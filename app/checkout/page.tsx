"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
};

type Customer = {
  id: number;
  name: string;
  email: string;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [message, setMessage] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    async function fetchCustomer() {
      try {
        const res = await fetch("/api/customer/me");

        if (res.ok) {
          const data = await res.json();

          if (data.customer) {
            setCustomer(data.customer);
            setCustomerName(data.customer.name);
            setEmail(data.customer.email);
          }
        }
      } catch (error) {
        console.error("CUSTOMER FETCH ERROR:", error);
      }
    }

    fetchCustomer();
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = cart.length > 0 ? 3 : 0;

  const total = subtotal + delivery;

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    if (paymentMethod === "card") {
      setMessage(
        "Online card payment is coming soon. Please choose Cash on Delivery for now."
      );
      return;
    }

    const orderData = {
      customerName,
      email,
      phone,
      address,
      total,
      paymentMethod,
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (res.ok) {
      const createdOrder = await res.json();

      localStorage.removeItem("cart");
      setCart([]);

      router.push(`/order-confirmation/${createdOrder.id}`);
    } else {
      const errorData = await res.json();
      setMessage(errorData.message || "Failed to place order.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-6 py-12 text-[#24243F]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
            Secure Checkout
          </p>
          <h1 className="text-4xl font-extrabold">Checkout</h1>

          {customer ? (
            <p className="mt-3 text-zinc-600">
              Logged in as <strong>{customer.name}</strong>
            </p>
          ) : (
            <p className="mt-3 text-zinc-600">
              You are checking out as a guest.
            </p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            onSubmit={handlePlaceOrder}
            className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5"
          >
            <h2 className="mb-6 text-2xl font-bold">Delivery Details</h2>

            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="rounded-2xl border border-zinc-200 bg-[#F7F5EF] py-4 outline-none focus:border-[#33D6D1]"
              />

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-2xl border border-zinc-200 bg-[#F7F5EF] py-4 outline-none focus:border-[#33D6D1]"
              />

              <input
                type="text"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="rounded-2xl border border-zinc-200 bg-[#F7F5EF] py-4 outline-none focus:border-[#33D6D1]"
              />

              <textarea
                placeholder="Delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={4}
                className="rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none focus:border-[#33D6D1]"
              />

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
                className="rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none focus:border-[#33D6D1]"
              >
                <option value="cash">Cash on Delivery</option>
                <option value="card">Card Payment</option>
              </select>

              {message && (
                <p className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600">
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="mt-2 rounded-full px-8 py-4 font-semibold text-white shadow-md transition hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(90deg, #F77C63 0%, #FF4F7A 100%)",
                }}
              >
                Place Order
              </button>
            </div>
          </form>

          <aside className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5">
            <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

            {cart.length === 0 ? (
              <p className="text-zinc-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-5">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-zinc-200 pb-4 last:border-b-0"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-zinc-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold">
                        ${item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="space-y-3 border-t border-zinc-200 pt-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-semibold">${subtotal}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Delivery</span>
                    <span className="font-semibold">${delivery}</span>
                  </div>

                  <div className="flex justify-between pt-3 text-xl font-extrabold">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>

                <p className="rounded-2xl bg-[#F7F5EF] p-4 text-sm text-zinc-600">
                  You will receive an order confirmation email after placing
                  your order.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}