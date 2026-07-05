import { MetadataRoute } from 'next';

/**
 * Next.js robots.txt
 * Tự động được serve tại /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://naherbs.vn';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Không cho index các trang admin/auth/checkout
        disallow: ['/admin/', '/dang-nhap', '/dang-ky', '/checkout', '/tai-khoan'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
