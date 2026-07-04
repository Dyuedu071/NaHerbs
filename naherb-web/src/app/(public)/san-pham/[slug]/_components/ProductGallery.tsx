"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/services/generated/model';

interface ProductGalleryProps {
  images: ProductImage[];
  activeSkuUrl?: string;
}

export default function ProductGallery({ images, activeSkuUrl }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(
    images.find((img) => img.isThumbnail)?.url || images[0]?.url || ''
  );

  // Sync active image when activeSkuUrl changes
  useEffect(() => {
    if (activeSkuUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveImage(activeSkuUrl);
    }
  }, [activeSkuUrl]);

  if (!images || images.length === 0) {
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
            alt="Main product image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img.url!)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors flex-shrink-0 ${
                activeImage === img.url ? 'border-green-600' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              style={{ position: 'relative' }}
            >
              <Image src={img.url!} alt={img.altText || 'Thumbnail'} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
