"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/customer/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Account created successfully!");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      setMessage(data.message || "Failed to create account.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-6 py-16 text-[#24243F]">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
            Join DS Store
          </p>

          <h1 className="text-4xl font-extrabold">Create Account</h1>

          <p className="mt-3 text-zinc-600">
            Create an account to track your orders and checkout faster.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5"
        >
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
            />

            <input
              type="text"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
            />

            {message && (
              <p
                className={`rounded-2xl p-4 text-sm font-medium ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
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
              Create Account
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-zinc-600">
          Already have an account?{" "}
          <Link
            href="/customer/login"
            className="font-semibold text-[#FF4F7A] hover:text-[#33D6D1]"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}