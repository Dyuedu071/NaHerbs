"use client";

import { useState } from 'react';
import { ProductDetail, ProductSku } from '@/services/generated/model';
import ProductGallery from './ProductGallery';
import ProductSelection from './ProductSelection';

interface Props {
  product: ProductDetail;
}

export default function ProductInteractive({ product }: Props) {
  const [selectedSku, setSelectedSku] = useState<ProductSku | undefined>(product.versions?.[0]?.skus?.[0]);

  // Combine product images and sku thumbnails
  const allImages = [...(product.images || [])];
  
  if (product.versions) {
    product.versions.forEach(v => {
      v.skus?.forEach(s => {
        if (s.thumbnailUrl) {
          // Check if already in list
          if (!allImages.find(img => img.url === s.thumbnailUrl)) {
            allImages.push({
              id: s.id, // safe fallback for key
              url: s.thumbnailUrl,
              altText: s.name || s.skuCode || 'SKU Image',
              isThumbnail: false
            });
          }
        }
      });
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="lg:sticky lg:top-28 h-fit">
        <ProductGallery 
          images={allImages} 
          activeSkuUrl={selectedSku?.thumbnailUrl ?? undefined} 
        />
      </div>

      <div className="pt-2">
        <h1 className="text-4xl font-merriweather font-bold text-gray-900 mb-4">
          {product.name}
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {product.shortDescription}
        </p>

        <ProductSelection 
          versions={product.versions || []} 
          onSkuSelect={setSelectedSku}
        />
      </div>
    </div>
  );
}
