"use client";

import { useRouter } from "next/navigation";

export default function CustomerLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/customer/logout", {
      method: "POST",
    });

    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        font: "inherit",
      }}
    >
      Logout
    </button>
  );
}