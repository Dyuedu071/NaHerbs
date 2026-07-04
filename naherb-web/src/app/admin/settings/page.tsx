"use client";

import QrPaymentConfigSection, {
  type QrPaymentSettingKey,
} from "@/components/admin/settings/QrPaymentConfigSection";
import { useEffect, useState } from "react";
import { AXIOS_INSTANCE } from "@/services/api-client";
import { useToast } from "@/contexts/ToastContext";

// ─── Keys định nghĩa cho Thông tin cửa hàng ────────────────────────────────
const STORE_KEYS = [
  "store_name",
  "store_tagline",
  "store_email",
  "store_phone",
  "store_hotline",
  "store_address",
  "store_city",
  "store_working_hours",
  "store_facebook_url",
  "store_zalo_url",
  "store_instagram_url",
  "store_youtube_url",
  "store_tiktok_url",
  "store_seo_title",
  "store_seo_description",
  "bankName",
  "bankBin",
  "bankAccountName",
  "bankAccountNumber",
] as const;

type SettingKey = (typeof STORE_KEYS)[number];
type SettingsMap = Record<SettingKey, string>;

const DEFAULT_SETTINGS: SettingsMap = {
  store_name: "",
  store_tagline: "",
  store_email: "",
  store_phone: "",
  store_hotline: "",
  store_address: "",
  store_city: "",
  store_working_hours: "",
  store_facebook_url: "",
  store_zalo_url: "",
  store_instagram_url: "",
  store_youtube_url: "",
  store_tiktok_url: "",
  store_seo_title: "",
  store_seo_description: "",
  bankName: "",
  bankBin: "",
  bankAccountName: "",
  bankAccountNumber: "",
};

type TabId = "general" | "contact" | "payment" | "social" | "seo";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "general", label: "Thông tin chung", icon: "storefront" },
  { id: "contact", label: "Liên hệ & Địa chỉ", icon: "contact_phone" },
  { id: "payment", label: "Thanh toán QR", icon: "qr_code_2" },
  { id: "social", label: "Mạng xã hội", icon: "share" },
  { id: "seo", label: "SEO cơ bản", icon: "travel_explore" },
];

// ─── Field Component ──────────────────────────────────────────────────────────
function SettingField({
  label,
  description,
  fieldKey,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  multiline = false,
}: {
  label: string;
  description?: string;
  fieldKey: SettingKey;
  value: string;
  onChange: (key: SettingKey, val: string) => void;
  type?: string;
  placeholder?: string;
  icon?: string;
  multiline?: boolean;
}) {
  return (
    <div className="group">
      <label className="mb-1 flex items-center gap-xs text-label-md font-label-md text-text-main">
        {icon && (
          <span className="material-symbols-outlined text-[18px] text-primary">
            {icon}
          </span>
        )}
        {label}
      </label>
      {description && (
        <p className="mb-2 text-caption text-text-muted">{description}</p>
      )}
      {multiline ? (
        <textarea
          id={`setting-${fieldKey}`}
          rows={3}
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          placeholder={placeholder}
          className="organic-input w-full resize-none rounded-xl px-4 py-3 text-body-md font-body-md text-text-main placeholder:text-text-muted"
          style={{ height: "auto", minHeight: "80px" }}
        />
      ) : (
        <input
          id={`setting-${fieldKey}`}
          type={type}
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          placeholder={placeholder}
          className="organic-input w-full rounded-xl px-4 text-body-md font-body-md text-text-main placeholder:text-text-muted"
        />
      )}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-herbal-beige bg-surface-container-lowest shadow-ambient-1">
      <div className="flex items-center gap-sm border-b border-herbal-beige bg-surface-container-low/50 px-md py-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-bg text-primary">
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
        <h3 className="text-body-lg font-semibold text-text-main">{title}</h3>
      </div>
      <div className="grid grid-cols-1 items-start gap-md p-md md:grid-cols-2">{children}</div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function FieldSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-2 h-4 w-28 rounded bg-surface-container" />
      <div className="h-12 rounded-xl bg-surface-container" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [settings, setSettings] = useState<SettingsMap>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await AXIOS_INSTANCE.get("/admin/settings");
        const data: Record<string, string> = res.data?.data || res.data || {};
        setSettings((prev) => {
          const merged = { ...prev };
          for (const key of STORE_KEYS) {
            if (data[key] !== undefined) {
              merged[key] = data[key];
            }
          }
          return merged;
        });
      } catch (err) {
        console.error("Failed to load settings:", err);
        showToast("Không thể tải cài đặt. Vui lòng thử lại.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (key: SettingKey, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleQrChange = (key: QrPaymentSettingKey, value: string) => {
    handleChange(key, value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await AXIOS_INSTANCE.put("/admin/settings", settings);
      showToast("Đã lưu cài đặt thành công!", "success");
      setIsDirty(false);
    } catch (err) {
      console.error("Failed to save settings:", err);
      showToast("Lưu thất bại. Vui lòng thử lại.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const s = settings;

  return (
    <main className="flex-1 p-gutter w-full max-w-5xl">
      {/* Page Header */}
      <div className="mb-lg flex items-start justify-between">
        <div>
          <h2 className="text-headline-md font-headline-md text-primary-container">
            Cài đặt cửa hàng
          </h2>
          <p className="mt-base text-body-md text-text-muted">
            Quản lý thông tin cửa hàng, thanh toán QR và nhận diện thương hiệu
            NaHerbs.
          </p>
        </div>

        {/* Save Button */}
        <button
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
              <span className="material-symbols-outlined text-[18px]">save</span>
              Lưu thay đổi
            </>
          )}
        </button>
      </div>

      {/* Dirty indicator */}
      {isDirty && !isSaving && (
        <div className="mb-md flex items-center gap-xs rounded-xl border border-tertiary-fixed bg-tertiary-fixed/20 px-md py-sm text-body-md text-tertiary-container">
          <span className="material-symbols-outlined text-[18px]">edit_note</span>
          Bạn có thay đổi chưa được lưu.
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-lg flex gap-xs overflow-x-auto rounded-2xl border border-herbal-beige bg-surface-container-lowest p-xs shadow-ambient-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-xs whitespace-nowrap rounded-xl px-md py-sm text-label-md font-label-md transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-primary text-on-primary shadow-ambient-1"
                : "text-text-muted hover:bg-surface-container hover:text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={
                activeTab === tab.id
                  ? { fontVariationSettings: "'FILL' 1" }
                  : {}
              }
            >
              {tab.icon}
            </span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-md">
        {/* ── General Tab ── */}
        {activeTab === "general" && (
          <>
            <SectionCard title="Thông tin cơ bản" icon="storefront">
              {isLoading ? (
                <>
                  <FieldSkeleton />
                  <FieldSkeleton />
                  <FieldSkeleton />
                  <FieldSkeleton />
                </>
              ) : (
                <>
                  <SettingField
                    label="Tên cửa hàng"
                    fieldKey="store_name"
                    value={s.store_name}
                    onChange={handleChange}
                    placeholder="NaHerbs"
                    icon="storefront"
                    description="Tên thương hiệu hiển thị trên toàn bộ website"
                  />
                  <SettingField
                    label="Slogan / Tagline"
                    fieldKey="store_tagline"
                    value={s.store_tagline}
                    onChange={handleChange}
                    placeholder="Thiên nhiên cho sức khỏe của bạn"
                    icon="format_quote"
                    description="Câu slogan ngắn gọn đại diện cho thương hiệu"
                  />
                  <div className="md:col-span-2">
                    <SettingField
                      label="Giờ làm việc"
                      fieldKey="store_working_hours"
                      value={s.store_working_hours}
                      onChange={handleChange}
                      placeholder="Thứ 2 – Thứ 7: 8:00 – 21:00 | Chủ nhật: 9:00 – 18:00"
                      icon="schedule"
                      description="Hiển thị ở trang liên hệ và footer"
                    />
                  </div>
                </>
              )}
            </SectionCard>
          </>
        )}

        {/* ── Contact Tab ── */}
        {activeTab === "contact" && (
          <SectionCard title="Liên hệ & Địa chỉ" icon="contact_phone">
            {isLoading ? (
              <>
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
                <div className="md:col-span-2">
                  <FieldSkeleton />
                </div>
              </>
            ) : (
              <>
                {/* Hàng 1: cả 2 đều có description → cùng chiều cao */}
                <SettingField
                  label="Email hỗ trợ"
                  fieldKey="store_email"
                  value={s.store_email}
                  onChange={handleChange}
                  type="email"
                  placeholder="support@naherbs.vn"
                  icon="email"
                  description="Email khách hàng liên hệ"
                />
                <SettingField
                  label="Hotline (nổi bật)"
                  fieldKey="store_hotline"
                  value={s.store_hotline}
                  onChange={handleChange}
                  type="tel"
                  placeholder="1800 xxxx"
                  icon="support_agent"
                  description="Số hotline miễn phí hoặc ưu tiên"
                />
                {/* Hàng 2: cả 2 đều không có description → cùng chiều cao */}
                <SettingField
                  label="Số điện thoại"
                  fieldKey="store_phone"
                  value={s.store_phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="028 xxxx xxxx"
                  icon="phone"
                />
                <SettingField
                  label="Tỉnh / Thành phố"
                  fieldKey="store_city"
                  value={s.store_city}
                  onChange={handleChange}
                  placeholder="TP. Hồ Chí Minh"
                  icon="location_city"
                />
                {/* Hàng 3: full width */}
                <div className="md:col-span-2">
                  <SettingField
                    label="Địa chỉ cụ thể"
                    fieldKey="store_address"
                    value={s.store_address}
                    onChange={handleChange}
                    placeholder="123 Nguyễn Văn A, Phường X, Quận Y"
                    icon="location_on"
                    description="Địa chỉ hiển thị ở footer và trang liên hệ"
                  />
                </div>
              </>
            )}
          </SectionCard>
        )}

        {/* ── Payment Tab ── */}
        {activeTab === "payment" && (
          <QrPaymentConfigSection
            settings={{
              bankName: s.bankName,
              bankBin: s.bankBin,
              bankAccountName: s.bankAccountName,
              bankAccountNumber: s.bankAccountNumber,
            }}
            onChange={handleQrChange}
            isLoading={isLoading}
          />
        )}

        {/* ── Social Tab ── */}
        {activeTab === "social" && (
          <SectionCard title="Mạng xã hội" icon="share">
            {isLoading ? (
              <>
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
              </>
            ) : (
              <>
                <SettingField
                  label="Facebook"
                  fieldKey="store_facebook_url"
                  value={s.store_facebook_url}
                  onChange={handleChange}
                  type="url"
                  placeholder="https://facebook.com/naherbs"
                  icon="facebook"
                />
                <SettingField
                  label="Zalo"
                  fieldKey="store_zalo_url"
                  value={s.store_zalo_url}
                  onChange={handleChange}
                  type="url"
                  placeholder="https://zalo.me/naherbs"
                  icon="chat"
                />
                <SettingField
                  label="Instagram"
                  fieldKey="store_instagram_url"
                  value={s.store_instagram_url}
                  onChange={handleChange}
                  type="url"
                  placeholder="https://instagram.com/naherbs"
                  icon="photo_camera"
                />
                <SettingField
                  label="YouTube"
                  fieldKey="store_youtube_url"
                  value={s.store_youtube_url}
                  onChange={handleChange}
                  type="url"
                  placeholder="https://youtube.com/@naherbs"
                  icon="play_circle"
                />
                <SettingField
                  label="TikTok"
                  fieldKey="store_tiktok_url"
                  value={s.store_tiktok_url}
                  onChange={handleChange}
                  type="url"
                  placeholder="https://tiktok.com/@naherbs"
                  icon="music_note"
                />
              </>
            )}
          </SectionCard>
        )}

        {/* ── SEO Tab ── */}
        {activeTab === "seo" && (
          <SectionCard title="SEO cơ bản" icon="travel_explore">
            {isLoading ? (
              <>
                <div className="md:col-span-2">
                  <FieldSkeleton />
                </div>
                <div className="md:col-span-2">
                  <FieldSkeleton />
                </div>
              </>
            ) : (
              <>
                <div className="md:col-span-2">
                  <SettingField
                    label="Tiêu đề trang (SEO Title)"
                    fieldKey="store_seo_title"
                    value={s.store_seo_title}
                    onChange={handleChange}
                    placeholder="NaHerbs – Thảo dược thiên nhiên cho sức khỏe"
                    icon="title"
                    description="Độ dài lý tưởng: 50–60 ký tự. Hiển thị trên tab trình duyệt và kết quả Google."
                  />
                  {s.store_seo_title && (
                    <div
                      className={`mt-xs text-caption ${
                        s.store_seo_title.length > 60
                          ? "text-error-text"
                          : "text-primary"
                      }`}
                    >
                      {s.store_seo_title.length}/60 ký tự
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <SettingField
                    label="Mô tả trang (Meta Description)"
                    fieldKey="store_seo_description"
                    value={s.store_seo_description}
                    onChange={handleChange}
                    placeholder="NaHerbs cung cấp các sản phẩm thảo dược thiên nhiên chất lượng cao, hỗ trợ sức khỏe toàn diện."
                    icon="description"
                    description="Độ dài lý tưởng: 150–160 ký tự. Hiển thị dưới tiêu đề trên kết quả Google."
                    multiline
                  />
                  {s.store_seo_description && (
                    <div
                      className={`mt-xs text-caption ${
                        s.store_seo_description.length > 160
                          ? "text-error-text"
                          : "text-primary"
                      }`}
                    >
                      {s.store_seo_description.length}/160 ký tự
                    </div>
                  )}
                </div>

                {/* Google Preview */}
                {(s.store_seo_title || s.store_seo_description) && (
                  <div className="md:col-span-2">
                    <p className="mb-sm text-label-md font-label-md text-text-muted">
                      Xem trước kết quả Google
                    </p>
                    <div className="rounded-xl border border-border-warm bg-surface-container-low p-md">
                      <p className="mb-1 text-caption text-text-muted">
                        naherbs.vn
                      </p>
                      <p className="text-body-lg font-medium text-blue-700">
                        {s.store_seo_title || "Tiêu đề trang"}
                      </p>
                      <p className="mt-1 text-body-md text-text-muted">
                        {s.store_seo_description ||
                          "Mô tả trang sẽ xuất hiện ở đây..."}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </SectionCard>
        )}
      </div>

      {/* Bottom Save Bar (sticky khi scroll) */}
      {isDirty && (
        <div className="sticky bottom-0 mt-lg flex items-center justify-between rounded-2xl border border-primary/20 bg-surface/95 px-md py-sm shadow-ambient-2 backdrop-blur-md">
          <p className="text-body-md text-text-muted">
            <span className="material-symbols-outlined mr-1 align-middle text-[18px] text-primary">
              info
            </span>
            Có thay đổi chưa được lưu
          </p>
          <button
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
