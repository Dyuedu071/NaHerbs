"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UpsertProductRequest, ProductStatus } from '@/services/generated/model';
import { useGetProductCategories } from '@/services/generated/public-products/public-products';
import { customInstance } from '@/services/api-client';
import RichTextEditor from '@/components/common/RichTextEditor';

export interface SkuFormState {
  skuCode: string;
  name: string;
  originalPrice: string;
  salePrice: string;
  stockQuantity: string;
  thumbnailMediaId?: string;
  thumbnailUrl?: string;
}

export interface VersionFormState {
  name: string;
  code: string;
  displayOrder: number;
  skus: SkuFormState[];
}

interface ExtendedUpsertProductRequest extends Omit<UpsertProductRequest, 'images'> {
  images: any[];
  versions?: VersionFormState[];
}

interface ProductFormProps {
  initialData?: ExtendedUpsertProductRequest & { id?: string };
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  title: string;
  embedded?: boolean;
}

const STEPS = [
  { id: 1, label: 'Thông tin', icon: 'info' },
  { id: 2, label: 'Cấu hình & SEO', icon: 'settings' },
  { id: 3, label: 'Phiên bản', icon: 'layers' },
  { id: 4, label: 'Phân loại (SKU)', icon: 'inventory_2' },
  { id: 5, label: 'Tổng quan', icon: 'check_circle' },
];

/**
 * Wraps a File as a Blob with an explicit MIME type.
 * Some browsers omit the Content-Type part-header in multipart uploads for
 * non-first files, causing Spring's MultipartFile.getContentType() to return
 * null and the backend to reject the request with 400.
 * Using new Blob([file], { type }) forces the browser to always include it.
 */
const EXT_MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg',
  png: 'image/png', webp: 'image/webp', gif: 'image/gif',
};
function toTypedBlob(file: File): Blob {
  const mimeType = file.type ||
    EXT_MIME[file.name.split('.').pop()?.toLowerCase() ?? ''] ||
    'application/octet-stream';
  return new Blob([file], { type: mimeType });
}

export default function ProductForm({ initialData, onSubmit, isLoading, title, embedded }: ProductFormProps) {
  const router = useRouter();
  const { data: categoriesData } = useGetProductCategories();
  const categories = Array.isArray(categoriesData) ? categoriesData : ((categoriesData as any)?.data || []);
  
  const [uploading, setUploading] = useState(false);
  const [skuUploading, setSkuUploading] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ─── TOAST NOTIFICATION ───────────────────────────────────────────────
  type ToastType = 'error' | 'success' | 'warning';
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const toastTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'error') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  // ─── IMAGE FORMAT VALIDATION ──────────────────────────────────────────
  const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);
  const ALLOWED_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

  /** Returns list of invalid file names, or empty array if all are valid */
  const findInvalidImages = (files: FileList | File[]): string[] => {
    const invalid: string[] = [];
    Array.from(files).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      const validExt = ALLOWED_EXTENSIONS.has(ext);
      const validMime = !file.type || ALLOWED_MIME.has(file.type);
      if (!validExt || !validMime) invalid.push(file.name);
    });
    return invalid;
  };
  
  const isEditMode = !!initialData?.id;

  const [formData, setFormData] = useState<ExtendedUpsertProductRequest>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    categoryId: initialData?.categoryId || undefined,
    shortDescription: initialData?.shortDescription || '',
    detailDescription: initialData?.detailDescription || '',
    usageInstruction: initialData?.usageInstruction || '',
    safetyNote: initialData?.safetyNote || '',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    benefits: initialData?.benefits || '',
    preservationInstruction: initialData?.preservationInstruction || '',
    primaryKeyword: initialData?.primaryKeyword || '',
    isFeatured: initialData?.isFeatured || false,
    displayOrder: initialData?.displayOrder || 0,
    status: initialData?.status || ProductStatus.DRAFT,
    images: initialData?.images || [],
    versions: initialData?.versions || [
      { name: 'Mặc định', code: '', displayOrder: 1, skus: [{ skuCode: '', name: 'Mặc định', originalPrice: '', salePrice: '', stockQuantity: '0' }] }
    ]
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // ── Client-side format check ──
    const invalid = findInvalidImages(e.target.files);
    if (invalid.length > 0) {
      showToast(
        `Ảnh không đúng định dạng: ${invalid.join(', ')}. Chỉ chấp nhận JPG, PNG, WEBP, GIF.`,
        'error'
      );
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const newImages = [...(formData.images || [])];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const payload = new FormData();
        // toTypedBlob ensures Content-Type is always present in the multipart
        // part header (some browsers omit it for non-first file fields).
        payload.append('file', toTypedBlob(file), file.name);
        payload.append('type', 'PRODUCT');
        
        const res: any = await customInstance({
          url: '/v1/admin/media/upload',
          method: 'POST',
          data: payload
        });
        
        newImages.push({
          mediaId: res.id,
          url: res.location,
          altText: file.name,
          isThumbnail: newImages.length === 0,
          displayOrder: newImages.length
        });
      }
      setFormData(prev => ({ ...prev, images: newImages }));
    } catch (error) {
      console.error('Upload failed', error);
      showToast('Tải ảnh thất bại, vui lòng thử lại.', 'error');
    } finally {
      setUploading(false);
      e.target.value = ''; 
    }
  };

  const handleSkuImageUpload = async (vi: number, si: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // ── Client-side format check ──
    const invalid = findInvalidImages(e.target.files);
    if (invalid.length > 0) {
      showToast(
        `Ảnh không đúng định dạng: ${invalid.join(', ')}. Chỉ chấp nhận JPG, PNG, WEBP, GIF.`,
        'error'
      );
      e.target.value = '';
      return;
    }

    const key = `${vi}_${si}`;
    const inputEl = e.target;
    setSkuUploading(prev => new Set(prev).add(key));
    try {
      const file = e.target.files[0];
      const payload = new FormData();
      // toTypedBlob ensures Content-Type is always present in the multipart
      // part header (some browsers omit it for non-first file fields).
      payload.append('file', toTypedBlob(file), file.name);
      payload.append('type', 'PRODUCT');
      
      const res: any = await customInstance({
        url: '/v1/admin/media/upload',
        method: 'POST',
        data: payload
      });
      
      setFormData(prev => {
        if (!prev.versions) return prev;
        const newVersions = [...prev.versions];
        const newSkus = [...newVersions[vi].skus];
        newSkus[si] = {
          ...newSkus[si],
          thumbnailMediaId: res.id,
          thumbnailUrl: res.location
        };
        newVersions[vi] = { ...newVersions[vi], skus: newSkus };
        return { ...prev, versions: newVersions };
      });
    } catch (error) {
      console.error('Upload failed', error);
      showToast('Tải ảnh SKU thất bại, vui lòng thử lại.', 'error');
    } finally {
      setSkuUploading(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      // Reset input so the same file can be re-selected if needed
      inputEl.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    const removed = newImages.splice(index, 1)[0];
    if (removed.isThumbnail && newImages.length > 0) newImages[0].isThumbnail = true;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const setThumbnail = (index: number) => {
    const newImages = (formData.images || []).map((img, i) => ({ ...img, isThumbnail: i === index }));
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === 'checkbox') val = (e.target as HTMLInputElement).checked;
    else if (type === 'number') val = Number(value);
    
    setFormData(prev => ({ ...prev, [name]: val }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ─── VERSION & SKU HANDLERS ──────────────────────────────────────────

  const addVersion = () => {
    setFormData(prev => {
      const v = [...(prev.versions || [])];
      v.push({ name: '', code: '', displayOrder: v.length + 1, skus: [] });
      return { ...prev, versions: v };
    });
  };

  const removeVersion = (index: number) => {
    setFormData(prev => {
      const v = [...(prev.versions || [])];
      v.splice(index, 1);
      return { ...prev, versions: v };
    });
  };

  const updateVersion = (index: number, field: keyof VersionFormState, value: any) => {
    setFormData(prev => {
      const v = [...(prev.versions || [])];
      v[index] = { ...v[index], [field]: value };
      return { ...prev, versions: v };
    });
  };

  const addSku = (versionIndex: number) => {
    setFormData(prev => {
      const v = [...(prev.versions || [])];
      v[versionIndex] = {
        ...v[versionIndex],
        skus: [...v[versionIndex].skus, { skuCode: '', name: '', originalPrice: '', salePrice: '', stockQuantity: '0' }]
      };
      return { ...prev, versions: v };
    });
  };

  const removeSku = (versionIndex: number, skuIndex: number) => {
    setFormData(prev => {
      const v = [...(prev.versions || [])];
      const newSkus = [...v[versionIndex].skus];
      newSkus.splice(skuIndex, 1);
      v[versionIndex] = { ...v[versionIndex], skus: newSkus };
      return { ...prev, versions: v };
    });
  };

  const updateSku = (versionIndex: number, skuIndex: number, field: keyof SkuFormState, value: any) => {
    setFormData(prev => {
      const v = [...(prev.versions || [])];
      const newSkus = [...v[versionIndex].skus];
      newSkus[skuIndex] = { ...newSkus[skuIndex], [field]: value };
      v[versionIndex] = { ...v[versionIndex], skus: newSkus };
      return { ...prev, versions: v };
    });
  };

  // ─── VALIDATION & SUBMIT ──────────────────────────────────────────────

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name?.trim()) errors.name = 'Vui lòng nhập tên sản phẩm';
      if (!formData.slug?.trim()) errors.slug = 'Vui lòng nhập đường dẫn (slug)';
    }
    if (step === 3 && !isEditMode) {
      if (!formData.versions || formData.versions.length === 0) {
        errors.versions = 'Vui lòng tạo ít nhất 1 phiên bản';
      } else {
        formData.versions.forEach((ver, i) => {
          if (!ver.name.trim()) errors[`version_${i}`] = 'Tên phiên bản không được để trống';
        });
      }
    }
    if (step === 4 && !isEditMode) {
      formData.versions?.forEach((ver, vi) => {
        if (!ver.skus || ver.skus.length === 0) {
          errors[`version_skus_${vi}`] = `Phiên bản "${ver.name}" cần có ít nhất 1 SKU`;
        } else {
          ver.skus.forEach((sku, si) => {
            const salePrice = Number(sku.salePrice);
            const originalPrice = Number(sku.originalPrice);

            if (!sku.salePrice || salePrice <= 0) errors[`sku_price_${vi}_${si}`] = 'Giá bán không hợp lệ';
            if (sku.originalPrice && originalPrice < salePrice) {
               errors[`sku_original_price_${vi}_${si}`] = 'Giá gốc phải >= giá bán';
            }
            if (!sku.stockQuantity || Number(sku.stockQuantity) < 0) errors[`sku_stock_${vi}_${si}`] = 'Tồn kho không hợp lệ';
          });
        }
      });
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    let isValid = false;
    if (isEditMode) {
      isValid = validateStep(1) && validateStep(2);
    } else {
      isValid = validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4);
    }

    if (isValid) {
      const payload: any = { ...formData };
      
      // Convert SKU string values to numbers
      if (!isEditMode && payload.versions) {
        payload.versions = payload.versions.map((ver: any) => ({
          ...ver,
          skus: ver.skus.map((sku: any) => ({
            ...sku,
            originalPrice: sku.originalPrice ? Number(sku.originalPrice) : null,
            salePrice: Number(sku.salePrice),
            stockQuantity: Number(sku.stockQuantity)
          }))
        }));
      } else {
        // If edit mode, don't submit nested versions to avoid overwriting existing ones.
        // User should use the Tabs to manage them.
        delete payload.versions;
      }
      
      await onSubmit(payload);
    } else {
      // Find the first step with errors
      if (!validateStep(1)) setCurrentStep(1);
      else if (!validateStep(2)) setCurrentStep(2);
      else if (!isEditMode && !validateStep(3)) setCurrentStep(3);
      else if (!isEditMode && !validateStep(4)) setCurrentStep(4);
    }
  };

  // ─── RENDERS ─────────────────────────────────────────────────────────

  const inputCls = "w-full px-4 py-2 bg-background border border-border-warm rounded-lg focus:outline-none focus:border-primary text-body-md transition-colors";
  const inputErrCls = "w-full px-4 py-2 bg-red-50 border border-red-500 rounded-lg focus:outline-none focus:border-red-600 text-body-md transition-colors";
  const labelCls = "text-label-md font-label-md text-on-surface";

  // ─── TOAST UI ────────────────────────────────────────────────────────
  const toastConfig = {
    error:   { bg: 'bg-red-50 border-red-300',   icon: 'error',            iconCls: 'text-red-500',    textCls: 'text-red-800' },
    success: { bg: 'bg-emerald-50 border-emerald-300', icon: 'check_circle', iconCls: 'text-emerald-500', textCls: 'text-emerald-800' },
    warning: { bg: 'bg-amber-50 border-amber-300', icon: 'warning',         iconCls: 'text-amber-500',  textCls: 'text-amber-800' },
  };

  const renderToast = () => {
    if (!toast) return null;
    const cfg = toastConfig[toast.type];
    return (
      <div
        role="alert"
        className={`fixed top-6 right-6 z-[9999] flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm animate-in slide-in-from-top-2 fade-in duration-300 ${cfg.bg}`}
      >
        <span className={`material-symbols-outlined text-xl flex-shrink-0 mt-0.5 ${cfg.iconCls}`}>{cfg.icon}</span>
        <p className={`text-body-sm leading-snug ${cfg.textCls}`}>{toast.message}</p>
        <button
          type="button"
          onClick={() => setToast(null)}
          className="ml-auto -mr-1 p-1 rounded-lg hover:bg-black/10 transition-colors flex-shrink-0"
          aria-label="Đóng thông báo"
        >
          <span className="material-symbols-outlined text-base text-current">close</span>
        </button>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-lg animate-in fade-in duration-300">
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-warm space-y-md">
        <h3 className="text-title-md font-title-md text-on-surface border-b border-border-warm pb-3">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="space-y-xs">
            <label className={labelCls}>Tên sản phẩm <span className="text-red-500">*</span></label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className={formErrors.name ? inputErrCls : inputCls} placeholder="Ví dụ: Trà thảo mộc" />
          </div>
          <div className="space-y-xs">
            <label className={labelCls}>Đường dẫn (Slug) <span className="text-red-500">*</span></label>
            <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className={formErrors.slug ? inputErrCls : inputCls} placeholder="vi-du-tra-thao-moc" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="space-y-xs">
            <label className={labelCls}>Danh mục</label>
            <select name="categoryId" value={formData.categoryId || ''} onChange={handleChange} className={inputCls}>
              <option value="">Chọn danh mục</option>
              {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div className="space-y-xs">
            <label className={labelCls}>Trạng thái <span className="text-red-500">*</span></label>
            <select required name="status" value={formData.status} onChange={handleChange} className={inputCls}>
              <option value={ProductStatus.DRAFT}>Bản nháp (Draft)</option>
              <option value={ProductStatus.PUBLISHED}>Đang bán (Published)</option>
              <option value={ProductStatus.HIDDEN}>Ẩn (Hidden)</option>
            </select>
          </div>
        </div>
        <div className="space-y-xs">
          <label className={labelCls}>Mô tả ngắn</label>
          <textarea name="shortDescription" value={formData.shortDescription || ''} onChange={handleChange} rows={2} className={inputCls} />
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-warm space-y-md">
        <h3 className="text-title-md font-title-md text-on-surface border-b border-border-warm pb-3">Chi tiết & Lưu ý</h3>
        <div className="space-y-xs">
          <label className={labelCls}>Mô tả chi tiết</label>
          <div className="border border-border-warm rounded-lg overflow-hidden">
            <RichTextEditor 
              initialValue={formData.detailDescription || ''} 
              onChange={(content) => setFormData(prev => ({ ...prev, detailDescription: content }))}
              mediaType="PRODUCT"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="space-y-xs">
            <label className={labelCls}>Lưu ý an toàn</label>
            <textarea name="safetyNote" value={formData.safetyNote || ''} onChange={handleChange} rows={3} className={inputCls} />
          </div>
          <div className="space-y-xs">
            <label className={labelCls}>Hướng dẫn sử dụng</label>
            <textarea name="usageInstruction" value={formData.usageInstruction || ''} onChange={handleChange} rows={3} className={inputCls} />
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-warm space-y-md relative">
        {/* Overlay loading for images */}
        {uploading && (
           <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center">
             <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-2">progress_activity</span>
             <p className="text-label-md font-label-md text-primary">Đang tải ảnh lên...</p>
           </div>
        )}
        <div className="flex items-center justify-between border-b border-border-warm pb-3">
          <h3 className="text-title-md font-title-md text-on-surface">Hình ảnh sản phẩm</h3>
          <label className={`cursor-pointer flex items-center gap-1 bg-primary text-on-primary px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <span className={`material-symbols-outlined text-[18px] ${uploading ? 'animate-spin' : ''}`}>{uploading ? 'progress_activity' : 'upload'}</span>
            <span className="text-label-sm font-label-sm">{uploading ? 'Đang tải...' : 'Tải ảnh lên'}</span>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
        
        {formData.images && formData.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {formData.images.map((img, i) => (
              <div key={i} className={`relative group aspect-square rounded-xl overflow-hidden border-2 ${img.isThumbnail ? 'border-primary shadow-ambient-md' : 'border-border-warm'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-full object-cover bg-surface-container" />
                {img.isThumbnail && <div className="absolute top-1 left-1 bg-primary text-on-primary text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">THUMBNAIL</div>}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  {!img.isThumbnail && <button type="button" onClick={() => setThumbnail(i)} className="text-[10px] bg-white text-black px-2 py-1 rounded shadow hover:bg-gray-100">Làm Thumbnail</button>}
                  <button type="button" onClick={() => removeImage(i)} className="text-[10px] bg-red-500 text-white px-2 py-1 rounded shadow hover:bg-red-600">Xóa ảnh</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <label className={`block border-2 border-dashed border-border-warm rounded-2xl p-8 text-center bg-surface-container-lowest hover:bg-surface-container cursor-pointer transition-colors group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            <span className={`material-symbols-outlined text-3xl mb-2 transition-colors ${uploading ? 'text-primary animate-spin' : 'text-text-muted group-hover:text-primary'}`}>{uploading ? 'progress_activity' : 'add_photo_alternate'}</span>
            <p className="text-body-sm text-text-muted group-hover:text-text-main transition-colors">{uploading ? 'Đang tải lên vui lòng chờ...' : 'Kéo thả hoặc nhấn để chọn ảnh'}</p>
          </label>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-lg animate-in fade-in duration-300">
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-warm space-y-md">
        <h3 className="text-title-md font-title-md text-on-surface border-b border-border-warm pb-3">SEO & Cấu hình</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="space-y-xs">
            <label className={labelCls}>Tiêu đề SEO</label>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle || ''}
              onChange={handleChange}
              maxLength={255}
              placeholder="Để trống sẽ dùng tên sản phẩm"
              className={inputCls}
            />
            <p className="text-caption text-text-muted text-right">{(formData.seoTitle || '').length}/60</p>
          </div>
          <div className="space-y-xs">
            <label className={labelCls}>Từ khóa SEO</label>
            <input type="text" name="primaryKeyword" value={formData.primaryKeyword || ''} onChange={handleChange} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="space-y-xs">
            <label className={labelCls}>Thứ tự hiển thị</label>
            <input type="number" name="displayOrder" value={formData.displayOrder || 0} onChange={handleChange} className={inputCls} />
          </div>
        </div>
        <div className="space-y-xs">
          <label className={labelCls}>Mô tả SEO</label>
          <textarea name="seoDescription" value={formData.seoDescription || ''} onChange={handleChange} rows={2} maxLength={500} className={inputCls} />
          <p className="text-caption text-text-muted text-right">{(formData.seoDescription || '').length}/160</p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <input type="checkbox" id="isFeatured" name="isFeatured" checked={!!formData.isFeatured} onChange={handleChange} className="w-5 h-5 accent-primary cursor-pointer" />
          <label htmlFor="isFeatured" className={labelCls + " cursor-pointer"}>Sản phẩm nổi bật (Featured)</label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-md animate-in fade-in duration-300">
      {isEditMode ? (
        <div className="p-8 bg-surface-container-lowest border border-border-warm rounded-2xl text-center">
          <span className="material-symbols-outlined text-5xl text-text-muted mb-3">layers</span>
          <h3 className="text-title-md font-title-md text-on-surface">Quản lý Phiên bản</h3>
          <p className="text-body-sm text-text-muted mt-2 max-w-lg mx-auto">
            Sản phẩm này đã được lưu. Hãy chuyển sang Tab <strong>Phiên bản</strong> ở trên cùng màn hình để thêm/sửa/xoá các phiên bản nhé.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-body-md text-text-muted">Phiên bản giúp phân loại sản phẩm (VD: Bản thường, Bản cao cấp).</p>
            <button onClick={addVersion} type="button" className="flex items-center gap-1 bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-lg text-primary text-label-md font-label-md transition-colors border border-border-warm">
              <span className="material-symbols-outlined text-[18px]">add</span> Thêm phiên bản
            </button>
          </div>
          
          {formErrors.versions && <p className="text-caption text-red-500">{formErrors.versions}</p>}

          <div className="space-y-4">
            {formData.versions?.map((ver, i) => (
              <div key={i} className="bg-surface-container-lowest p-5 rounded-2xl border border-border-warm shadow-ambient-low relative group">
                {formData.versions!.length > 1 && (
                  <button type="button" onClick={() => removeVersion(i)} className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                  <div className="space-y-xs">
                    <label className={labelCls}>Tên phiên bản <span className="text-red-500">*</span></label>
                    <input type="text" value={ver.name} onChange={e => updateVersion(i, 'name', e.target.value)} className={formErrors[`version_${i}`] ? inputErrCls : inputCls} placeholder="VD: Mặc định, Size L, Có Nhiệt..." />
                    {formErrors[`version_${i}`] && <p className="text-caption text-red-500">{formErrors[`version_${i}`]}</p>}
                  </div>
                  <div className="space-y-xs">
                    <label className={labelCls}>Mã Code (Tùy chọn)</label>
                    <input type="text" value={ver.code || ''} onChange={e => updateVersion(i, 'code', e.target.value)} className={inputCls} placeholder="VD: V1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-md animate-in fade-in duration-300">
      {isEditMode ? (
         <div className="p-8 bg-surface-container-lowest border border-border-warm rounded-2xl text-center">
         <span className="material-symbols-outlined text-5xl text-text-muted mb-3">inventory_2</span>
         <h3 className="text-title-md font-title-md text-on-surface">Quản lý Biến thể (SKU)</h3>
         <p className="text-body-sm text-text-muted mt-2 max-w-lg mx-auto">
           Sản phẩm này đã được lưu. Hãy chuyển sang Tab <strong>Biến thể</strong> ở trên cùng màn hình để thêm/sửa/xoá các mặt hàng và cập nhật tồn kho nhé.
         </p>
       </div>
      ) : (
        <>
          <p className="text-body-md text-text-muted">Biến thể (SKU) chứa thông tin giá bán và tồn kho cho từng phiên bản.</p>
          
          <div className="space-y-lg">
            {formData.versions?.map((ver, vi) => (
              <div key={vi} className="bg-surface-container-lowest rounded-2xl border border-border-warm shadow-ambient-low overflow-hidden">
                <div className="bg-surface-container-low px-5 py-3 border-b border-border-warm flex items-center justify-between">
                  <h4 className="font-title-md text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-text-muted">layers</span>
                    Phiên bản: {ver.name || <span className="text-red-500 italic">Chưa nhập tên</span>}
                  </h4>
                  <button type="button" onClick={() => addSku(vi)} className="text-label-sm font-label-sm text-primary hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">add</span> Thêm SKU
                  </button>
                </div>
                
                <div className="p-5 space-y-4 bg-background">
                  {formErrors[`version_skus_${vi}`] && <p className="text-caption text-red-500 mb-2">{formErrors[`version_skus_${vi}`]}</p>}
                  
                  {ver.skus.map((sku, si) => (
                    <div key={si} className="p-4 rounded-xl border border-border-warm bg-surface-container-lowest relative">
                       {ver.skus.length > 1 && (
                          <button type="button" onClick={() => removeSku(vi, si)} className="absolute top-3 right-3 p-1 text-text-muted hover:text-red-500 rounded transition-colors">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                       )}
                       
                       {/* SKU Image Upload */}
                       <div className="mb-4">
                          <label className="block text-label-sm font-label-sm text-text-muted mb-2">Ảnh đại diện SKU</label>
                          <div className="flex items-center gap-4">
                            {sku.thumbnailUrl ? (
                              <div className="relative w-16 h-16 rounded overflow-hidden border border-border-warm bg-surface-container-low group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={sku.thumbnailUrl} alt="SKU Thumbnail" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => updateSku(vi, si, 'thumbnailUrl', '')} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="material-symbols-outlined text-white text-sm">delete</span>
                                </button>
                              </div>
                            ) : (
                              <div className="relative w-16 h-16 rounded border border-dashed border-border-warm bg-surface-container-low flex flex-col items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer">
                                {skuUploading.has(`${vi}_${si}`) ? (
                                  <span className="material-symbols-outlined text-xl animate-spin text-primary">progress_activity</span>
                                ) : (
                                  <span className="material-symbols-outlined text-xl mb-1">add_photo_alternate</span>
                                )}
                                <input
                                  type="file"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  accept="image/*"
                                  onChange={(e) => handleSkuImageUpload(vi, si, e)}
                                  disabled={skuUploading.has(`${vi}_${si}`)}
                                />
                              </div>
                            )}
                          </div>
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-xs lg:col-span-2">
                            <label className={labelCls}>Tên SKU <span className="text-red-500">*</span></label>
                            <input type="text" value={sku.name} onChange={e => updateSku(vi, si, 'name', e.target.value)} className={formErrors[`sku_name_${vi}_${si}`] ? inputErrCls : inputCls} placeholder="VD: Màu Đỏ - Thường" />
                          </div>
                          <div className="space-y-xs">
                            <label className={labelCls}>Mã SKU</label>
                            <input type="text" value={sku.skuCode} onChange={e => updateSku(vi, si, 'skuCode', e.target.value)} className={inputCls} placeholder="VD: SP-01" />
                          </div>
                          <div className="space-y-xs">
                            <label className={labelCls}>Giá bán (đ) <span className="text-red-500">*</span></label>
                            <input type="number" min={0} value={sku.salePrice} onChange={e => updateSku(vi, si, 'salePrice', e.target.value)} className={formErrors[`sku_price_${vi}_${si}`] ? inputErrCls : inputCls} placeholder="0" />
                          </div>
                          <div className="space-y-xs">
                            <label className={labelCls}>Giá gốc (đ)</label>
                            <input type="number" min={0} value={sku.originalPrice} onChange={e => updateSku(vi, si, 'originalPrice', e.target.value)} className={formErrors[`sku_original_price_${vi}_${si}`] ? inputErrCls : inputCls} placeholder="0" />
                            {formErrors[`sku_original_price_${vi}_${si}`] && <p className="text-[10px] text-red-500">{formErrors[`sku_original_price_${vi}_${si}`]}</p>}
                          </div>
                          <div className="space-y-xs">
                            <label className={labelCls}>Tồn kho <span className="text-red-500">*</span></label>
                            <input type="number" min={0} value={sku.stockQuantity} onChange={e => updateSku(vi, si, 'stockQuantity', e.target.value)} className={formErrors[`sku_stock_${vi}_${si}`] ? inputErrCls : inputCls} placeholder="0" />
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderStep5 = () => {
    const catName = categories.find((c: any) => c.id === formData.categoryId)?.name || 'Chưa chọn';
    const totalSkus = !isEditMode ? (formData.versions?.reduce((acc, v) => acc + (v.skus?.length || 0), 0) || 0) : 'Đã lưu';

    return (
      <div className="space-y-md animate-in fade-in duration-300">
        <div className="bg-surface-container-lowest border border-border-warm rounded-2xl p-6 flex flex-col md:flex-row gap-6 shadow-ambient-low">
          <div className="w-full md:w-[240px] aspect-square rounded-xl overflow-hidden bg-surface-container border border-border-warm">
             {formData.images && formData.images.length > 0 ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img src={formData.images.find(img => img.isThumbnail)?.url || formData.images[0].url} alt="" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                 <span className="material-symbols-outlined text-4xl mb-1 opacity-50">hide_image</span>
                 <span className="text-caption">Chưa có ảnh</span>
               </div>
             )}
          </div>
          <div className="flex-1 space-y-4">
             <h3 className="text-headline-sm text-on-surface">{formData.name || <span className="italic text-text-muted">Chưa nhập tên</span>}</h3>
             <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-surface-container rounded-md text-label-sm font-label-sm border border-border-warm">Danh mục: {catName}</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-label-sm font-label-sm">{formData.status}</span>
                {!isEditMode && <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-label-sm font-label-sm">{formData.versions?.length || 0} Phiên bản • {totalSkus} SKUs</span>}
             </div>
             <p className="text-body-sm text-text-muted line-clamp-3">{formData.shortDescription || 'Chưa có mô tả'}</p>
          </div>
        </div>

        <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl text-center text-primary-dark font-medium text-body-md">
          {isEditMode ? 'Nhấn Cập nhật để lưu lại thông tin Sản phẩm.' : 'Tuyệt vời! Hãy kiểm tra lại thông tin và nhấn Lưu Sản Phẩm để hoàn tất luồng tạo.'}
        </div>
      </div>
    );
  };

  const formContent = (
    <div className="flex flex-col relative">
      {/* Full screen loading overlay when submitting */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center">
           <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient-lg border border-border-warm flex flex-col items-center gap-3">
             <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
             <p className="text-title-md text-on-surface font-title-md">Đang xử lý dữ liệu...</p>
             <p className="text-body-sm text-text-muted">Vui lòng không đóng trang</p>
           </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between mb-8 gap-y-4 px-2 overflow-x-auto">
        <div className="flex items-center w-full md:w-auto min-w-max">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isPassed = step.id < currentStep;
            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (isPassed) setCurrentStep(step.id);
                    else if (step.id === currentStep + 1 && validateStep(currentStep)) setCurrentStep(step.id);
                  }}
                  className={`flex items-center gap-2 group transition-colors ${isActive ? 'text-primary' : isPassed ? 'text-emerald-600 cursor-pointer' : 'text-text-muted opacity-50 cursor-not-allowed'}`}
                  disabled={!isPassed && step.id !== currentStep + 1}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all ${isActive ? 'bg-primary text-on-primary ring-4 ring-primary/20' : isPassed ? 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200' : 'bg-surface-container text-text-muted'}`}>
                    {isPassed ? <span className="material-symbols-outlined text-[18px]">check</span> : step.id}
                  </div>
                  <span className="font-label-md hidden md:block whitespace-nowrap">{step.label}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <div className="w-6 md:w-12 h-[2px] mx-2 bg-border-warm rounded-full overflow-hidden flex-shrink-0">
                    <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: isPassed ? '100%' : '0%' }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="min-h-[400px]">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>

      <div className="pt-6 mt-8 border-t border-border-warm flex items-center justify-between">
        <button type="button" onClick={currentStep === 1 ? () => router.back() : prevStep} className="px-6 py-2.5 rounded-full border border-border-warm text-text-main hover:bg-surface-container transition-colors text-label-md font-label-md flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {currentStep === 1 ? 'Hủy' : 'Quay lại'}
        </button>

        {currentStep < STEPS.length ? (
          <button type="button" onClick={nextStep} className="px-6 py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-ambient-md text-label-md font-label-md flex items-center gap-1">
            Tiếp tục <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={isLoading} className="px-8 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-ambient-md text-label-md font-label-md flex items-center gap-2 disabled:opacity-50">
            {isLoading ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">done_all</span>}
            {isLoading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm')}
          </button>
        )}
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="flex flex-col relative space-y-md">
        {renderToast()}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center">
             <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient-lg border border-border-warm flex flex-col items-center gap-3">
               <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
               <p className="text-title-md text-on-surface font-title-md">Đang xử lý dữ liệu...</p>
             </div>
          </div>
        )}
        {renderStep1()}
        {renderStep2()}
        <div className="pt-6 border-t border-border-warm flex justify-end">
          <button type="button" onClick={handleSubmit} disabled={isLoading} className="px-8 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-ambient-md text-label-md font-label-md flex items-center gap-2 disabled:opacity-50">
            {isLoading ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">done_all</span>}
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-gutter bg-background">
      {renderToast()}
      <div className="max-w-7xl mx-auto space-y-md">
        <div className="flex items-center gap-sm mb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-surface-container rounded-full transition-colors text-text-muted">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-headline-md font-headline-md text-on-surface">{title}</h1>
            <p className="text-body-sm text-text-muted mt-1">Hoàn thành các bước dưới đây để thiết lập sản phẩm</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-border-warm p-4 md:p-8 shadow-ambient-low">
          {formContent}
        </div>
      </div>
    </main>
  );
}
