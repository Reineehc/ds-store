import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { verifyAdminToken, createAdminToken } from "../../../../lib/auth";

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-auth")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const adminToken = await verifyAdminToken(token);

    if (!adminToken || !adminToken.adminId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const currentPassword = body.currentPassword;
    const newEmail = body.newEmail;
    const newPassword = body.newPassword;
    const confirmNewPassword = body.confirmNewPassword;

    if (!currentPassword) {
      return NextResponse.json(
        { message: "Current password is required." },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: {
        id: Number(adminToken.adminId),
      },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found." },
        { status: 404 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      admin.password
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
      email?: string;
      password?: string;
    } = {};

    if (newEmail && newEmail !== admin.email) {
      const existingAdmin = await prisma.admin.findUnique({
        where: {
          email: newEmail,
        },
      });

      if (existingAdmin) {
        return NextResponse.json(
          { message: "This email is already used by another admin." },
          { status: 400 }
        );
      }

      updateData.email = newEmail;
    }

    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (!updateData.email && !updateData.password) {
      return NextResponse.json(
        { message: "No changes were provided." },
        { status: 400 }
      );
    }

    const updatedAdmin = await prisma.admin.update({
      where: {
        id: admin.id,
      },
      data: updateData,
    });

    const newToken = await createAdminToken(
      updatedAdmin.id,
      updatedAdmin.email
    );

    const response = NextResponse.json({
      message: "Admin settings updated successfully.",
      admin: {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
      },
    });

    response.cookies.set("admin-auth", newToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating admin settings", error },
      { status: 500 }
    );
  }
}