"use client";

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/services/generated/model';
import { resolveImageUrl } from '@/lib/image-url';

interface ProductGalleryProps {
  images: ProductImage[];
  activeSkuUrl?: string;
  productName?: string;
}

export default function ProductGallery({ images, activeSkuUrl, productName }: ProductGalleryProps) {
  const mainAlt = productName || 'Ảnh sản phẩm NaHerbs';
  const normalizedImages = useMemo(
    () =>
      images
        .map((img) => ({ ...img, url: resolveImageUrl(img.url) }))
        .filter((img) => Boolean(img.url)),
    [images],
  );
  const normalizedActiveSkuUrl = resolveImageUrl(activeSkuUrl);

  const initial = normalizedImages.find((img) => img.isThumbnail) || normalizedImages[0];
  const [activeImage, setActiveImage] = useState(initial?.url || '');
  const [activeAlt, setActiveAlt] = useState(initial?.altText || mainAlt);

  useEffect(() => {
    if (!normalizedActiveSkuUrl) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveImage(normalizedActiveSkuUrl);
    const match = normalizedImages.find((img) => img.url === normalizedActiveSkuUrl);
    setActiveAlt(match?.altText || mainAlt);
  }, [normalizedActiveSkuUrl, normalizedImages, mainAlt]);

  if (normalizedImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
        No Image Available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
        {activeImage && (
          <Image
            src={activeImage}
            alt={activeAlt || mainAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      {normalizedImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {normalizedImages.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => {
                setActiveImage(img.url!);
                setActiveAlt(img.altText || mainAlt);
              }}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors flex-shrink-0 ${
                activeImage === img.url ? 'border-green-600' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url!}
                alt={img.altText || `${mainAlt} thumbnail`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
