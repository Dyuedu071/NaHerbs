"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AXIOS_INSTANCE } from "@/services/api-client";

interface RecentOrderItem {
  id: string;
  orderCode: string;
  receiverName: string;
  receiverPhone: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface LowStockItem {
  id: string;
  productName: string;
  skuName: string;
  stockQuantity: number;
  stockStatus: string;
  thumbnailUrl: string | null;
}

interface PendingQrItem {
  id: string;
  orderCode: string;
  totalAmount: number;
  createdAt: string;
}

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  pendingOrders: number;
  todayOrders: number;
  pendingQrPayments: number;
  monthlyRevenue: number;
  lastMonthRevenue: number;
  recentOrders: RecentOrderItem[];
  lowStockItems: LowStockItem[];
  pendingQrItems: PendingQrItem[];
}

const orderStatusLabels: Record<string, string> = {
  PENDING_CONFIRMATION: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PACKING: "Đang đóng gói",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

const orderStatusStyles: Record<string, string> = {
  PENDING_CONFIRMATION:
    "bg-surface-container text-text-muted",
  CONFIRMED:
    "bg-secondary-container/30 text-primary",
  PACKING:
    "bg-tertiary-fixed/30 text-tertiary-container",
  SHIPPING:
    "bg-surface-container text-primary-container",
  COMPLETED:
    "bg-success-bg text-primary",
  CANCELLED:
    "bg-error-bg text-error-text",
};

function formatMoney(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K`;
  }
  return amount.toLocaleString("vi-VN") + "đ";
}

function formatMoneyFull(amount: number): string {
  return amount.toLocaleString("vi-VN") + " đ";
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
}

function revenueChangePercent(current: number, previous: number): { text: string; positive: boolean } {
  if (previous === 0 && current === 0) return { text: "Chưa có dữ liệu", positive: true };
  if (previous === 0) return { text: "+100%", positive: true };
  const percent = ((current - previous) / previous) * 100;
  const sign = percent >= 0 ? "+" : "";
  return {
    text: `${sign}${percent.toFixed(0)}% so với tháng trước`,
    positive: percent >= 0,
  };
}

// Skeleton loader for stat cards
function StatCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-md shadow-level-1 border border-herbal-beige flex items-start justify-between animate-pulse">
      <div className="flex-1">
        <div className="h-3 bg-surface-container rounded w-24 mb-3" />
        <div className="h-7 bg-surface-container rounded w-16 mb-2" />
        <div className="h-3 bg-surface-container rounded w-32" />
      </div>
      <div className="w-12 h-12 rounded-xl bg-surface-container" />
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await AXIOS_INSTANCE.get("/admin/dashboard/stats");
        const data = res.data?.data || res.data;
        setStats(data);
      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err);
        setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const revenueChange = stats
    ? revenueChangePercent(stats.monthlyRevenue, stats.lastMonthRevenue)
    : { text: "", positive: true };

  return (
    <main className="flex-1 p-gutter w-full">
      <div className="mb-lg">
        <h2 className="text-headline-md font-headline-md text-primary-container">Tổng quan</h2>
        <p className="text-body-md text-text-muted mt-base">Theo dõi hiệu suất cửa hàng hôm nay.</p>
      </div>

      {error && (
        <div className="mb-md p-md rounded-2xl bg-error-bg border border-error-text/20 text-error-text text-body-md">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : stats ? (
          <>
            {/* Total Products */}
            <div className="bg-surface-container-lowest rounded-2xl p-md shadow-level-1 border border-herbal-beige flex items-start justify-between">
              <div>
                <p className="text-caption font-caption text-text-muted uppercase tracking-wider">
                  Tổng sản phẩm
                </p>
                <p className="text-price-display font-price-display text-text-main mt-xs">
                  {stats.totalProducts.toLocaleString("vi-VN")}
                </p>
                <p className="text-caption text-primary mt-base flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    inventory_2
                  </span>{" "}
                  {stats.activeProducts} đang bán
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success-bg flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>
              </div>
            </div>

            {/* New Orders */}
            <div className="bg-surface-container-lowest rounded-2xl p-md shadow-level-1 border border-herbal-beige flex items-start justify-between">
              <div>
                <p className="text-caption font-caption text-text-muted uppercase tracking-wider">
                  Đơn chờ xác nhận
                </p>
                <p className="text-price-display font-price-display text-text-main mt-xs">
                  {stats.pendingOrders}
                </p>
                <p className="text-caption text-primary mt-base flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    add_shopping_cart
                  </span>{" "}
                  +{stats.todayOrders} hôm nay
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_mall
                </span>
              </div>
            </div>

            {/* Pending QR Payments */}
            <div className="bg-surface-container-lowest rounded-2xl p-md shadow-level-1 border border-herbal-beige flex items-start justify-between">
              <div>
                <p className="text-caption font-caption text-text-muted uppercase tracking-wider">
                  Đơn chờ xác nhận QR
                </p>
                <p className={`text-price-display font-price-display mt-xs ${stats.pendingQrPayments > 0 ? "text-error-text" : "text-text-main"}`}>
                  {stats.pendingQrPayments}
                </p>
                <p className="text-caption text-text-muted mt-base flex items-center gap-1">
                  {stats.pendingQrPayments > 0 ? "Cần xử lý ngay" : "Không có đơn chờ"}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stats.pendingQrPayments > 0 ? "bg-error-bg text-error-text" : "bg-success-bg text-primary"}`}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  qr_code_scanner
                </span>
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-surface-container-lowest rounded-2xl p-md shadow-level-1 border border-herbal-beige flex items-start justify-between">
              <div>
                <p className="text-caption font-caption text-text-muted uppercase tracking-wider">
                  Doanh thu tháng
                </p>
                <p className="text-price-display font-price-display text-text-main mt-xs">
                  {formatMoney(stats.monthlyRevenue)}
                </p>
                <p className={`text-caption mt-base flex items-center gap-1 ${revenueChange.positive ? "text-primary" : "text-error-text"}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {revenueChange.positive ? "trending_up" : "trending_down"}
                  </span>{" "}
                  {revenueChange.text}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-container">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_balance_wallet
                </span>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Complex Layout: Main Table & Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Recent Orders Table (Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl shadow-level-1 border border-herbal-beige overflow-hidden flex flex-col">
          <div className="p-md border-b border-herbal-beige flex justify-between items-center bg-surface-container-low/50">
            <h3 className="text-body-lg font-body-lg font-semibold text-text-main">
              Đơn hàng gần đây
            </h3>
            <Link
              href="/admin/orders"
              className="text-label-md font-label-md text-primary hover:text-primary-container transition-colors"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-caption font-caption text-text-muted uppercase tracking-wide">
                  <th className="p-sm font-semibold border-b border-herbal-beige">
                    Mã Đơn
                  </th>
                  <th className="p-sm font-semibold border-b border-herbal-beige">
                    Khách Hàng
                  </th>
                  <th className="p-sm font-semibold border-b border-herbal-beige">
                    Tổng Tiền
                  </th>
                  <th className="p-sm font-semibold border-b border-herbal-beige">
                    Trạng Thái
                  </th>
                  <th className="p-sm font-semibold border-b border-herbal-beige text-right">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="text-body-md text-text-main divide-y divide-herbal-beige">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="p-sm"><div className="h-4 bg-surface-container rounded w-20" /></td>
                      <td className="p-sm">
                        <div className="h-4 bg-surface-container rounded w-28 mb-1" />
                        <div className="h-3 bg-surface-container rounded w-20" />
                      </td>
                      <td className="p-sm"><div className="h-4 bg-surface-container rounded w-24" /></td>
                      <td className="p-sm"><div className="h-6 bg-surface-container rounded-full w-24" /></td>
                      <td className="p-sm"><div className="h-8 bg-surface-container rounded w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : stats && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-sm font-medium">#{order.orderCode}</td>
                      <td className="p-sm">
                        <div className="flex flex-col">
                          <span>{order.receiverName}</span>
                          <span className="text-caption text-text-muted">
                            {order.receiverPhone}
                          </span>
                        </div>
                      </td>
                      <td className="p-sm">{formatMoneyFull(order.totalAmount)}</td>
                      <td className="p-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-caption font-semibold ${orderStatusStyles[order.orderStatus] || "bg-surface-container text-text-muted"}`}>
                          {orderStatusLabels[order.orderStatus] || order.orderStatus}
                        </span>
                      </td>
                      <td className="p-sm text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 text-text-muted hover:text-primary transition-colors inline-flex"
                          title="Chi tiết"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            visibility
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-lg text-center text-text-muted">
                      <div className="flex flex-col items-center gap-xs">
                        <span className="material-symbols-outlined text-[40px] text-border-warm">
                          shopping_cart_off
                        </span>
                        <p>Chưa có đơn hàng nào.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panels (Takes up 1 column on large screens) */}
        <div className="lg:col-span-1 space-y-md">
          {/* Low Stock Widget */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-level-1 border border-herbal-beige overflow-hidden">
            <div className="p-sm border-b border-herbal-beige bg-surface-container-low/50 flex items-center gap-xs">
              <span
                className="material-symbols-outlined text-tertiary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
              <h3 className="text-label-md font-label-md text-text-main">
                Sản phẩm sắp hết hàng
              </h3>
            </div>
            <div className="p-sm space-y-sm">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-sm animate-pulse">
                    <div className="w-12 h-12 rounded-lg bg-surface-container" />
                    <div className="flex-1">
                      <div className="h-4 bg-surface-container rounded w-3/4 mb-1" />
                      <div className="h-3 bg-surface-container rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : stats && stats.lowStockItems.length > 0 ? (
                stats.lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-sm">
                    <div className="w-12 h-12 rounded-lg bg-herbal-beige border border-border-warm overflow-hidden shrink-0 flex items-center justify-center text-primary">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined">eco</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md font-medium text-text-main truncate">
                        {item.productName}
                      </p>
                      <p className="text-caption text-text-muted truncate">
                        {item.skuName}
                      </p>
                      <p className={`text-caption ${item.stockStatus === "OUT_OF_STOCK" ? "text-error-text font-semibold" : "text-tertiary-container"}`}>
                        {item.stockStatus === "OUT_OF_STOCK"
                          ? "Hết hàng"
                          : `Còn lại: ${item.stockQuantity}`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-sm text-text-muted text-body-md">
                  <span className="material-symbols-outlined text-[32px] text-primary mb-xs block">
                    check_circle
                  </span>
                  Tất cả sản phẩm đều còn hàng
                </div>
              )}
            </div>
          </div>

          {/* Pending QR Payments Widget */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-level-1 border border-herbal-beige overflow-hidden">
            <div className="p-sm border-b border-herbal-beige bg-surface-container-low/50 flex items-center justify-between">
              <div className="flex items-center gap-xs">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  qr_code
                </span>
                <h3 className="text-label-md font-label-md text-text-main">
                  Thanh toán QR chờ duyệt
                </h3>
              </div>
              {stats && stats.pendingQrPayments > 0 && (
                <span className="bg-primary text-on-primary text-caption font-bold px-2 py-0.5 rounded-full">
                  {stats.pendingQrPayments}
                </span>
              )}
            </div>
            <div className="p-sm space-y-sm">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="flex justify-between items-center p-sm rounded-xl border border-border-warm bg-surface-container/30 animate-pulse">
                    <div>
                      <div className="h-4 bg-surface-container rounded w-20 mb-1" />
                      <div className="h-3 bg-surface-container rounded w-24" />
                    </div>
                    <div className="flex items-center gap-sm">
                      <div className="h-5 bg-surface-container rounded w-16" />
                      <div className="h-7 bg-surface-container rounded-full w-14" />
                    </div>
                  </div>
                ))
              ) : stats && stats.pendingQrItems.length > 0 ? (
                stats.pendingQrItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-sm rounded-xl border border-border-warm bg-surface-container/30">
                    <div>
                      <p className="text-label-md font-label-md text-text-main">
                        #{item.orderCode}
                      </p>
                      <p className="text-caption text-text-muted">{timeAgo(item.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-sm">
                      <p className="text-body-md font-bold text-primary">
                        {formatMoney(item.totalAmount)}
                      </p>
                      <Link
                        href={`/admin/orders/${item.id}`}
                        className="px-3 py-1 rounded-full bg-primary text-on-primary text-caption hover:bg-primary-container transition-colors shadow-level-1"
                      >
                        Duyệt
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-sm text-text-muted text-body-md">
                  <span className="material-symbols-outlined text-[32px] text-primary mb-xs block">
                    check_circle
                  </span>
                  Không có đơn QR chờ duyệt
                </div>
              )}
            </div>
            {stats && stats.pendingQrPayments > 0 && (
              <div className="p-sm pt-0">
                <Link
                  href="/admin/orders"
                  className="w-full py-2 text-center text-label-md text-primary hover:bg-surface-container rounded-lg transition-colors block"
                >
                  Xem tất cả yêu cầu
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
