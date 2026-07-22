import { MetadataRoute } from 'next';

/**
 * Next.js robots.txt
 * Tự động được serve tại /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://naherb.com.vn';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dang-nhap',
          '/dang-ky',
          '/checkout',
          '/cart',
          '/tai-khoan',
          '/account/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
