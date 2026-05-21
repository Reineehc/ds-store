"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("LOGIN PAGE ERROR:", error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-6 py-16 text-[#24243F]">
      <div className="mx-auto flex min-h-[75vh] max-w-md items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full rounded-3xl bg-white p-8 shadow-md ring-1 ring-black/5"
        >
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#FF4F7A]">
              Admin Panel
            </p>

            <h1 className="text-4xl font-extrabold">Admin Login</h1>

            <p className="mt-3 text-zinc-600">
              Sign in to manage products, stock, and customer orders.
            </p>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-bold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">Password</label>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-[#F7F5EF] px-5 py-4 outline-none transition focus:border-[#33D6D1] focus:bg-white"
              />
            </div>

            {message && (
              <p className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full px-8 py-4 font-semibold text-white shadow-md transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background:
                  "linear-gradient(90deg, #24243F 0%, #33D6D1 100%)",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Not a customer page.{" "}
            <Link href="/" className="font-semibold text-[#FF4F7A]">
              Back to store
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}