import type { RecommendedProduct } from "@/services/generated/model/recommendedProduct";
import { StockStatus } from "@/services/generated/model/stockStatus";
import { resolveImageUrl } from "@/lib/image-url";
import Link from "next/link";

interface ChatProductCardProps {
  product: RecommendedProduct;
}

function formatVnd(price?: number | null): string {
  if (price == null) {
    return "";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function stockLabel(status?: RecommendedProduct["stockStatus"]): string | null {
  switch (status) {
    case StockStatus.IN_STOCK:
      return "Còn hàng";
    case StockStatus.LOW_STOCK:
      return "Sắp hết";
    case StockStatus.OUT_OF_STOCK:
      return "Hết hàng";
    default:
      return null;
  }
}

export default function ChatProductCard({ product }: ChatProductCardProps) {
  const href = product.slug ? `/san-pham/${product.slug}` : "#";
  const stock = stockLabel(product.stockStatus);

  return (
    <Link
      href={href}
      className="flex w-full min-w-0 max-w-full gap-sm overflow-hidden rounded-xl border border-border-warm bg-surface p-xs transition-colors hover:border-primary hover:bg-success-bg/40"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border-warm bg-herbal-beige">
        {product.thumbnailUrl ? (
          <img
            src={resolveImageUrl(product.thumbnailUrl, { width: 112 }) || product.thumbnailUrl}
            alt={product.name ?? "Sản phẩm"}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="truncate font-label-md text-label-md text-text-main">
          {product.name}
        </p>
        {product.skuName?.trim() && product.skuName !== product.name && (
          <p className="truncate font-caption text-caption text-text-muted">
            {product.skuName}
          </p>
        )}
        {product.reason?.trim() && (
          <p className="mt-0.5 line-clamp-2 font-caption text-caption text-text-muted">
            {product.reason}
          </p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-xs">
          {product.salePrice != null && (
            <span className="font-label-md text-label-md text-primary">
              {formatVnd(product.salePrice)}
            </span>
          )}
          {stock && (
            <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-caption text-caption text-text-muted">
              {stock}
            </span>
          )}
        </div>
      </div>

      <span className="material-symbols-outlined shrink-0 self-center text-text-muted">
        chevron_right
      </span>
    </Link>
  );
}
