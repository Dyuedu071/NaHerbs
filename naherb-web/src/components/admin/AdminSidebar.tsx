"use client";

import { extractSessionUser } from "@/lib/current-user";
import { useGetAuthMe } from "@/services/generated/customer-profile/customer-profile";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data } = useGetAuthMe({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  });
  const account = extractSessionUser(data);
  const avatarUrl = account?.avatarUrl;

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { name: "Sản phẩm", href: "/admin/san-pham", icon: "inventory_2" },
    { name: "Đơn hàng", href: "/admin/orders", icon: "shopping_cart" },
    { name: "QR Payments", href: "/admin/qr-payments", icon: "qr_code_2" },
    { name: "Blog", href: "/admin/posts", icon: "edit_note" },
    { name: "Chatbot AI", href: "/admin/chatbot", icon: "psychiatry" },
    { name: "Cài đặt", href: "/admin/settings", icon: "settings" },
  ];

  return (
    <aside className="custom-scrollbar fixed left-0 top-0 z-50 flex h-screen w-64 flex-col overflow-y-auto border-r border-border-warm bg-surface-container-low shadow-sm">
      <div className="flex flex-col items-center border-b border-border-warm p-md">
        <div className="mb-xs flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-herbal-beige">
          <img
            className="h-full w-full object-cover"
            alt="Wellness Clinic Administrator"
            src={
              avatarUrl ||
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCUvIyn86HxX7B0C0hVLnUsLEPOBquhHiSErWc-J6O5bD3OJSheJ7AaozIJ0We28BV5wfaQCHy_ATPN2Xtih-pvQeAgJD06H2J1--FOZGbcS4MCeUNl-ECk-TQdVWAhp5LEdNrWKPRLmaKulgaTzVbmWo2Y1A974UYpSVWPP4heGHFQ4dxQyUdX_KvApSziEfTuj4VRII48zkA-iblORSPlODOCMaPlQGVWr1sYAhCvEszhvf2uqxYuiIwqjzn08hM-llNEU7lPNbo"
            }
          />
        </div>
        <h2 className="text-headline-md font-headline-md font-bold text-primary">
          {account?.name || "Wellness Admin"}
        </h2>
        <p className="text-caption font-caption text-text-muted">
          {account?.role === "ADMIN" ? "Quản trị viên" : account?.role || "Management Portal"}
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-base py-md">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`mx-sm flex items-center gap-sm rounded-lg px-md py-sm transition-all duration-200 ${
                isActive
                  ? "scale-[0.98] border-r-4 border-primary bg-secondary-container/20 font-bold text-primary"
                  : "text-text-muted hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-label-md font-label-md">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-base border-t border-border-warm p-md">
        <a
          className="flex items-center gap-sm rounded-lg px-sm py-sm text-text-muted transition-all duration-200 hover:bg-surface-container-high hover:text-primary"
          href="#"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-label-md font-label-md">Settings</span>
        </a>
        <a
          className="flex items-center gap-sm rounded-lg px-sm py-sm text-text-muted transition-all duration-200 hover:bg-surface-container-high hover:text-primary"
          href="#"
        >
          <span className="material-symbols-outlined">help_outline</span>
          <span className="text-label-md font-label-md">Support</span>
        </a>
        <Link
          href="/"
          className="mt-sm w-full rounded-full bg-primary py-sm text-center text-label-md font-label-md text-on-primary transition-colors hover:bg-secondary"
        >
          View Store
        </Link>
      </div>
    </aside>
  );
}
