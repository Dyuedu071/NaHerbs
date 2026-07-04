"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AXIOS_INSTANCE } from '@/services/api-client';

interface BlogDetailProps {
  params: Promise<{ slug: string }> | { slug: string };
}

interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl?: string;
  price?: number;
  status?: string;
}

interface BlogPostDetail {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  createdAt: string;
  thumbnailUrl?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  products?: ProductSummary[];
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  createdAt: string;
  category?: { name: string; slug: string };
}

export default function BlogDetail({ params }: BlogDetailProps) {
  const resolvedParams = 'then' in params ? use(params) : params;
  const slug = resolvedParams.slug;

  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await AXIOS_INSTANCE.get(`/v1/blogs/${slug}`);
        const data = res.data?.data || res.data;
        if (data) {
          setPost(data);
          // Fetch related posts from same category
          try {
            const relRes = await AXIOS_INSTANCE.get(`/v1/blogs?page=0&size=4${data.category ? `&categorySlug=${data.category.slug}` : ''}`);
            const relData = relRes.data?.content || relRes.data?.data?.content || [];
            setRelatedPosts(relData.filter((p: RelatedPost) => p.slug !== slug).slice(0, 3));
          } catch { /* ignore */ }
        } else {
          setError("Bài viết không tồn tại hoặc đã bị gỡ bỏ.");
        }
      } catch {
        setError("Không thể tải nội dung bài viết. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const estimateReadTime = (content: string) => {
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <>
      <style>{`
        .blog-content h2 {
          font-family: 'Merriweather', serif;
          font-size: 28px;
          color: #37563b;
          margin-top: 48px;
          margin-bottom: 24px;
          font-weight: 700;
        }
        .blog-content h3 {
          font-family: 'Merriweather', serif;
          font-size: 22px;
          color: #37563b;
          margin-top: 36px;
          margin-bottom: 16px;
          font-weight: 700;
        }
        .blog-content p {
          margin-bottom: 24px;
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          line-height: 1.7;
          color: #424841;
        }
        .blog-content blockquote {
          border-left: 4px solid #A8BFA3;
          padding-left: 24px;
          margin: 32px 0;
          font-style: italic;
          color: #45664f;
          font-size: 20px;
        }
        .blog-content ul {
          list-style-type: disc;
          padding-left: 24px;
          margin-bottom: 24px;
        }
        .blog-content ol {
          list-style-type: decimal;
          padding-left: 24px;
          margin-bottom: 24px;
        }
        .blog-content li {
          margin-bottom: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          line-height: 1.7;
          color: #424841;
        }
        .blog-content img {
          border-radius: 12px;
          width: 100%;
          height: auto;
          margin: 24px 0;
          border: 1px solid #DDD0BC;
        }
        .blog-content strong {
          color: #37563b;
          font-weight: 600;
        }
        .blog-content a {
          color: #45664f;
          text-decoration: underline;
        }
      `}</style>

      

      <main className="flex-grow pt-[120px] pb-xl px-sm md:px-gutter bg-background">

        {loading ? (
          <div className="max-w-[820px] mx-auto py-xl flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-md"></div>
            <p className="text-body-md text-text-muted">Đang tải nội dung bài viết...</p>
          </div>
        ) : error || !post ? (
          <div className="max-w-[820px] mx-auto py-xl text-center min-h-[400px] flex flex-col justify-center items-center gap-md">
            <span className="material-symbols-outlined text-[64px] text-error">error</span>
            <h2 className="text-headline-md font-headline-md text-primary">{error || "Không tìm thấy bài viết"}</h2>
            <Link href="/blog" className="px-lg py-sm bg-primary text-on-primary rounded-full font-label-md text-label-md hover:opacity-90 transition-opacity">
              Quay lại cẩm nang
            </Link>
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            <div className="max-w-[820px] mx-auto mb-md flex items-center gap-xs text-text-muted font-caption text-caption flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-on-surface line-clamp-1">{post.title}</span>
            </div>

            {/* Article */}
            <article className="max-w-[820px] mx-auto">
              {/* Article Header */}
              <header className="mb-lg">
                {post.category && (
                  <span className="inline-block bg-success-bg text-primary px-3 py-1 rounded-full font-caption text-caption mb-sm">
                    {post.category.name}
                  </span>
                )}
                <h1 className="font-headline-lg text-headline-lg md:text-[48px] text-primary mb-md leading-tight">
                  {post.title}
                </h1>
                {/* Author row */}
                <div className="flex items-center gap-sm">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center border border-border-warm overflow-hidden flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface">Ban biên tập NaHerbs</div>
                    <div className="font-caption text-caption text-text-muted flex items-center gap-xs">
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      <span className="w-1 h-1 bg-border-warm rounded-full inline-block"></span>
                      <span>{estimateReadTime(post.content)} phút đọc</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {post.thumbnailUrl && (
                <div className="mb-lg rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(55,86,59,0.08),0_4px_16px_-4px_rgba(55,86,59,0.04)] aspect-video">
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Summary as intro */}
              {post.summary && (
                <p className="text-[18px] leading-[1.7] text-on-surface-variant mb-[24px] font-inter">
                  {post.summary}
                </p>
              )}

              {/* Blog Content */}
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Health Disclaimer */}
              <div className="mt-lg p-md bg-surface-container-low rounded-xl border border-border-warm shadow-[0_2px_8px_-2px_rgba(55,86,59,0.08)] flex gap-md items-start">
                <div className="bg-primary-container text-on-primary-container p-2 rounded-full flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined">info</span>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-primary mb-2">Lưu ý y tế</h4>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Thông tin trong bài viết chỉ mang tính chất tham khảo và không thay thế cho lời khuyên, chẩn đoán hoặc điều trị y khoa chuyên nghiệp.
                    Vui lòng tham khảo ý kiến bác sĩ trước khi sử dụng bất kỳ sản phẩm thảo dược nào, đặc biệt nếu bạn đang mang thai hoặc điều trị bệnh.
                  </p>
                </div>
              </div>

              {/* Share and Tags */}
              <div className="mt-md flex flex-wrap justify-between items-center py-sm border-t border-b border-border-warm gap-sm">
                <div className="flex gap-sm flex-wrap items-center">
                  <span className="font-label-md text-label-md text-on-surface-variant flex items-center">Tags:</span>
                  {post.category && (
                    <Link
                      href={`/blog?category=${post.category.slug}`}
                      className="text-sm bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md hover:bg-secondary-container transition-colors"
                    >
                      {post.category.name}
                    </Link>
                  )}
                  <span className="text-sm bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md hover:bg-secondary-container transition-colors cursor-pointer">
                    NaHerbs
                  </span>
                </div>
                <div className="flex gap-sm items-center">
                  <span className="font-label-md text-label-md text-on-surface-variant">Chia sẻ:</span>
                  <button
                    onClick={handleShare}
                    className="w-8 h-8 rounded-full bg-surface-variant text-on-surface flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors relative"
                    title="Chia sẻ bài viết"
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                    {copySuccess && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[11px] px-2 py-1 rounded whitespace-nowrap">
                        Đã sao chép!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </article>

            {/* Related Products */}
            {post.products && post.products.length > 0 && (
              <section className="max-w-container-max mx-auto mt-xl">
                <h3 className="font-headline-md text-headline-md text-primary mb-md text-center">Sản Phẩm Đề Xuất Cho Bạn</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                  {post.products.map((product) => (
                    <Link key={product.id} href={`/san-pham/${product.slug}`} className="group block">
                      <div className="bg-surface rounded-xl shadow-[0_2px_8px_-2px_rgba(55,86,59,0.08),0_4px_16px_-4px_rgba(55,86,59,0.04)] border border-herbal-beige overflow-hidden hover:shadow-[0_4px_12px_-2px_rgba(55,86,59,0.12),0_8px_24px_-4px_rgba(55,86,59,0.08)] transition-shadow duration-300 flex flex-col h-full">
                        <div className="relative aspect-square overflow-hidden bg-surface-container-low p-sm">
                          {product.thumbnailUrl ? (
                            <img
                              src={product.thumbnailUrl}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-[64px] opacity-30">spa</span>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 z-10 bg-success-bg text-primary px-2 py-1 rounded-full font-caption text-caption">
                            Còn hàng
                          </div>
                        </div>
                        <div className="p-md flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="font-label-md text-label-md text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-2">
                              {product.name}
                            </h4>
                            <p className="font-caption text-caption text-text-muted mb-sm line-clamp-2">
                              Sản phẩm thảo dược tự nhiên NaHerbs.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="font-label-md text-label-md text-secondary flex items-center gap-xs">
                              Xem chi tiết
                              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </span>
                            <div className="bg-tertiary-container text-on-primary w-9 h-9 rounded-full flex items-center justify-center hover:bg-tertiary transition-colors">
                              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* AI CTA Banner */}
            <section className="max-w-[820px] mx-auto mt-xl">
              <div className="bg-primary rounded-xl p-lg relative overflow-hidden shadow-[0_4px_12px_-2px_rgba(55,86,59,0.12),0_8px_24px_-4px_rgba(55,86,59,0.08)] flex flex-col md:flex-row items-center justify-between gap-md">
                <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '300px' }}>auto_awesome</span>
                </div>
                <div className="z-10 text-center md:text-left">
                  <h3 className="font-headline-md text-headline-md text-on-primary mb-sm">Bạn cần tư vấn riêng?</h3>
                  <p className="font-body-md text-body-md text-primary-fixed mb-0">Hỏi AI của NaHerbs để tìm ra sản phẩm phù hợp nhất với thể trạng của bạn.</p>
                </div>
                <button className="z-10 bg-on-primary text-primary px-6 py-3 rounded-full font-label-md text-label-md hover:bg-success-bg transition-colors flex items-center gap-2 whitespace-nowrap shadow-[0_2px_8px_-2px_rgba(55,86,59,0.08)]">
                  <span className="material-symbols-outlined">forum</span>
                  Hỏi AI Tư Vấn
                </button>
              </div>
            </section>

            {/* Related Articles */}
            <section className="max-w-container-max mx-auto mt-xl">
              <div className="flex justify-between items-end mb-md border-b border-border-warm pb-sm">
                <h3 className="font-headline-md text-headline-md text-primary">Bài Viết Cùng Chủ Đề</h3>
                <Link href="/blog" className="text-secondary hover:text-primary transition-colors font-label-md text-label-md flex items-center">
                  Xem tất cả <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
                </Link>
              </div>
              {relatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                  {relatedPosts.map((rp) => (
                    <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block">
                      <div className="aspect-video rounded-lg overflow-hidden mb-sm shadow-[0_2px_8px_-2px_rgba(55,86,59,0.08)]">
                        {rp.thumbnailUrl ? (
                          <img
                            src={rp.thumbnailUrl}
                            alt={rp.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-surface-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-[48px] text-text-muted opacity-40">article</span>
                          </div>
                        )}
                      </div>
                      <div className="font-caption text-caption text-text-muted mb-1">{formatDate(rp.publishedAt || rp.createdAt)}</div>
                      <h4 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                        {rp.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group block opacity-50">
                      <div className="aspect-video rounded-lg overflow-hidden mb-sm bg-surface-container animate-pulse"></div>
                      <div className="h-3 w-20 bg-surface-container rounded animate-pulse mb-1"></div>
                      <div className="h-4 w-full bg-surface-container rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      
    </>
  );
}
