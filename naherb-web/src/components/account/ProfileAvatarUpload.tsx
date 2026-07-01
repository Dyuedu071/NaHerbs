"use client";

import { extractApiErrorMessage } from "@/lib/api-error";
import { prepareAvatarFile, uploadAccountAvatar } from "@/services/account-avatar";
import {
  getGetAccountProfileQueryKey,
  getGetAuthMeQueryKey,
} from "@/services/generated/customer-profile/customer-profile";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useRef, useState } from "react";

const DEFAULT_AVATAR = "/images/avatars/default-avatar.jpg";

function resolveAvatarSrc(avatarUrl?: string | null, previewUrl?: string | null): string {
  if (previewUrl?.trim()) {
    return previewUrl;
  }
  if (avatarUrl?.trim()) {
    return avatarUrl.trim();
  }
  return DEFAULT_AVATAR;
}

type ProfileAvatarUploadProps = {
  avatarUrl?: string | null;
  fullName?: string;
  onUploaded: (avatarUrl: string) => void;
};

export default function ProfileAvatarUpload({
  avatarUrl,
  fullName,
  onUploaded,
}: ProfileAvatarUploadProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const displayUrl = resolveAvatarSrc(avatarUrl, previewUrl);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);
    setSuccess(null);

    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
      setError("Chỉ chấp nhận ảnh JPG, PNG hoặc WebP.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Ảnh không được vượt quá 2MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsUploading(true);

    try {
      const prepared = await prepareAvatarFile(file);
      const profile = await uploadAccountAvatar(prepared);
      if (profile.avatarUrl) {
        onUploaded(profile.avatarUrl);
        setPreviewUrl(null);
        setSuccess("Đã cập nhật ảnh đại diện.");
        void queryClient.invalidateQueries({ queryKey: getGetAccountProfileQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getGetAuthMeQueryKey() });
      }
    } catch (uploadError: unknown) {
      setPreviewUrl(null);
      setError(extractApiErrorMessage(uploadError, "Không thể upload ảnh đại diện."));
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(objectUrl);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col gap-sm sm:flex-row sm:items-center">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-herbal-beige bg-surface-container-low shadow-ambient-sm">
        <img
          src={displayUrl}
          alt={fullName ? `Ảnh đại diện của ${fullName}` : "Ảnh đại diện"}
          className="h-full w-full object-cover"
        />
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inverse-surface/40 text-on-primary">
            <span className="material-symbols-outlined animate-spin text-[28px]">progress_activity</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-xs">
        <p className="font-label-md text-label-md text-text-main">Ảnh đại diện</p>
        <p className="font-caption text-caption text-text-muted">
          JPG, PNG hoặc WebP · tối đa 2MB
        </p>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full border border-primary px-md py-2 font-label-md text-label-md text-primary transition-colors hover:bg-success-bg disabled:opacity-60"
          >
            {isUploading ? "Đang tải lên..." : "Chọn ảnh"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        {success && (
          <p className="font-caption text-caption text-primary">{success}</p>
        )}
        {error && <p className="font-caption text-caption text-error">{error}</p>}
      </div>
    </div>
  );
}
