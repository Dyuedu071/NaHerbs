"use client";

import {
  formatDateTime,
  formatMoney,
  orderStatusLabels,
  paymentMethodLabels,
  paymentStatusLabels,
} from "@/lib/order-format";
import { useGetOrdersMyOrderId } from "@/services/generated/customer-orders/customer-orders";
import type { OrderDetail } from "@/services/generated/model/orderDetail";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AccountOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;
  const { data: orderResponse, isLoading, isError } = useGetOrdersMyOrderId(orderId);
  const order = (orderResponse as { data?: OrderDetail } | undefined)?.data;

  if (isLoading) {
    return <PanelText>Đang tải chi tiết đơn hàng...</PanelText>;
  }

  if (isError || !order) {
    return <PanelText tone="error">Không thể tải chi tiết đơn hàng.</PanelText>;
  }

  return (
    <section className="flex flex-col gap-md">
      <div className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-xs text-caption text-primary hover:text-secondary"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Quay lại danh sách
        </Link>
        <div className="mt-sm flex flex-wrap items-end justify-between gap-sm">
          <div>
            <h1 className="font-headline-md text-headline-md text-primary">
              {order.orderCode}
            </h1>
            <p className="mt-xs text-body-md text-text-muted">
              Tạo lúc {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-xs">
            {order.orderStatus && (
              <span className="rounded-full bg-surface-container px-sm py-1 text-caption text-text-muted">
                {orderStatusLabels[order.orderStatus]}
              </span>
            )}
            {order.paymentStatus && (
              <span className="rounded-full bg-success-bg px-sm py-1 text-caption text-primary">
                {paymentStatusLabels[order.paymentStatus]}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-md lg:grid-cols-[1fr_340px]">
        <div className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
          <h2 className="text-body-lg font-body-lg font-semibold text-text-main">
            Sản phẩm
          </h2>
          <div className="mt-md flex flex-col gap-sm">
            {(order.items ?? []).map((item) => (
              <div
                key={item.id}
                className="grid gap-sm border-b border-border-warm pb-sm md:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="text-label-md font-label-md text-text-main">
                    {item.productNameSnapshot}
                  </p>
                  <p className="mt-xs text-caption text-text-muted">
                    {item.skuNameSnapshot} · SL {item.quantity}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-caption text-text-muted">
                    {formatMoney(item.unitPrice)}
                  </p>
                  <p className="text-body-md font-semibold text-text-main">
                    {formatMoney(item.lineTotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-md">
          <section className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
            <h2 className="text-body-lg font-body-lg font-semibold text-text-main">
              Tổng quan
            </h2>
            <dl className="mt-md flex flex-col gap-sm text-body-md">
              <div className="flex justify-between gap-sm">
                <dt className="text-text-muted">Thanh toán</dt>
                <dd className="font-semibold text-text-main">
                  {order.paymentMethod ? paymentMethodLabels[order.paymentMethod] : "-"}
                </dd>
              </div>
              <div className="flex justify-between gap-sm border-t border-border-warm pt-sm">
                <dt className="text-primary">Tổng tiền</dt>
                <dd className="font-semibold text-primary">{formatMoney(order.totalAmount)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
            <h2 className="text-body-lg font-body-lg font-semibold text-text-main">
              Giao hàng
            </h2>
            <div className="mt-sm text-body-md text-text-main">
              <p className="font-semibold">{order.shippingAddress?.receiverName}</p>
              <p className="text-text-muted">{order.shippingAddress?.receiverPhone}</p>
              {order.shippingAddress?.email && (
                <p className="text-text-muted">{order.shippingAddress.email}</p>
              )}
              <p className="mt-xs">{order.shippingAddress?.fullAddress}</p>
              {order.note && (
                <p className="mt-xs text-caption text-text-muted">Ghi chú: {order.note}</p>
              )}
            </div>
          </section>

          {order.qrInstruction && (
            <section className="rounded-[24px] border border-primary/30 bg-success-bg p-md shadow-ambient-sm">
              <h2 className="text-body-lg font-body-lg font-semibold text-primary">
                Chuyển khoản QR
              </h2>
              <div className="mt-sm text-body-md text-text-main">
                <p>{order.qrInstruction.bankName}</p>
                <p>{order.qrInstruction.accountName}</p>
                <p className="font-semibold">{order.qrInstruction.accountNumber}</p>
                <p className="mt-xs text-caption text-text-muted">
                  Nội dung: {order.qrInstruction.transferContent}
                </p>
              </div>
            </section>
          )}
        </aside>
      </div>
    </section>
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
