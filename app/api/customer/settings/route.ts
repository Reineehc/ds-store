import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import {
  verifyCustomerToken,
  createCustomerToken,
} from "../../../../lib/customerAuth";

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer-auth")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const customerToken = await verifyCustomerToken(token);

    if (!customerToken) {
      return NextResponse.json(
        { message: "Invalid session. Please log in again." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name = body.name;
    const email = body.email;
    const phone = body.phone;
    const currentPassword = body.currentPassword;
    const newPassword = body.newPassword;
    const confirmNewPassword = body.confirmNewPassword;

    if (!currentPassword) {
      return NextResponse.json(
        { message: "Current password is required." },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: {
        id: customerToken.id,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found." },
        { status: 404 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      customer.password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Current password is incorrect." },
        { status: 401 }
      );
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { message: "New passwords do not match." },
        { status: 400 }
      );
    }

    const updateData: {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
    } = {};

    if (name && name !== customer.name) {
      updateData.name = name;
    }

    if (phone !== undefined && phone !== customer.phone) {
      updateData.phone = phone;
    }

    if (email && email !== customer.email) {
      const existingCustomer = await prisma.customer.findUnique({
        where: {
          email,
        },
      });

      if (existingCustomer) {
        return NextResponse.json(
          { message: "This email is already used by another account." },
          { status: 400 }
        );
      }

      updateData.email = email;
    }

    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (
      !updateData.name &&
      updateData.phone === undefined &&
      !updateData.email &&
      !updateData.password
    ) {
      return NextResponse.json(
        { message: "No changes were provided." },
        { status: 400 }
      );
    }

    const updatedCustomer = await prisma.customer.update({
      where: {
        id: customer.id,
      },
      data: updateData,
    });

    const newToken = await createCustomerToken({
      id: updatedCustomer.id,
      email: updatedCustomer.email,
      name: updatedCustomer.name,
    });

    const response = NextResponse.json({
      message: "Account settings updated successfully.",
      customer: {
        id: updatedCustomer.id,
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
      },
    });

    response.cookies.set("customer-auth", newToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating account settings", error },
      { status: 500 }
    );
  }
}