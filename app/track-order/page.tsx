"use client";

import { useState } from "react";

type OrderItem = {
  id: number;
  price: number;
  quantity: number;
  product: {
    name: string;
    image: string;
    category: string;
  };
};

type Order = {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState("");

  async function handleTrackOrder(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");
    setOrder(null);

    const res = await fetch("/api/track-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, email }),
    });

    const data = await res.json();

    if (res.ok) {
      setOrder(data);
    } else {
      setMessage(data.message || "Could not find order.");
    }
  }

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Track Your Order</h1>
      <p>Enter your order ID and email address to check your order status.</p>

      <form
        onSubmit={handleTrackOrder}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        <input
          type="number"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Track Order</button>
      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}

      {order && (
        <div
          style={{
            marginTop: "30px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <h2>Order #{order.id}</h2>

          <p>
            <strong>Order Status:</strong> {order.status}
          </p>

          <p>
            <strong>Payment Status:</strong>{" "}
            {order.paymentStatus === "pending"
              ? "Pending"
              : order.paymentStatus}
          </p>

          <p>
            <strong>Payment Method:</strong>{" "}
            {order.paymentMethod === "cash"
              ? "Cash on Delivery"
              : "Card Payment"}
          </p>

          <p>
            <strong>Total:</strong> ${order.total}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <h3 style={{ marginTop: "20px" }}>Items</h3>

          {order.items.map((item) => (
            <div
              key={item.id}
              style={{
                borderTop: "1px solid #eee",
                paddingTop: "12px",
                marginTop: "12px",
              }}
            >
              <p>
                <strong>{item.product.name}</strong>
              </p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}