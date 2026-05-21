"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock?: number;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  function updateCart(updatedCart: CartItem[]) {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  }

  function increaseQuantity(id: number) {
    const updatedCart = cartItems.map((item) => {
      if (item.id !== id) return item;

      if (item.stock !== undefined && item.quantity >= item.stock) {
        alert(`Only ${item.stock} item(s) available in stock.`);
        return item;
      }

      return { ...item, quantity: item.quantity + 1 };
    });

    updateCart(updatedCart);
  }

  function decreaseQuantity(id: number) {
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    updateCart(updatedCart);
  }

  function deleteItem(id: number) {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    updateCart(updatedCart);
  }

  function clearCart() {
    updateCart([]);
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const delivery = cartItems.length > 0 ? 3 : 0;
  const total = subtotal + delivery;

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24243F]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
              Shopping Cart
            </p>
            <h1 className="text-4xl font-extrabold">Your Cart</h1>
          </div>

          <Link
            href="/"
            className="rounded-full border border-[#33D6D1] px-5 py-3 text-sm font-semibold text-[#24243F] transition hover:bg-[#33D6D1] hover:text-white"
          >
            ← Continue Shopping
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Cart Items</h2>

                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-sm font-semibold text-red-500 hover:text-red-600"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="rounded-3xl bg-[#F7F5EF] p-6">
                  <p className="text-zinc-600">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between gap-5 rounded-3xl border border-zinc-200 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <h3 className="font-bold">{item.name}</h3>

                          <p className="mt-1 text-sm text-zinc-500">
                            ${item.price} each
                          </p>

                          <div className="mt-3 flex items-center gap-3">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 transition hover:bg-[#F7F5EF]"
                            >
                              -
                            </button>

                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 transition hover:bg-[#F7F5EF]"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => deleteItem(item.id)}
                            className="mt-3 text-sm font-semibold text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <p className="text-lg font-extrabold">
                        ${item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5">
            <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-semibold">${subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">Delivery</span>
                <span className="font-semibold">${delivery}</span>
              </div>

              <div className="border-t border-zinc-200 pt-4">
                <div className="flex justify-between text-xl font-extrabold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>

            {cartItems.length > 0 ? (
              <Link
                href="/checkout"
                className="mt-6 block rounded-full px-8 py-4 text-center font-semibold text-white shadow-md transition hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(90deg, #F77C63 0%, #FF4F7A 100%)",
                }}
              >
                Go to Checkout
              </Link>
            ) : (
              <button
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-full bg-zinc-300 px-8 py-4 font-semibold text-white"
              >
                Go to Checkout
              </button>
            )}

            <p className="mt-4 rounded-2xl bg-[#F7F5EF] p-4 text-sm text-zinc-600">
              Delivery fees may be confirmed before final delivery.
            </p>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}