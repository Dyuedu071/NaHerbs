import { AXIOS_INSTANCE } from "@/services/api-client";
import { getCsrfToken } from "@/services/csrf";
import type { AccountProfile } from "@/services/generated/model/accountProfile";

type UploadAvatarResponse = {
  success?: boolean;
  data?: AccountProfile;
  message?: string;
};

export async function uploadAccountAvatar(file: File): Promise<AccountProfile> {
  await getCsrfToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await AXIOS_INSTANCE.post<UploadAvatarResponse>(
    "/account/profile/avatar",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  if (!response.data?.data) {
    throw new Error(response.data?.message ?? "Không thể upload ảnh đại diện.");
  }

  return response.data.data;
}

const MAX_AVATAR_EDGE = 800;
const JPEG_QUALITY = 0.85;

export async function prepareAvatarFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Vui lòng chọn file ảnh.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_AVATAR_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return file;
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
  );

  if (!blob) {
    return file;
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "avatar";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}
