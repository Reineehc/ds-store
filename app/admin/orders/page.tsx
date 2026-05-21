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
  if (status === "Delivered") return "bg-green-50 text-green-700";
  if (status === "Cancelled") return "bg-red-50 text-red-600";
  if (status === "Preparing") return "bg-orange-50 text-orange-700";
  return "bg-[#F7F5EF] text-[#24243F]";
}

function getPaymentStatusStyle(status: string) {
  if (status === "paid") return "bg-green-50 text-green-700";
  if (status === "failed" || status === "refunded")
    return "bg-red-50 text-red-600";
  return "bg-yellow-50 text-yellow-700";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders");

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);
      setMessage("Failed to load orders.");
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleStatusChange(orderId: number, newStatus: string) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setMessage("Order status updated!");
      fetchOrders();
    } else {
      setMessage("Failed to update order status.");
    }
  }

  async function handlePaymentStatusChange(
    orderId: number,
    newPaymentStatus: string
  ) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentStatus: newPaymentStatus }),
    });

    if (res.ok) {
      setMessage("Payment status updated!");
      fetchOrders();
    } else {
      setMessage("Failed to update payment status.");
    }
  }

  async function handleDeleteOrder(orderId: number) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMessage("Order deleted successfully!");
      fetchOrders();
    } else {
      setMessage("Failed to delete order.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-6 py-12 text-[#24243F]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
              Admin Orders
            </p>
            <h1 className="text-4xl font-extrabold">Orders</h1>
            <p className="mt-3 text-zinc-600">
              View customer orders, update delivery status, and manage payment
              status.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-full border border-[#33D6D1] px-6 py-3 font-semibold text-[#24243F] transition hover:bg-[#33D6D1] hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>

        {message && (
          <p
            className={`mb-6 rounded-2xl p-4 text-sm font-medium ${
              message.includes("successfully") || message.includes("updated")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5">
            <h2 className="text-2xl font-bold">No orders yet</h2>
            <p className="mt-3 text-zinc-600">
              Customer orders will appear here after checkout.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5"
              >
                <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 lg:flex-row lg:items-start">
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

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl bg-[#F7F5EF] p-5">
                    <h3 className="mb-3 font-bold">Customer Details</h3>

                    <div className="space-y-2 text-sm text-zinc-600">
                      <p>
                        <strong className="text-[#24243F]">Name:</strong>{" "}
                        {order.customerName}
                      </p>
                      <p>
                        <strong className="text-[#24243F]">Email:</strong>{" "}
                        {order.email}
                      </p>
                      <p>
                        <strong className="text-[#24243F]">Phone:</strong>{" "}
                        {order.phone}
                      </p>
                      <p>
                        <strong className="text-[#24243F]">Address:</strong>{" "}
                        {order.address}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#F7F5EF] p-5">
                    <h3 className="mb-3 font-bold">Order Details</h3>

                    <div className="space-y-2 text-sm text-zinc-600">
                      <p>
                        <strong className="text-[#24243F]">Total:</strong> $
                        {order.total}
                      </p>
                      <p>
                        <strong className="text-[#24243F]">
                          Payment Method:
                        </strong>{" "}
                        {order.paymentMethod === "cash"
                          ? "Cash on Delivery"
                          : "Card Payment"}
                      </p>
                      <p>
                        <strong className="text-[#24243F]">Items:</strong>{" "}
                        {order.items.length} item(s)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">
                      Order Status
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="w-full rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">
                      Payment Status
                    </span>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) =>
                        handlePaymentStatusChange(order.id, e.target.value)
                      }
                      className="w-full rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </label>
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-bold">Items</h3>

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

                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="mt-6 rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition hover:scale-[1.02] hover:bg-red-600"
                >
                  Delete Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}