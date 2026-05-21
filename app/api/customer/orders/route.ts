import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../../lib/prisma";
import { verifyCustomerToken } from "../../../../lib/customerAuth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer-auth")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "You must be logged in to view your orders." },
        { status: 401 }
      );
    }

    const customer = await verifyCustomerToken(token);

    if (!customer) {
      return NextResponse.json(
        { message: "Invalid session. Please log in again." },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        customerId: customer.id,
      },
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
      { message: "Error fetching customer orders", error },
      { status: 500 }
    );
  }
}