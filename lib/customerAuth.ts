import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.CUSTOMER_JWT_SECRET || "temporary-customer-secret-change-this"
);

export async function createCustomerToken(customer: {
  id: number;
  email: string;
  name: string;
}) {
  return await new SignJWT({
    id: customer.id,
    email: customer.email,
    name: customer.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyCustomerToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);

    return {
      id: Number(payload.id),
      email: String(payload.email),
      name: String(payload.name),
    };
  } catch {
    return null;
  }
}