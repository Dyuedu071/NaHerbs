"use client";

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetCartQueryKey, usePostCartItems } from '@/services/generated/cart/cart';
import { getProductsSlug } from '@/services/generated/public-products/public-products';
import type { ProductDetail } from '@/services/generated/model/productDetail';
import type { ProductSku } from '@/services/generated/model/productSku';
import { useToast } from '@/contexts/ToastContext';
import { extractApiErrorMessage } from '@/lib/api-error';

interface AddToCartButtonProps {
  productSlug: string;
  isOutOfStock: boolean;
}

function findFirstAvailableSku(product?: ProductDetail): ProductSku | undefined {
  return product?.versions
    ?.flatMap((v) => v.skus ?? [])
    .find(
      (sku) =>
        sku.id &&
        sku.status === 'ACTIVE' &&
        sku.stockStatus !== 'OUT_OF_STOCK' &&
        (sku.stockQuantity ?? 0) > 0,
    );
}

export default function AddToCartButton({ productSlug, isOutOfStock }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { mutateAsync: addCartItem } = usePostCartItems();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || loading) return;

    setLoading(true);
    try {
      const rawData = await getProductsSlug(productSlug);
      let detail: ProductDetail | undefined;
      if (rawData) {
        if ('id' in rawData) {
          detail = rawData as unknown as ProductDetail;
        } else if (typeof rawData === 'object' && 'data' in rawData && rawData.data) {
          detail = rawData.data as ProductDetail;
        }
      }

      const sku = findFirstAvailableSku(detail);
      if (!sku?.id) {
        showToast('Sản phẩm hiện chưa có SKU còn hàng.', 'error');
        return;
      }

      await addCartItem({ data: { skuId: sku.id, quantity: 1 } });
      await queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      showToast('Đã thêm sản phẩm vào giỏ hàng!', 'success');
    } catch (err) {
      showToast(extractApiErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_20px_-2px_rgba(46,77,57,0.12)] transition-colors ${
        isOutOfStock
          ? 'bg-surface-container-high text-text-muted cursor-not-allowed'
          : loading
          ? 'bg-primary/70 text-white cursor-wait'
          : 'bg-primary text-white hover:bg-on-primary-fixed-variant'
      }`}
      onClick={handleClick}
      disabled={isOutOfStock || loading}
      aria-label={isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
      ) : (
        <span className="material-symbols-outlined">
          {isOutOfStock ? 'notifications' : 'add_shopping_cart'}
        </span>
      )}
    </button>
  );
}
