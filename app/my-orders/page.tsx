"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  id: number;
  productId: number;
  price: number;
  quantity: number;
  product: {
    id: number;
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

function getOrderStatusStyle(status: string) {
  if (status === "Delivered") {
    return "bg-green-50 text-green-700";
  }

  if (status === "Cancelled") {
    return "bg-red-50 text-red-600";
  }

  if (status === "Preparing") {
    return "bg-orange-50 text-orange-700";
  }

  return "bg-[#F7F5EF] text-[#24243F]";
}

function getPaymentStatusStyle(status: string) {
  if (status === "paid") {
    return "bg-green-50 text-green-700";
  }

  if (status === "failed" || status === "refunded") {
    return "bg-red-50 text-red-600";
  }

  return "bg-yellow-50 text-yellow-700";
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/customer/orders");
        const data = await res.json();

        if (res.ok) {
          setOrders(data);
        } else {
          setMessage(data.message || "Please log in to view your orders.");
        }
      } catch (error) {
        console.error("MY ORDERS ERROR:", error);
        setMessage("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F5EF] px-6 py-16 text-[#24243F]">
        <div className="mx-auto max-w-5xl">
          <p className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-6 py-16 text-[#24243F]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
            Order History
          </p>
          <h1 className="text-4xl font-extrabold">My Orders</h1>
          <p className="mt-3 text-zinc-600">
            View your order history, payment status, and delivery progress.
          </p>
        </div>

        {message && (
          <div className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5">
            <p className="mb-4 text-zinc-600">{message}</p>

            <Link
              href="/customer/login"
              className="inline-block rounded-full px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(90deg, #F77C63 0%, #FF4F7A 100%)",
              }}
            >
              Login here
            </Link>
          </div>
        )}

        {!message && orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5">
            <h2 className="text-2xl font-bold">No orders yet</h2>
            <p className="mt-3 text-zinc-600">
              You have not placed any orders yet.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-full px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(90deg, #F77C63 0%, #FF4F7A 100%)",
              }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5"
              >
                <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="text-2xl font-extrabold">
                      Order #{order.id}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${getOrderStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${getPaymentStatusStyle(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus === "pending"
                        ? "Payment Pending"
                        : order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[#F7F5EF] p-4">
                    <p className="text-sm text-zinc-500">Payment Method</p>
                    <p className="mt-1 font-semibold">
                      {order.paymentMethod === "cash"
                        ? "Cash on Delivery"
                        : "Card Payment"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F7F5EF] p-4">
                    <p className="text-sm text-zinc-500">Total</p>
                    <p className="mt-1 font-semibold">${order.total}</p>
                  </div>

                  <div className="rounded-2xl bg-[#F7F5EF] p-4">
                    <p className="text-sm text-zinc-500">Items</p>
                    <p className="mt-1 font-semibold">
                      {order.items.length} item(s)
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-4 text-lg font-bold">Order Items</h3>

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4"
                      >
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-zinc-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold">${item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}