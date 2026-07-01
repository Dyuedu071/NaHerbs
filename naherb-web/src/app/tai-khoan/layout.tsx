"use client";

import AccountNav from "@/components/account/AccountNav";
import { useRequireAuth } from "@/components/account/useRequireAuth";
import Link from "next/link";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading, isAuthenticated } = useRequireAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-body-md text-body-md text-text-muted">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border-warm bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-gutter">
          <Link
            href="/"
            className="font-display-lg text-display-lg text-primary tracking-tight"
          >
            NaHerbs
          </Link>
          <Link
            href="/"
            className="font-label-md text-label-md text-secondary hover:text-primary"
          >
            ← Về trang chủ
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-container-max gap-lg px-gutter py-lg md:grid-cols-[240px_1fr]">
        <aside className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
          <h2 className="mb-md font-headline-md text-headline-md text-primary">
            Tài khoản
          </h2>
          <AccountNav />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
