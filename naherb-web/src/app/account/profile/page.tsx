"use client";

import { extractApiErrorMessage } from "@/lib/api-error";
import ProfileAvatarUpload from "@/components/account/ProfileAvatarUpload";
import {
  getGetAccountProfileQueryKey,
  useGetAccountProfile,
  usePutAccountProfile,
} from "@/services/generated/customer-profile/customer-profile";
import type { AccountProfile } from "@/services/generated/model/accountProfile";
import type { UpdateProfileRequest } from "@/services/generated/model/updateProfileRequest";
import { getCsrfToken } from "@/services/csrf";
import { useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";

const emptyForm: UpdateProfileRequest = {
  fullName: "",
  phone: "",
  contactEmail: "",
  avatarUrl: "",
};

export default function AccountProfilePage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<UpdateProfileRequest>(emptyForm);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data: profileResponse, isLoading, isError } = useGetAccountProfile();

  useEffect(() => {
    void getCsrfToken();
  }, []);

  useEffect(() => {
    const profile = (profileResponse as { data?: AccountProfile } | undefined)?.data;
    if (!profile) {
      return;
    }
    setForm({
      fullName: profile.fullName ?? "",
      phone: profile.phone ?? "",
      contactEmail: profile.contactEmail ?? "",
      avatarUrl: profile.avatarUrl ?? "",
    });
  }, [profileResponse]);

  const { mutate: saveProfile, isPending: isSaving } = usePutAccountProfile({
    mutation: {
      onSuccess: () => {
        setSaveError(null);
        setSaveMessage("Đã cập nhật hồ sơ.");
        void queryClient.invalidateQueries({
          queryKey: getGetAccountProfileQueryKey(),
        });
      },
      onError: (error: unknown) => {
        setSaveMessage(null);
        setSaveError(extractApiErrorMessage(error, "Không thể cập nhật hồ sơ."));
      },
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaveMessage(null);
    setSaveError(null);

    if (!form.fullName.trim()) {
      setSaveError("Họ tên không được để trống.");
      return;
    }

    const payload: UpdateProfileRequest = {
      fullName: form.fullName.trim(),
      phone: form.phone?.trim() || null,
      contactEmail: form.contactEmail?.trim() || null,
      avatarUrl: form.avatarUrl?.trim() || null,
    };

    saveProfile({ data: payload });
  };

  if (isLoading) {
    return (
      <section className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
        <p className="text-body-md text-text-muted">Đang tải hồ sơ...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
        <p className="text-body-md text-error">
          Không thể tải hồ sơ. Vui lòng đăng nhập lại.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
      <div className="mb-lg">
        <h1 className="font-headline-md text-headline-md text-primary">
          Hồ sơ cá nhân
        </h1>
        <p className="mt-xs font-body-md text-body-md text-text-muted">
          Cập nhật thông tin liên hệ hiển thị khi đặt hàng.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-md">
        <ProfileAvatarUpload
          avatarUrl={form.avatarUrl}
          fullName={form.fullName}
          onUploaded={(url) => setForm((prev) => ({ ...prev, avatarUrl: url }))}
        />

        <div className="flex flex-col gap-xs">
          <label htmlFor="fullName" className="font-label-md text-label-md text-text-main">
            Họ và tên *
          </label>
          <input
            id="fullName"
            type="text"
            required
            maxLength={100}
            value={form.fullName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, fullName: event.target.value }))
            }
            className="rounded-xl border border-border-warm bg-surface-container-lowest px-sm py-2 font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label htmlFor="phone" className="font-label-md text-label-md text-text-main">
            Số điện thoại
          </label>
          <input
            id="phone"
            type="tel"
            maxLength={20}
            value={form.phone ?? ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, phone: event.target.value }))
            }
            className="rounded-xl border border-border-warm bg-surface-container-lowest px-sm py-2 font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label
            htmlFor="contactEmail"
            className="font-label-md text-label-md text-text-main"
          >
            Email liên hệ
          </label>
          <input
            id="contactEmail"
            type="email"
            maxLength={254}
            value={form.contactEmail ?? ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, contactEmail: event.target.value }))
            }
            className="rounded-xl border border-border-warm bg-surface-container-lowest px-sm py-2 font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {saveMessage && (
          <p className="rounded-lg bg-success-bg px-sm py-2 font-caption text-caption text-primary">
            {saveMessage}
          </p>
        )}
        {saveError && (
          <p className="rounded-lg bg-error-container px-sm py-2 font-caption text-caption text-error">
            {saveError}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-primary px-md py-sm font-label-md text-label-md text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
          >
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </section>
  );
}
