"use client";

import { AdminOrderDetailPanel } from "@/components/admin/AdminOrderDetailPanel";
import { isAdminSession } from "@/lib/current-user";
import { useGetAuthMe } from "@/services/generated/customer-profile/customer-profile";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;
  const { data: meResponse, isLoading: authLoading } = useGetAuthMe({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  });
  const isAdmin = isAdminSession(meResponse);

  if (authLoading) {
    return <AdminShell>Đang kiểm tra quyền admin...</AdminShell>;
  }

  if (!isAdmin) {
    return <AdminShell tone="error">Bạn không có quyền truy cập quản lý đơn hàng.</AdminShell>;
  }

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-md p-gutter">
      <Link
        href="/admin/orders"
        className="inline-flex w-fit items-center gap-xs text-caption text-primary hover:text-secondary"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Quay lại danh sách
      </Link>
      <AdminOrderDetailPanel
        key={orderId}
        orderId={orderId}
        enabled={isAdmin}
        showOpenLink={false}
      />
    </main>
  );
}

function AdminShell({
  children,
  tone = "muted",
}: {
  children: string;
  tone?: "muted" | "error";
}) {
  return (
    <main className="mx-auto flex w-full max-w-container-max flex-1 items-center justify-center p-gutter">
      <p className={`text-body-md ${tone === "error" ? "text-error" : "text-text-muted"}`}>
        {children}
      </p>
    </main>
  );
}
