"use client";

import { AXIOS_INSTANCE } from "@/services/api-client";
import { useRef, useState } from "react";

const MAX_QR_BYTES = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type QrPaymentSettingKey =
  | "bankName"
  | "bankAccountName"
  | "bankAccountNumber"
  | "bankQrImageUrl"
  | "bankQrMediaId";

export interface QrPaymentSettings {
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankQrImageUrl: string;
  bankQrMediaId: string;
}

interface QrPaymentConfigSectionProps {
  settings: QrPaymentSettings;
  onChange: (key: QrPaymentSettingKey, value: string) => void;
  isLoading: boolean;
  showToast: (msg: string, kind: "success" | "error") => void;
}

function BankField({
  label,
  fieldKey,
  value,
  onChange,
  placeholder,
  icon,
  description,
}: {
  label: string;
  fieldKey: QrPaymentSettingKey;
  value: string;
  onChange: (key: QrPaymentSettingKey, value: string) => void;
  placeholder?: string;
  icon: string;
  description?: string;
}) {
  return (
    <div>
      <label
        htmlFor={`qr-setting-${fieldKey}`}
        className="mb-1 flex items-center gap-xs text-label-md font-label-md text-text-main"
      >
        <span className="material-symbols-outlined text-[18px] text-primary">
          {icon}
        </span>
        {label}
      </label>
      {description && (
        <p className="mb-2 text-caption text-text-muted">{description}</p>
      )}
      <input
        id={`qr-setting-${fieldKey}`}
        type="text"
        value={value}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        placeholder={placeholder}
        className="organic-input w-full rounded-xl px-4 text-body-md font-body-md text-text-main placeholder:text-text-muted"
      />
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-2 h-4 w-28 rounded bg-surface-container" />
      <div className="h-12 rounded-xl bg-surface-container" />
    </div>
  );
}

export default function QrPaymentConfigSection({
  settings,
  onChange,
  isLoading,
  showToast,
}: QrPaymentConfigSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingQr, setIsUploadingQr] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      return "Chỉ chấp nhận ảnh PNG, JPG, WEBP hoặc GIF.";
    }
    if (file.size > MAX_QR_BYTES) {
      return "Ảnh vượt quá 10MB.";
    }
    return null;
  };

  const uploadQrFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    const oldMediaId = settings.bankQrMediaId;
    setIsUploadingQr(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "QR");

      const res = await AXIOS_INSTANCE.post("/v1/admin/media/upload", formData);
      const location = res.data?.location as string | undefined;
      const id = res.data?.id as string | undefined;

      if (!location || !id) {
        showToast("Phản hồi upload không hợp lệ.", "error");
        return;
      }

      onChange("bankQrImageUrl", location);
      onChange("bankQrMediaId", id);

      if (oldMediaId) {
        AXIOS_INSTANCE.delete(`/v1/admin/media/${oldMediaId}`).catch(() => {
          // best-effort cleanup
        });
      }

      showToast("Đã tải ảnh QR mới.", "success");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Upload ảnh thất bại.";
      showToast(message, "error");
    } finally {
      setIsUploadingQr(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void uploadQrFile(file);
  };

  const handleRemoveQr = async () => {
    const oldMediaId = settings.bankQrMediaId;
    onChange("bankQrImageUrl", "");
    onChange("bankQrMediaId", "");
    if (oldMediaId) {
      try {
        await AXIOS_INSTANCE.delete(`/v1/admin/media/${oldMediaId}`);
      } catch {
        // best-effort
      }
    }
    showToast("Đã xoá ảnh QR.", "success");
  };

  return (
    <div className="space-y-md">
      {/* Warning — BR-06 */}
      <div className="flex items-start gap-sm rounded-xl border border-error-container bg-error-bg p-sm shadow-sm">
        <span
          className="material-symbols-outlined mt-0.5 text-error-text"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          warning
        </span>
        <div>
          <h4 className="font-label-md text-label-md text-error-text">
            Lưu ý quan trọng
          </h4>
          <p className="mt-1 font-body-md text-body-md text-error-text/80">
            QR là mã cố định của tài khoản shop. Sau khi đổi ảnh, khách checkout
            mới sẽ thấy ảnh mới. Hệ thống không tự đối soát ngân hàng — admin
            xác nhận thanh toán thủ công tại trang Thanh toán QR.
          </p>
        </div>
      </div>

      {/* Bank info */}
      <div className="overflow-hidden rounded-2xl border border-herbal-beige bg-surface-container-lowest shadow-ambient-1">
        <div className="flex items-center gap-sm border-b border-herbal-beige bg-surface-container-low/50 px-md py-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-bg text-primary">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance
            </span>
          </div>
          <h3 className="text-body-lg font-semibold text-text-main">
            Thông tin ngân hàng
          </h3>
        </div>
        <div className="grid grid-cols-1 items-start gap-md p-md md:grid-cols-2">
          {isLoading ? (
            <>
              <FieldSkeleton />
              <FieldSkeleton />
              <div className="md:col-span-2">
                <FieldSkeleton />
              </div>
            </>
          ) : (
            <>
              <BankField
                label="Tên ngân hàng"
                fieldKey="bankName"
                value={settings.bankName}
                onChange={onChange}
                placeholder="Vietcombank"
                icon="account_balance"
                description="Hiển thị trên modal chuyển khoản của khách"
              />
              <BankField
                label="Tên chủ tài khoản"
                fieldKey="bankAccountName"
                value={settings.bankAccountName}
                onChange={onChange}
                placeholder="CONG TY NAHERBS"
                icon="person"
              />
              <div className="md:col-span-2">
                <BankField
                  label="Số tài khoản"
                  fieldKey="bankAccountNumber"
                  value={settings.bankAccountNumber}
                  onChange={onChange}
                  placeholder="0123456789"
                  icon="numbers"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* QR image */}
      <div className="overflow-hidden rounded-2xl border border-herbal-beige bg-surface-container-lowest shadow-ambient-1">
        <div className="flex items-center gap-sm border-b border-herbal-beige bg-surface-container-low/50 px-md py-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-bg text-primary">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              qr_code_2
            </span>
          </div>
          <h3 className="text-body-lg font-semibold text-text-main">
            Ảnh QR chuyển khoản
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-md p-md md:grid-cols-2">
          {/* Uploader */}
          <div className="relative">
            {isUploadingQr && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
                <span className="material-symbols-outlined animate-spin text-[32px] text-primary">
                  progress_activity
                </span>
              </div>
            )}

            {isLoading ? (
              <div className="h-48 animate-pulse rounded-xl bg-surface-container" />
            ) : settings.bankQrImageUrl ? (
              <div className="flex flex-col gap-sm rounded-xl border border-border-warm bg-white p-md sm:flex-row sm:items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.bankQrImageUrl}
                  alt="QR chuyển khoản"
                  className="h-40 w-40 shrink-0 rounded-lg border border-border-warm bg-white object-contain"
                />
                <div className="flex flex-col gap-xs">
                  <button
                    type="button"
                    disabled={isUploadingQr}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-xs rounded-full bg-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition-colors hover:bg-surface-tint disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      swap_horiz
                    </span>
                    Đổi ảnh khác
                  </button>
                  <button
                    type="button"
                    disabled={isUploadingQr}
                    onClick={() => void handleRemoveQr()}
                    className="inline-flex items-center justify-center gap-xs rounded-full border border-error-text/40 px-md py-sm font-label-md text-label-md text-error-text transition-colors hover:bg-error-container/50 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                    Xoá ảnh
                  </button>
                  <p className="font-caption text-caption text-text-muted">
                    PNG / JPG / WEBP, tối đa 10MB. Ảnh lưu trên Cloudinary.
                  </p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={isUploadingQr}
                onClick={() => fileInputRef.current?.click()}
                className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-warm bg-surface-container-low/50 transition-colors hover:border-primary hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[40px] text-text-muted">
                  upload_file
                </span>
                <span className="mt-xs font-label-md text-label-md text-text-main">
                  Chọn ảnh QR
                </span>
                <span className="mt-1 font-caption text-caption text-text-muted">
                  PNG / JPG / WEBP, tối đa 10MB
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploadingQr}
            />
          </div>

          {/* Customer preview mock */}
          <div className="rounded-xl border border-border-warm bg-surface-container-low p-md">
            <p className="mb-sm font-caption text-caption text-text-muted">
              Khách sẽ nhìn thấy
            </p>
            <div className="flex flex-col items-center rounded-lg bg-white p-sm">
              {settings.bankQrImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={settings.bankQrImageUrl}
                  alt="Xem trước QR"
                  className="h-40 w-40 object-contain"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-dashed border-border-warm bg-surface-container-low">
                  <span className="material-symbols-outlined text-[48px] text-text-muted">
                    qr_code_2
                  </span>
                </div>
              )}
              <p className="mt-sm font-label-md text-label-md text-primary">
                {settings.bankName || "—"}
              </p>
              <p className="font-body-md text-body-md text-text-main">
                {settings.bankAccountName || "—"}
              </p>
              <code className="mt-xs rounded bg-surface-container-high px-2 py-1 font-mono text-sm text-earth-brown">
                {settings.bankAccountNumber || "—"}
              </code>
              <p className="mt-sm text-center font-caption text-caption text-text-muted">
                Nội dung CK = mã đơn hàng (tự sinh khi checkout)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
