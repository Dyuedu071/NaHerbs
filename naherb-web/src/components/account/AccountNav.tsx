"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/account/profile", label: "Hồ sơ cá nhân", icon: "person" },
  { href: "/account/addresses", label: "Địa chỉ giao hàng", icon: "location_on" },
  { href: "/account/orders", label: "Đơn hàng của tôi", icon: "receipt_long" },
] as const;

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-xs">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-sm rounded-xl px-sm py-3 font-label-md text-label-md transition-colors ${
              active
                ? "bg-primary text-on-primary shadow-ambient-1"
                : "text-text-muted hover:bg-surface-container-low hover:text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              {link.icon}
            </span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
