import type { OrderStatus } from "@/services/generated/model/orderStatus";
import type { PaymentMethod } from "@/services/generated/model/paymentMethod";
import type { PaymentStatus } from "@/services/generated/model/paymentStatus";

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING_CONFIRMATION: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PACKING: "Đang đóng gói",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  UNPAID: "Chưa thanh toán",
  COD_PENDING: "COD chờ thu",
  WAITING_BANK_TRANSFER: "Chờ xác nhận chuyển khoản",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán lỗi",
  REFUNDED: "Đã hoàn tiền",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  COD: "COD",
  BANK_QR: "Chuyển khoản QR",
};

export function formatMoney(value?: number | null): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function formatDateTime(value?: string | null): string {
  if (!value) {
    return "-";
  }
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
