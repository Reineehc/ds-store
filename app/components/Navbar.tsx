"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CustomerLogoutButton from "./CustomerLogoutButton";

type CartItem = {
  id: number;
  quantity: number;
};

type Customer = {
  id: number;
  name: string;
  email: string;
};

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    function updateCartCount() {
      const savedCart = localStorage.getItem("cart");
      const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

      const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(totalItems);
    }

    async function fetchCustomer() {
      try {
        const res = await fetch("/api/customer/me");

        if (res.ok) {
          const data = await res.json();
          setCustomer(data.customer);
        } else {
          setCustomer(null);
        }
      } catch (error) {
        console.error("CUSTOMER NAVBAR ERROR:", error);
        setCustomer(null);
      }
    }

    updateCartCount();
    fetchCustomer();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#F7F5EF]/90 px-6 py-5 shadow-sm backdrop-blur md:px-10">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#24243F]">
          DS Store
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium md:hidden"
        >
          Menu
        </button>

        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <NavLinks cartCount={cartCount} customer={customer} />
        </div>
      </div>

      {menuOpen && (
        <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-white p-5 text-sm font-medium text-[#24243F] shadow-sm md:hidden">
          <NavLinks cartCount={cartCount} customer={customer} />
        </div>
      )}
    </nav>
  );
}

function NavLinks({
  cartCount,
  customer,
}: {
  cartCount: number;
  customer: Customer | null;
}) {
  return (
    <>
      <Link href="/#bracelets" className="hover:text-[#FF4F7A]">
        Bracelets
      </Link>

      <Link href="/#caps" className="hover:text-[#FF4F7A]">
        Caps
      </Link>

      <Link href="/#fresheners" className="hover:text-[#FF4F7A]">
        DS Fresher
      </Link>

      {customer ? (
        <>
          <Link href="/my-orders" className="hover:text-[#FF4F7A]">
            My Orders
          </Link>

          <CustomerLogoutButton />
        </>
      ) : (
        <>
          <Link href="/customer/login" className="hover:text-[#FF4F7A]">
            Login
          </Link>

          <Link href="/customer/register" className="hover:text-[#FF4F7A]">
            Register
          </Link>
        </>
      )}

      <Link href="/admin" className="hover:text-[#FF4F7A]">
        Admin
      </Link>
      
      <Link href="/account/settings" className="hover:text-[#FF4F7A]">
        Account
      </Link>

      <Link
        href="/cart"
        className="relative flex h-12 w-12 items-center justify-center rounded-full text-xl text-white shadow-md transition hover:scale-[1.05]"
        style={{
          background: "linear-gradient(90deg, #24243F 0%, #33D6D1 100%)",
        }}
        aria-label="Cart"
      >
        🛒

        {cartCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF4F7A] text-xs font-bold text-white">
            {cartCount}
          </span>
        )}
      </Link>
    </>
  );
}