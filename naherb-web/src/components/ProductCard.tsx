import Link from 'next/link';
import Image from 'next/image';
import { ProductSummary } from '@/services/generated/model';

interface ProductCardProps {
  product: ProductSummary;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';

  return (
    <Link href={`/san-pham/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-square">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name || 'Product Image'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2 text-center">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.shortDescription}</p>
        
        <div className="text-green-700 font-bold">
          {product.minSalePrice === product.maxSalePrice ? (
            <span>{product.minSalePrice?.toLocaleString('vi-VN')} ₫</span>
          ) : (
            <span>
              {product.minSalePrice?.toLocaleString('vi-VN')} ₫ - {product.maxSalePrice?.toLocaleString('vi-VN')} ₫
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
