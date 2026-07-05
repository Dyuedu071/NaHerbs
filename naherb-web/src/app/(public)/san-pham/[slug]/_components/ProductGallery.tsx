"use client";

import { useState, useEffect } from 'react';
import { ProductImage } from '@/services/generated/model';
import { resolveImageUrl } from '@/lib/image-url';

interface ProductGalleryProps {
  images: ProductImage[];
  activeSkuUrl?: string;
}

export default function ProductGallery({ images, activeSkuUrl }: ProductGalleryProps) {
  const normalizedImages = images
    .map((img) => ({ ...img, url: resolveImageUrl(img.url) }))
    .filter((img) => Boolean(img.url));
  const normalizedActiveSkuUrl = resolveImageUrl(activeSkuUrl);

  const [activeImage, setActiveImage] = useState(
    normalizedImages.find((img) => img.isThumbnail)?.url || normalizedImages[0]?.url || ''
  );

  // Sync active image when activeSkuUrl changes
  useEffect(() => {
    if (normalizedActiveSkuUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveImage(normalizedActiveSkuUrl);
    }
  }, [normalizedActiveSkuUrl]);

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
          <img
            src={activeImage}
            alt="Main product image"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {normalizedImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {normalizedImages.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img.url!)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors flex-shrink-0 ${
                activeImage === img.url ? 'border-green-600' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              style={{ position: 'relative' }}
            >
              <img src={img.url!} alt={img.altText || 'Thumbnail'} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
