"use client";

import QrPaymentConfigSection, {
  type QrPaymentSettingKey,
  type QrPaymentSettings,
} from "@/components/admin/settings/QrPaymentConfigSection";
import { useToast } from "@/contexts/ToastContext";
import { extractApiErrorMessage } from "@/lib/api-error";
import {
  formatDateTime,
  formatMoney,
  paymentStatusLabels,
} from "@/lib/order-format";
import { AXIOS_INSTANCE } from "@/services/api-client";
import {
  getGetAdminOrdersQueryKey,
  useGetAdminOrders,
  usePatchAdminOrdersOrderIdPaymentStatus,
} from "@/services/generated/admin-orders/admin-orders";
import { PaymentMethod } from "@/services/generated/model/paymentMethod";
import { PaymentStatus } from "@/services/generated/model/paymentStatus";
import type { GetAdminOrdersParams } from "@/services/generated/model/getAdminOrdersParams";
import type { OrderPage } from "@/services/generated/model/orderPage";
import type { OrderSummary } from "@/services/generated/model/orderSummary";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const QR_SETTING_KEYS: QrPaymentSettingKey[] = [
  "bankName",
  "bankAccountName",
  "bankAccountNumber",
  "bankQrImageUrl",
  "bankQrMediaId",
];

const DEFAULT_QR_SETTINGS: QrPaymentSettings = {
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankQrImageUrl: "",
  bankQrMediaId: "",
};

type TabId = "confirm" | "config";

const PAGE_SIZE = 10;

export default function AdminQrPaymentSettingsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("confirm");
  const [settings, setSettings] =
    useState<QrPaymentSettings>(DEFAULT_QR_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await AXIOS_INSTANCE.get("/admin/settings");
        const data: Record<string, string> = res.data?.data || res.data || {};
        setSettings((prev) => {
          const merged = { ...prev };
          for (const key of QR_SETTING_KEYS) {
            if (data[key] !== undefined) {
              merged[key] = data[key];
            }
          }
          return merged;
        });
      } catch (err) {
        console.error("Failed to load QR payment settings:", err);
        showToast("Không thể tải cấu hình thanh toán QR.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (key: QrPaymentSettingKey, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await AXIOS_INSTANCE.put("/admin/settings", settings);
      showToast("Đã lưu cấu hình thanh toán QR.", "success");
      setIsDirty(false);
    } catch (err) {
      console.error("Failed to save QR payment settings:", err);
      showToast("Lưu cấu hình QR thất bại. Vui lòng thử lại.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex-1 p-gutter w-full max-w-6xl">
      <div className="mb-lg flex items-start justify-between">
        <div>
          <h2 className="text-headline-md font-headline-md text-primary-container">
            Thanh toán QR
          </h2>
          <p className="mt-base text-body-md text-text-muted">
            Xác nhận chuyển khoản thủ công và cấu hình ảnh QR cố định cho
            khách hàng khi checkout.
          </p>
        </div>

        {activeTab === "config" && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className={`flex items-center gap-xs rounded-full px-md py-sm text-label-md font-label-md text-on-primary shadow-ambient-1 transition-all duration-200 ${
              isDirty && !isSaving
                ? "bg-primary hover:bg-primary-container active:scale-95"
                : "cursor-not-allowed bg-outline-variant opacity-60"
            }`}
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                Đang lưu...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">
                  save
                </span>
                Lưu thay đổi
              </>
            )}
          </button>
        )}
      </div>

      <div className="mb-lg flex gap-xs overflow-x-auto rounded-2xl border border-herbal-beige bg-surface-container-lowest p-xs shadow-ambient-1">
        <TabButton
          active={activeTab === "confirm"}
          icon="fact_check"
          label="Xác nhận chuyển khoản"
          onClick={() => setActiveTab("confirm")}
        />
        <TabButton
          active={activeTab === "config"}
          icon="qr_code_2"
          label="Cấu hình QR"
          onClick={() => setActiveTab("config")}
        />
      </div>

      {activeTab === "config" && isDirty && !isSaving && (
        <div className="mb-md flex items-center gap-xs rounded-xl border border-tertiary-fixed bg-tertiary-fixed/20 px-md py-sm text-body-md text-tertiary-container">
          <span className="material-symbols-outlined text-[18px]">
            edit_note
          </span>
          Bạn có thay đổi chưa được lưu.
        </div>
      )}

      {activeTab === "confirm" ? (
        <PendingQrTransfersSection showToast={showToast} />
      ) : (
        <QrPaymentConfigSection
          settings={settings}
          onChange={handleChange}
          isLoading={isLoading}
          showToast={showToast}
        />
      )}

      {activeTab === "config" && isDirty && (
        <div className="sticky bottom-0 mt-lg flex items-center justify-between rounded-2xl border border-primary/20 bg-surface/95 px-md py-sm shadow-ambient-2 backdrop-blur-md">
          <p className="text-body-md text-text-muted">
            <span className="material-symbols-outlined mr-1 align-middle text-[18px] text-primary">
              info
            </span>
            Có thay đổi chưa được lưu
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-xs rounded-full bg-primary px-md py-sm text-label-md font-label-md text-on-primary shadow-ambient-1 transition-all hover:bg-primary-container active:scale-95 disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                Đang lưu...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">
                  save
                </span>
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      )}
    </main>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-xs whitespace-nowrap rounded-xl px-md py-sm text-label-md font-label-md transition-all duration-200 ${
        active
          ? "bg-primary text-on-primary shadow-ambient-1"
          : "text-text-muted hover:bg-surface-container hover:text-primary"
      }`}
    >
      <span
        className="material-symbols-outlined text-[18px]"
        style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
      >
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function PendingQrTransfersSection({
  showToast,
}: {
  showToast: (msg: string, kind: "success" | "error") => void;
}) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const params: GetAdminOrdersParams = {
    paymentMethod: PaymentMethod.BANK_QR,
    paymentStatus: PaymentStatus.WAITING_BANK_TRANSFER,
    page,
    size: PAGE_SIZE,
  };

  const {
    data: ordersResponse,
    isLoading,
    isError,
  } = useGetAdminOrders(params, {
    query: {
      retry: false,
    },
  });

  const ordersPage = (ordersResponse as { data?: OrderPage } | undefined)?.data;
  const orders = ordersPage?.items ?? [];
  const totalPages = ordersPage?.totalPages ?? 0;
  const totalItems = ordersPage?.totalItems ?? orders.length;

  const refresh = () => {
    void queryClient.invalidateQueries({
      queryKey: getGetAdminOrdersQueryKey(params),
    });
    void queryClient.invalidateQueries({ queryKey: ["/admin/dashboard"] });
  };

  const { mutate: updatePaymentStatus, isPending } =
    usePatchAdminOrdersOrderIdPaymentStatus({
      mutation: {
        onSuccess: (_, variables) => {
          const status = variables.data.paymentStatus;
          setUpdatingOrderId(null);
          showToast(
            status === PaymentStatus.PAID
              ? "Đã xác nhận thanh toán QR."
              : "Đã đánh dấu thanh toán cần kiểm tra.",
            "success",
          );
          refresh();
        },
        onError: (error) => {
          setUpdatingOrderId(null);
          showToast(extractApiErrorMessage(error, "Cập nhật thanh toán thất bại."), "error");
        },
      },
    });

  const handleUpdate = (order: OrderSummary, paymentStatus: PaymentStatus) => {
    if (!order.id) return;
    setUpdatingOrderId(order.id);
    updatePaymentStatus({
      orderId: order.id,
      data: {
        paymentStatus,
        note:
          paymentStatus === PaymentStatus.PAID
            ? "Admin đã kiểm tra giao dịch ngân hàng và xác nhận thanh toán QR."
            : "Admin đánh dấu giao dịch QR cần kiểm tra lại.",
      },
    });
  };

  return (
    <section className="space-y-md">
      <div className="flex items-start gap-sm rounded-xl border border-error-container bg-error-bg p-sm shadow-sm">
        <span
          className="material-symbols-outlined mt-0.5 text-error-text"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          warning
        </span>
        <div>
          <h3 className="font-label-md text-label-md text-error-text">
            Chỉ xác nhận sau khi đã kiểm tra ngân hàng
          </h3>
          <p className="mt-1 font-body-md text-body-md text-error-text/80">
            Khách hàng sẽ thấy trạng thái “Chờ xác nhận chuyển khoản” cho tới
            khi admin đổi sang “Đã thanh toán”.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-md md:grid-cols-3">
        <StatCard
          icon="hourglass_empty"
          label="Đơn chờ xác nhận"
          value={String(totalItems)}
          tone="warning"
        />
        <StatCard
          icon="qr_code_2"
          label="Phương thức"
          value="BANK_QR"
          tone="neutral"
        />
        <StatCard
          icon="payments"
          label="Trạng thái khách thấy"
          value={paymentStatusLabels.WAITING_BANK_TRANSFER}
          tone="success"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border-warm bg-surface-container-lowest shadow-sm">
        <div className="flex flex-col gap-xs border-b border-border-warm bg-surface-container-low/50 p-md">
          <h3 className="text-xl font-semibold text-text-main">
            Đơn chờ chuyển khoản
          </h3>
          <p className="text-body-md text-text-muted">
            Danh sách chỉ gồm đơn QR đang chờ admin xác nhận tiền về tài khoản.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-warm bg-surface-container-low/30 font-label-md text-label-md text-text-muted">
                <th className="px-4 py-3 font-semibold">Mã đơn</th>
                <th className="px-4 py-3 font-semibold">Số tiền</th>
                <th className="px-4 py-3 font-semibold">Thời gian</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-warm/50 font-body-md text-body-md text-text-main">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-lg text-center text-text-muted">
                    Đang tải đơn chờ chuyển khoản...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="py-lg text-center text-error-text">
                    Không thể tải danh sách đơn QR.
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-lg text-center">
                    <div className="flex flex-col items-center gap-xs text-text-muted">
                      <span className="material-symbols-outlined text-[40px]">
                        task_alt
                      </span>
                      <p>Không có đơn QR nào đang chờ xác nhận.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isRowUpdating =
                    isPending && updatingOrderId === order.id;

                  return (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-surface-container-low/30"
                    >
                      <td className="px-4 py-4 font-medium text-primary">
                        {order.orderCode ?? "—"}
                      </td>
                      <td className="px-4 py-4 font-semibold">
                        {formatMoney(order.totalAmount)}
                      </td>
                      <td className="px-4 py-4 text-sm text-text-muted">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-semibold text-earth-brown">
                          <span className="h-1.5 w-1.5 rounded-full bg-earth-brown" />
                          {paymentStatusLabels.WAITING_BANK_TRANSFER}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-xs">
                          <button
                            type="button"
                            disabled={isRowUpdating}
                            onClick={() =>
                              handleUpdate(order, PaymentStatus.PAID)
                            }
                            className="inline-flex items-center gap-xs rounded-full bg-primary px-4 py-1.5 font-label-md text-label-md text-on-primary shadow-sm transition-colors hover:bg-secondary disabled:opacity-60"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              check_circle
                            </span>
                            {isRowUpdating ? "Đang xử lý..." : "Xác nhận"}
                          </button>
                          <button
                            type="button"
                            disabled={isRowUpdating}
                            onClick={() =>
                              handleUpdate(order, PaymentStatus.FAILED)
                            }
                            className="inline-flex items-center gap-xs rounded-full border border-error-text/30 px-3 py-1.5 font-label-md text-label-md text-error-text transition-colors hover:bg-error-container/50 disabled:opacity-60"
                          >
                            Cần kiểm tra
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border-warm p-4 text-sm text-text-muted">
          <span>
            Trang {page + 1} / {Math.max(totalPages, 1)}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded p-1 text-text-muted transition-colors hover:bg-surface-container-high disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_left
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= totalPages}
              className="rounded p-1 text-text-main transition-colors hover:bg-surface-container-high disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: string;
  label: string;
  value: string;
  tone: "warning" | "success" | "neutral";
}) {
  const iconClass =
    tone === "warning"
      ? "bg-surface-container-low text-earth-brown"
      : tone === "success"
        ? "bg-success-bg text-primary"
        : "bg-surface-container-low text-primary";
  const valueClass =
    tone === "warning"
      ? "text-earth-brown"
      : tone === "success"
        ? "text-primary"
        : "text-text-main";

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border-warm/50 bg-surface-container-lowest p-md shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-sm flex items-start justify-between">
        <span className="font-body-md text-body-md text-text-muted">
          {label}
        </span>
        <div className={`rounded-lg p-2 ${iconClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <div className={`text-headline-lg font-headline-lg ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}
