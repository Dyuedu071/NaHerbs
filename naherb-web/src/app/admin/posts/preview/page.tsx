"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AXIOS_INSTANCE } from '@/services/api-client';

interface BlogPostDetail {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'ARCHIVED';
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
  products?: Array<{
    id: string;
    name: string;
    slug: string;
    seoTitle?: string;
  }>;
}

export default function AdminPostPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Thiếu mã bài viết (ID).");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await AXIOS_INSTANCE.get(`/v1/admin/blog/${id}`);
        const data = res.data?.data || res.data;
        if (data) {
          setPost(data);
        } else {
          setError("Bài viết không tồn tại.");
        }
      } catch (err: any) {
        console.error("Error fetching preview blog details:", err);
        setError("Không thể tải bản xem trước của bài viết. Vui lòng đăng nhập lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'DRAFT': return { text: 'Bản nháp', style: 'bg-amber-100 text-amber-800 border border-amber-200' };
      case 'PUBLISHED': return { text: 'Đã xuất bản', style: 'bg-green-100 text-green-800 border border-green-200' };
      case 'HIDDEN': return { text: 'Đang ẩn', style: 'bg-slate-100 text-slate-800 border border-slate-200' };
      case 'ARCHIVED': return { text: 'Đã lưu trữ', style: 'bg-red-100 text-red-800 border border-red-200' };
      default: return { text: status || '', style: 'bg-gray-100 text-gray-800 border border-gray-200' };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-container-lowest">
      {/* Sticky Admin Preview Banner */}
      <div className="sticky top-0 z-40 bg-primary-fixed text-on-primary-fixed-variant px-gutter py-sm border-b border-primary-fixed-dim shadow-ambient-sm flex flex-wrap justify-between items-center gap-sm">
        <div className="flex items-center gap-md">
          <Link href="/admin/posts" className="w-9 h-9 flex items-center justify-center rounded-full bg-surface text-primary hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div>
            <h2 className="text-body-lg font-bold text-primary flex items-center gap-xs">
              <span className="material-symbols-outlined">visibility</span>
              Chế độ xem trước bài viết
            </h2>
            <p className="text-caption text-text-muted">Xem giao diện thực tế trước khi xuất bản</p>
          </div>
          {post && (
            <span className={`px-2.5 py-0.5 rounded-full text-caption font-semibold ${getStatusLabel(post.status).style}`}>
              {getStatusLabel(post.status).text}
            </span>
          )}
        </div>
        
        <div className="flex gap-sm">
          {post && (
            <Link 
              href={`/admin/posts/create?id=${post.id}`}
              className="px-md py-1.5 bg-primary text-on-primary rounded-full text-label-md font-label-md hover:bg-secondary transition-all flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Chỉnh sửa bài viết
            </Link>
          )}
          <Link 
            href="/admin/posts" 
            className="px-md py-1.5 bg-surface text-primary border border-primary rounded-full text-label-md font-label-md hover:bg-surface-variant transition-colors"
          >
            Quản lý bài viết
          </Link>
        </div>
      </div>

      <main className="flex-grow py-xl">
        {loading ? (
          <div className="max-w-container-max mx-auto px-gutter py-xl flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-md"></div>
            <p className="text-body-lg text-text-muted">Đang tải nội dung bản xem trước...</p>
          </div>
        ) : error || !post ? (
          <div className="max-w-container-max mx-auto px-gutter py-xl text-center min-h-[400px] flex flex-col justify-center items-center gap-md">
            <span className="material-symbols-outlined text-[64px] text-error">error</span>
            <h2 className="text-headline-md font-headline-md text-primary">{error || "Không tìm thấy bài viết"}</h2>
            <Link href="/admin/posts" className="px-lg py-sm bg-primary text-on-primary rounded-full hover:bg-secondary transition-colors font-label-md text-label-md">
              Quay lại danh sách bài viết
            </Link>
          </div>
        ) : (
          <article className="max-w-container-max mx-auto px-gutter">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
              {/* Left & Center: Article Content */}
              <div className="lg:col-span-2 flex flex-col gap-md">
                {/* Header Information */}
                <header className="flex flex-col gap-sm">
                  {post.category && (
                    <span className="w-fit px-4 py-1 bg-success-bg text-primary rounded-full font-label-md text-label-md border border-primary/10">
                      {post.category.name}
                    </span>
                  )}
                  <h1 className="font-display-md text-headline-lg lg:text-display-md text-primary font-bold leading-tight">
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-md text-caption font-caption text-text-muted border-b border-border-warm pb-md">
                    <span className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                    <span className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      Ban biên tập NaHerbs (Xem trước)
                    </span>
                  </div>
                </header>

                {/* Thumbnail Image */}
                {post.thumbnailUrl && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-ambient-md border border-border-warm bg-surface-container-low">
                    <img 
                      src={post.thumbnailUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Summary */}
                {post.summary && (
                  <p className="text-body-lg font-body-lg text-text-main font-medium italic border-l-4 border-primary pl-md py-xs bg-primary-fixed/20 rounded-r-lg">
                    {post.summary}
                  </p>
                )}

                {/* Main Text Content */}
                <div 
                  className="prose prose-lg prose-stone max-w-none text-text-main mt-sm
                    prose-headings:text-primary prose-headings:font-headline-md prose-headings:mb-sm
                    prose-p:text-body-lg prose-p:leading-relaxed prose-p:mb-md
                    prose-strong:text-primary prose-strong:font-semibold
                    prose-img:rounded-2xl prose-img:border prose-img:border-border-warm prose-img:my-md
                    prose-ul:list-disc prose-ul:pl-md prose-ul:mb-md
                    prose-ol:list-decimal prose-ol:pl-md prose-ol:mb-md
                    prose-li:text-body-lg prose-li:mb-xs"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Right: Sidebar */}
              <div className="flex flex-col gap-lg">
                {/* Related Products */}
                <div className="bg-surface p-md rounded-2xl border border-herbal-beige shadow-ambient-sm flex flex-col gap-sm">
                  <h3 className="font-headline-md text-headline-md text-primary border-b border-border-warm pb-xs mb-xs flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary">spa</span>
                    Sản phẩm liên quan
                  </h3>
                  
                  {post.products && post.products.length > 0 ? (
                    <div className="flex flex-col gap-sm">
                      {post.products.map((product) => (
                        <div key={product.id} className="block group">
                          <div className="bg-surface-container-lowest rounded-xl border border-border-warm p-sm flex items-center gap-sm hover:shadow-ambient-sm transition-all duration-300">
                            <div className="w-12 h-12 rounded-lg bg-herbal-beige flex items-center justify-center text-primary border border-border-warm overflow-hidden flex-shrink-0">
                              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-body-md text-body-md text-primary font-medium transition-colors truncate">
                                {product.name}
                              </h4>
                              <span className="text-caption font-caption text-text-muted flex items-center gap-2xs mt-xs">
                                Liên kết sản phẩm
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-body-md text-text-muted italic">
                      Bài viết chưa liên kết với sản phẩm nào.
                    </p>
                  )}
                </div>

                {/* SEO Metadata Box */}
                <div className="bg-surface p-md rounded-2xl border border-border-warm shadow-ambient-sm flex flex-col gap-sm">
                  <h3 className="font-headline-md text-headline-md text-primary border-b border-border-warm pb-xs mb-xs flex items-center gap-xs">
                    <span className="material-symbols-outlined">travel_explore</span>
                    Cấu hình SEO (Xem trước)
                  </h3>
                  <div className="flex flex-col gap-xs text-body-md text-text-main">
                    <p><strong>Tiêu đề SEO:</strong> {post.seoTitle || post.title}</p>
                    <p className="mt-xs"><strong>Mô tả SEO:</strong></p>
                    <p className="text-text-muted text-body-sm bg-surface-container-low p-xs rounded border border-border-warm mt-2xs">
                      {post.seoDescription || "Chưa thiết lập mô tả SEO."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
