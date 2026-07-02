"use client";

import {
  AdminOrderDetailPanel,
  AdminOrderSelect,
  StatusPill,
} from "@/components/admin/AdminOrderDetailPanel";
import { isAdminSession } from "@/lib/current-user";
import {
  formatDateTime,
  formatMoney,
  orderStatusLabels,
  paymentMethodLabels,
  paymentStatusLabels,
} from "@/lib/order-format";
import {
  getGetAdminOrdersQueryKey,
  useGetAdminOrders,
} from "@/services/generated/admin-orders/admin-orders";
import { useGetAuthMe } from "@/services/generated/customer-profile/customer-profile";
import type { GetAdminOrdersParams } from "@/services/generated/model/getAdminOrdersParams";
import type { OrderPage } from "@/services/generated/model/orderPage";
import { OrderStatus } from "@/services/generated/model/orderStatus";
import type { OrderStatus as OrderStatusType } from "@/services/generated/model/orderStatus";
import { PaymentMethod } from "@/services/generated/model/paymentMethod";
import type { PaymentMethod as PaymentMethodType } from "@/services/generated/model/paymentMethod";
import { PaymentStatus } from "@/services/generated/model/paymentStatus";
import type { PaymentStatus as PaymentStatusType } from "@/services/generated/model/paymentStatus";
import { getCsrfToken } from "@/services/csrf";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

const pageSize = 20;

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [page, setPage] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: meResponse, isLoading: authLoading } = useGetAuthMe({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  });
  const isAdmin = isAdminSession(meResponse);

  const params: GetAdminOrdersParams = useMemo(
    () => ({
      keyword: keyword || undefined,
      orderStatus: (orderStatus || undefined) as OrderStatusType | undefined,
      paymentStatus: (paymentStatus || undefined) as PaymentStatusType | undefined,
      paymentMethod: (paymentMethod || undefined) as PaymentMethodType | undefined,
      page,
      size: pageSize,
    }),
    [keyword, orderStatus, page, paymentMethod, paymentStatus],
  );

  const { data: ordersResponse, isLoading: ordersLoading, isError: ordersError } =
    useGetAdminOrders(params, {
      query: {
        enabled: isAdmin,
        retry: false,
      },
    });

  useEffect(() => {
    void getCsrfToken();
  }, []);

  const ordersPage = (ordersResponse as { data?: OrderPage } | undefined)?.data;
  const orders = ordersPage?.items ?? [];
  const totalPages = ordersPage?.totalPages ?? 0;

  const refreshOrders = () => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminOrdersQueryKey(params) });
    void queryClient.invalidateQueries({ queryKey: ["/admin/orders"] });
  };

  const handleFilter = (event: FormEvent) => {
    event.preventDefault();
    setKeyword(keywordInput.trim());
    setPage(0);
  };

  if (authLoading) {
    return <AdminShell>Đang kiểm tra quyền admin...</AdminShell>;
  }

  if (!isAdmin) {
    return <AdminShell tone="error">Bạn không có quyền truy cập quản lý đơn hàng.</AdminShell>;
  }

  return (
    <main className="mx-auto flex w-full max-w-none flex-1 flex-col gap-md p-gutter">
      <div className="flex flex-wrap items-end justify-between gap-md">
        <div>
          <h1 className="text-headline-md font-headline-md text-primary">
            Quản lý đơn hàng
          </h1>
          <p className="mt-xs text-body-md text-text-muted">
            Danh sách, chi tiết và cập nhật trạng thái đơn hàng.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleFilter}
        className="grid gap-sm rounded-[24px] border border-herbal-beige bg-surface-container-lowest p-md shadow-ambient-sm lg:grid-cols-[1fr_180px_180px_180px_auto]"
      >
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            search
          </span>
          <input
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            placeholder="Mã đơn, khách hàng, email, SĐT"
            className="h-11 w-full rounded-lg border border-border-warm bg-surface pl-10 pr-sm text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <AdminOrderSelect
          value={orderStatus}
          onChange={setOrderStatus}
          options={Object.values(OrderStatus).map((value) => ({
            value,
            label: orderStatusLabels[value],
          }))}
          placeholder="Tất cả đơn"
        />
        <AdminOrderSelect
          value={paymentStatus}
          onChange={setPaymentStatus}
          options={Object.values(PaymentStatus).map((value) => ({
            value,
            label: paymentStatusLabels[value],
          }))}
          placeholder="Tất cả thanh toán"
        />
        <AdminOrderSelect
          value={paymentMethod}
          onChange={setPaymentMethod}
          options={Object.values(PaymentMethod).map((value) => ({
            value,
            label: paymentMethodLabels[value],
          }))}
          placeholder="Tất cả phương thức"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-xs rounded-full bg-primary px-md text-label-md font-label-md text-on-primary hover:bg-secondary"
        >
          <span className="material-symbols-outlined text-[18px]">filter_list</span>
          Lọc
        </button>
      </form>

      <div className="grid gap-md xl:grid-cols-[1fr_420px]">
        <section className="overflow-hidden rounded-[24px] border border-herbal-beige bg-surface-container-lowest shadow-ambient-sm">
          {ordersLoading ? (
            <p className="p-md text-body-md text-text-muted">Đang tải đơn hàng...</p>
          ) : ordersError ? (
            <p className="p-md text-body-md text-error">Không thể tải danh sách đơn hàng.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
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
                      <tr
                        key={order.id}
                        className={`cursor-pointer hover:bg-surface-container-low/60 ${
                          selectedOrderId === order.id ? "bg-success-bg/70" : ""
                        }`}
                        onClick={() => {
                          if (order.id) {
                            setSelectedOrderId(order.id);
                          }
                        }}
                      >
                        <td className="p-sm font-label-md text-label-md text-primary">
                          {order.orderCode}
                        </td>
                        <td className="p-sm text-body-md text-text-muted">
                          {formatDateTime(order.createdAt)}
                        </td>
                        <td className="p-sm">
                          {order.orderStatus && (
                            <StatusPill
                              label={orderStatusLabels[order.orderStatus]}
                              value={order.orderStatus}
                            />
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
                              <StatusPill
                                label={paymentStatusLabels[order.paymentStatus]}
                                value={order.paymentStatus}
                              />
                            )}
                          </div>
                        </td>
                        <td className="p-sm font-semibold text-text-main">
                          {formatMoney(order.totalAmount)}
                        </td>
                        <td className="p-sm text-right">
                          <div className="flex justify-end gap-xs">
                            <button
                              type="button"
                              className="inline-flex items-center justify-center rounded-full p-2 text-primary hover:bg-success-bg"
                              onClick={(event) => {
                                event.stopPropagation();
                                if (order.id) {
                                  setSelectedOrderId(order.id);
                                }
                              }}
                              aria-label="Xem chi tiết"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                visibility
                              </span>
                            </button>
                            {order.id && (
                              <Link
                                href={`/admin/orders/${order.id}`}
                                className="inline-flex items-center justify-center rounded-full p-2 text-primary hover:bg-success-bg"
                                onClick={(event) => event.stopPropagation()}
                                aria-label="Mở trang chi tiết"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  open_in_new
                                </span>
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-md text-center text-body-md text-text-muted">
                          Không có đơn hàng phù hợp.
                        </td>
                      </tr>
                    )}
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
            </>
          )}
        </section>

        <AdminOrderDetailPanel
          key={selectedOrderId ?? "empty-order"}
          orderId={selectedOrderId}
          enabled={isAdmin}
          onAfterUpdate={refreshOrders}
        />
      </div>
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
    <main className="mx-auto flex w-full max-w-none flex-1 items-center justify-center p-gutter">
      <p className={`text-body-md ${tone === "error" ? "text-error" : "text-text-muted"}`}>
        {children}
      </p>
    </main>
  );
}
