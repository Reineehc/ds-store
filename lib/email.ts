import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderEmailItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

type SendOrderEmailsParams = {
  orderId: number;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  total: number;
  paymentMethod: string;
  items: OrderEmailItem[];
};

export async function sendOrderEmails({
  orderId,
  customerName,
  customerEmail,
  phone,
  address,
  total,
  paymentMethod,
  items,
}: SendOrderEmailsParams) {
  const itemsHtml = items
  .map(
    (item) => `
      <li>
        ${item.name} — Quantity: ${item.quantity} — Price: $${item.price}
      </li>
    `
  )
  .join("");

  await resend.emails.send({
    from: "DS Store <onboarding@resend.dev>",
    to: customerEmail,
    subject: `Order Confirmation #${orderId}`,
    html: `
      <h1>Thank you for your order, ${customerName}!</h1>
      <p>Your order has been placed successfully.</p>

      <h2>Order #${orderId}</h2>

      <p><strong>Total:</strong> $${total}</p>
      <p><strong>Payment Method:</strong> ${
        paymentMethod === "cash" ? "Cash on Delivery" : "Card Payment"
      }</p>

      <h3>Items</h3>
      <ul>${itemsHtml}</ul>

      <p>We will contact you soon to confirm your delivery details.</p>
    `,
  });

  await resend.emails.send({
    from: "DS Store <onboarding@resend.dev>",
    to: process.env.ADMIN_EMAIL!,
    subject: `New Order Received #${orderId}`,
    html: `
      <h1>New Order Received</h1>

      <h2>Order #${orderId}</h2>

      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Total:</strong> $${total}</p>
      <p><strong>Payment Method:</strong> ${
        paymentMethod === "cash" ? "Cash on Delivery" : "Card Payment"
      }</p>

      <h3>Items</h3>
      <ul>${itemsHtml}</ul>
    `,
  });
}