"use client";

import { extractApiErrorMessage } from "@/lib/api-error";
import {
  formatDateTime,
  formatMoney,
  orderStatusLabels,
  paymentMethodLabels,
  paymentStatusLabels,
} from "@/lib/order-format";
import {
  getGetAdminOrdersOrderIdQueryKey,
  useGetAdminOrdersOrderId,
  usePatchAdminOrdersOrderIdPaymentStatus,
  usePatchAdminOrdersOrderIdStatus,
} from "@/services/generated/admin-orders/admin-orders";
import type { OrderDetail } from "@/services/generated/model/orderDetail";
import { OrderStatus } from "@/services/generated/model/orderStatus";
import type { OrderStatus as OrderStatusType } from "@/services/generated/model/orderStatus";
import { PaymentStatus } from "@/services/generated/model/paymentStatus";
import type { PaymentStatus as PaymentStatusType } from "@/services/generated/model/paymentStatus";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";

type AdminOrderDetailPanelProps = {
  orderId?: string | null;
  enabled?: boolean;
  showOpenLink?: boolean;
  onAfterUpdate?: () => void;
  emptyText?: string;
};

export function AdminOrderDetailPanel({
  orderId,
  enabled = true,
  showOpenLink = true,
  onAfterUpdate,
  emptyText = "Chọn một đơn hàng để xem chi tiết.",
}: AdminOrderDetailPanelProps) {
  const queryClient = useQueryClient();
  const [statusValue, setStatusValue] = useState<OrderStatusType | null>(null);
  const [paymentValue, setPaymentValue] = useState<PaymentStatusType | null>(null);
  const [orderNote, setOrderNote] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeOrderId = orderId ?? "";
  const { data: detailResponse, isLoading, isError } = useGetAdminOrdersOrderId(
    activeOrderId,
    {
      query: {
        enabled: Boolean(enabled && activeOrderId),
        retry: false,
      },
    },
  );

  const order = (detailResponse as { data?: OrderDetail } | undefined)?.data;

  const effectiveStatusValue = useMemo(
    () => statusValue ?? order?.orderStatus ?? OrderStatus.CONFIRMED,
    [order?.orderStatus, statusValue],
  );
  const effectivePaymentValue = useMemo(
    () => paymentValue ?? order?.paymentStatus ?? PaymentStatus.PAID,
    [order?.paymentStatus, paymentValue],
  );

  const refreshDetail = () => {
    if (activeOrderId) {
      void queryClient.invalidateQueries({
        queryKey: getGetAdminOrdersOrderIdQueryKey(activeOrderId),
      });
    }
    onAfterUpdate?.();
  };

  const onMutationError = (mutationError: unknown) => {
    setMessage(null);
    setError(extractApiErrorMessage(mutationError));
  };

  const { mutate: updateOrderStatus, isPending: isUpdatingStatus } =
    usePatchAdminOrdersOrderIdStatus({
      mutation: {
        onSuccess: () => {
          setError(null);
          setMessage("Đã cập nhật trạng thái đơn hàng.");
          setOrderNote("");
          refreshDetail();
        },
        onError: onMutationError,
      },
    });

  const { mutate: updatePaymentStatus, isPending: isUpdatingPayment } =
    usePatchAdminOrdersOrderIdPaymentStatus({
      mutation: {
        onSuccess: () => {
          setError(null);
          setMessage("Đã cập nhật trạng thái thanh toán.");
          setPaymentNote("");
          refreshDetail();
        },
        onError: onMutationError,
      },
    });

  const handleUpdateStatus = () => {
    if (!activeOrderId) {
      return;
    }
    updateOrderStatus({
      orderId: activeOrderId,
      data: {
        orderStatus: effectiveStatusValue,
        note: orderNote.trim() || null,
      },
    });
  };

  const handleUpdatePayment = () => {
    if (!activeOrderId) {
      return;
    }
    updatePaymentStatus({
      orderId: activeOrderId,
      data: {
        paymentStatus: effectivePaymentValue,
        note: paymentNote.trim() || null,
      },
    });
  };

  if (!activeOrderId) {
    return (
      <PanelFrame>
        <div className="flex min-h-80 flex-col items-center justify-center text-center text-text-muted">
          <span className="material-symbols-outlined text-[44px] text-primary">
            receipt_long
          </span>
          <p className="mt-sm text-body-md">{emptyText}</p>
        </div>
      </PanelFrame>
    );
  }

  if (isLoading) {
    return <PanelText>Đang tải chi tiết đơn hàng...</PanelText>;
  }

  if (isError || !order) {
    return <PanelText tone="error">Không thể tải chi tiết đơn hàng.</PanelText>;
  }

  return (
    <PanelFrame>
      <div className="flex flex-col gap-md">
        <div className="flex flex-wrap items-start justify-between gap-sm">
          <div>
            <h2 className="text-body-lg font-body-lg font-semibold text-primary">
              {order.orderCode}
            </h2>
            <p className="mt-xs text-caption text-text-muted">
              Tạo lúc {formatDateTime(order.createdAt)}
            </p>
          </div>
          {showOpenLink && (
            <Link
              href={`/admin/orders/${activeOrderId}`}
              className="inline-flex items-center gap-xs rounded-full border border-border-warm px-sm py-2 text-caption text-primary hover:bg-success-bg"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              Mở trang riêng
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-xs">
          {order.orderStatus && (
            <StatusPill label={orderStatusLabels[order.orderStatus]} value={order.orderStatus} />
          )}
          {order.paymentStatus && (
            <StatusPill
              label={paymentStatusLabels[order.paymentStatus]}
              value={order.paymentStatus}
            />
          )}
          {order.paymentMethod && (
            <StatusPill label={paymentMethodLabels[order.paymentMethod]} value={order.paymentMethod} />
          )}
        </div>

        {message && (
          <p className="rounded-lg bg-success-bg px-sm py-2 text-caption text-primary">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-lg bg-error-container px-sm py-2 text-caption text-error">
            {error}
          </p>
        )}

        <section className="rounded-xl border border-border-warm bg-surface p-sm">
          <h3 className="text-label-md font-label-md text-text-main">Sản phẩm</h3>
          <div className="mt-sm flex flex-col gap-xs">
            {(order.items ?? []).map((item, index) => (
              <div key={item.id ?? index} className="flex justify-between gap-sm text-caption">
                <span className="text-text-main">
                  {item.productNameSnapshot} · {item.skuNameSnapshot} x{item.quantity}
                </span>
                <span className="font-semibold text-text-main">
                  {formatMoney(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border-warm bg-surface p-sm">
          <h3 className="text-label-md font-label-md text-text-main">Giao hàng</h3>
          <p className="mt-xs text-caption text-text-main">
            {order.shippingAddress?.receiverName} · {order.shippingAddress?.receiverPhone}
          </p>
          {order.shippingAddress?.email && (
            <p className="mt-xs text-caption text-text-muted">{order.shippingAddress.email}</p>
          )}
          <p className="mt-xs text-caption text-text-muted">
            {order.shippingAddress?.fullAddress}
          </p>
          {order.note && (
            <p className="mt-xs text-caption text-text-muted">Ghi chú: {order.note}</p>
          )}
        </section>

        <section className="rounded-xl border border-border-warm bg-surface p-sm">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">
              local_shipping
            </span>
            <h3 className="text-label-md font-label-md text-text-main">
              Cập nhật đơn hàng
            </h3>
          </div>
          <div className="mt-sm grid gap-sm">
            <AdminOrderSelect
              value={effectiveStatusValue}
              onChange={(value) => setStatusValue(value as OrderStatusType)}
              options={Object.values(OrderStatus).map((value) => ({
                value,
                label: orderStatusLabels[value],
              }))}
              placeholder="Trạng thái đơn"
            />
            <input
              value={orderNote}
              onChange={(event) => setOrderNote(event.target.value)}
              placeholder="Ghi chú cho đơn hàng"
              className="h-11 rounded-lg border border-border-warm bg-surface px-sm text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={handleUpdateStatus}
              className="inline-flex h-11 items-center justify-center gap-xs rounded-full bg-primary px-sm text-caption font-semibold text-on-primary hover:bg-secondary disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              Cập nhật đơn
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-border-warm bg-surface p-sm">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">
              payments
            </span>
            <h3 className="text-label-md font-label-md text-text-main">
              Cập nhật thanh toán
            </h3>
          </div>
          <div className="mt-sm grid gap-sm">
            <AdminOrderSelect
              value={effectivePaymentValue}
              onChange={(value) => setPaymentValue(value as PaymentStatusType)}
              options={Object.values(PaymentStatus).map((value) => ({
                value,
                label: paymentStatusLabels[value],
              }))}
              placeholder="Trạng thái thanh toán"
            />
            <input
              value={paymentNote}
              onChange={(event) => setPaymentNote(event.target.value)}
              placeholder="Ghi chú cho thanh toán"
              className="h-11 rounded-lg border border-border-warm bg-surface px-sm text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              disabled={isUpdatingPayment}
              onClick={handleUpdatePayment}
              className="inline-flex h-11 items-center justify-center gap-xs rounded-full bg-primary px-sm text-caption font-semibold text-on-primary hover:bg-secondary disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[16px]">payments</span>
              Cập nhật tiền
            </button>
          </div>
        </section>

        <div className="flex justify-between border-t border-border-warm pt-sm text-body-md font-semibold text-primary">
          <span>Tổng cộng</span>
          <span>{formatMoney(order.totalAmount)}</span>
        </div>
      </div>
    </PanelFrame>
  );
}

export function AdminOrderSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 rounded-lg border border-border-warm bg-surface px-sm text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function StatusPill({ label, value }: { label: string; value?: string }) {
  const color =
    value === "FAILED" || value === "CANCELLED"
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

function PanelFrame({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-[24px] border border-herbal-beige bg-surface-container-lowest p-md shadow-ambient-sm">
      {children}
    </aside>
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
    <PanelFrame>
      <p className={`text-body-md ${tone === "error" ? "text-error" : "text-text-muted"}`}>
        {children}
      </p>
    </PanelFrame>
  );
}
