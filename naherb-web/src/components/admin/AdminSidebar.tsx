"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Tổng quan", href: "/admin/dashboard", icon: "dashboard" },
    { name: "Sản phẩm", href: "/admin/san-pham", icon: "inventory_2" },
    { name: "Đơn hàng", href: "/admin/orders", icon: "shopping_cart" },
    { name: "Thanh toán QR", href: "/admin/qr-payments", icon: "qr_code_2" },
    { name: "Bài viết", href: "/admin/posts", icon: "edit_note" },
    { name: "Chatbot AI", href: "/admin/chatbot", icon: "psychiatry" },
  ];

  return (
    <aside className="flex flex-col h-screen overflow-y-auto fixed left-0 top-0 bg-surface-container-low border-r border-border-warm shadow-sm w-64 z-50 custom-scrollbar">
      <div className="p-md border-b border-border-warm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
        </div>
        <div>
          <h2 className="text-title-md font-bold text-primary">NaHerbs</h2>
          <p className="text-caption text-text-muted">Quản trị viên</p>
        </div>
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
          <span className="text-label-md font-label-md">Cài đặt</span>
        </a>
        <a
          className="flex items-center gap-sm px-sm py-sm rounded-lg text-text-muted hover:text-primary hover:bg-surface-container-high transition-all duration-200"
          href="#"
        >
          <span className="material-symbols-outlined">help_outline</span>
          <span className="text-label-md font-label-md">Hỗ trợ</span>
        </a>
        <Link
          href="/"
          className="mt-sm w-full py-sm bg-primary text-on-primary rounded-full text-label-md font-label-md hover:bg-secondary transition-colors text-center block shadow-level-1 hover:shadow-level-2"
        >
          Xem cửa hàng
        </Link>
      </div>
    </aside>
  );
}
