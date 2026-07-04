"use client";

export type QrPaymentSettingKey =
  | "bankName"
  | "bankBin"
  | "bankAccountName"
  | "bankAccountNumber";

export interface QrPaymentSettings {
  bankName: string;
  bankBin: string;
  bankAccountName: string;
  bankAccountNumber: string;
}

interface QrPaymentConfigSectionProps {
  settings: QrPaymentSettings;
  onChange: (key: QrPaymentSettingKey, value: string) => void;
  isLoading: boolean;
}

const VIETQR_BANKS = [
  { bin: "970436", name: "Vietcombank" },
  { bin: "970415", name: "VietinBank" },
  { bin: "970418", name: "BIDV" },
  { bin: "970405", name: "Agribank" },
  { bin: "970407", name: "Techcombank" },
  { bin: "970422", name: "MB Bank" },
  { bin: "970416", name: "ACB" },
  { bin: "970432", name: "VPBank" },
  { bin: "970403", name: "Sacombank" },
  { bin: "970423", name: "TPBank" },
  { bin: "970441", name: "VIB" },
  { bin: "970437", name: "HDBank" },
  { bin: "970443", name: "SHB" },
  { bin: "970426", name: "MSB" },
  { bin: "970448", name: "OCB" },
  { bin: "970440", name: "SeABank" },
] as const;

const SAMPLE_AMOUNT = 250000;
const SAMPLE_ORDER_CODE = "NAHERBS-DEMO-001";

function buildVietQrPreviewUrl(settings: QrPaymentSettings): string | null {
  if (!settings.bankBin || !settings.bankAccountNumber) {
    return null;
  }

  const params = new URLSearchParams({
    amount: String(SAMPLE_AMOUNT),
    addInfo: SAMPLE_ORDER_CODE,
  });
  if (settings.bankAccountName) {
    params.set("accountName", settings.bankAccountName);
  }
  return `https://img.vietqr.io/image/${encodeURIComponent(settings.bankBin)}-${encodeURIComponent(
    settings.bankAccountNumber,
  )}-compact2.png?${params.toString()}`;
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
}: QrPaymentConfigSectionProps) {
  const previewUrl = buildVietQrPreviewUrl(settings);

  const handleBankChange = (bin: string) => {
    const bank = VIETQR_BANKS.find((item) => item.bin === bin);
    onChange("bankBin", bin);
    onChange("bankName", bank?.name ?? "");
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
            VietQR được tạo tự động theo từng đơn, có sẵn số tiền và nội dung
            chuyển khoản là mã đơn hàng. Hệ thống vẫn không tự đối soát ngân
            hàng — admin xác nhận thanh toán thủ công tại trang Thanh toán QR.
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
              <div>
                <label
                  htmlFor="qr-setting-bankBin"
                  className="mb-1 flex items-center gap-xs text-label-md font-label-md text-text-main"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    account_balance
                  </span>
                  Ngân hàng
                </label>
                <p className="mb-2 text-caption text-text-muted">
                  Chọn ngân hàng theo chuẩn VietQR
                </p>
                <select
                  id="qr-setting-bankBin"
                  value={settings.bankBin}
                  onChange={(e) => handleBankChange(e.target.value)}
                  className="organic-input w-full rounded-xl px-4 text-body-md font-body-md text-text-main"
                >
                  <option value="">Chọn ngân hàng</option>
                  {VIETQR_BANKS.map((bank) => (
                    <option key={bank.bin} value={bank.bin}>
                      {bank.name} ({bank.bin})
                    </option>
                  ))}
                </select>
              </div>
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

      {/* VietQR preview */}
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
            Xem trước VietQR động
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-md p-md md:grid-cols-2">
          <div className="rounded-xl border border-border-warm bg-white p-md">
            {previewUrl ? (
              <div className="flex flex-col items-center gap-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Xem trước VietQR"
                  className="h-60 w-60 object-contain"
                />
                <p className="text-center font-caption text-caption text-text-muted">
                  Đây là QR demo. Khi khách đặt hàng, hệ thống tự thay số tiền
                  và nội dung bằng đơn thực tế.
                </p>
              </div>
            ) : (
              <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-border-warm bg-surface-container-low text-center text-text-muted">
                <span className="material-symbols-outlined text-[48px]">
                  qr_code_2
                </span>
                <p className="mt-xs font-label-md text-label-md">
                  Chọn ngân hàng và nhập số tài khoản để xem trước VietQR
                </p>
              </div>
            )}
          </div>

          {/* Customer preview mock */}
          <div className="rounded-xl border border-border-warm bg-surface-container-low p-md">
            <p className="mb-sm font-caption text-caption text-text-muted">
              Khách sẽ nhìn thấy
            </p>
            <div className="flex flex-col items-center rounded-lg bg-white p-sm">
              {previewUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewUrl}
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
                Số tiền + nội dung CK tự động theo từng đơn hàng
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
