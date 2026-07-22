"use client";

import { extractApiErrorMessage } from "@/lib/api-error";
import { extractSessionUser } from "@/lib/current-user";
import { formatMoney } from "@/lib/order-format";
import { resolveImageUrl } from "@/lib/image-url";
import {
  getGetCartQueryKey,
  useDeleteCart,
  useDeleteCartItemsItemId,
  useGetCart,
  usePatchCartItemsItemId,
} from "@/services/generated/cart/cart";
import type { Cart } from "@/services/generated/model/cart";
import type { CartItem } from "@/services/generated/model/cartItem";
import { useGetAuthMe } from "@/services/generated/customer-profile/customer-profile";
import { getCsrfToken } from "@/services/csrf";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

export default function CartModal() {
  const queryClient = useQueryClient();
  const { isOpen, close } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: meResponse,
    isLoading: authLoading,
    isError: authError,
  } = useGetAuthMe({
    query: {
      enabled: isOpen,
      retry: false,
      refetchOnWindowFocus: false,
    },
  });

  const user = extractSessionUser(meResponse);
  const isAuthenticated = !!user && !authError;

  const {
    data: cartResponse,
    isLoading: cartLoading,
    isError: cartError,
  } = useGetCart({
    query: {
      enabled: isOpen && isAuthenticated,
      retry: false,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    void getCsrfToken();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, isOpen]);

  const cart = (cartResponse as { data?: Cart } | undefined)?.data;
  const items = cart?.items ?? [];

  const invalidateCart = () => {
    void queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
  };

  const onMutationError = (mutationError: unknown) => {
    setMessage(null);
    setError(extractApiErrorMessage(mutationError));
  };

  const { mutate: updateItem, isPending: isUpdating } = usePatchCartItemsItemId({
    mutation: {
      onSuccess: () => {
        setError(null);
        setMessage("Đã cập nhật giỏ hàng.");
        invalidateCart();
      },
      onError: onMutationError,
    },
  });

  const { mutate: removeItem, isPending: isRemoving } = useDeleteCartItemsItemId({
    mutation: {
      onSuccess: () => {
        setError(null);
        setMessage("Đã xóa sản phẩm khỏi giỏ hàng.");
        invalidateCart();
      },
      onError: onMutationError,
    },
  });

  const { mutate: clearCart, isPending: isClearing } = useDeleteCart({
    mutation: {
      onSuccess: () => {
        setError(null);
        setMessage("Đã xóa toàn bộ giỏ hàng.");
        invalidateCart();
      },
      onError: onMutationError,
    },
  });

  const handleQuantityChange = (item: CartItem, quantity: number) => {
    if (!item.id) {
      return;
    }
    setMessage(null);
    setError(null);
    updateItem({
      itemId: item.id,
      data: { quantity: Math.max(1, quantity) },
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-text-main/45 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Đóng giỏ hàng"
        onClick={close}
        className="absolute inset-0 cursor-default"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
        className="relative flex h-full w-full max-w-[520px] flex-col bg-background shadow-ambient-2"
      >
        <header className="flex h-16 items-center justify-between border-b border-border-warm bg-surface px-md">
          <div>
            <h2 id="cart-modal-title" className="text-body-lg font-body-lg font-semibold text-primary">
              Giỏ hàng
            </h2>
            <p className="text-caption text-text-muted">
              {items.length > 0 ? `${items.length} sản phẩm` : "Chưa có sản phẩm"}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-success-bg"
            aria-label="Đóng giỏ hàng"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-md py-md">
          {authLoading && <PanelText>Đang kiểm tra đăng nhập...</PanelText>}

          {!authLoading && !isAuthenticated && (
            <div className="rounded-[24px] border border-herbal-beige bg-surface-container-lowest p-md text-center shadow-ambient-sm">
              <span className="material-symbols-outlined text-[42px] text-primary">
                account_circle
              </span>
              <h3 className="mt-sm text-body-lg font-body-lg font-semibold text-primary">
                Đăng nhập để xem giỏ hàng
              </h3>
              <Link
                href="/dang-nhap"
                onClick={close}
                className="mt-md inline-flex items-center justify-center gap-xs rounded-full bg-primary px-md py-sm text-label-md font-label-md text-on-primary transition-colors hover:bg-secondary"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                Đăng nhập
              </Link>
            </div>
          )}

          {isAuthenticated && cartLoading && <PanelText>Đang tải giỏ hàng...</PanelText>}

          {isAuthenticated && cartError && (
            <PanelText tone="error">Không thể tải giỏ hàng. Vui lòng đăng nhập lại.</PanelText>
          )}

          {isAuthenticated && !cartLoading && !cartError && (
            <div className="flex flex-col gap-md">
              <div className="flex items-center justify-between gap-sm">
                <p className="text-body-md text-text-muted">
                  Kiểm tra số lượng và tồn kho trước khi thanh toán.
                </p>
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearCart()}
                    disabled={isClearing}
                    className="inline-flex shrink-0 items-center gap-xs rounded-full border border-error/30 px-sm py-1 text-caption text-error transition-colors hover:bg-error-container disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                    Xóa hết
                  </button>
                )}
              </div>

              {message && (
                <p className="rounded-lg bg-success-bg px-sm py-2 text-caption text-primary">
                  {message}
                </p>
              )}
              {error && (
                <p className="rounded-lg bg-error-container px-sm py-2 text-caption text-error">
                  {error}
                </p>
              )}

              {items.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-herbal-beige bg-surface-container-lowest p-lg text-center shadow-ambient-sm">
                  <span className="material-symbols-outlined text-[44px] text-primary">
                    shopping_cart
                  </span>
                  <h3 className="mt-sm text-body-lg font-body-lg font-semibold text-primary">
                    Giỏ hàng đang trống
                  </h3>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-md inline-flex items-center gap-xs rounded-full bg-primary px-md py-sm text-label-md font-label-md text-on-primary transition-colors hover:bg-secondary"
                  >
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    Tiếp tục mua hàng
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-sm">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="grid grid-cols-[80px_1fr] gap-sm rounded-[24px] border border-herbal-beige bg-surface-container-lowest p-sm shadow-ambient-sm"
                    >
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-surface-container">
                        {item.thumbnailUrl ? (
                          <img
                            src={resolveImageUrl(item.thumbnailUrl, { width: 160 }) || item.thumbnailUrl}
                            alt={item.productName ?? "Sản phẩm"}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-[30px] text-outline">
                            inventory_2
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-body-md font-body-md font-semibold text-text-main">
                          {item.productName ?? "Sản phẩm"}
                        </h3>
                        <p className="mt-1 text-caption text-text-muted">
                          {item.skuName ?? "SKU"} · Còn {item.stockQuantity ?? 0}
                        </p>
                        <div className="mt-sm flex flex-wrap items-center justify-between gap-xs">
                          <label className="flex items-center gap-xs text-label-md text-text-main">
                            SL
                            <input
                              type="number"
                              min={1}
                              max={item.stockQuantity ?? undefined}
                              value={item.quantity ?? 1}
                              disabled={isUpdating}
                              onChange={(event) =>
                                handleQuantityChange(item, Number(event.target.value))
                              }
                              className="h-9 w-16 rounded-lg border border-border-warm bg-surface px-xs text-center outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                          </label>
                          <span className="text-label-md font-label-md text-primary">
                            {formatMoney(item.lineTotal)}
                          </span>
                        </div>
                        <button
                          type="button"
                          disabled={isRemoving || !item.id}
                          onClick={() => item.id && removeItem({ itemId: item.id })}
                          className="mt-sm inline-flex items-center gap-xs rounded-full border border-error/30 px-sm py-1 text-caption text-error transition-colors hover:bg-error-container disabled:opacity-60"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          Xóa
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {isAuthenticated && !cartLoading && !cartError && items.length > 0 && (
          <footer className="border-t border-border-warm bg-surface px-md py-md">
            <div className="mb-sm flex items-center justify-between">
              <span className="text-body-md text-text-muted">Tạm tính</span>
              <span className="text-body-lg font-body-lg font-semibold text-text-main">
                {formatMoney(cart?.subtotal)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={close}
              className="inline-flex w-full items-center justify-center gap-xs rounded-full bg-primary px-md py-sm text-label-md font-label-md text-on-primary transition-colors hover:bg-secondary"
            >
              <span className="material-symbols-outlined text-[18px]">payments</span>
              Thanh toán
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}

function PanelText({
  children,
  tone = "muted",
}: {
  children: string;
  tone?: "muted" | "error";
}) {
  return (
    <p className={`py-lg text-center text-body-md ${tone === "error" ? "text-error" : "text-text-muted"}`}>
      {children}
    </p>
  );
}
