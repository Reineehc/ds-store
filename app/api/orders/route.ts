import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "../../../lib/auth";
import { verifyCustomerToken } from "../../../lib/customerAuth";
import { sendOrderEmails } from "../../../lib/email";
import type { Prisma } from "@prisma/client";

async function isAdminLoggedIn() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-auth")?.value;

  if (!token) {
    return false;
  }

  const admin = await verifyAdminToken(token);
  return !!admin;
}

export async function GET() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching orders", error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const cookieStore = await cookies();
    const customerToken = cookieStore.get("customer-auth")?.value;

    let customerId: number | undefined = undefined;

    if (customerToken) {
      const customer = await verifyCustomerToken(customerToken);

      if (customer) {
        customerId = customer.id;
      }
    }

    const items = body.items;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "Order must contain at least one item." },
        { status: 400 }
      );
    }

    const order = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: {
            id: Number(item.productId),
          },
        });

        if (!product) {
          throw new Error("Product not found.");
        }

        if (product.stock < Number(item.quantity)) {
          throw new Error(
            `${product.name} does not have enough stock. Available: ${product.stock}`
          );
        }
      }

      const createdOrder = await tx.order.create({
        data: {
          customerName: body.customerName,
          email: body.email,
          phone: body.phone,
          address: body.address,
          total: Number(body.total),
          paymentMethod: body.paymentMethod || "cash",
          paymentStatus: "pending",
          customerId,

          items: {
            create: items.map(
              (item: {
                productId: number;
                price: number;
                quantity: number;
              }) => ({
                productId: Number(item.productId),
                price: Number(item.price),
                quantity: Number(item.quantity),
              })
            ),
          },
        },
        include: {
          items: true,
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: {
            id: Number(item.productId),
          },
          data: {
            stock: {
              decrement: Number(item.quantity),
            },
          },
        });
      }

      return createdOrder;
    },
    {
      maxWait: 10000,
      timeout: 20000,
    }
  );
    try {
      await sendOrderEmails({
        orderId: order.id,
        customerName: body.customerName,
        customerEmail: body.email,
        phone: body.phone,
        address: body.address,
        total: Number(body.total),
        paymentMethod: body.paymentMethod || "cash",
        items: body.items.map(
          (item: {
            productId: number;
            name: string;
            price: number;
            quantity: number;
          }) => ({
            productId: Number(item.productId),
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
          })
        ),
      });
    } catch (emailError) {
      console.error("EMAIL ERROR:", emailError);
    }
    return NextResponse.json(order, { status: 201 });
    
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error creating order";

    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}