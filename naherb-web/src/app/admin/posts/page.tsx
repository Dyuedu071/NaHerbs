"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AXIOS_INSTANCE } from '@/services/api-client';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'ARCHIVED';
  createdAt: string;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  thumbnailUrl?: string;
  thumbnailMediaId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminPosts() {
  const router = useRouter();

  // State variables
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Deletion Modal
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Custom Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0); // Reset page on search change
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await AXIOS_INSTANCE.get('/v1/admin/blog/categories');
        const data = res.data?.data?.items || res.data?.data || res.data;
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch blog posts when filters or page changes
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page,
        size,
      };
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      if (categoryId) {
        params.categoryId = categoryId;
      }

      const res = await AXIOS_INSTANCE.get('/v1/admin/blog', { params });
      
      const postsList = res.data?.content || res.data?.data?.items || res.data?.data || [];
      const totalP = res.data?.totalPages || res.data?.data?.totalPages || 0;
      const totalE = res.data?.totalElements || res.data?.data?.totalElements || 0;

      setPosts(Array.isArray(postsList) ? postsList : []);
      setTotalPages(totalP);
      setTotalElements(totalE);
    } catch (err) {
      console.error('Error fetching posts:', err);
      showToast('Không thể tải danh sách bài viết từ database.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, debouncedSearch, categoryId]);

  // Handle post deletion
  const handleDelete = async () => {
    if (!deletePostId) return;
    setIsDeleting(true);
    try {
      await AXIOS_INSTANCE.delete(`/v1/admin/blog/${deletePostId}`);
      showToast('Xóa bài viết thành công!', 'success');
      setDeletePostId(null);
      // Fetch current page again, or adjust if last item on page is deleted
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      showToast('Lỗi khi xóa bài viết. Vui lòng thử lại.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <main className="flex-1 p-gutter max-w-container-max mx-auto w-full flex flex-col gap-md relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-xs px-md py-sm rounded-lg shadow-ambient-lg border animate-fade-in transition-all ${
          toast.type === 'success' 
            ? 'bg-success-bg text-primary border-green-200' 
            : 'bg-error-container text-error border-red-200'
        }`}>
          <span className="material-symbols-outlined text-[20px]">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="text-label-md font-label-md">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-end mb-sm">
        <div>
          <h1 className="text-headline-md font-headline-md text-primary mb-xs">
            Quản lý bài viết
          </h1>
          <p className="text-body-md font-body-md text-text-muted">
            Quản lý các bài viết chăm sóc sức khỏe, trạng thái SEO và lịch xuất bản.
          </p>
        </div>
        <Link 
          href="/admin/posts/create"
          className="px-md py-sm bg-primary text-on-primary rounded-full text-label-md font-label-md hover:bg-secondary transition-all shadow-ambient-md flex items-center gap-xs hover:-translate-y-0.5">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Viết bài mới
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-lowest p-sm rounded-xl shadow-ambient-sm border border-border-warm flex gap-sm items-center">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-lg border border-border-warm focus:ring-1 focus:ring-primary focus:border-primary text-body-md font-body-md outline-none transition-colors"
            placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-64">
          <select 
            className="w-full pl-4 pr-10 py-2.5 bg-surface rounded-lg border border-border-warm focus:ring-1 focus:ring-primary focus:border-primary text-body-md font-body-md appearance-none outline-none transition-colors cursor-pointer"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(0);
            }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      {/* Blog Table Card */}
      <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient-sm border border-herbal-beige overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-border-warm">
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold w-16">
                  Hình ảnh
                </th>
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold">
                  Tiêu đề bài viết
                </th>
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold">
                  Danh mục
                </th>
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold">
                  Trạng thái
                </th>
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold">
                  Ngày đăng
                </th>
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold">
                  SEO
                </th>
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold text-center">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-warm">
              {isLoading ? (
                // Loading Skeletons
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-sm">
                      <div className="w-12 h-12 rounded-lg bg-surface-container border border-border-warm"></div>
                    </td>
                    <td className="p-sm">
                      <div className="h-4 bg-surface-container rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-surface-container rounded w-1/2"></div>
                    </td>
                    <td className="p-sm">
                      <div className="h-4 bg-surface-container rounded w-16"></div>
                    </td>
                    <td className="p-sm">
                      <div className="h-6 bg-surface-container rounded-full w-20"></div>
                    </td>
                    <td className="p-sm">
                      <div className="h-4 bg-surface-container rounded w-20"></div>
                    </td>
                    <td className="p-sm">
                      <div className="h-6 bg-surface-container rounded-full w-16"></div>
                    </td>
                    <td className="p-sm">
                      <div className="h-8 bg-surface-container rounded-full w-24 mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : posts.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={7} className="p-xl text-center">
                    <div className="flex flex-col items-center justify-center gap-xs text-text-muted">
                      <span className="material-symbols-outlined text-[48px] text-border-warm">
                        article_off
                      </span>
                      <p className="text-body-lg font-body-lg font-semibold">Không tìm thấy bài viết nào</p>
                      <p className="text-body-md">Thử thay đổi bộ lọc tìm kiếm hoặc viết một bài viết mới.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => {
                  // Determine status styling
                  let statusBg = 'bg-surface-container-high text-text-muted border-border-warm';
                  let statusText = 'Draft';
                  if (post.status === 'PUBLISHED') {
                    statusBg = 'bg-success-bg text-primary border-green-200';
                    statusText = 'Published';
                  } else if (post.status === 'HIDDEN') {
                    statusBg = 'bg-surface-container text-text-muted border-border-warm';
                    statusText = 'Hidden';
                  } else if (post.status === 'ARCHIVED') {
                    statusBg = 'bg-error-container text-error border-red-200';
                    statusText = 'Archived';
                  }

                  // Determine SEO status
                  const hasSEO = post.seoTitle && post.seoDescription;

                  return (
                    <tr key={post.id} className="hover:bg-surface/50 transition-colors group">
                      <td className="p-sm">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-border-warm bg-herbal-beige flex items-center justify-center text-primary relative">
                          {post.thumbnailUrl ? (
                            <img 
                              src={post.thumbnailUrl} 
                              alt={post.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-[24px]">article</span>
                          )}
                        </div>
                      </td>
                      <td className="p-sm max-w-xs md:max-w-md">
                        <p className="text-body-md font-body-md font-semibold text-text-main line-clamp-1">
                          {post.title}
                        </p>
                        <p className="text-caption font-caption text-text-muted line-clamp-1">
                          {post.summary || 'Không có mô tả tóm tắt...'}
                        </p>
                      </td>
                      <td className="p-sm text-body-md font-body-md text-text-main">
                        {post.category?.name || 'Chưa phân loại'}
                      </td>
                      <td className="p-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-caption font-label-md font-semibold ${statusBg}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="p-sm text-body-md font-body-md text-text-muted">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </td>
                      <td className="p-sm">
                        {hasSEO ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-success-bg text-primary text-caption font-label-md font-semibold gap-1 border border-green-200">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Tốt
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-text-muted text-caption font-label-md font-semibold gap-1 border border-border-warm">
                            <span className="material-symbols-outlined text-[14px]">pending</span>
                            Chưa tối ưu
                          </span>
                        )}
                      </td>
                      <td className="p-sm">
                        <div className="flex justify-center gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/admin/posts/create?id=${post.id}`}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:bg-secondary-container/30 transition-colors"
                            title="Chỉnh sửa bài viết"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </Link>
                          <Link
                            href={post.status === 'PUBLISHED' ? `/blog/${post.slug}` : `/admin/posts/preview?id=${post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:bg-secondary-container/30 transition-colors"
                            title={post.status === 'PUBLISHED' ? "Xem chi tiết công khai" : "Xem trước bản nháp"}
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </Link>
                          <button
                            onClick={() => setDeletePostId(post.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-error hover:bg-error-container/30 transition-colors"
                            title="Xóa bài viết"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="p-sm border-t border-border-warm flex justify-between items-center bg-surface-container-lowest">
            <p className="text-caption font-caption text-text-muted">
              Hiển thị {page * size + 1} đến {Math.min((page + 1) * size, totalElements)} trong số {totalElements} bài viết
            </p>
            <div className="flex gap-1">
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-warm text-text-muted hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                disabled={page === 0}
                onClick={() => setPage(p => Math.max(0, p - 1))}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border font-label-md text-label-md transition-colors ${
                    page === idx 
                      ? 'border-primary bg-primary text-on-primary' 
                      : 'border-border-warm text-text-main hover:border-primary hover:text-primary'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-warm text-text-muted hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                disabled={page === totalPages - 1}
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletePostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-3xl p-lg border border-border-warm shadow-ambient-lg max-w-md w-full mx-md flex flex-col gap-md">
            <div className="flex items-center gap-sm text-error">
              <span className="material-symbols-outlined text-[32px]">warning</span>
              <h3 className="text-headline-sm font-headline-sm">Xác nhận xóa bài viết</h3>
            </div>
            <p className="text-body-md font-body-md text-text-main">
              Bạn có chắc chắn muốn xóa bài viết này không? Bài viết và toàn bộ liên kết sản phẩm của nó sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu. Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-sm">
              <button
                onClick={() => setDeletePostId(null)}
                disabled={isDeleting}
                className="px-md py-sm border border-border-warm rounded-full text-label-md font-label-md hover:bg-surface-container transition-colors text-text-main disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-md py-sm bg-error text-on-error rounded-full text-label-md font-label-md hover:bg-red-700 transition-all flex items-center gap-xs disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xóa...
                  </>
                ) : (
                  'Xóa bài viết'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
