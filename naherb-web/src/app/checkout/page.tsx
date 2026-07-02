"use client";

import { useRequireAuth } from "@/components/account/useRequireAuth";
import { useCart } from "@/components/cart/CartContext";
import { extractApiErrorMessage } from "@/lib/api-error";
import { formatMoney, paymentMethodLabels } from "@/lib/order-format";
import {
  getGetCartQueryKey,
  useGetCart,
} from "@/services/generated/cart/cart";
import { usePostCheckout } from "@/services/generated/checkout/checkout";
import { useGetAccountAddresses } from "@/services/generated/customer-addresses/customer-addresses";
import type { AccountAddress } from "@/services/generated/model/accountAddress";
import type { Cart } from "@/services/generated/model/cart";
import type { CheckoutResponse } from "@/services/generated/model/checkoutResponse";
import { PaymentMethod } from "@/services/generated/model/paymentMethod";
import type { PaymentMethod as PaymentMethodType } from "@/services/generated/model/paymentMethod";
import type { UpsertAddressRequest } from "@/services/generated/model/upsertAddressRequest";
import { getCsrfToken } from "@/services/csrf";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";

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

function formatAddress(address: AccountAddress): string {
  return [address.addressDetail, address.wardCommune, address.provinceCity]
    .filter(Boolean)
    .join(", ");
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutShell>Đang tải thông tin thanh toán...</CheckoutShell>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const queryClient = useQueryClient();
  const { open: openCart } = useCart();
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth();
  const [addressMode, setAddressMode] = useState<"saved" | "inline">("saved");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addressForm, setAddressForm] = useState<UpsertAddressRequest>(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethod.COD);
  const [saveAddress, setSaveAddress] = useState(true);
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<CheckoutResponse | null>(null);

  const { data: cartResponse, isLoading: cartLoading } = useGetCart({
    query: {
      enabled: isAuthenticated,
      retry: false,
    },
  });
  const { data: addressesResponse, isLoading: addressesLoading } = useGetAccountAddresses({
    query: {
      enabled: isAuthenticated,
      retry: false,
    },
  });

  useEffect(() => {
    void getCsrfToken();
  }, []);

  const searchParams = useSearchParams();
  const itemsParam = searchParams.get("items");
  const selectedItemIds = useMemo(() => {
    if (!itemsParam) return null;
    return new Set(itemsParam.split(",").filter(Boolean));
  }, [itemsParam]);

  const cart = (cartResponse as { data?: Cart } | undefined)?.data;
  const allItems = cart?.items ?? [];
  const items = useMemo(() => {
    if (!selectedItemIds) return allItems;
    return allItems.filter((item) => item.id && selectedItemIds.has(item.id));
  }, [allItems, selectedItemIds]);
  const addresses = useMemo(
    () => (addressesResponse as { data?: AccountAddress[] } | undefined)?.data ?? [],
    [addressesResponse],
  );

  const defaultAddressId = useMemo(
    () => addresses.find((address) => address.isDefault)?.id ?? addresses[0]?.id ?? "",
    [addresses],
  );
  const effectiveAddressMode =
    addressMode === "saved" && addresses.length > 0 ? "saved" : "inline";
  const effectiveSelectedAddressId = selectedAddressId || defaultAddressId;

  const { mutate: checkout, isPending } = usePostCheckout({
    mutation: {
      onSuccess: (response) => {
        const order = (response as { data?: CheckoutResponse }).data ?? null;
        setFormError(null);
        setCreatedOrder(order);
        void queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        void queryClient.invalidateQueries({ queryKey: ["/orders/my"] });
      },
      onError: (error) => {
        setCreatedOrder(null);
        setFormError(extractApiErrorMessage(error, "Không thể tạo đơn hàng."));
      },
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setCreatedOrder(null);

    if (items.length === 0) {
      setFormError("Giỏ hàng đang trống.");
      return;
    }

    if (effectiveAddressMode === "saved") {
      if (!effectiveSelectedAddressId) {
        setFormError("Vui lòng chọn địa chỉ giao hàng.");
        return;
      }
      checkout({
        data: {
          paymentMethod,
          shippingAddressId: effectiveSelectedAddressId,
          cartItemIds: selectedItemIds ? Array.from(selectedItemIds) : undefined,
          note: note.trim() || null,
        },
      });
      return;
    }

    if (
      !addressForm.receiverName.trim() ||
      !addressForm.receiverPhone.trim() ||
      !addressForm.provinceCity.trim() ||
      !addressForm.wardCommune.trim() ||
      !addressForm.addressDetail.trim()
    ) {
      setFormError("Vui lòng điền đầy đủ địa chỉ giao hàng.");
      return;
    }

    checkout({
      data: {
        paymentMethod,
        saveAddress,
        cartItemIds: selectedItemIds ? Array.from(selectedItemIds) : undefined,
        note: note.trim() || null,
        shippingAddress: {
          receiverName: addressForm.receiverName.trim(),
          receiverPhone: addressForm.receiverPhone.trim(),
          email: addressForm.email?.trim() || null,
          provinceCity: addressForm.provinceCity.trim(),
          wardCommune: addressForm.wardCommune.trim(),
          addressDetail: addressForm.addressDetail.trim(),
          note: addressForm.note?.trim() || null,
          isDefault: addressForm.isDefault ?? false,
        },
      },
    });
  };

  if (authLoading || !isAuthenticated || cartLoading || addressesLoading) {
    return <CheckoutShell>Đang tải thông tin thanh toán...</CheckoutShell>;
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border-warm bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-gutter">
          <Link href="/" className="font-display-lg text-display-lg text-primary">
            NaHerbs
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="text-label-md font-label-md text-secondary hover:text-primary"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-container-max gap-md px-gutter py-lg lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-md rounded-[24px] border border-herbal-beige bg-surface-container-lowest p-md shadow-ambient-sm"
        >
          <div>
            <h1 className="text-headline-md font-headline-md text-primary">Thanh toán</h1>
            <p className="mt-xs text-body-md text-text-muted">
              Địa chỉ chỉ dùng Tỉnh / Thành phố và Phường / Xã theo contract hiện tại.
            </p>
          </div>

          {items.length === 0 && (
            <p className="rounded-lg bg-error-container px-sm py-2 text-caption text-error">
              Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.
            </p>
          )}

          <section className="flex flex-col gap-sm">
            <h2 className="text-body-lg font-body-lg font-semibold text-text-main">
              Phương thức thanh toán
            </h2>
            <div className="grid gap-sm sm:grid-cols-2">
              {Object.values(PaymentMethod).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-xl border px-md py-sm text-left transition-colors ${
                    paymentMethod === method
                      ? "border-primary bg-success-bg text-primary"
                      : "border-border-warm bg-surface text-text-main hover:border-primary"
                  }`}
                >
                  <span className="block text-label-md font-label-md">
                    {paymentMethodLabels[method]}
                  </span>
                  <span className="mt-xs block text-caption text-text-muted">
                    {method === "BANK_QR" ? "Nhận nội dung chuyển khoản QR" : "Thanh toán khi nhận hàng"}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-sm">
            <h2 className="text-body-lg font-body-lg font-semibold text-text-main">
              Địa chỉ giao hàng
            </h2>
            {addresses.length > 0 && (
              <div className="flex flex-wrap gap-sm">
                <button
                  type="button"
                  onClick={() => setAddressMode("saved")}
                  className={`rounded-full px-md py-sm text-label-md font-label-md ${
                    effectiveAddressMode === "saved"
                      ? "bg-primary text-on-primary"
                      : "border border-border-warm text-primary"
                  }`}
                >
                  Dùng địa chỉ đã lưu
                </button>
                <button
                  type="button"
                  onClick={() => setAddressMode("inline")}
                  className={`rounded-full px-md py-sm text-label-md font-label-md ${
                    effectiveAddressMode === "inline"
                      ? "bg-primary text-on-primary"
                      : "border border-border-warm text-primary"
                  }`}
                >
                  Nhập địa chỉ mới
                </button>
              </div>
            )}

            {effectiveAddressMode === "saved" && addresses.length > 0 ? (
              <div className="grid gap-sm">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`flex cursor-pointer gap-sm rounded-xl border p-sm ${
                      effectiveSelectedAddressId === address.id
                        ? "border-primary bg-success-bg"
                        : "border-border-warm bg-surface"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={effectiveSelectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id ?? "")}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <span>
                      <span className="block text-label-md font-label-md text-text-main">
                        {address.receiverName} · {address.receiverPhone}
                      </span>
                      <span className="mt-xs block text-caption text-text-muted">
                        {formatAddress(address)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="grid gap-sm md:grid-cols-2">
                <CheckoutField
                  id="receiverName"
                  label="Người nhận *"
                  value={addressForm.receiverName}
                  onChange={(value) => setAddressForm((prev) => ({ ...prev, receiverName: value }))}
                />
                <CheckoutField
                  id="receiverPhone"
                  label="Số điện thoại *"
                  value={addressForm.receiverPhone}
                  onChange={(value) => setAddressForm((prev) => ({ ...prev, receiverPhone: value }))}
                />
                <CheckoutField
                  id="email"
                  label="Email"
                  type="email"
                  value={addressForm.email ?? ""}
                  onChange={(value) => setAddressForm((prev) => ({ ...prev, email: value }))}
                />
                <CheckoutField
                  id="provinceCity"
                  label="Tỉnh / Thành phố *"
                  value={addressForm.provinceCity}
                  onChange={(value) => setAddressForm((prev) => ({ ...prev, provinceCity: value }))}
                />
                <CheckoutField
                  id="wardCommune"
                  label="Phường / Xã *"
                  value={addressForm.wardCommune}
                  onChange={(value) => setAddressForm((prev) => ({ ...prev, wardCommune: value }))}
                />
                <CheckoutField
                  id="addressDetail"
                  label="Địa chỉ cụ thể *"
                  value={addressForm.addressDetail}
                  onChange={(value) => setAddressForm((prev) => ({ ...prev, addressDetail: value }))}
                />
                <CheckoutField
                  id="addressNote"
                  label="Ghi chú địa chỉ"
                  value={addressForm.note ?? ""}
                  onChange={(value) => setAddressForm((prev) => ({ ...prev, note: value }))}
                  className="md:col-span-2"
                />
                <label className="flex items-center gap-sm md:col-span-2">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(event) => setSaveAddress(event.target.checked)}
                    className="h-5 w-5 rounded border-border-warm text-primary focus:ring-primary"
                  />
                  <span className="text-label-md font-label-md text-text-main">
                    Lưu địa chỉ này vào tài khoản
                  </span>
                </label>
              </div>
            )}
          </section>

          <CheckoutField
            id="note"
            label="Ghi chú đơn hàng"
            value={note}
            onChange={setNote}
          />

          {formError && (
            <p className="rounded-lg bg-error-container px-sm py-2 text-caption text-error">
              {formError}
            </p>
          )}

          {createdOrder && (
            <section className="rounded-xl border border-primary/30 bg-success-bg p-md">
              <h2 className="text-body-lg font-body-lg font-semibold text-primary">
                Đã tạo đơn {createdOrder.orderCode}
              </h2>
              <p className="mt-xs text-body-md text-text-main">
                Tổng tiền: {formatMoney(createdOrder.totalAmount)}
              </p>
              {createdOrder.qrInstruction && (
                <div className="mt-sm rounded-lg bg-surface p-sm text-caption text-text-main">
                  <p>Ngân hàng: {createdOrder.qrInstruction.bankName}</p>
                  <p>Số tài khoản: {createdOrder.qrInstruction.accountNumber}</p>
                  <p>Nội dung: {createdOrder.qrInstruction.transferContent}</p>
                </div>
              )}
              {createdOrder.orderId && (
                <Link
                  href={`/account/orders/${createdOrder.orderId}`}
                  className="mt-sm inline-flex items-center gap-xs rounded-full bg-primary px-md py-sm text-label-md font-label-md text-on-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  Xem chi tiết đơn
                </Link>
              )}
            </section>
          )}

          <button
            type="submit"
            disabled={isPending || items.length === 0}
            className="inline-flex w-full items-center justify-center gap-xs rounded-full bg-primary px-md py-sm text-label-md font-label-md text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {isPending ? "Đang tạo đơn..." : "Xác nhận đặt hàng"}
          </button>
        </form>

        <aside className="h-fit rounded-[24px] border border-herbal-beige bg-surface-container-lowest p-md shadow-ambient-sm">
          <h2 className="text-body-lg font-body-lg font-semibold text-primary">Đơn hàng</h2>
          <div className="mt-md flex flex-col gap-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-sm border-b border-border-warm pb-sm">
                <div>
                  <p className="text-label-md font-label-md text-text-main">
                    {item.productName}
                  </p>
                  <p className="text-caption text-text-muted">
                    {item.skuName} · SL {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-label-md font-label-md text-text-main">
                  {formatMoney(item.lineTotal)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-md flex justify-between text-body-md font-semibold text-primary">
            <span>Tổng cộng</span>
            <span>{formatMoney(cart?.subtotal)}</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

function CheckoutField({
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
      <label htmlFor={id} className="text-label-md font-label-md text-text-main">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-border-warm bg-surface px-sm py-2 text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function CheckoutShell({ children }: { children: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-gutter">
      <p className="text-body-md text-text-muted">{children}</p>
    </main>
  );
}
