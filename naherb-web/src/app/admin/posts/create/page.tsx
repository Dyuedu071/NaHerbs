"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { AXIOS_INSTANCE } from '@/services/api-client';

const RichTextEditor = dynamic(() => import('@/components/common/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="p-10 text-center text-text-muted">Đang tải trình soạn thảo...</div>
});


export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [thumbnailMediaId, setThumbnailMediaId] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  // Categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [categorySearch, setCategorySearch] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Đảm bảo trình duyệt có XSRF-TOKEN cookie trước khi submit form hoặc upload ảnh
    AXIOS_INSTANCE.get('/auth/csrf').catch(console.error);

    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          AXIOS_INSTANCE.get('/admin/blog/categories'),
          AXIOS_INSTANCE.get('/admin/products')
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Derived state for filtered lists
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()));
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) && !productIds.includes(p.id));

  const selectedCategory = categories.find(c => c.id === categoryId);
  const selectedProducts = products.filter(p => productIds.includes(p.id));

  const handleSelectCategory = (id: string) => {
    setCategoryId(id);
    setCategorySearch('');
    setIsCategoryDropdownOpen(false);
  };

  const handleSelectProduct = (id: string) => {
    if (productIds.length >= 6) {
      alert("Chỉ được chọn tối đa 6 sản phẩm");
      return;
    }
    setProductIds([...productIds, id]);
    setProductSearch('');
    setIsProductDropdownOpen(false);
  };
  
  const handleRemoveProduct = (id: string) => {
    setProductIds(productIds.filter(pid => pid !== id));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await AXIOS_INSTANCE.post('/v1/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setThumbnailUrl(response.data.location);
      setThumbnailMediaId(response.data.id);
    } catch (error) {
      console.error("Thumbnail upload failed:", error);
      alert("Lỗi tải ảnh đại diện lên.");
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const submitPost = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề bài viết");
      return;
    }

    setIsSubmitting(true);
    try {
      await AXIOS_INSTANCE.post('/admin/blogs', {
        title,
        slug,
        content,
        seoTitle,
        seoDescription,
        status,
        isFeatured: false,
        thumbnailMediaId,
        categoryId: categoryId ? categoryId : null,
        productIds
      });
      alert(status === 'DRAFT' ? "Đã lưu nháp thành công!" : "Đã xuất bản bài viết!");
      router.push('/admin/posts');
    } catch (error: any) {
      console.error("Error creating post:", error);
      if (error.response?.status === 409) {
        alert("Lỗi: Đường dẫn tĩnh (Slug) đã tồn tại. Vui lòng đổi slug khác.");
      } else if (error.response?.data?.message) {
        alert("Lỗi: " + error.response.data.message);
      } else {
        alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => submitPost('DRAFT');
  const handlePublish = async () => submitPost('PUBLISHED');

  return (
    <main className="flex-1 p-gutter max-w-container-max mx-auto w-full flex flex-col gap-md pb-xl">
      <div className="flex justify-between items-center mb-sm">
        <div className="flex items-center gap-sm">
          <Link href="/admin/posts" className="w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-headline-md font-headline-md text-primary">Tạo bài viết mới</h1>
        </div>
        <div className="flex gap-sm">
          <button 
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-md py-sm bg-surface text-primary border border-primary rounded-full text-label-md font-label-md hover:bg-surface-variant transition-colors shadow-ambient-sm disabled:opacity-50">
            Lưu nháp
          </button>
          <button 
            onClick={handlePublish}
            disabled={isSubmitting}
            className="px-md py-sm bg-primary text-on-primary rounded-full text-label-md font-label-md hover:bg-secondary transition-all shadow-ambient-md flex items-center gap-xs disabled:opacity-50">
            <span className="material-symbols-outlined text-[18px]">publish</span>
            Xuất bản
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Main Content Area */}
        <div className="lg:col-span-2 flex flex-col gap-md">
          <div className="bg-surface-container-lowest p-md rounded-2xl shadow-ambient-sm border border-border-warm flex flex-col gap-sm">
            <label className="text-label-md font-label-md text-text-main font-semibold">Tiêu đề bài viết</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-surface rounded-lg border border-border-warm focus:ring-2 focus:ring-primary focus:border-primary text-body-lg outline-none transition-all disabled:opacity-50"
              placeholder="Nhập tiêu đề ấn tượng..."
            />

            <label className="text-label-md font-label-md text-text-main font-semibold mt-sm">Đường dẫn tĩnh (Slug)</label>
            <input 
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-surface rounded-lg border border-border-warm focus:ring-2 focus:ring-primary focus:border-primary text-body-md outline-none transition-all disabled:opacity-50"
              placeholder="Để trống để tự động sinh từ tiêu đề..."
            />
          </div>

          <div className="bg-surface-container-lowest p-md rounded-2xl shadow-ambient-sm border border-border-warm flex flex-col gap-sm">
             <label className="text-label-md font-label-md text-text-main font-semibold">Nội dung bài viết (TinyMCE)</label>
             <div className="border border-border-warm rounded-lg overflow-hidden">
                {/* TinyMCE Editor Component */}
                <RichTextEditor 
                  initialValue={content}
                  onChange={(newContent) => setContent(newContent)}
                />
             </div>
          </div>
        </div>

        {/* Sidebar Settings Area */}
        <div className="flex flex-col gap-md">
           <div className="bg-surface-container-lowest p-md rounded-2xl shadow-ambient-sm border border-border-warm flex flex-col gap-sm">
             <h3 className="text-title-md font-headline-md text-primary mb-xs">Ảnh đại diện</h3>
             
             {thumbnailUrl ? (
               <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border-warm mb-2">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={thumbnailUrl} alt="Thumbnail preview" className="object-cover w-full h-full" />
                 <button 
                   onClick={() => { setThumbnailUrl(''); setThumbnailMediaId(null); }}
                   className="absolute top-2 right-2 w-8 h-8 bg-surface/80 rounded-full flex items-center justify-center text-error hover:bg-error hover:text-white transition-colors"
                 >
                   <span className="material-symbols-outlined text-[18px]">close</span>
                 </button>
               </div>
             ) : (
               <label className={`w-full aspect-video rounded-lg border-2 border-dashed border-border-warm flex flex-col items-center justify-center cursor-pointer hover:bg-surface-variant hover:border-primary transition-colors ${isUploadingThumbnail ? 'opacity-50 pointer-events-none' : ''}`}>
                 <span className="material-symbols-outlined text-4xl text-text-muted mb-2">add_photo_alternate</span>
                 <span className="text-label-md text-text-muted">
                   {isUploadingThumbnail ? 'Đang tải lên...' : 'Bấm để chọn ảnh'}
                 </span>
                 <input 
                   type="file" 
                   accept="image/*" 
                   className="hidden" 
                   onChange={handleThumbnailUpload} 
                   disabled={isUploadingThumbnail || isSubmitting}
                 />
               </label>
             )}
           </div>

           <div className="bg-surface-container-lowest p-md rounded-2xl shadow-ambient-sm border border-border-warm flex flex-col gap-sm">
             <h3 className="text-title-md font-headline-md text-primary mb-xs">Danh mục & Gắn thẻ</h3>
             
             {/* Category Search Bar */}
             <div className="relative">
               <label className="text-label-sm font-label-md text-text-main mb-1 block">Danh mục bài viết</label>
               <div className="min-h-[42px] flex items-center flex-wrap gap-2 px-3 py-1 bg-surface rounded-lg border border-border-warm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all cursor-text"
                    onClick={() => setIsCategoryDropdownOpen(true)}>
                 {selectedCategory && (
                   <span className="flex items-center gap-1 bg-primary-container text-on-primary-container px-2 py-1 rounded-md text-label-sm">
                     {selectedCategory.name}
                     <button onClick={(e) => { e.stopPropagation(); setCategoryId(''); }} className="hover:text-error material-symbols-outlined text-[14px]">close</button>
                   </span>
                 )}
                 {!selectedCategory && (
                   <input
                     type="text"
                     value={categorySearch}
                     onChange={(e) => setCategorySearch(e.target.value)}
                     onFocus={() => setIsCategoryDropdownOpen(true)}
                     onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 200)}
                     className="flex-1 bg-transparent outline-none min-w-[120px] text-body-sm py-1"
                     placeholder="Tìm danh mục..."
                   />
                 )}
               </div>
               
               {isCategoryDropdownOpen && !selectedCategory && filteredCategories.length > 0 && (
                 <div className="absolute z-10 w-full mt-1 bg-surface rounded-lg shadow-elevation-md border border-border-warm max-h-60 overflow-y-auto">
                   {filteredCategories.map(cat => (
                     <div 
                       key={cat.id} 
                       onClick={() => handleSelectCategory(cat.id)}
                       className="px-4 py-2 hover:bg-surface-variant cursor-pointer text-body-sm transition-colors"
                     >
                       {cat.name}
                     </div>
                   ))}
                 </div>
               )}
             </div>

             {/* Products Search Bar */}
             <div className="relative mt-2">
               <label className="text-label-sm font-label-md text-text-main mb-1 block">Sản phẩm liên quan (Tối đa 6)</label>
               <div className="min-h-[42px] flex items-center flex-wrap gap-2 px-3 py-1.5 bg-surface rounded-lg border border-border-warm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all cursor-text"
                    onClick={() => setIsProductDropdownOpen(true)}>
                 {selectedProducts.map(prod => (
                   <span key={prod.id} className="flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2 py-1 rounded-md text-label-sm">
                     {prod.name}
                     <button onClick={(e) => { e.stopPropagation(); handleRemoveProduct(prod.id); }} className="hover:text-error material-symbols-outlined text-[14px]">close</button>
                   </span>
                 ))}
                 {productIds.length < 6 && (
                   <input
                     type="text"
                     value={productSearch}
                     onChange={(e) => setProductSearch(e.target.value)}
                     onFocus={() => setIsProductDropdownOpen(true)}
                     onBlur={() => setTimeout(() => setIsProductDropdownOpen(false), 200)}
                     className="flex-1 bg-transparent outline-none min-w-[120px] text-body-sm py-0.5"
                     placeholder={productIds.length === 0 ? "Tìm sản phẩm..." : ""}
                   />
                 )}
               </div>
               
               {isProductDropdownOpen && productIds.length < 6 && filteredProducts.length > 0 && (
                 <div className="absolute z-10 w-full mt-1 bg-surface rounded-lg shadow-elevation-md border border-border-warm max-h-60 overflow-y-auto">
                   {filteredProducts.map(prod => (
                     <div 
                       key={prod.id} 
                       onClick={() => handleSelectProduct(prod.id)}
                       className="px-4 py-2 hover:bg-surface-variant cursor-pointer text-body-sm transition-colors"
                     >
                       {prod.name}
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </div>

           <div className="bg-surface-container-lowest p-md rounded-2xl shadow-ambient-sm border border-border-warm flex flex-col gap-sm">
             <h3 className="text-title-md font-headline-md text-primary mb-xs">Cấu hình SEO</h3>
             
             <label className="text-label-sm font-label-md text-text-main">SEO Title (Max 60 chars)</label>
             <input 
              type="text"
              maxLength={60}
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full px-3 py-2 bg-surface rounded-lg border border-border-warm focus:ring-1 focus:ring-primary outline-none text-body-sm"
              placeholder="Nhập tiêu đề SEO..."
            />
            <p className="text-caption text-text-muted text-right">{seoTitle.length}/60</p>

             <label className="text-label-sm font-label-md text-text-main mt-sm">SEO Description (Max 160 chars)</label>
             <textarea 
              rows={4}
              maxLength={160}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full px-3 py-2 bg-surface rounded-lg border border-border-warm focus:ring-1 focus:ring-primary outline-none text-body-sm resize-none"
              placeholder="Nhập mô tả SEO..."
            />
            <p className="text-caption text-text-muted text-right">{seoDescription.length}/160</p>
           </div>
        </div>
      </div>
    </main>
  );
}
