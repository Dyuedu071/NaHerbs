"use client";

import { extractApiErrorMessage } from "@/lib/api-error";
import {
  getGetAccountAddressesQueryKey,
  useDeleteAccountAddressesAddressId,
  useGetAccountAddresses,
  usePatchAccountAddressesAddressIdDefault,
  usePostAccountAddresses,
  usePutAccountAddressesAddressId,
} from "@/services/generated/customer-addresses/customer-addresses";
import type { AccountAddress } from "@/services/generated/model/accountAddress";
import type { UpsertAddressRequest } from "@/services/generated/model/upsertAddressRequest";
import { getCsrfToken } from "@/services/csrf";
import { useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";

const emptyAddress: UpsertAddressRequest = {
  receiverName: "",
  receiverPhone: "",
  email: "",
  provinceCity: "",
  wardCommune: "",
  addressDetail: "",
  note: "",
  isDefault: false,
};

function toForm(address: AccountAddress): UpsertAddressRequest {
  return {
    receiverName: address.receiverName ?? "",
    receiverPhone: address.receiverPhone ?? "",
    email: address.email ?? "",
    provinceCity: address.provinceCity ?? "",
    wardCommune: address.wardCommune ?? "",
    addressDetail: address.addressDetail ?? "",
    note: address.note ?? "",
    isDefault: address.isDefault ?? false,
  };
}

function formatAddressLine(address: AccountAddress): string {
  return [address.addressDetail, address.wardCommune, address.provinceCity]
    .filter(Boolean)
    .join(", ");
}

export default function AccountAddressesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<UpsertAddressRequest>(emptyAddress);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const { data: addressesResponse, isLoading, isError } = useGetAccountAddresses();

  useEffect(() => {
    void getCsrfToken();
  }, []);

  const addresses =
    (addressesResponse as { data?: AccountAddress[] } | undefined)?.data ?? [];

  const invalidateAddresses = () => {
    void queryClient.invalidateQueries({
      queryKey: getGetAccountAddressesQueryKey(),
    });
  };

  const onMutationError = (error: unknown) => {
    setActionMessage(null);
    setFormError(extractApiErrorMessage(error));
  };

  const { mutate: createAddress, isPending: isCreating } = usePostAccountAddresses({
    mutation: {
      onSuccess: () => {
        setFormError(null);
        setActionMessage("Đã thêm địa chỉ mới.");
        resetForm();
        invalidateAddresses();
      },
      onError: onMutationError,
    },
  });

  const { mutate: updateAddress, isPending: isUpdating } = usePutAccountAddressesAddressId({
    mutation: {
      onSuccess: () => {
        setFormError(null);
        setActionMessage("Đã cập nhật địa chỉ.");
        resetForm();
        invalidateAddresses();
      },
      onError: onMutationError,
    },
  });

  const { mutate: deleteAddress } = useDeleteAccountAddressesAddressId({
    mutation: {
      onSuccess: () => {
        setActionMessage("Đã xóa địa chỉ.");
        invalidateAddresses();
      },
      onError: onMutationError,
    },
  });

  const { mutate: setDefaultAddress } = usePatchAccountAddressesAddressIdDefault({
    mutation: {
      onSuccess: () => {
        setActionMessage("Đã đặt làm địa chỉ mặc định.");
        invalidateAddresses();
      },
      onError: onMutationError,
    },
  });

  const resetForm = () => {
    setForm(emptyAddress);
    setEditingId(null);
    setShowForm(false);
    setFormError(null);
  };

  const openCreateForm = () => {
    setForm(emptyAddress);
    setEditingId(null);
    setShowForm(true);
    setFormError(null);
    setActionMessage(null);
  };

  const openEditForm = (address: AccountAddress) => {
    if (!address.id) {
      return;
    }
    setForm(toForm(address));
    setEditingId(address.id);
    setShowForm(true);
    setFormError(null);
    setActionMessage(null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setActionMessage(null);

    if (
      !form.receiverName.trim() ||
      !form.receiverPhone.trim() ||
      !form.provinceCity.trim() ||
      !form.wardCommune.trim() ||
      !form.addressDetail.trim()
    ) {
      setFormError("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    const payload: UpsertAddressRequest = {
      receiverName: form.receiverName.trim(),
      receiverPhone: form.receiverPhone.trim(),
      email: form.email?.trim() || null,
      provinceCity: form.provinceCity.trim(),
      wardCommune: form.wardCommune.trim(),
      addressDetail: form.addressDetail.trim(),
      note: form.note?.trim() || null,
      isDefault: form.isDefault ?? false,
    };

    if (editingId) {
      updateAddress({ addressId: editingId, data: payload });
    } else {
      createAddress({ data: payload });
    }
  };

  const handleDelete = (addressId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      return;
    }
    setActionMessage(null);
    deleteAddress({ addressId });
  };

  const isSaving = isCreating || isUpdating;

  if (isLoading) {
    return (
      <section className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
        <p className="text-body-md text-text-muted">Đang tải địa chỉ...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
        <p className="text-body-md text-error">
          Không thể tải danh sách địa chỉ. Vui lòng đăng nhập lại.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-lg">
      <div className="flex flex-wrap items-end justify-between gap-sm rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary">
            Địa chỉ giao hàng
          </h1>
          <p className="mt-xs font-body-md text-body-md text-text-muted">
            Quản lý địa chỉ nhận hàng khi thanh toán.
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-full bg-primary px-md py-sm font-label-md text-label-md text-on-primary transition-colors hover:bg-secondary"
          >
            + Thêm địa chỉ
          </button>
        )}
      </div>

      {actionMessage && (
        <p className="rounded-lg bg-success-bg px-sm py-2 font-caption text-caption text-primary">
          {actionMessage}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-md rounded-[24px] border border-herbal-beige bg-surface-container-lowest p-md shadow-ambient-sm"
        >
          <h2 className="font-headline-sm text-headline-sm text-primary">
            {editingId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
          </h2>

          <div className="grid gap-md md:grid-cols-2">
            <Field
              id="receiverName"
              label="Người nhận *"
              value={form.receiverName}
              onChange={(value) => setForm((prev) => ({ ...prev, receiverName: value }))}
            />
            <Field
              id="receiverPhone"
              label="Số điện thoại *"
              value={form.receiverPhone}
              onChange={(value) => setForm((prev) => ({ ...prev, receiverPhone: value }))}
            />
            <Field
              id="email"
              label="Email"
              type="email"
              value={form.email ?? ""}
              onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
            />
            <Field
              id="provinceCity"
              label="Tỉnh / Thành phố *"
              value={form.provinceCity}
              onChange={(value) => setForm((prev) => ({ ...prev, provinceCity: value }))}
            />
            <Field
              id="wardCommune"
              label="Phường / Xã *"
              value={form.wardCommune}
              onChange={(value) => setForm((prev) => ({ ...prev, wardCommune: value }))}
            />
            <Field
              id="addressDetail"
              label="Địa chỉ cụ thể *"
              value={form.addressDetail}
              onChange={(value) => setForm((prev) => ({ ...prev, addressDetail: value }))}
              className="md:col-span-2"
            />
            <Field
              id="note"
              label="Ghi chú"
              value={form.note ?? ""}
              onChange={(value) => setForm((prev) => ({ ...prev, note: value }))}
              className="md:col-span-2"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-sm">
            <input
              type="checkbox"
              checked={form.isDefault ?? false}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, isDefault: event.target.checked }))
              }
              className="h-5 w-5 rounded border-border-warm text-primary focus:ring-primary"
            />
            <span className="font-label-md text-label-md text-text-main">
              Đặt làm địa chỉ mặc định
            </span>
          </label>

          {formError && (
            <p className="rounded-lg bg-error-container px-sm py-2 font-caption text-caption text-error">
              {formError}
            </p>
          )}

          <div className="flex gap-sm">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-primary px-md py-sm font-label-md text-label-md text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
            >
              {isSaving ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm địa chỉ"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-primary px-md py-sm font-label-md text-label-md text-primary transition-colors hover:bg-success-bg"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-md">
        {addresses.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-herbal-beige bg-surface p-lg text-center">
            <p className="font-body-md text-body-md text-text-muted">
              Bạn chưa có địa chỉ giao hàng nào.
            </p>
          </div>
        ) : (
          addresses.map((address) => (
            <article
              key={address.id}
              className="rounded-[24px] border border-herbal-beige bg-surface p-md shadow-ambient-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-sm">
                <div>
                  <div className="flex flex-wrap items-center gap-sm">
                    <h3 className="font-label-md text-label-md text-primary">
                      {address.receiverName}
                    </h3>
                    {address.isDefault && (
                      <span className="rounded-full bg-success-bg px-xs py-0.5 font-caption text-caption text-primary">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="mt-xs font-body-md text-body-md text-text-muted">
                    {address.receiverPhone}
                    {address.email ? ` · ${address.email}` : ""}
                  </p>
                  <p className="mt-xs font-body-md text-body-md text-text-main">
                    {formatAddressLine(address)}
                  </p>
                  {address.note && (
                    <p className="mt-xs font-caption text-caption text-text-muted">
                      Ghi chú: {address.note}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-xs">
                  {!address.isDefault && address.id && (
                    <button
                      type="button"
                      onClick={() => setDefaultAddress({ addressId: address.id! })}
                      className="rounded-full border border-border-warm px-sm py-1 font-caption text-caption text-primary hover:bg-success-bg"
                    >
                      Đặt mặc định
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openEditForm(address)}
                    className="rounded-full border border-border-warm px-sm py-1 font-caption text-caption text-primary hover:bg-success-bg"
                  >
                    Sửa
                  </button>
                  {address.id && (
                    <button
                      type="button"
                      onClick={() => handleDelete(address.id!)}
                      className="rounded-full border border-error/30 px-sm py-1 font-caption text-caption text-error hover:bg-error-container"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-xs ${className}`}>
      <label htmlFor={id} className="font-label-md text-label-md text-text-main">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-border-warm bg-surface px-sm py-2 font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
