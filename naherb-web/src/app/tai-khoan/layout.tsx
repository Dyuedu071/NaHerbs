"use client";

import AccountNav from "@/components/account/AccountNav";
import { useRequireAuth } from "@/components/account/useRequireAuth";
import PublicHeader from "@/components/common/PublicHeader";

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
      <PublicHeader />

      <div className="mx-auto grid max-w-container-max gap-lg px-gutter py-lg pt-28 md:grid-cols-[240px_1fr]">
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
