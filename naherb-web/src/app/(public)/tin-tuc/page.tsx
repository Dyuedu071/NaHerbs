import type { Metadata } from "next";
import TinTucClient from "./_components/TinTucClient";
import { fetchBlogCategories, fetchBlogPosts } from "@/lib/blog-api";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Tin tức & Cẩm nang sức khỏe",
  description:
    "Khám phá bí quyết chăm sóc sức khỏe tự nhiên, mẹo thảo dược và lối sống cân bằng từ NaHerbs.",
  path: "/tin-tuc",
});

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function TinTucPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolved = await searchParams;
  const category =
    typeof resolved.category === "string" ? resolved.category : "";
  const pageRaw = typeof resolved.page === "string" ? parseInt(resolved.page, 10) : 0;
  const page = Number.isFinite(pageRaw) && pageRaw >= 0 ? pageRaw : 0;

  const [pageData, categories] = await Promise.all([
    fetchBlogPosts({ page, size: 9, categorySlug: category || undefined }),
    fetchBlogCategories(),
  ]);

  return (
    <TinTucClient
      initialPosts={pageData.content}
      initialPageData={pageData}
      categories={categories}
      initialCategory={category}
      initialPage={page}
    />
  );
}
