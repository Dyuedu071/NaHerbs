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
          Theo dõi trạng thái xử lý, thanh toán và thông tin giao hàng của bạn.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-herbal-beige bg-surface p-lg text-center shadow-ambient-sm">
          <span className="material-symbols-outlined text-[48px] text-primary">
            receipt_long
          </span>
          <p className="mt-sm text-body-md text-text-muted">
            Bạn chưa có đơn hàng nào tại cửa hàng.
          </p>
          <Link
            href="/"
            className="mt-md inline-flex items-center gap-xs rounded-full bg-primary px-md py-sm text-label-md font-label-md text-on-primary transition-transform hover:scale-[1.02] shadow-soft-1"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-md">
          {/* Card List of Orders */}
          <div className="flex flex-col gap-sm">
            {orders.map((order) => (
              <div
                key={order.id}
                className="group relative flex flex-col gap-sm rounded-2xl border border-border-warm bg-surface-container-lowest p-md shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-soft-1"
              >
                {/* Top Header Row of Card */}
                <div className="flex flex-wrap items-center justify-between gap-xs border-b border-border-warm/40 pb-sm">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      receipt_long
                    </span>
                    <span className="font-label-md text-label-md text-primary">
                      Mã đơn: {order.orderCode}
                    </span>
                  </div>
                  <span className="text-caption text-text-muted font-medium">
                    {formatDateTime(order.createdAt)}
                  </span>
                </div>

                {/* Grid Content of Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm py-xs">
                  {/* Column 1: Total Amount */}
                  <div className="flex flex-col gap-1">
                    <span className="text-caption text-text-muted font-medium">Tổng tiền</span>
                    <span className="text-title-md font-bold text-tertiary-container">
                      {formatMoney(order.totalAmount)}
                    </span>
                  </div>

                  {/* Column 2: Order Status */}
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-caption text-text-muted font-medium">Trạng thái đơn hàng</span>
                    {order.orderStatus && (
                      <StatusPill tone="order" value={order.orderStatus} />
                    )}
                  </div>

                  {/* Column 3: Payment */}
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-caption text-text-muted font-medium">Thanh toán</span>
                    <div className="flex flex-wrap items-center gap-xs">
                      <span className="text-caption font-semibold text-text-main">
                        {order.paymentMethod ? paymentMethodLabels[order.paymentMethod] : "-"}
                      </span>
                      {order.paymentStatus && (
                        <StatusPill tone="payment" value={order.paymentStatus} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action Row of Card */}
                <div className="flex items-center justify-end border-t border-border-warm/40 pt-sm mt-xs">
                  {order.id && (
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center gap-xs rounded-full border border-primary px-md py-1.5 text-caption font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-on-primary"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        visibility
                      </span>
                      Chi tiết đơn hàng
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between rounded-2xl border border-border-warm bg-surface p-sm shadow-sm">
            <p className="text-caption font-semibold text-text-muted ml-xs">
              Trang {page + 1} / {Math.max(totalPages, 1)}
            </p>
            <div className="flex gap-xs">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1 rounded-lg border border-border-warm bg-white px-md py-1.5 text-caption font-semibold text-primary transition-colors hover:bg-success-bg disabled:opacity-50 disabled:hover:bg-white"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                Trước
              </button>
              <button
                type="button"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="flex items-center gap-1 rounded-lg border border-border-warm bg-white px-md py-1.5 text-caption font-semibold text-primary transition-colors hover:bg-success-bg disabled:opacity-50 disabled:hover:bg-white"
              >
                Sau
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
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

  let colorStyle = "bg-surface-container text-text-muted border border-border-warm/40";
  if (value === "CANCELLED" || value === "FAILED") {
    colorStyle = "bg-error-bg text-error-text border border-error/20";
  } else if (value === "PAID" || value === "COMPLETED") {
    colorStyle = "bg-success-bg text-primary border border-primary/20";
  } else {
    colorStyle = "bg-tertiary-fixed text-on-tertiary-fixed-variant border border-tertiary-fixed-dim/30";
  }

  return (
    <span className={`inline-flex items-center rounded-full px-sm py-[2px] text-caption font-semibold ${colorStyle}`}>
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
    <section className="rounded-[24px] border border-herbal-beige bg-surface p-lg shadow-ambient-sm flex flex-col items-center justify-center min-h-[220px] text-center">
      <span className={`material-symbols-outlined text-[40px] mb-sm ${tone === "error" ? "text-error" : "text-soft-sage animate-pulse"}`}>
        {tone === "error" ? "error_outline" : "hourglass_empty"}
      </span>
      <p className={`text-body-md font-semibold ${tone === "error" ? "text-error" : "text-text-muted"}`}>
        {children}
      </p>
    </section>
  );
}
