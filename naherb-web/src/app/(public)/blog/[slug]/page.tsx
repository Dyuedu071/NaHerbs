import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import {
  fetchBlogPostBySlug,
  fetchBlogPosts,
  type BlogPostSummary,
} from "@/lib/blog-api";
import {
  absoluteImageUrl,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo";
import BlogShareButton from "./_components/BlogShareButton";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function estimateReadTime(content: string) {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);
  if (!post) {
    return buildPageMetadata({
      title: "Bài viết không tồn tại",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.summary,
    path: `/blog/${post.slug}`,
    image: post.thumbnailUrl,
    type: "article",
    absoluteTitle: Boolean(post.seoTitle),
    publishedTime: post.publishedAt || post.createdAt,
    modifiedTime: post.updatedAt || post.publishedAt || post.createdAt,
    keywords: post.primaryKeyword,
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);
  if (!post) notFound();

  let relatedPosts: BlogPostSummary[] = [];
  try {
    const related = await fetchBlogPosts({
      page: 0,
      size: 4,
      categorySlug: post.category?.slug,
    });
    relatedPosts = related.content.filter((p) => p.slug !== slug).slice(0, 3);
  } catch {
    relatedPosts = [];
  }

  return (
    <>
      <JsonLd
        data={[
          buildArticleJsonLd({
            title: post.title,
            slug: post.slug,
            description: post.seoDescription || post.summary,
            image: post.thumbnailUrl,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            createdAt: post.createdAt,
          }),
          buildBreadcrumbJsonLd([
            { name: "Trang chủ", path: "/" },
            { name: "Tin tức", path: "/tin-tuc" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

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
        <nav
          aria-label="Breadcrumb"
          className="max-w-[820px] mx-auto mb-md flex items-center gap-xs text-text-muted font-caption text-caption flex-wrap"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link href="/tin-tuc" className="hover:text-primary transition-colors">
            Tin tức
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface line-clamp-1">{post.title}</span>
        </nav>

        <article className="max-w-[820px] mx-auto">
          <header className="mb-lg">
            {post.category && (
              <Link
                href={`/tin-tuc?category=${post.category.slug}`}
                className="inline-block bg-success-bg text-primary px-3 py-1 rounded-full font-caption text-caption mb-sm"
              >
                {post.category.name}
              </Link>
            )}
            <h1 className="font-headline-lg text-headline-lg md:text-[48px] text-primary mb-md leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-sm">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center border border-border-warm overflow-hidden flex-shrink-0">
                <span
                  className="material-symbols-outlined text-primary text-[28px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_circle
                </span>
              </div>
              <div>
                <div className="font-label-md text-label-md text-on-surface">
                  Ban biên tập NaHerbs
                </div>
                <div className="font-caption text-caption text-text-muted flex items-center gap-xs">
                  <time dateTime={post.publishedAt || post.createdAt}>
                    {formatDate(post.publishedAt || post.createdAt)}
                  </time>
                  <span className="w-1 h-1 bg-border-warm rounded-full inline-block" />
                  <span>{estimateReadTime(post.content)} phút đọc</span>
                </div>
              </div>
            </div>
          </header>

          {post.thumbnailUrl && (
            <div className="mb-lg relative rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(55,86,59,0.08),0_4px_16px_-4px_rgba(55,86,59,0.04)] aspect-video">
              <Image
                src={absoluteImageUrl(post.thumbnailUrl) || post.thumbnailUrl}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 820px) 100vw, 820px"
              />
            </div>
          )}

          {post.summary && (
            <p className="text-[18px] leading-[1.7] text-on-surface-variant mb-[24px] font-inter">
              {post.summary}
            </p>
          )}

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-lg p-md bg-surface-container-low rounded-xl border border-border-warm shadow-[0_2px_8px_-2px_rgba(55,86,59,0.08)] flex gap-md items-start">
            <div className="bg-primary-container text-on-primary-container p-2 rounded-full flex-shrink-0 mt-1">
              <span className="material-symbols-outlined">info</span>
            </div>
            <div>
              <h2 className="font-label-md text-label-md text-primary mb-2">Lưu ý y tế</h2>
              <p className="font-caption text-caption text-on-surface-variant">
                Thông tin trong bài viết chỉ mang tính chất tham khảo và không thay thế cho lời
                khuyên, chẩn đoán hoặc điều trị y khoa chuyên nghiệp. Vui lòng tham khảo ý kiến
                bác sĩ trước khi sử dụng bất kỳ sản phẩm thảo dược nào, đặc biệt nếu bạn đang mang
                thai hoặc điều trị bệnh.
              </p>
            </div>
          </div>

          <div className="mt-md flex flex-wrap justify-between items-center py-sm border-t border-b border-border-warm gap-sm">
            <div className="flex gap-sm flex-wrap items-center">
              <span className="font-label-md text-label-md text-on-surface-variant flex items-center">
                Tags:
              </span>
              {post.category && (
                <Link
                  href={`/tin-tuc?category=${post.category.slug}`}
                  className="text-sm bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md hover:bg-secondary-container transition-colors"
                >
                  {post.category.name}
                </Link>
              )}
              <span className="text-sm bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md">
                NaHerbs
              </span>
            </div>
            <div className="flex gap-sm items-center">
              <span className="font-label-md text-label-md text-on-surface-variant">Chia sẻ:</span>
              <BlogShareButton title={post.title} />
            </div>
          </div>
        </article>

        {post.products && post.products.length > 0 && (
          <section className="max-w-container-max mx-auto mt-xl">
            <h2 className="font-headline-md text-headline-md text-primary mb-md text-center">
              Sản Phẩm Đề Xuất Cho Bạn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {post.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/san-pham/${product.slug}`}
                  className="group block"
                >
                  <div className="bg-surface rounded-xl shadow-[0_2px_8px_-2px_rgba(55,86,59,0.08),0_4px_16px_-4px_rgba(55,86,59,0.04)] border border-herbal-beige overflow-hidden hover:shadow-[0_4px_12px_-2px_rgba(55,86,59,0.12),0_8px_24px_-4px_rgba(55,86,59,0.08)] transition-shadow duration-300 flex flex-col h-full">
                    <div className="relative aspect-square overflow-hidden bg-surface-container-low p-sm">
                      {product.thumbnailUrl ? (
                        <Image
                          src={
                            absoluteImageUrl(product.thumbnailUrl) || product.thumbnailUrl
                          }
                          alt={product.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[64px] opacity-30">
                            spa
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-md flex-grow flex flex-col justify-between">
                      <h3 className="font-label-md text-label-md text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <span className="font-label-md text-label-md text-secondary flex items-center gap-xs mt-sm">
                        Xem chi tiết
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="max-w-container-max mx-auto mt-xl">
          <div className="flex justify-between items-end mb-md border-b border-border-warm pb-sm">
            <h2 className="font-headline-md text-headline-md text-primary">
              Bài Viết Cùng Chủ Đề
            </h2>
            <Link
              href="/tin-tuc"
              className="text-secondary hover:text-primary transition-colors font-label-md text-label-md flex items-center"
            >
              Xem tất cả{" "}
              <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
            </Link>
          </div>
          {relatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block">
                  <div className="aspect-video relative rounded-lg overflow-hidden mb-sm shadow-[0_2px_8px_-2px_rgba(55,86,59,0.08)] bg-surface-container">
                    {rp.thumbnailUrl ? (
                      <Image
                        src={absoluteImageUrl(rp.thumbnailUrl) || rp.thumbnailUrl}
                        alt={rp.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[48px] text-text-muted opacity-40">
                          article
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="font-caption text-caption text-text-muted mb-1">
                    {formatDate(rp.publishedAt || rp.createdAt)}
                  </div>
                  <h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                    {rp.title}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-body-md text-text-muted">Chưa có bài viết liên quan.</p>
          )}
        </section>
      </main>
    </>
  );
}
