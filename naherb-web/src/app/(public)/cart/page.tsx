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
import { useGetAuthMe } from "@/services/generated/customer-profile/customer-profile";
import type { Cart } from "@/services/generated/model/cart";
import type { CartItem } from "@/services/generated/model/cartItem";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState, useEffect } from "react";
const EMPTY_ITEMS: CartItem[] = [];

export default function CartPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const {
    data: meResponse,
    isLoading: authLoading,
    isError: authError,
  } = useGetAuthMe({
    query: {
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
      enabled: isAuthenticated,
      retry: false,
    },
  });

  const cart = (cartResponse as { data?: Cart } | undefined)?.data;
  const items = cart?.items ?? EMPTY_ITEMS;
  
  // Make sure to remove deleted items from selectedItems
  useEffect(() => {
    const currentItemIds = new Set(items.map((i: CartItem) => i.id).filter(Boolean) as string[]);
    setSelectedItems((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const id of next) {
        if (!currentItemIds.has(id)) {
          next.delete(id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [items]);

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((i: CartItem) => i.id).filter(Boolean) as string[]));
    }
  };

  const toggleSelectItem = (id: string) => {
    const next = new Set(selectedItems);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedItems(next);
  };

  const selectedItemsList = items.filter((i: CartItem) => i.id && selectedItems.has(i.id));
  const selectedSubtotal = selectedItemsList.reduce((acc: number, item: CartItem) => acc + (item.lineTotal ?? 0), 0);
  const selectedTotalItemsCount = selectedItemsList.reduce((acc: number, item: CartItem) => acc + (item.quantity ?? 0), 0);
  const isAllSelected = items.length > 0 && selectedItems.size === items.length;

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
        setSelectedItems(new Set());
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

  return (
    <>
      
      <main className="pt-32 pb-xl px-gutter max-w-container-max mx-auto min-h-[819px]">
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-headline-lg text-headline-lg md:font-headline-lg-mobile md:text-headline-lg-mobile text-primary mb-2">
            Giỏ hàng của bạn
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Bạn đang có {items.reduce((acc: number, item: CartItem) => acc + (item.quantity ?? 0), 0)} sản phẩm trong giỏ hàng.
          </p>
        </header>

        {message && (
          <div className="mb-6 rounded-lg bg-success-bg px-4 py-3 text-sm text-primary">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {authLoading && <p className="text-center py-8 text-text-muted">Đang tải thông tin...</p>}

        {!authLoading && !isAuthenticated && (
          <div className="rounded-[24px] border border-herbal-beige bg-surface-container-lowest p-8 text-center shadow-ambient-sm max-w-md mx-auto mt-12">
            <span className="material-symbols-outlined text-[48px] text-primary">
              account_circle
            </span>
            <h3 className="mt-4 text-body-lg font-body-lg font-semibold text-primary">
              Đăng nhập để xem giỏ hàng
            </h3>
            <p className="mt-2 text-on-surface-variant text-sm mb-6">Bạn cần đăng nhập để quản lý và thanh toán giỏ hàng của mình.</p>
            <Link
              href="/dang-nhap"
              className="inline-flex items-center justify-center gap-xs rounded-full bg-primary px-8 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-secondary"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              Đăng nhập ngay
            </Link>
          </div>
        )}

        {isAuthenticated && cartLoading && (
          <p className="text-center py-8 text-text-muted">Đang tải giỏ hàng...</p>
        )}
        
        {isAuthenticated && cartError && (
          <p className="text-center py-8 text-error">Không thể tải giỏ hàng. Vui lòng đăng nhập lại hoặc thử lại sau.</p>
        )}

        {isAuthenticated && !cartLoading && !cartError && (
          <>
            {items.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-herbal-beige bg-surface-container-lowest p-12 text-center shadow-ambient-sm max-w-xl mx-auto mt-12">
                <span className="material-symbols-outlined text-[64px] text-primary mb-4 block">
                  shopping_cart
                </span>
                <h3 className="text-body-lg font-body-lg font-semibold text-primary mb-2">
                  Giỏ hàng của bạn đang trống
                </h3>
                <p className="text-on-surface-variant mb-8">Hãy thêm vài sản phẩm tốt cho sức khỏe vào giỏ hàng nhé!</p>
                <Link
                  href="/san-pham"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-secondary"
                >
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                {/* Cart Items List (Left Column) */}
                <div className="lg:col-span-8 space-y-md">
                  <div className="flex justify-between items-center mb-2 px-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-outline text-primary focus:ring-primary accent-primary" 
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                      />
                      <span className="font-label-md text-label-md text-on-surface">Chọn tất cả</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => clearCart()}
                      disabled={isClearing}
                      className="inline-flex items-center gap-xs rounded-full border border-error/30 px-sm py-1 text-caption text-error transition-colors hover:bg-error-container disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                      Xóa tất cả
                    </button>
                  </div>
                  
                  {items.map((item: CartItem) => (
                    <article
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-6 p-6 bg-surface-container-low rounded-xl border border-border-warm shadow-ambient-sm relative group transition-all duration-300 hover:shadow-ambient-md"
                    >
                      {/* Checkbox */}
                      <div className="flex items-center h-full sm:pt-[52px]">
                         <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-outline text-primary focus:ring-primary accent-primary cursor-pointer" 
                            checked={item.id ? selectedItems.has(item.id) : false}
                            onChange={() => item.id && toggleSelectItem(item.id)}
                         />
                      </div>
                      {/* Thumbnail */}
                      <div className="w-full sm:w-32 h-32 shrink-0 bg-surface-variant rounded-lg overflow-hidden flex items-center justify-center">
                        {item.thumbnailUrl ? (
                          <img
                            className="w-full h-full object-cover"
                            alt={item.productName ?? "Sản phẩm"}
                            src={resolveImageUrl(item.thumbnailUrl, { width: 256 }) || item.thumbnailUrl}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                           <span className="material-symbols-outlined text-[40px] text-outline">
                              inventory_2
                           </span>
                        )}
                      </div>
                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start pr-8">
                            <Link href={`/san-pham/${item.productSlug}`} className="font-headline-md text-headline-md text-primary !text-[20px] hover:underline">
                              {item.productName ?? "Sản phẩm"}
                            </Link>
                            <button
                              aria-label="Remove item"
                              onClick={() => item.id && removeItem({ itemId: item.id })}
                              disabled={isRemoving}
                              className="absolute top-6 right-6 text-outline-variant hover:text-error transition-colors p-1 rounded-full hover:bg-error-bg disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                          <p className="font-caption text-caption text-on-surface-variant mt-1">
                            SKU: {item.skuName ?? "N/A"}
                          </p>
                          
                          {(item.stockQuantity ?? 0) > 0 ? (
                             <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-success-bg text-primary text-xs font-semibold">
                                Còn hàng
                             </div>
                          ) : (
                             <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-error-bg text-error text-xs font-semibold">
                                Hết hàng
                             </div>
                          )}
                          
                        </div>
                        {/* Price & Quantity */}
                        <div className="flex flex-wrap items-end justify-between mt-4 gap-4">
                          <div className="font-price-display text-price-display text-primary !text-[24px]">
                            {formatMoney(item.lineTotal)}
                          </div>
                          {/* Stepper */}
                          <div className="flex items-center gap-3 bg-surface border border-border-warm rounded-full px-2 py-1 h-[42px]">
                            <button
                              onClick={() => handleQuantityChange(item, (item.quantity ?? 1) - 1)}
                              disabled={isUpdating || (item.quantity ?? 1) <= 1}
                              className="w-8 h-8 flex items-center justify-center text-primary hover:bg-secondary-fixed rounded-full transition-colors focus:outline-none disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                              <span className="material-symbols-outlined text-[18px]">remove</span>
                            </button>
                            <span className="font-label-md text-label-md w-6 text-center select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, (item.quantity ?? 1) + 1)}
                              disabled={isUpdating || (item.quantity ?? 1) >= (item.stockQuantity ?? Infinity)}
                              className="w-8 h-8 flex items-center justify-center text-primary hover:bg-secondary-fixed rounded-full transition-colors focus:outline-none disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                              <span className="material-symbols-outlined text-[18px]">add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                
                {/* Order Summary (Right Column - Sticky) */}
                <div className="lg:col-span-4 sticky top-32">
                  <div className="bg-surface-container-lowest rounded-xl p-8 border border-border-warm shadow-ambient-sm">
                    <h2 className="font-headline-md text-headline-md text-primary mb-6 !text-[24px]">
                      Tóm tắt đơn hàng
                    </h2>
                    <div className="space-y-4 font-body-md text-body-md text-on-surface mb-6 border-b border-border-warm pb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Tạm tính ({selectedTotalItemsCount} sản phẩm)</span>
                        <span className="font-medium">{formatMoney(selectedSubtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Phí vận chuyển</span>
                        <span className="text-primary font-medium text-sm bg-success-bg px-2 py-0.5 rounded-full">
                          Miễn phí
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end mb-8">
                      <span className="font-label-md text-label-md text-on-surface">Tổng cộng</span>
                      <div className="text-right">
                        <span className="font-price-display text-price-display text-primary block">
                          {formatMoney(selectedSubtotal)}
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant block mt-1">
                          (Đã bao gồm VAT)
                        </span>
                      </div>
                    </div>
                    <Link
                      href={{ pathname: "/checkout", query: { items: Array.from(selectedItems).join(",") } }}
                      aria-disabled={selectedItems.size === 0}
                      className={`w-full rounded-full py-4 font-label-md text-label-md flex justify-center items-center gap-2 transition-all duration-300 ${selectedItems.size === 0 ? 'bg-surface-variant text-outline cursor-not-allowed' : 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant hover:shadow-ambient-md transform hover:-translate-y-0.5'}`}
                      onClick={(e) => {
                         if (selectedItems.size === 0) e.preventDefault();
                      }}
                    >
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                      Tiến hành thanh toán
                    </Link>
                    {selectedItems.size === 0 && (
                       <p className="text-center text-error text-sm mt-3">Vui lòng chọn sản phẩm để thanh toán</p>
                    )}
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-soft-sage">
                        verified_user
                      </span>
                      <span>Thanh toán an toàn & bảo mật 100%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
    </>
  );
}
