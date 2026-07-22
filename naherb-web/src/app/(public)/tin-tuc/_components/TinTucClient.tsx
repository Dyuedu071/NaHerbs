"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BlogCategory, BlogPageData, BlogPostSummary } from "@/lib/blog-api";
import { absoluteImageUrl } from "@/lib/seo";
import { AXIOS_INSTANCE } from "@/services/api-client";

type TinTucClientProps = {
  initialPosts: BlogPostSummary[];
  initialPageData: BlogPageData;
  categories: BlogCategory[];
  initialCategory: string;
  initialPage: number;
};

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function TinTucClient({
  initialPosts,
  initialPageData,
  categories,
  initialCategory,
  initialPage,
}: TinTucClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [posts, setPosts] = useState(initialPosts);
  const [pageData, setPageData] = useState(initialPageData);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPosts(initialPosts);
    setPageData(initialPageData);
    setCurrentPage(initialPage);
    setActiveCategory(initialCategory);
  }, [initialPosts, initialPageData, initialPage, initialCategory]);

  const syncUrl = (page: number, category: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (page > 0) params.set("page", String(page));
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/tin-tuc?${qs}` : "/tin-tuc", { scroll: false });
    });
  };

  const fetchPosts = async (page: number, category: string, search: string) => {
    setLoading(true);
    try {
      let url = `/v1/blogs?page=${page}&size=9`;
      if (category) url += `&categorySlug=${encodeURIComponent(category)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await AXIOS_INSTANCE.get(url);
      const data = res.data?.data || res.data;
      if (data?.content) {
        setPosts(data.content);
        setPageData(data);
      }
    } catch (error) {
      console.error("Error fetching blogs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery) return;
    const timeoutId = setTimeout(() => {
      fetchPosts(0, activeCategory, searchQuery);
      setCurrentPage(0);
    }, 300);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    setCurrentPage(0);
    setSearchQuery("");
    syncUrl(0, slug);
    if (slug === initialCategory && !searchQuery) {
      setPosts(initialPosts);
      setPageData(initialPageData);
    } else {
      fetchPosts(0, slug, "");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchQuery("");
    syncUrl(page, activeCategory);
    fetchPosts(page, activeCategory, "");
  };

  const isDefaultView = currentPage === 0 && !activeCategory && !searchQuery;
  let featuredPost: BlogPostSummary | null = null;
  let gridPosts = posts;

  if (isDefaultView && posts.length > 0) {
    const featuredIndex = posts.findIndex((p) => p.featured || p.isFeatured);
    if (featuredIndex !== -1) {
      featuredPost = posts[featuredIndex];
      gridPosts = posts.filter((_, i) => i !== featuredIndex);
    } else {
      featuredPost = posts[0];
      gridPosts = posts.slice(1);
    }
  }

  const busy = loading || isPending;

  return (
    <main className="flex-grow pt-20">
      <section className="w-full bg-surface py-xl px-gutter">
        <div className="max-w-container-max mx-auto text-center">
          <h1 className="font-display-lg text-display-lg text-primary mb-md">
            Cẩm nang Sức khỏe NaHerbs
          </h1>
          <p className="font-body-lg text-body-lg text-text-muted max-w-2xl mx-auto">
            Khám phá những bí quyết chăm sóc sức khỏe tự nhiên, từ các bài thuốc dân gian đến mẹo
            vặt hàng ngày với thảo dược thiên nhiên, giúp bạn duy trì một lối sống cân bằng và an
            lành.
          </p>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-gutter pb-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-md mb-xl">
          <div className="flex flex-wrap gap-xs">
            <button
              type="button"
              onClick={() => handleCategoryClick("")}
              className={`px-6 py-3 rounded-full font-label-md text-label-md transition-all duration-200 shadow-level-1 ${
                activeCategory === ""
                  ? "bg-primary text-on-primary"
                  : "bg-surface border border-border-warm text-secondary hover:border-primary hover:text-primary"
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`px-6 py-3 rounded-full font-label-md text-label-md transition-all duration-200 shadow-level-1 ${
                  activeCategory === cat.slug
                    ? "bg-primary text-on-primary"
                    : "bg-surface border border-border-warm text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80 group">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-full bg-surface border border-border-warm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 font-body-md text-body-md placeholder-text-muted shadow-level-1 group-hover:shadow-level-2"
              placeholder="Tìm kiếm bài viết..."
              type="search"
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
              search
            </span>
          </div>
        </div>

        {busy ? (
          <div className="flex justify-center items-center py-xl min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-xl min-h-[400px]">
            <span className="material-symbols-outlined text-[64px] text-text-muted mb-sm">
              article
            </span>
            <h2 className="font-headline-md text-headline-md text-primary mb-xs">
              Không tìm thấy bài viết nào
            </h2>
            <p className="font-body-md text-body-md text-text-muted">
              Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
            </p>
          </div>
        ) : (
          <>
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="block relative rounded-2xl overflow-hidden shadow-level-2 group cursor-pointer h-[500px] mb-xl"
              >
                <div className="absolute inset-0">
                  {featuredPost.thumbnailUrl ? (
                    <Image
                      src={
                        absoluteImageUrl(featuredPost.thumbnailUrl) ||
                        featuredPost.thumbnailUrl
                      }
                      alt={featuredPost.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="100vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-container" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-lg w-full md:w-2/3">
                  <span className="inline-block px-4 py-1.5 bg-success-bg/90 backdrop-blur-sm text-primary rounded-full font-label-md text-label-md mb-md">
                    Bài viết nổi bật
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-primary mb-md group-hover:text-secondary-fixed transition-colors">
                    {featuredPost.title}
                  </h2>
                  {featuredPost.summary && (
                    <p className="font-body-md text-body-md text-on-primary/90 mb-md line-clamp-2">
                      {featuredPost.summary}
                    </p>
                  )}
                </div>
              </Link>
            )}

            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {gridPosts.map((post) => (
                  <Link
                    href={`/blog/${post.slug}`}
                    key={post.id}
                    className="bg-surface rounded-2xl overflow-hidden shadow-level-1 border border-herbal-beige hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                  >
                    <div className="relative w-full pt-[56.25%] overflow-hidden bg-surface-container-low">
                      {post.thumbnailUrl ? (
                        <Image
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          alt={post.title}
                          src={absoluteImageUrl(post.thumbnailUrl) || post.thumbnailUrl}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                          <span className="material-symbols-outlined text-[48px] opacity-30">
                            article
                          </span>
                        </div>
                      )}
                      {post.category && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-surface/90 backdrop-blur-sm rounded-full font-caption text-caption text-primary">
                          {post.category.name}
                        </div>
                      )}
                    </div>
                    <div className="p-md flex flex-col flex-grow">
                      <time className="font-caption text-caption text-text-muted mb-xs block">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </time>
                      <h3 className="font-headline-md text-headline-md text-primary mb-sm line-clamp-2 group-hover:text-earth-brown transition-colors">
                        {post.title}
                      </h3>
                      {post.summary && (
                        <p className="font-body-md text-body-md text-text-muted line-clamp-3 mb-md flex-grow">
                          {post.summary}
                        </p>
                      )}
                      <div className="inline-flex items-center gap-xs font-label-md text-label-md text-earth-brown group-hover:text-primary transition-colors mt-auto">
                        Đọc tiếp{" "}
                        <span className="material-symbols-outlined text-[16px]">
                          arrow_right_alt
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {pageData.totalPages > 1 && (
              <div className="flex justify-center items-center gap-xs mt-xl">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-variant transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>

                {[...Array(pageData.totalPages)].map((_, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handlePageChange(idx)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-label-md text-label-md transition-colors ${
                      currentPage === idx
                        ? "bg-primary text-on-primary shadow-level-1"
                        : "text-secondary hover:bg-surface-variant"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(Math.min(pageData.totalPages - 1, currentPage + 1))
                  }
                  disabled={currentPage === pageData.totalPages - 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-variant transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
