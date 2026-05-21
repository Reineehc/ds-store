import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyCustomerToken } from "../../../../lib/customerAuth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customer-auth")?.value;

  if (!token) {
    return NextResponse.json(
      { customer: null },
      { status: 401 }
    );
  }

  const customer = await verifyCustomerToken(token);

  if (!customer) {
    return NextResponse.json(
      { customer: null },
      { status: 401 }
    );
  }

  return NextResponse.json({ customer });
}