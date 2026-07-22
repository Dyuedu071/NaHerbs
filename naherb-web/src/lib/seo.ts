import type { Metadata } from "next";

export const DEFAULT_SITE_URL = "https://naherb.com.vn";
export const DEFAULT_STORE_NAME = "NaHerbs";
export const DEFAULT_OG_IMAGE = "/naherbs-icon.png";

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || DEFAULT_SITE_URL
  );
}

export function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
}

export async function fetchSiteInfo(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${getApiBase()}/v1/settings/site-info`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};
    const json = await res.json();
    return (json?.data || json || {}) as Record<string, string>;
  } catch {
    return {};
  }
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return path.startsWith("http")
    ? path
    : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return absoluteUrl(url);
}

type BuildMetadataOptions = {
  title?: string | null;
  description?: string | null;
  path?: string;
  image?: string | null;
  type?: "website" | "article";
  /** When true, use title as-is (no `%s | Brand` template). */
  absoluteTitle?: boolean;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  keywords?: string | null;
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  absoluteTitle = false,
  publishedTime,
  modifiedTime,
  keywords,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = absoluteUrl(path);
  const ogImage = absoluteImageUrl(image) || absoluteUrl(DEFAULT_OG_IMAGE);
  const resolvedTitle = title?.trim() || DEFAULT_STORE_NAME;
  const resolvedDescription =
    description?.trim() ||
    "Tinh hoa thảo dược, chăm sóc sức khỏe từ thiên nhiên";

  return {
    metadataBase: new URL(siteUrl),
    title: absoluteTitle
      ? { absolute: resolvedTitle }
      : resolvedTitle,
    description: resolvedDescription,
    ...(keywords ? { keywords: keywords.split(/[,;]+/).map((k) => k.trim()).filter(Boolean) } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      siteName: DEFAULT_STORE_NAME,
      locale: "vi_VN",
      type,
      images: [
        {
          url: ogImage,
          alt: resolvedTitle,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function jsonLdScript(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

type OrganizationInput = {
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  facebookUrl?: string;
  zaloUrl?: string;
  instagramUrl?: string;
};

export function buildOrganizationJsonLd(info: OrganizationInput): Record<string, unknown> {
  const name = info.name?.trim() || DEFAULT_STORE_NAME;
  const sameAs = [info.facebookUrl, info.zaloUrl, info.instagramUrl].filter(
    (url): url is string => Boolean(url && url.startsWith("http")),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: getSiteUrl(),
    logo: absoluteUrl(DEFAULT_OG_IMAGE),
    ...(info.description ? { description: info.description } : {}),
    ...(info.email ? { email: info.email } : {}),
    ...(info.phone
      ? { telephone: info.phone, contactPoint: { "@type": "ContactPoint", telephone: info.phone, contactType: "customer service", availableLanguage: "Vietnamese" } }
      : {}),
    ...(info.address || info.city
      ? {
          address: {
            "@type": "PostalAddress",
            ...(info.address ? { streetAddress: info.address } : {}),
            ...(info.city ? { addressLocality: info.city } : {}),
            addressCountry: "VN",
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function buildArticleJsonLd(post: {
  title: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}): Record<string, unknown> {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const image = absoluteImageUrl(post.image);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description || undefined,
    url,
    mainEntityOfPage: url,
    ...(image ? { image: [image] } : {}),
    datePublished: post.publishedAt || post.createdAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt || undefined,
    author: {
      "@type": "Organization",
      name: DEFAULT_STORE_NAME,
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: DEFAULT_STORE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(DEFAULT_OG_IMAGE),
      },
    },
    inLanguage: "vi-VN",
  };
}

export function buildProductJsonLd(product: {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  sku?: string | null;
  price?: number | null;
  currency?: string;
  inStock?: boolean;
}): Record<string, unknown> {
  const url = absoluteUrl(`/san-pham/${product.slug}`);
  const image = absoluteImageUrl(product.image);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    url,
    ...(image ? { image: [image] } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    brand: {
      "@type": "Brand",
      name: DEFAULT_STORE_NAME,
    },
    ...(product.price != null
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: product.currency || "VND",
            price: product.price,
            availability: product.inStock === false
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: DEFAULT_STORE_NAME,
            },
          },
        }
      : {}),
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path?: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}
