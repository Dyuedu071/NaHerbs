import Link from 'next/link';
import { ProductSummary } from '@/services/generated/model';
import FavoriteButton from './FavoriteButton';
import AddToCartButton from './AddToCartButton';
import { resolveImageUrl } from '@/lib/image-url';

interface ProductCardProps {
  product: ProductSummary;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';
  const productUrl = `/san-pham/${product.slug}`;
  const thumbnailUrl = resolveImageUrl(product.thumbnailUrl);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-sm shadow-[0_4px_20px_-2px_rgba(46,77,57,0.12)] group block h-full flex flex-col transition-shadow hover:shadow-[0_8px_30px_-4px_rgba(46,77,57,0.2)]">
      <div className="relative mb-sm overflow-hidden rounded-xl bg-surface-container-low aspect-square flex-shrink-0">
        <Link href={productUrl} className="relative block w-full h-full" style={{ position: 'relative' }}>
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={product.name || 'Product Image'}
              loading={priority ? 'eager' : 'lazy'}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-muted">
              <span className="material-symbols-outlined text-[48px] opacity-20">spa</span>
            </div>
          )}
        </Link>
        
        {/* Status Badge */}
        {isOutOfStock ? (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface-container-high text-text-muted font-label-md text-[12px] pointer-events-none">Hết hàng</span>
        ) : (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-success-bg text-primary font-label-md text-[12px] pointer-events-none">Còn hàng</span>
        )}
        
        {/* Favorite Button (Interactive) */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton productId={product.id || ''} />
        </div>
      </div>

      <div className="space-y-xs flex flex-col flex-grow">
        <Link href={productUrl}>
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Tags / Short Description */}
        {product.shortDescription && (
          <div className="flex gap-1 flex-wrap">
             <span className="px-2 py-0.5 rounded-full bg-surface-variant text-text-muted text-[10px] font-label-md line-clamp-1">{product.shortDescription}</span>
          </div>
        )}
        
        {/* Price and Cart */}
        <div className="flex items-center justify-between pt-sm mt-auto">
          <div className="flex flex-col justify-end">
            {product.maxSalePrice && product.minSalePrice && product.maxSalePrice > product.minSalePrice ? (
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-text-muted text-xs line-through">
                  {product.maxSalePrice.toLocaleString('vi-VN')} ₫
                </span>
                <span className="text-error text-[10px] font-bold px-1 py-0.5 bg-error-container rounded">
                  -{Math.round(((product.maxSalePrice - product.minSalePrice) / product.maxSalePrice) * 100)}%
                </span>
              </div>
            ) : product.originalPrice && product.minSalePrice && product.originalPrice > product.minSalePrice ? (
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-text-muted text-xs line-through">
                  {product.originalPrice.toLocaleString('vi-VN')} ₫
                </span>
                <span className="text-error text-[10px] font-bold px-1 py-0.5 bg-error-container rounded">
                  -{Math.round(((product.originalPrice - product.minSalePrice) / product.originalPrice) * 100)}%
                </span>
              </div>
            ) : null}
            <span className="text-tertiary font-price-display text-price-display leading-none">
               {product.minSalePrice ? (
                 <span>{product.minSalePrice.toLocaleString('vi-VN')} ₫</span>
               ) : (
                 <span>Liên hệ</span>
               )}
            </span>
          </div>
          <div className="z-10 relative">
            <AddToCartButton productSlug={product.slug || ''} isOutOfStock={isOutOfStock} />
          </div>
        </div>
      </div>
    </div>
  );
}
