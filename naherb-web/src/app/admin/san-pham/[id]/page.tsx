"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  usePutAdminProductsProductId,
  usePostAdminProductsProductIdVersions,
  usePostAdminProductsProductIdSkus,
  usePutAdminProductSkusSkuId,
  usePatchAdminProductSkusSkuIdStock,
  useGetAdminProductsProductId,
} from '@/services/generated/admin-products/admin-products';
import ProductForm from '../_components/ProductForm';
import { ProductStatus } from '@/services/generated/model';
import { customInstance } from '@/services/api-client';

type Tab = 'info' | 'versions' | 'skus';

const EMPTY_VERSION_FORM = { name: '', code: '', displayOrder: 0, status: 'PUBLISHED' };
const EMPTY_SKU_FORM = {
  versionId: '', skuCode: '', name: '', color: '', scent: '',
  type: '', originalPrice: '', salePrice: '', stockQuantity: '0', status: 'ACTIVE',
  thumbnailMediaId: '', thumbnailUrl: ''
};

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [editingVersion, setEditingVersion] = useState<any>(null);
  const [showSkuModal, setShowSkuModal] = useState(false);
  const [editingSku, setEditingSku] = useState<any>(null);
  const [stockModal, setStockModal] = useState<any>(null);
  const [versionForm, setVersionForm] = useState({ ...EMPTY_VERSION_FORM });
  const [skuForm, setSkuForm] = useState({ ...EMPTY_SKU_FORM });
  const [newStockQty, setNewStockQty] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch specific product data
  const { data: productData, isLoading: isFetching, refetch: refetchProduct } = useGetAdminProductsProductId(id, {
    query: { enabled: !!id    }
  });

  const deleteVersionMutation = useMutation({
    mutationFn: (versionId: string) => customInstance({ url: `/api/v1/admin/products/${id}/versions/${versionId}`, method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Xóa phiên bản thành công');
      refetchVersions();
      refetchSkus();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Lỗi khi xóa phiên bản');
    }
  });

  const deleteSkuMutation = useMutation({
    mutationFn: (skuId: string) => customInstance({ url: `/api/v1/admin/product-skus/${skuId}`, method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Xóa SKU thành công');
      refetchSkus();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Lỗi khi xóa SKU');
    }
  });

  const handleDeleteVersion = (versionId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiên bản này? Các SKU thuộc phiên bản này cũng sẽ bị xóa vĩnh viễn.')) {
      deleteVersionMutation.mutate(versionId);
    }
  };

  const handleDeleteSku = (skuId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa SKU này?')) {
      deleteSkuMutation.mutate(skuId);
    }
  };

  const product = (productData as any)?.data || productData;

  // Versions & SKUs from dedicated endpoints
  const {
    data: versionsRaw,
    refetch: refetchVersions,
    isLoading: versionsLoading,
  } = useQuery({
    queryKey: ['admin-product-versions', id],
    queryFn: () => customInstance<any>({ url: `/admin/products/${id}/versions`, method: 'GET' }),
    enabled: !!id,
  });

  const {
    data: skusRaw,
    refetch: refetchSkus,
    isLoading: skusLoading,
  } = useQuery({
    queryKey: ['admin-product-skus', id],
    queryFn: () => customInstance<any>({ url: `/admin/products/${id}/skus`, method: 'GET' }),
    enabled: !!id,
  });

  const versions: any[] = (versionsRaw as any)?.data || [];
  const skus: any[] = (skusRaw as any)?.data || [];

  // Mutations
  const updateProductMutation = usePutAdminProductsProductId();
  const createVersionMutation = usePostAdminProductsProductIdVersions();
  const updateVersionMutation = useMutation({
    mutationFn: ({ versionId, data }: { versionId: string; data: any }) => customInstance({ url: `/api/v1/admin/products/${id}/versions/${versionId}`, method: 'PUT', data })
  });
  const createSkuMutation = usePostAdminProductsProductIdSkus();
  const updateSkuMutation = usePutAdminProductSkusSkuId();
  const updateStockMutation = usePatchAdminProductSkusSkuIdStock();

  // Handlers
  const handleProductSubmit = async (data: any) => {
    try {
      await updateProductMutation.mutateAsync({ productId: id, data });
      refetchProduct();
      toast.success('Cập nhật sản phẩm thành công!');
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm.');
    }
  };

  const handleSkuImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const file = e.target.files[0];
      const payload = new FormData();
      payload.append('file', file);
      payload.append('type', 'PRODUCT');
      
      const res: any = await customInstance({
        url: '/v1/admin/media/upload',
        method: 'POST',
        data: payload
      });
      
      setSkuForm(prev => ({
        ...prev,
        thumbnailMediaId: res.id,
        thumbnailUrl: res.location
      }));
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Tải ảnh thất bại');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVersionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: versionForm.name,
      code: versionForm.code,
      displayOrder: versionForm.displayOrder,
      status: versionForm.status as any,
    };
    try {
      if (editingVersion) {
        await updateVersionMutation.mutateAsync({ versionId: editingVersion.id, data });
        toast.success('Cập nhật phiên bản thành công!');
      } else {
        await createVersionMutation.mutateAsync({ productId: id, data });
        toast.success('Thêm phiên bản thành công!');
      }
      setShowVersionModal(false);
      setEditingVersion(null);
      setVersionForm({ ...EMPTY_VERSION_FORM });
      refetchVersions();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi lưu phiên bản.');
    }
  };

  const handleSkuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = {
      versionId: skuForm.versionId,
      skuCode: skuForm.skuCode,
      name: skuForm.name,
      color: skuForm.color || null,
      scent: skuForm.scent || null,
      type: skuForm.type || null,
      originalPrice: skuForm.originalPrice ? Number(skuForm.originalPrice) : null,
      salePrice: Number(skuForm.salePrice),
      stockQuantity: Number(skuForm.stockQuantity),
      status: skuForm.status,
      thumbnailMediaId: skuForm.thumbnailMediaId || null,
    };
    try {
      if (editingSku) {
        await updateSkuMutation.mutateAsync({ skuId: editingSku.id, data });
      } else {
        await createSkuMutation.mutateAsync({ productId: id, data });
      }
      setShowSkuModal(false);
      setEditingSku(null);
      setSkuForm({ ...EMPTY_SKU_FORM });
      refetchSkus();
      toast.success(editingSku ? 'Cập nhật SKU thành công' : 'Tạo SKU thành công');
    } catch {
      toast.error('Có lỗi xảy ra khi lưu SKU.');
    }
  };

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStockMutation.mutateAsync({ skuId: stockModal.id, data: { stockQuantity: newStockQty } });
      setStockModal(null);
      refetchSkus();
    } catch {
      alert('Có lỗi xảy ra khi cập nhật tồn kho.');
    }
  };

  const openEditSku = (sku: any) => {
    setEditingSku(sku);
    setSkuForm({
      versionId: sku.versionId || '',
      skuCode: sku.skuCode || '',
      name: sku.skuName || '',
      color: sku.color || '',
      scent: sku.scent || '',
      type: sku.type || '',
      originalPrice: sku.originalPrice != null ? String(sku.originalPrice) : '',
      salePrice: sku.salePrice != null ? String(sku.salePrice) : '',
      stockQuantity: String(sku.stockQuantity ?? 0),
      status: sku.status || 'ACTIVE',
      thumbnailMediaId: sku.thumbnailMedia?.id || '',
      thumbnailUrl: sku.thumbnailMedia?.location || '',
    });
    setShowSkuModal(true);
  };

  if (isFetching) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-sm text-text-muted">
          <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
          <p>Đang tải dữ liệu sản phẩm...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center text-text-muted">
          <span className="material-symbols-outlined text-5xl block mb-2">error</span>
          <p className="text-title-md">Không tìm thấy sản phẩm!</p>
          <Link href="/admin/san-pham" className="text-primary underline mt-2 inline-block">← Quay lại danh sách</Link>
        </div>
      </main>
    );
  }

  const initialProductData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryId: product.category?.id,
    shortDescription: product.shortDescription,
    detailDescription: product.detailDescription,
    usageInstruction: product.usageInstruction,
    safetyNote: product.safetyNote,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    benefits: product.benefits,
    preservationInstruction: product.preservationInstruction,
    primaryKeyword: product.primaryKeyword,
    isFeatured: product.isFeatured,
    displayOrder: product.displayOrder,
    status: product.status as ProductStatus,
    images: product.images || [],
  };

  // ─── Input style shorthand
  const inputCls = 'w-full px-4 py-2 bg-background border border-border-warm rounded-lg focus:outline-none focus:border-primary text-body-md';
  const selectCls = 'appearance-none ' + inputCls + ' cursor-pointer';
  const labelCls = 'text-label-md font-label-md text-on-surface';

  // ─── Tab button
  const TabBtn = ({ tab, label, icon, count }: { tab: Tab; label: string; icon: string; count?: number }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-xs px-4 py-2 rounded-full text-label-md font-label-md whitespace-nowrap transition-all ${
        activeTab === tab
          ? 'bg-primary/10 text-primary border border-primary/30 shadow-ambient-low'
          : 'text-text-muted border border-transparent hover:bg-surface-container'
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
      {count !== undefined && (
        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-caption font-mono ${activeTab === tab ? 'bg-primary/15 text-primary' : 'bg-surface-container text-text-muted'}`}>
          {count}
        </span>
      )}
    </button>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; cls: string }> = {
      PUBLISHED: { label: 'Hiển thị', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      DRAFT:     { label: 'Nháp',     cls: 'bg-amber-50 text-amber-700 border-amber-200' },
      HIDDEN:    { label: 'Ẩn',       cls: 'bg-gray-100 text-gray-500 border-gray-200' },
      ARCHIVED:  { label: 'Lưu trữ', cls: 'bg-red-50 text-red-600 border-red-200' },
      ACTIVE:    { label: 'Hoạt động', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      INACTIVE:  { label: 'Ẩn',       cls: 'bg-gray-100 text-gray-500 border-gray-200' },
      OUT_OF_STOCK: { label: 'Hết hàng', cls: 'bg-red-50 text-red-600 border-red-200' },
    };
    const item = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-500 border-gray-200' };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-caption border ${item.cls}`}>
        {item.label}
      </span>
    );
  };

  const StockBadge = ({ stockStatus, qty }: { stockStatus: string; qty: number }) => {
    const color = stockStatus === 'OUT_OF_STOCK' ? 'text-red-600' : stockStatus === 'LOW_STOCK' ? 'text-amber-600' : 'text-emerald-700';
    const dot = stockStatus === 'OUT_OF_STOCK' ? 'bg-red-500' : stockStatus === 'LOW_STOCK' ? 'bg-amber-500' : 'bg-emerald-500';
    const label = stockStatus === 'OUT_OF_STOCK' ? 'Hết hàng' : stockStatus === 'LOW_STOCK' ? 'Sắp hết' : 'Còn hàng';
    return (
      <div>
        <span className={`font-semibold ${color}`}>{qty}</span>
        <div className={`text-caption flex items-center gap-1 ${color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
          {label}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 overflow-y-auto bg-background">
      {/* Page header */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border-warm px-gutter py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-sm">
          <Link
            href="/admin/san-pham"
            className="p-2 hover:bg-surface-container rounded-full transition-colors text-text-muted flex-shrink-0"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-headline-sm font-headline-sm text-on-surface truncate">Chỉnh sửa sản phẩm</h1>
            <p className="text-caption text-text-muted truncate">{product.name}</p>
          </div>
          {/* Tabs in header */}
          <div className="hidden md:flex gap-2">
            <TabBtn tab="info"     label="Thông tin"  icon="info"        />
            <TabBtn tab="versions" label="Phiên bản"  icon="layers"      count={versions.length} />
            <TabBtn tab="skus"     label="Phân loại (SKU)" icon="inventory_2" count={skus.length} />
          </div>
        </div>
        {/* Mobile tabs */}
        <div className="flex md:hidden gap-2 overflow-x-auto mt-2 px-gutter pb-1">
          <TabBtn tab="info"     label="Thông tin"  icon="info"        />
          <TabBtn tab="versions" label="Phiên bản"  icon="layers"      count={versions.length} />
          <TabBtn tab="skus"     label="Phân loại (SKU)" icon="inventory_2" count={skus.length} />
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-7xl mx-auto p-gutter space-y-md">

        {/* ── Tab: Thông tin chung ────────────────────────────────────── */}
        {activeTab === 'info' && (
          <div className="bg-surface-container-lowest rounded-2xl border border-border-warm shadow-ambient-low">
            <ProductForm
              title=""
              initialData={initialProductData}
              onSubmit={handleProductSubmit}
              isLoading={updateProductMutation.isPending}
              embedded
            />
          </div>
        )}

        {/* ── Tab: Phiên bản ──────────────────────────────────────────── */}
        {activeTab === 'versions' && (
          <div className="space-y-md">
            <div className="flex items-start justify-between gap-4">
              <p className="text-body-md text-text-muted">
                Phiên bản xác định nhóm lớn của sản phẩm (vd: <strong>Có Nhiệt</strong>, <strong>Không Nhiệt</strong>, <strong>Combo</strong>). Sau khi tạo phiên bản, hãy sang tab <em>Phân loại (SKU)</em> để thêm SKU.
              </p>
              <button
                onClick={() => { setEditingVersion(null); setVersionForm({ ...EMPTY_VERSION_FORM }); setShowVersionModal(true); }}
                className="flex-shrink-0 flex items-center gap-xs bg-primary text-on-primary px-sm py-2 rounded-full hover:opacity-90 transition-opacity shadow-ambient-md text-label-md font-label-md"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Thêm phiên bản
              </button>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl border border-border-warm shadow-ambient-low overflow-hidden">
              {versionsLoading ? (
                <div className="p-10 text-center text-text-muted">
                  <span className="material-symbols-outlined text-3xl block mb-2 animate-spin">progress_activity</span>
                  Đang tải...
                </div>
              ) : versions.length === 0 ? (
                <div className="p-10 text-center text-text-muted">
                  <span className="material-symbols-outlined text-5xl block mb-3 opacity-20">layers</span>
                  <h3 className="text-title-md">{editingVersion ? 'Sửa phiên bản' : 'Thêm phiên bản mới'}</h3>
                  <p className="text-caption">Nhấn <strong>Thêm phiên bản</strong> để bắt đầu</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-border-warm">
                      {['Tên phiên bản', 'Mã (code)', 'Thứ tự', 'Trạng thái', 'Số SKU', ''].map(h => (
                        <th key={h} className="py-3 px-4 text-label-sm font-label-sm text-text-muted">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-warm">
                    {versions.map((v: any) => (
                      <tr key={v.id} className="hover:bg-surface/40 transition-colors group">
                        <td className="py-3 px-4 font-semibold text-on-surface">{v.name}</td>
                        <td className="py-3 px-4 font-mono text-caption text-text-muted">{v.code || '—'}</td>
                        <td className="py-3 px-4 text-text-muted">{v.displayOrder ?? 0}</td>
                        <td className="py-3 px-4"><StatusBadge status={v.status} /></td>
                        <td className="py-3 px-4 text-text-muted">{v.skus?.length ?? 0} SKU</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingVersion(v);
                                setVersionForm({
                                  name: v.name || '',
                                  code: v.code || '',
                                  displayOrder: v.displayOrder || 0,
                                  status: v.status || 'PUBLISHED'
                                });
                                setShowVersionModal(true);
                              }}
                              title="Sửa phiên bản"
                              className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-surface-container transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteVersion(v.id)}
                              disabled={deleteVersionMutation.isPending}
                              title="Xóa phiên bản"
                              className="p-1.5 text-text-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: SKU ────────────────────────────────────────────────── */}
        {activeTab === 'skus' && (
          <div className="space-y-md">
            <div className="flex items-start justify-between gap-4">
              <p className="text-body-md text-text-muted">
                Phân loại (SKU) là đơn vị bán hàng nhỏ nhất. Mỗi SKU có giá, tồn kho, màu sắc và mùi hương riêng.
              </p>
              <button
                onClick={() => {
                  setEditingSku(null);
                  setSkuForm({ ...EMPTY_SKU_FORM, versionId: versions[0]?.id || '' });
                  setShowSkuModal(true);
                }}
                className="flex-shrink-0 flex items-center gap-xs bg-primary text-on-primary px-sm py-2 rounded-full hover:opacity-90 transition-opacity shadow-ambient-md text-label-md font-label-md"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Thêm SKU
              </button>
            </div>

            {versions.length === 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-700">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <p className="text-body-sm">Bạn cần tạo ít nhất một <strong>Phiên bản</strong> trước khi thêm SKU.</p>
              </div>
            )}

            <div className="bg-surface-container-lowest rounded-2xl border border-border-warm shadow-ambient-low overflow-hidden">
              {skusLoading ? (
                <div className="p-10 text-center text-text-muted">
                  <span className="material-symbols-outlined text-3xl block mb-2 animate-spin">progress_activity</span>
                  Đang tải...
                </div>
              ) : skus.length === 0 ? (
                <div className="p-10 text-center text-text-muted">
                  <span className="material-symbols-outlined text-5xl block mb-3 opacity-20">inventory_2</span>
                  <p className="text-title-sm mb-1">Chưa có SKU nào</p>
                  <p className="text-caption">Tạo phiên bản trước, sau đó nhấn <strong>Thêm SKU</strong></p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-border-warm">
                        {['SKU', 'Phiên bản', 'Thuộc tính', 'Giá bán', 'Tồn kho', 'Trạng thái', ''].map(h => (
                          <th key={h} className="py-3 px-4 text-label-sm font-label-sm text-text-muted whitespace-nowrap last:text-right">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-warm">
                      {skus.map((sku: any) => {
                        const ver = versions.find((v: any) => v.id === sku.versionId);
                        const attrs = [sku.color, sku.scent, sku.type].filter(Boolean).join(' · ');
                        return (
                          <tr key={sku.id} className="hover:bg-surface/40 transition-colors group">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {sku.thumbnailMedia?.location ? (
                                  <div className="w-10 h-10 rounded border border-border-warm overflow-hidden flex-shrink-0 bg-surface-container-low">
                                    <img src={sku.thumbnailMedia.location} alt="SKU" className="w-full h-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded border border-border-warm flex items-center justify-center flex-shrink-0 bg-surface-container-low text-text-muted">
                                    <span className="material-symbols-outlined text-[20px]">image</span>
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-on-surface">{sku.skuName}</p>
                                  <p className="text-caption text-text-muted font-mono">{sku.skuCode}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-text-muted whitespace-nowrap">{ver?.name ?? '—'}</td>
                            <td className="py-3 px-4 text-text-muted text-caption">{attrs || '—'}</td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <p className="font-semibold text-on-surface">{Number(sku.salePrice).toLocaleString('vi-VN')}đ</p>
                              {sku.originalPrice && (
                                <p className="text-caption text-text-muted line-through">{Number(sku.originalPrice).toLocaleString('vi-VN')}đ</p>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <StockBadge stockStatus={sku.stockStatus} qty={sku.stockQuantity} />
                            </td>
                            <td className="py-3 px-4"><StatusBadge status={sku.status} /></td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => { setStockModal(sku); setNewStockQty(sku.stockQuantity); }}
                                  title="Cập nhật tồn kho"
                                  className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-surface-container transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[18px]">inventory</span>
                                </button>
                                <button
                                  onClick={() => openEditSku(sku)}
                                  title="Sửa SKU"
                                  className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-surface-container transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteSku(sku.id)}
                                  disabled={deleteSkuMutation.isPending}
                                  title="Xóa SKU"
                                  className="p-1.5 text-text-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── Modal: Thêm phiên bản ─────────────────────────────────────── */}
      {showVersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowVersionModal(false)}
          />
          <div className="relative bg-surface-container-lowest rounded-2xl border border-border-warm shadow-2xl w-full max-w-md p-md space-y-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-title-md font-title-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">layers</span>
                Thêm phiên bản mới
              </h2>
              <button
                onClick={() => setShowVersionModal(false)}
                className="p-1.5 hover:bg-surface-container rounded-full text-text-muted transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleVersionSubmit} className="space-y-sm">
              <div className="space-y-xs">
                <label className={labelCls}>Tên phiên bản *</label>
                <input
                  required
                  autoFocus
                  type="text"
                  value={versionForm.name}
                  onChange={e => setVersionForm(p => ({ ...p, name: e.target.value }))}
                  className={inputCls}
                  placeholder="Ví dụ: Có Nhiệt, Không Nhiệt, Combo..."
                />
              </div>

              <div className="space-y-xs">
                <label className={labelCls}>Mã phiên bản (tuỳ chọn)</label>
                <input
                  type="text"
                  value={versionForm.code}
                  onChange={e => setVersionForm(p => ({ ...p, code: e.target.value }))}
                  className={inputCls}
                  placeholder="VD: V1, HOT, COMBO..."
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="space-y-xs">
                  <label className={labelCls}>Thứ tự hiển thị</label>
                  <input
                    type="number"
                    min={0}
                    value={versionForm.displayOrder}
                    onChange={e => setVersionForm(p => ({ ...p, displayOrder: Number(e.target.value) }))}
                    className={inputCls}
                  />
                </div>
                <div className="space-y-xs">
                  <label className={labelCls}>Trạng thái</label>
                  <div className="relative">
                    <select
                      value={versionForm.status}
                      onChange={e => setVersionForm(p => ({ ...p, status: e.target.value }))}
                      className={selectCls}
                    >
                      <option value="PUBLISHED">Hiển thị</option>
                      <option value="HIDDEN">Ẩn</option>
                      <option value="DRAFT">Nháp</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[18px]">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-sm pt-2 border-t border-border-warm">
                <button
                  type="button"
                  onClick={() => setShowVersionModal(false)}
                  className="px-5 py-2 rounded-full border border-border-warm text-text-main hover:bg-surface-container transition-colors text-label-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createVersionMutation.isPending || updateVersionMutation.isPending}
                  className="px-6 py-2 bg-primary text-on-primary rounded-full hover:opacity-90 transition-opacity font-label-md"
                >
                  {(createVersionMutation.isPending || updateVersionMutation.isPending) ? 'Đang lưu...' : (editingVersion ? 'Cập nhật' : 'Thêm phiên bản')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Thêm / Sửa SKU ─────────────────────────────────────── */}
      {showSkuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => { setShowSkuModal(false); setEditingSku(null); }}
          />
          <div className="relative bg-surface-container-lowest rounded-2xl border border-border-warm shadow-2xl w-full max-w-lg p-md space-y-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-title-md font-title-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
                {editingSku ? 'Chỉnh sửa SKU' : 'Thêm SKU mới'}
              </h2>
              <button
                onClick={() => { setShowSkuModal(false); setEditingSku(null); }}
                className="p-1.5 hover:bg-surface-container rounded-full text-text-muted transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSkuSubmit} className="space-y-sm">
              {/* Version select */}
              <div className="space-y-xs">
                <label className={labelCls}>Phiên bản *</label>
                <div className="relative">
                  <select
                    required
                    value={skuForm.versionId}
                    onChange={e => setSkuForm(p => ({ ...p, versionId: e.target.value }))}
                    className={selectCls}
                  >
                    <option value="">Chọn phiên bản</option>
                    {versions.map((v: any) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[18px]">expand_more</span>
                </div>
              </div>

              {/* SKU Image Upload */}
              <div className="mb-4">
                <label className="block text-label-sm font-label-sm text-text-muted mb-2">Ảnh đại diện SKU</label>
                <div className="flex items-center gap-4">
                  {skuForm.thumbnailUrl ? (
                    <div className="relative w-20 h-20 rounded overflow-hidden border border-border-warm bg-surface-container-low group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={skuForm.thumbnailUrl} alt="SKU Thumbnail" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setSkuForm(prev => ({ ...prev, thumbnailUrl: '', thumbnailMediaId: '' }))} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white">delete</span>
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-20 h-20 rounded border-2 border-dashed border-border-warm bg-surface-container-low flex flex-col items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer">
                      {uploadingImage ? (
                        <span className="material-symbols-outlined text-2xl mb-1 animate-spin">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-2xl mb-1">add_photo_alternate</span>
                      )}
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleSkuImageUpload} disabled={uploadingImage} />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="space-y-xs">
                  <label className={labelCls}>Mã SKU *</label>
                  <input
                    required
                    type="text"
                    value={skuForm.skuCode}
                    onChange={e => setSkuForm(p => ({ ...p, skuCode: e.target.value }))}
                    className={inputCls}
                    placeholder="VD: NH-GOI-CNHIET-BE"
                  />
                </div>
                <div className="space-y-xs">
                  <label className={labelCls}>Tên SKU *</label>
                  <input
                    required
                    type="text"
                    value={skuForm.name}
                    onChange={e => setSkuForm(p => ({ ...p, name: e.target.value }))}
                    className={inputCls}
                    placeholder="VD: Có Nhiệt - Màu Be"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-sm">
                <div className="space-y-xs">
                  <label className={labelCls}>Màu sắc</label>
                  <input type="text" value={skuForm.color} onChange={e => setSkuForm(p => ({ ...p, color: e.target.value }))} className={inputCls} placeholder="Màu Be" />
                </div>
                <div className="space-y-xs">
                  <label className={labelCls}>Mùi hương</label>
                  <input type="text" value={skuForm.scent} onChange={e => setSkuForm(p => ({ ...p, scent: e.target.value }))} className={inputCls} placeholder="Ngải cứu" />
                </div>
                <div className="space-y-xs">
                  <label className={labelCls}>Loại</label>
                  <input type="text" value={skuForm.type} onChange={e => setSkuForm(p => ({ ...p, type: e.target.value }))} className={inputCls} placeholder="Standard" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="space-y-xs">
                  <label className={labelCls}>Giá gốc (đ)</label>
                  <input
                    type="number"
                    min={0}
                    value={skuForm.originalPrice}
                    onChange={e => setSkuForm(p => ({ ...p, originalPrice: e.target.value }))}
                    className={inputCls}
                    placeholder="0 (để trống nếu không có)"
                  />
                </div>
                <div className="space-y-xs">
                  <label className={labelCls}>Giá bán (đ) *</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={skuForm.salePrice}
                    onChange={e => setSkuForm(p => ({ ...p, salePrice: e.target.value }))}
                    className={inputCls}
                    placeholder="399000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="space-y-xs">
                  <label className={labelCls}>Số lượng kho *</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={skuForm.stockQuantity}
                    onChange={e => setSkuForm(p => ({ ...p, stockQuantity: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div className="space-y-xs">
                  <label className={labelCls}>Trạng thái</label>
                  <div className="relative">
                    <select
                      value={skuForm.status}
                      onChange={e => setSkuForm(p => ({ ...p, status: e.target.value }))}
                      className={selectCls}
                    >
                      <option value="ACTIVE">Hoạt động</option>
                      <option value="INACTIVE">Ẩn</option>
                      <option value="OUT_OF_STOCK">Hết hàng</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[18px]">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-sm pt-2 border-t border-border-warm">
                <button
                  type="button"
                  onClick={() => { setShowSkuModal(false); setEditingSku(null); }}
                  className="px-5 py-2 rounded-full border border-border-warm text-text-main hover:bg-surface-container transition-colors text-label-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createSkuMutation.isPending || updateSkuMutation.isPending}
                  className="px-5 py-2 rounded-full bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-ambient-md text-label-md disabled:opacity-50"
                >
                  {(createSkuMutation.isPending || updateSkuMutation.isPending)
                    ? 'Đang lưu...'
                    : editingSku ? 'Cập nhật SKU' : 'Tạo SKU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Cập nhật tồn kho ────────────────────────────────────── */}
      {stockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setStockModal(null)}
          />
          <div className="relative bg-surface-container-lowest rounded-2xl border border-border-warm shadow-2xl w-full max-w-sm p-md space-y-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-title-md font-title-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">inventory</span>
                Cập nhật tồn kho
              </h2>
              <button
                onClick={() => setStockModal(null)}
                className="p-1.5 hover:bg-surface-container rounded-full text-text-muted transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-surface-container rounded-xl p-3">
              <p className="text-body-sm font-semibold text-on-surface">{stockModal.skuName}</p>
              <p className="text-caption text-text-muted font-mono">{stockModal.skuCode}</p>
              <p className="text-caption text-text-muted mt-1">Tồn kho hiện tại: <span className="font-semibold text-on-surface">{stockModal.stockQuantity}</span></p>
            </div>

            <form onSubmit={handleStockUpdate} className="space-y-sm">
              <div className="space-y-xs">
                <label className={labelCls}>Số lượng mới *</label>
                <input
                  required
                  autoFocus
                  type="number"
                  min={0}
                  value={newStockQty}
                  onChange={e => setNewStockQty(Number(e.target.value))}
                  className={inputCls + ' text-center text-2xl font-bold'}
                />
                <div className="flex gap-2">
                  {[0, 10, 25, 50, 100].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setNewStockQty(v)}
                      className="flex-1 py-1 text-caption rounded-lg border border-border-warm hover:bg-surface-container transition-colors text-text-muted"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-sm pt-2 border-t border-border-warm">
                <button
                  type="button"
                  onClick={() => setStockModal(null)}
                  className="px-5 py-2 rounded-full border border-border-warm text-text-main hover:bg-surface-container transition-colors text-label-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={updateStockMutation.isPending}
                  className="px-5 py-2 rounded-full bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-ambient-md text-label-md disabled:opacity-50"
                >
                  {updateStockMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
