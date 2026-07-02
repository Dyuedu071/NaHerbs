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
      {/* Detail Page Header */}
      <div className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-xs text-caption font-semibold text-primary transition-colors hover:text-secondary"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Quay lại danh sách đơn hàng
        </Link>
        <div className="mt-sm flex flex-wrap items-end justify-between gap-sm">
          <div>
            <span className="text-caption font-semibold text-text-muted uppercase tracking-wider">
              Chi tiết đơn hàng
            </span>
            <h1 className="font-headline-md text-headline-md text-primary mt-1">
              {order.orderCode}
            </h1>
            <p className="mt-xs text-body-md text-text-muted">
              Tạo lúc {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-xs">
            {order.orderStatus && (
              <StatusPill tone="order" value={order.orderStatus} />
            )}
            {order.paymentStatus && (
              <StatusPill tone="payment" value={order.paymentStatus} />
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-md lg:grid-cols-[1fr_340px]">
        {/* Left Column: Products List */}
        <div className="rounded-[24px] border border-herbal-beige bg-surface-container-lowest p-md shadow-ambient-sm flex flex-col gap-md">
          <div className="flex items-center gap-xs border-b border-border-warm/40 pb-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">
              shopping_bag
            </span>
            <h2 className="text-body-lg font-body-lg font-bold text-text-main">
              Sản phẩm trong đơn
            </h2>
          </div>
          
          <div className="flex flex-col gap-sm">
            {(order.items ?? []).map((item) => (
              <div
                key={item.id}
                className="flex gap-md border-b border-border-warm/30 pb-sm last:border-0 last:pb-0"
              >
                {/* Product Icon Box */}
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-surface-container border border-border-warm/40 text-primary">
                  <span className="material-symbols-outlined text-[24px]">
                    inventory_2
                  </span>
                </div>
                
                {/* Details */}
                <div className="flex flex-1 flex-wrap justify-between gap-sm">
                  <div className="min-w-[180px]">
                    <p className="text-label-md font-bold text-text-main">
                      {item.productNameSnapshot}
                    </p>
                    <p className="mt-xs text-caption text-text-muted font-medium">
                      Phiên bản: {item.skuNameSnapshot} · Số lượng: <span className="font-bold text-text-main">{item.quantity}</span>
                    </p>
                  </div>
                  <div className="text-left md:text-right flex flex-col justify-center">
                    <p className="text-caption text-text-muted font-medium">
                      Đơn giá: {formatMoney(item.unitPrice)}
                    </p>
                    <p className="text-body-md font-bold text-primary mt-1">
                      {formatMoney(item.lineTotal)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary & Info */}
        <aside className="flex flex-col gap-md">
          {/* Summary Section */}
          <section className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
            <div className="flex items-center gap-xs border-b border-border-warm/40 pb-sm mb-md">
              <span className="material-symbols-outlined text-primary text-[20px]">
                analytics
              </span>
              <h2 className="text-body-lg font-body-lg font-bold text-text-main">
                Tổng quan hóa đơn
              </h2>
            </div>
            
            <dl className="flex flex-col gap-sm text-body-md">
              <div className="flex justify-between gap-sm">
                <dt className="text-text-muted font-medium">Hình thức thanh toán</dt>
                <dd className="font-bold text-text-main">
                  {order.paymentMethod ? paymentMethodLabels[order.paymentMethod] : "-"}
                </dd>
              </div>
              <div className="flex justify-between gap-sm border-t border-border-warm/40 pt-sm">
                <dt className="text-primary font-bold">Tổng thanh toán</dt>
                <dd className="font-headline-md text-title-md font-black text-tertiary-container">
                  {formatMoney(order.totalAmount)}
                </dd>
              </div>
            </dl>
          </section>

          {/* Shipping Section */}
          <section className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
            <div className="flex items-center gap-xs border-b border-border-warm/40 pb-sm mb-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">
                local_shipping
              </span>
              <h2 className="text-body-lg font-body-lg font-bold text-text-main">
                Thông tin nhận hàng
              </h2>
            </div>
            <div className="text-body-md text-text-main flex flex-col gap-1.5 pt-xs">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-text-muted text-[16px]">person</span>
                <span className="font-bold text-text-main">{order.shippingAddress?.receiverName}</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-text-muted text-[16px]">call</span>
                <span className="text-text-muted font-semibold">{order.shippingAddress?.receiverPhone}</span>
              </div>
              {order.shippingAddress?.email && (
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-text-muted text-[16px]">mail</span>
                  <span className="text-text-muted font-medium">{order.shippingAddress.email}</span>
                </div>
              )}
              <div className="flex items-start gap-xs mt-1 border-t border-border-warm/30 pt-sm">
                <span className="material-symbols-outlined text-text-muted text-[18px] mt-0.5">location_on</span>
                <span className="text-body-md leading-relaxed">{order.shippingAddress?.fullAddress}</span>
              </div>
              
              {order.note && (
                <div className="mt-sm p-sm bg-surface-container rounded-xl border border-border-warm/40">
                  <p className="text-caption text-text-muted italic">
                    <span className="font-bold not-italic">Ghi chú:</span> {order.note}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* QR Bank Transfer Section */}
          {order.qrInstruction && (
            <section className="rounded-[24px] border border-primary/30 bg-success-bg p-md shadow-ambient-sm flex flex-col gap-sm">
              <div className="flex items-center gap-xs border-b border-primary/20 pb-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  qr_code_2
                </span>
                <h2 className="text-body-lg font-body-lg font-bold text-primary">
                  Chuyển khoản qua mã QR
                </h2>
              </div>
              <div className="text-body-md text-text-main flex flex-col gap-1">
                <p className="text-caption text-text-muted font-bold uppercase">Ngân hàng</p>
                <p className="font-bold text-primary">{order.qrInstruction.bankName}</p>
                
                <p className="text-caption text-text-muted font-bold uppercase mt-sm">Tên tài khoản</p>
                <p className="font-bold text-text-main">{order.qrInstruction.accountName}</p>
                
                <p className="text-caption text-text-muted font-bold uppercase mt-sm">Số tài khoản</p>
                <p className="font-mono text-lg font-black text-text-main tracking-wider">{order.qrInstruction.accountNumber}</p>
                
                <div className="mt-sm p-sm bg-white/70 rounded-xl border border-primary/10">
                  <p className="text-caption text-text-muted font-bold uppercase">Nội dung chuyển khoản</p>
                  <p className="font-mono text-body-md font-bold text-primary mt-1">
                    {order.qrInstruction.transferContent}
                  </p>
                </div>
              </div>
            </section>
          )}
        </aside>
      </div>
    </section>
  );
}

function StatusPill({
  tone,
  value,
}: {
  tone: "order" | "payment";
  value: string;
}) {
  const label =
    tone === "order"
      ? orderStatusLabels[value as keyof typeof orderStatusLabels]
      : paymentStatusLabels[value as keyof typeof paymentStatusLabels];

  let colorStyle = "bg-surface-container text-text-muted border border-border-warm/40";
  if (value === "CANCELLED" || value === "FAILED") {
    colorStyle = "bg-error-bg text-error-text border border-error/20";
  } else if (value === "PAID" || value === "COMPLETED" || value === "DELIVERED") {
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
