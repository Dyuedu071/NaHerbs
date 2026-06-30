"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { name: "Products", href: "/admin/products", icon: "inventory_2" },
    { name: "Orders", href: "/admin/orders", icon: "shopping_cart" },
    { name: "QR Payments", href: "/admin/qr-payments", icon: "qr_code_2" },
    { name: "Blog", href: "/admin/posts", icon: "edit_note" },
    { name: "Chatbot AI", href: "/admin/chatbot", icon: "psychiatry" },
  ];

  return (
    <aside className="flex flex-col h-screen overflow-y-auto fixed left-0 top-0 bg-surface-container-low border-r border-border-warm shadow-sm w-64 z-50 custom-scrollbar">
      <div className="p-md border-b border-border-warm flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-herbal-beige mb-xs flex items-center justify-center overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt="Wellness Clinic Administrator"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUvIyn86HxX7B0C0hVLnUsLEPOBquhHiSErWc-J6O5bD3OJSheJ7AaozIJ0We28BV5wfaQCHy_ATPN2Xtih-pvQeAgJD06H2J1--FOZGbcS4MCeUNl-ECk-TQdVWAhp5LEdNrWKPRLmaKulgaTzVbmWo2Y1A974UYpSVWPP4heGHFQ4dxQyUdX_KvApSziEfTuj4VRII48zkA-iblORSPlODOCMaPlQGVWr1sYAhCvEszhvf2uqxYuiIwqjzn08hM-llNEU7lPNbo"
          />
        </div>
        <h2 className="text-headline-md font-headline-md font-bold text-primary">Wellness Admin</h2>
        <p className="text-caption font-caption text-text-muted">Management Portal</p>
      </div>

      <nav className="flex-1 py-md flex flex-col gap-base">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-sm px-md py-sm mx-sm rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-primary font-bold border-r-4 border-primary bg-secondary-container/20 scale-[0.98]"
                  : "text-text-muted hover:text-primary hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
              <span className="text-label-md font-label-md">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-md border-t border-border-warm flex flex-col gap-base">
        <a
          className="flex items-center gap-sm px-sm py-sm rounded-lg text-text-muted hover:text-primary hover:bg-surface-container-high transition-all duration-200"
          href="#"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-label-md font-label-md">Settings</span>
        </a>
        <a
          className="flex items-center gap-sm px-sm py-sm rounded-lg text-text-muted hover:text-primary hover:bg-surface-container-high transition-all duration-200"
          href="#"
        >
          <span className="material-symbols-outlined">help_outline</span>
          <span className="text-label-md font-label-md">Support</span>
        </a>
        <button className="mt-sm w-full py-sm bg-primary text-on-primary rounded-full text-label-md font-label-md hover:bg-secondary transition-colors">
          View Store
        </button>
      </div>
    </aside>
  );
}
