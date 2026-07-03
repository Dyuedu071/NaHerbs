"use client";

import { useState } from 'react';
import { ProductVersion, ProductSku } from '@/services/generated/model';
import { useToast } from '@/contexts/ToastContext';
import { usePostCartItems, getGetCartQueryKey } from '@/services/generated/cart/cart';
import { useQueryClient } from '@tanstack/react-query';
import { extractApiErrorMessage } from '@/lib/api-error';

interface ProductSelectionProps {
  versions: ProductVersion[];
  onSkuSelect?: (sku: ProductSku) => void;
}

export default function ProductSelection({ versions, onSkuSelect }: ProductSelectionProps) {
  const [selectedVersion, setSelectedVersion] = useState<ProductVersion | undefined>(versions[0]);
  const [selectedSku, setSelectedSku] = useState<ProductSku | undefined>(selectedVersion?.skus?.[0]);
  const [quantity, setQuantity] = useState(1);

  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { mutateAsync: addCartItem, isPending } = usePostCartItems();

  const handleVersionChange = (version: ProductVersion) => {
    setSelectedVersion(version);
    setSelectedSku(version.skus?.[0]);
    setQuantity(1);
    if (onSkuSelect && version.skus?.[0]) {
      onSkuSelect(version.skus[0]);
    }
  };

  const isOutOfStock = selectedSku?.stockStatus === 'OUT_OF_STOCK' || (selectedSku?.stockQuantity ?? 0) === 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || isPending) return;

    if (!selectedSku?.id) {
      showToast('Vui lòng chọn phân loại sản phẩm.', 'error');
      return;
    }

    try {
      await addCartItem({ data: { skuId: selectedSku.id, quantity } });
      await queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      showToast(`Đã thêm ${quantity} × ${selectedSku.name || 'sản phẩm'} vào giỏ hàng!`, 'success');
    } catch (err) {
      showToast(extractApiErrorMessage(err), 'error');
    }
  };

  if (!versions || versions.length === 0) return null;

  return (
    <div className="space-y-8 relative">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {selectedSku?.salePrice?.toLocaleString('vi-VN')} ₫
        </h2>
        {selectedSku?.originalPrice && selectedSku.originalPrice > selectedSku.salePrice! && (
          <p className="text-gray-500 line-through">
            {selectedSku.originalPrice.toLocaleString('vi-VN')} ₫
          </p>
        )}
      </div>

      {versions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Phiên bản</h3>
          <div className="flex flex-wrap gap-3">
            {versions.map((version) => (
              <button
                key={version.id}
                onClick={() => handleVersionChange(version)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                  selectedVersion?.id === version.id
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {version.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedVersion && selectedVersion.skus && selectedVersion.skus.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Tùy chọn (Mùi hương / Phân loại)</h3>
          <div className="flex flex-wrap gap-3">
            {selectedVersion.skus.map((sku) => (
              <button
                key={sku.id}
                onClick={() => {
                  setSelectedSku(sku);
                  setQuantity(1);
                  if (onSkuSelect) onSkuSelect(sku);
                }}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                  selectedSku?.id === sku.id
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {sku.name || sku.scent || sku.skuCode}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Số lượng</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              readOnly
              className="w-16 text-center border-none focus:ring-0 text-gray-900 font-medium p-0"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={isOutOfStock || (selectedSku?.stockQuantity ? quantity >= selectedSku.stockQuantity : false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {isOutOfStock ? 'Hết hàng' : `Còn ${selectedSku?.stockQuantity || 0} sản phẩm`}
          </span>
        </div>
      </div>

      <button
        onClick={() => void handleAddToCart()}
        disabled={isOutOfStock || isPending}
        className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            Đang thêm...
          </>
        ) : (
          'Thêm vào giỏ hàng'
        )}
      </button>
    </div>
  );
}
