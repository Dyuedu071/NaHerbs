"use client";

import {
  formatDateTime,
  formatMoney,
  orderStatusLabels,
  paymentMethodLabels,
  paymentStatusLabels,
} from "@/lib/order-format";
import { useGetOrdersMy } from "@/services/generated/customer-orders/customer-orders";
import type { OrderPage } from "@/services/generated/model/orderPage";
import type { OrderStatus } from "@/services/generated/model/orderStatus";
import type { PaymentStatus } from "@/services/generated/model/paymentStatus";
import Link from "next/link";
import { useState } from "react";

const pageSize = 10;

export default function AccountOrdersPage() {
  const [page, setPage] = useState(0);
  const { data: ordersResponse, isLoading, isError } = useGetOrdersMy({
    page,
    size: pageSize,
  });
  const ordersPage = (ordersResponse as { data?: OrderPage } | undefined)?.data;
  const orders = ordersPage?.items ?? [];
  const totalPages = ordersPage?.totalPages ?? 0;

  if (isLoading) {
    return <PanelText>Đang tải đơn hàng...</PanelText>;
  }

  if (isError) {
    return <PanelText tone="error">Không thể tải danh sách đơn hàng.</PanelText>;
  }

  return (
    <section className="flex flex-col gap-md">
      <div className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
        <h1 className="font-headline-md text-headline-md text-primary">
          Đơn hàng của tôi
        </h1>
        <p className="mt-xs text-body-md text-text-muted">
          Theo dõi trạng thái xử lý, thanh toán và thông tin giao hàng.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-herbal-beige bg-surface p-lg text-center">
          <span className="material-symbols-outlined text-[44px] text-primary">
            receipt_long
          </span>
          <p className="mt-sm text-body-md text-text-muted">
            Bạn chưa có đơn hàng nào.
          </p>
          <Link
            href="/"
            className="mt-md inline-flex items-center gap-xs rounded-full bg-primary px-md py-sm text-label-md font-label-md text-on-primary"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            Mua hàng
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-herbal-beige bg-surface shadow-ambient-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-surface-container-low text-caption uppercase text-text-muted">
                <tr>
                  <th className="p-sm font-semibold">Mã đơn</th>
                  <th className="p-sm font-semibold">Ngày tạo</th>
                  <th className="p-sm font-semibold">Đơn hàng</th>
                  <th className="p-sm font-semibold">Thanh toán</th>
                  <th className="p-sm font-semibold">Tổng tiền</th>
                  <th className="p-sm font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/50">
                    <td className="p-sm font-label-md text-label-md text-primary">
                      {order.orderCode}
                    </td>
                    <td className="p-sm text-body-md text-text-muted">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="p-sm">
                      {order.orderStatus && (
                        <StatusPill tone="order" value={order.orderStatus} />
                      )}
                    </td>
                    <td className="p-sm">
                      <div className="flex flex-col gap-xs">
                        <span className="text-caption text-text-muted">
                          {order.paymentMethod
                            ? paymentMethodLabels[order.paymentMethod]
                            : "-"}
                        </span>
                        {order.paymentStatus && (
                          <StatusPill tone="payment" value={order.paymentStatus} />
                        )}
                      </div>
                    </td>
                    <td className="p-sm font-semibold text-text-main">
                      {formatMoney(order.totalAmount)}
                    </td>
                    <td className="p-sm text-right">
                      {order.id && (
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="inline-flex items-center gap-xs rounded-full border border-border-warm px-sm py-1 text-caption text-primary hover:bg-success-bg"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            visibility
                          </span>
                          Chi tiết
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border-warm p-sm">
            <p className="text-caption text-text-muted">
              Trang {page + 1} / {Math.max(totalPages, 1)}
            </p>
            <div className="flex gap-xs">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                className="rounded-lg border border-border-warm px-sm py-1 text-caption text-primary disabled:opacity-50"
              >
                Trước
              </button>
              <button
                type="button"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-lg border border-border-warm px-sm py-1 text-caption text-primary disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function StatusPill({
  tone,
  value,
}: {
  tone: "order" | "payment";
  value: OrderStatus | PaymentStatus;
}) {
  const label =
    tone === "order"
      ? orderStatusLabels[value as OrderStatus]
      : paymentStatusLabels[value as PaymentStatus];
  const color =
    value === "CANCELLED" || value === "FAILED"
      ? "bg-error-container text-error"
      : value === "PAID" || value === "COMPLETED"
        ? "bg-success-bg text-primary"
        : "bg-surface-container text-text-muted";

  return (
    <span className={`inline-flex rounded-full px-sm py-1 text-caption font-semibold ${color}`}>
      {label}
    </span>
  );
}

function PanelText({
  children,
  tone = "muted",
}: {
  children: string;
  tone?: "muted" | "error";
}) {
  return (
    <section className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
      <p className={`text-body-md ${tone === "error" ? "text-error" : "text-text-muted"}`}>
        {children}
      </p>
    </section>
  );
}
