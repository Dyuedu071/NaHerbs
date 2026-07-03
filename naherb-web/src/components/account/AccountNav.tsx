"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/tai-khoan/ho-so", label: "Hồ sơ cá nhân", icon: "person", exact: true },
  { href: "/tai-khoan/dia-chi", label: "Địa chỉ giao hàng", icon: "location_on", exact: true },
  { href: "/tai-khoan/don-hang", label: "Đơn hàng của tôi", icon: "receipt_long", exact: false },
] as const;

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-xs">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-sm rounded-xl px-sm py-3 font-label-md text-label-md transition-colors ${active
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
