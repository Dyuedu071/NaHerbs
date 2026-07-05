import { MetadataRoute } from 'next';

/**
 * Next.js dynamic sitemap
 * Tự động được serve tại /sitemap.xml
 * Dữ liệu lấy từ backend endpoint GET /api/v1/seo/sitemap-data
 */

interface SitemapItem {
  slug?: string;
  updatedAt?: string | null;
}

interface SitemapData {
  staticPages?: string[];
  products?: SitemapItem[];
  categories?: SitemapItem[];
  blogPosts?: SitemapItem[];
}

async function fetchSitemapData(): Promise<SitemapData> {
  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
    const res = await fetch(`${apiBase}/v1/seo/sitemap-data`, {
      // Revalidate mỗi 1 tiếng để sitemap không quá cũ
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};
    const json = await res.json();
    return (json?.data ?? json) as SitemapData;
  } catch {
    return {};
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://naherb.com.vn';

  const data = await fetchSitemapData();

  const entries: MetadataRoute.Sitemap = [];

  // ── Static pages ─────────────────────────────────────────────
  const staticDefaults: Record<string, { priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = {
    '/': { priority: 1.0, changeFrequency: 'daily' },
    '/san-pham': { priority: 0.9, changeFrequency: 'daily' },
    '/tin-tuc': { priority: 0.8, changeFrequency: 'weekly' },
    '/gioi-thieu': { priority: 0.5, changeFrequency: 'monthly' },
    '/lien-he': { priority: 0.5, changeFrequency: 'monthly' },
  };

  const staticPages = data.staticPages ?? Object.keys(staticDefaults);
  staticPages.forEach((path) => {
    const meta = staticDefaults[path] ?? { priority: 0.5, changeFrequency: 'monthly' as const };
    entries.push({
      url: `${siteUrl}${path}`,
      priority: meta.priority,
      changeFrequency: meta.changeFrequency,
    });
  });

  // ── Product detail pages ──────────────────────────────────────
  (data.products ?? []).forEach(({ slug, updatedAt }) => {
    if (!slug) return;
    entries.push({
      url: `${siteUrl}/san-pham/${slug}`,
      lastModified: updatedAt ? new Date(updatedAt) : undefined,
      priority: 0.8,
      changeFrequency: 'weekly',
    });
  });

  // ── Category pages (filtered view) ───────────────────────────
  (data.categories ?? []).forEach(({ slug }) => {
    if (!slug) return;
    entries.push({
      url: `${siteUrl}/san-pham?categorySlugs=${encodeURIComponent(slug)}`,
      priority: 0.7,
      changeFrequency: 'weekly',
    });
  });

  // ── Blog post pages ───────────────────────────────────────────
  (data.blogPosts ?? []).forEach(({ slug, updatedAt }) => {
    if (!slug) return;
    entries.push({
      url: `${siteUrl}/blog/${slug}`,
      lastModified: updatedAt ? new Date(updatedAt) : undefined,
      priority: 0.6,
      changeFrequency: 'monthly',
    });
  });

  return entries;
}
