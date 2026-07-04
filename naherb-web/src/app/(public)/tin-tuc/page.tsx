"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AXIOS_INSTANCE } from '@/services/api-client';

interface BlogCategory {
    id: string;
    name: string;
    slug: string;
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnailUrl: string;
    category?: BlogCategory;
    createdAt: string;
    publishedAt?: string;
    featured?: boolean;
}

interface PageData {
    content: BlogPost[];
    pageable: { pageNumber: number };
    totalPages: number;
    totalElements: number;
}

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPosts = async (page: number, category: string, search: string) => {
        setLoading(true);
        try {
            let url = `/v1/blogs?page=${page}&size=9`;
            if (category) url += `&categorySlug=${category}`;
            if (search) url += `&search=${search}`;
            
            const res = await AXIOS_INSTANCE.get(url);
            const data = res.data?.data || res.data;
            if (data && data.content) {
                setPosts(data.content);
                setPageData(data);
            }
        } catch (error) {
            console.error("Error fetching blogs", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await AXIOS_INSTANCE.get('/v1/blogs/categories');
            const data = res.data?.data || res.data;
            if (data) {
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCategories();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPosts(currentPage, activeCategory, searchQuery);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [currentPage, activeCategory, searchQuery]);

    const handleCategoryClick = (slug: string) => {
        setActiveCategory(slug);
        setCurrentPage(0);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0);
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Separate featured post if page is 0 and no filters
    const isDefaultView = currentPage === 0 && !activeCategory && !searchQuery;
    let featuredPost = null;
    let gridPosts = posts;

    if (isDefaultView && posts.length > 0) {
        // Try to find an explicitly featured post, otherwise use the first one
        const featuredIndex = posts.findIndex(p => p.featured);
        if (featuredIndex !== -1) {
            featuredPost = posts[featuredIndex];
            gridPosts = posts.filter((_, i) => i !== featuredIndex);
        } else {
            featuredPost = posts[0];
            gridPosts = posts.slice(1);
        }
    }

    return (
        <>
            

            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <section className="w-full bg-surface py-xl px-gutter">
                    <div className="max-w-container-max mx-auto text-center">
                        <h1 className="font-display-lg text-display-lg text-primary mb-md">Cẩm nang Sức khỏe NaHerbs</h1>
                        <p className="font-body-lg text-body-lg text-text-muted max-w-2xl mx-auto">
                            Khám phá những bí quyết chăm sóc sức khỏe tự nhiên, từ các bài thuốc dân gian đến mẹo vặt hàng ngày
                            với thảo dược thiên nhiên, giúp bạn duy trì một lối sống cân bằng và an lành.
                        </p>
                    </div>
                </section>

                <section className="max-w-container-max mx-auto px-gutter pb-xl">
                    {/* Search & Filters */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-md mb-xl">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-xs">
                            <button
                                onClick={() => handleCategoryClick('')}
                                className={`px-6 py-3 rounded-full font-label-md text-label-md transition-all duration-200 shadow-level-1 ${
                                    activeCategory === '' 
                                    ? 'bg-primary text-on-primary' 
                                    : 'bg-surface border border-border-warm text-secondary hover:border-primary hover:text-primary'
                                }`}
                            >
                                Tất cả
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.slug)}
                                    className={`px-6 py-3 rounded-full font-label-md text-label-md transition-all duration-200 shadow-level-1 ${
                                        activeCategory === cat.slug 
                                        ? 'bg-primary text-on-primary' 
                                        : 'bg-surface border border-border-warm text-secondary hover:border-primary hover:text-primary'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                        {/* Search */}
                        <div className="relative w-full md:w-80 group">
                            <input
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full h-12 pl-12 pr-4 rounded-full bg-surface border border-border-warm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 font-body-md text-body-md placeholder-text-muted shadow-level-1 group-hover:shadow-level-2"
                                placeholder="Tìm kiếm bài viết..." 
                                type="text" 
                            />
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                                search
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-xl min-h-[400px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-xl min-h-[400px]">
                            <span className="material-symbols-outlined text-[64px] text-text-muted mb-sm">article</span>
                            <h3 className="font-headline-md text-headline-md text-primary mb-xs">Không tìm thấy bài viết nào</h3>
                            <p className="font-body-md text-body-md text-text-muted">Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
                        </div>
                    ) : (
                        <>
                            {/* Featured Article */}
                            {featuredPost && (
                                <Link href={`/blog/${featuredPost.slug}`} className="block relative rounded-2xl overflow-hidden shadow-level-2 group cursor-pointer h-[500px] mb-xl">
                                    <div className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url('${featuredPost.thumbnailUrl || 'https://via.placeholder.com/1200x600?text=No+Image'}')` }}>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/40 to-transparent"></div>
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
                                        <button className="inline-flex items-center gap-xs font-label-md text-label-md text-on-primary hover:text-secondary-fixed transition-colors">
                                            Xem thêm <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </button>
                                    </div>
                                </Link>
                            )}

                            {/* Blog Grid */}
                            {gridPosts.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                                    {gridPosts.map((post) => (
                                        <Link href={`/blog/${post.slug}`} key={post.id} className="bg-surface rounded-2xl overflow-hidden shadow-level-1 border border-herbal-beige hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                                            <div className="relative w-full pt-[56.25%] overflow-hidden bg-surface-container-low">
                                                {post.thumbnailUrl ? (
                                                    <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        alt={post.title}
                                                        src={post.thumbnailUrl} />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                                                        <span className="material-symbols-outlined text-[48px] opacity-30">article</span>
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
                                                <div className="inline-flex items-center gap-xs font-label-md text-label-md text-earth-brown hover:text-primary transition-colors mt-auto">
                                                    Đọc tiếp <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {pageData && pageData.totalPages > 1 && (
                                <div className="flex justify-center items-center gap-xs mt-xl">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                        disabled={currentPage === 0}
                                        className="w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-variant transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                                    >
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    
                                    {[...Array(pageData.totalPages)].map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentPage(idx)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-full font-label-md text-label-md transition-colors ${
                                                currentPage === idx 
                                                ? 'bg-primary text-on-primary shadow-level-1' 
                                                : 'text-secondary hover:bg-surface-variant'
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(pageData.totalPages - 1, p + 1))}
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

            
        </>
    );
}
