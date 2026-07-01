"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useGetAdminProducts } from '@/services/generated/admin-products/admin-products';
import { useGetProductCategories } from '@/services/generated/public-products/public-products';

// Define structure for display products
interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  categorySlug: string;
  variants: string;
  price: string;
  stock: number;
  stockText: string;
  stockStatus: 'instock' | 'lowstock' | 'outofstock';
  status: 'active' | 'hidden';
  statusText: string;
  imageUrl: string;
}

export default function AdminProducts() {
  const { data: backendData, isLoading } = useGetAdminProducts();
  const { data: categoriesData } = useGetProductCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'lowstock' | 'hidden'>('all');

  const rawData = (backendData as any)?.data || backendData;
  const apiProducts = Array.isArray(rawData) ? rawData : (rawData?.items || []);
  
  const products: ProductItem[] = apiProducts.map((p: any, idx: number) => {
    const minPrice = p.minSalePrice ? `${p.minSalePrice.toLocaleString('vi-VN')}đ` : "0đ";
    const maxPrice = p.maxSalePrice ? `${p.maxSalePrice.toLocaleString('vi-VN')}đ` : "0đ";
    const priceDisplay = p.minSalePrice && p.maxSalePrice && p.minSalePrice !== p.maxSalePrice 
      ? `${minPrice} - ${maxPrice}` 
      : minPrice;

    const isOutOfStock = p.stockStatus === 'OUT_OF_STOCK' || (p.totalStockQuantity !== undefined && p.totalStockQuantity <= 0);
    const isLowStock = p.stockStatus === 'LOW_STOCK';
    
    let stockText = "Còn hàng";
    let stockStatus: 'instock' | 'lowstock' | 'outofstock' = 'instock';
    if (isOutOfStock) {
      stockText = "Hết hàng";
      stockStatus = 'outofstock';
    } else if (isLowStock) {
      stockText = "Sắp hết";
      stockStatus = 'lowstock';
    }

    const isHidden = p.status === 'DRAFT' || p.status === 'ARCHIVED' || p.status === 'HIDDEN';
    
    return {
      id: p.id || `api-prod-${idx}`,
      name: p.name || "Sản phẩm không tên",
      sku: p.skuCode ? p.skuCode.toUpperCase() : (p.slug ? p.slug.toUpperCase() : `SKU-${idx}`),
      category: p.categoryName || "Thảo dược",
      categorySlug: p.categorySlug || p.categoryName || "",
      variants: `${p.skuCount ?? 1} SKU`,
      price: priceDisplay,
      stock: p.totalStockQuantity ?? (isOutOfStock ? 0 : 50),
      stockText,
      stockStatus,
      status: isHidden ? "hidden" : "active",
      statusText: isHidden ? "Đã ẩn" : "Đang bán",
      imageUrl: p.thumbnailUrl || ""
    };
  });

  const dbCategories = (categoriesData as any)?.data || (Array.isArray(categoriesData) ? categoriesData : []);

  const categoryOptions = useMemo(() => {
    const map = new Map<string, { name: string; slug: string }>();
    if (Array.isArray(dbCategories)) {
      dbCategories.forEach((cat: any) => {
        if (cat.name) {
          const key = cat.slug || cat.name;
          map.set(key, { name: cat.name, slug: cat.slug || cat.name });
        }
      });
    }
    products.forEach((p) => {
      if (p.category && p.category !== "Thảo dược") {
        const key = p.categorySlug || p.category;
        if (!map.has(key)) {
          map.set(key, { name: p.category, slug: p.categorySlug || p.category });
        }
      }
    });
    return Array.from(map.values());
  }, [dbCategories, products]);

  // Filter products by selected category first (used for tab count calculations)
  const categoryFilteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter(p => p.categorySlug === selectedCategory || p.category === selectedCategory);
  }, [products, selectedCategory]);

  // Filter products based on search and tab selection
  const filteredProducts = categoryFilteredProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'active') {
      matchesTab = product.status === 'active' && product.stockStatus !== 'outofstock';
    } else if (activeTab === 'lowstock') {
      matchesTab = product.stockStatus === 'lowstock' || product.stockStatus === 'outofstock';
    } else if (activeTab === 'hidden') {
      matchesTab = product.status === 'hidden';
    }

    return matchesSearch && matchesTab;
  });

  return (
    <main className="flex-1 overflow-y-auto p-gutter bg-background">
      <div className="max-w-container-max mx-auto space-y-md">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm">
          <div>
            <h1 className="text-headline-md font-headline-md text-on-surface">Quản lý sản phẩm</h1>
            <p className="text-body-md font-body-md text-text-muted mt-1">
              Manage your herbal product catalog, inventory, and pricing.
            </p>
          </div>
          <button
            className="flex items-center gap-xs bg-primary text-on-primary px-sm py-2 rounded-full hover:bg-primary-container transition-all shadow-ambient-md hover:shadow-ambient-low hover:translate-y-px"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="text-label-md font-label-md">Thêm sản phẩm mới</span>
          </button>
        </div>

        {/* Filters & Controls Card */}
        <div
          className="bg-surface-container-lowest rounded-2xl border border-border-warm p-sm shadow-ambient-low flex flex-col lg:flex-row gap-sm items-center justify-between"
        >
          <div className="flex flex-1 w-full gap-sm">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 h-[42px] bg-background border border-border-warm rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-body-md"
                placeholder="Tìm kiếm tên sản phẩm, SKU..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="appearance-none h-[42px] pl-4 pr-10 py-2 bg-background border border-border-warm rounded-lg focus:outline-none focus:border-primary text-body-md text-text-main cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categoryOptions.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-label-md font-label-md whitespace-nowrap transition-colors ${
                activeTab === 'all'
                  ? 'bg-secondary-container/30 text-primary border border-primary/20'
                  : 'bg-transparent text-text-muted border border-transparent hover:bg-surface-container'
              }`}
            >
              Tất cả ({categoryFilteredProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-1.5 rounded-full text-label-md font-label-md whitespace-nowrap transition-colors ${
                activeTab === 'active'
                  ? 'bg-secondary-container/30 text-primary border border-primary/20'
                  : 'bg-transparent text-text-muted border border-transparent hover:bg-surface-container'
              }`}
            >
              Đang bán ({categoryFilteredProducts.filter(p => p.status === 'active' && p.stockStatus !== 'outofstock').length})
            </button>
            <button
              onClick={() => setActiveTab('lowstock')}
              className={`px-4 py-1.5 rounded-full text-label-md font-label-md whitespace-nowrap transition-colors ${
                activeTab === 'lowstock'
                  ? 'bg-secondary-container/30 text-primary border border-primary/20'
                  : 'bg-transparent text-text-muted border border-transparent hover:bg-surface-container'
              }`}
            >
              Hết hàng/Sắp hết ({categoryFilteredProducts.filter(p => p.stockStatus === 'lowstock' || p.stockStatus === 'outofstock').length})
            </button>
            <button
              onClick={() => setActiveTab('hidden')}
              className={`px-4 py-1.5 rounded-full text-label-md font-label-md whitespace-nowrap transition-colors ${
                activeTab === 'hidden'
                  ? 'bg-secondary-container/30 text-primary border border-primary/20'
                  : 'bg-transparent text-text-muted border border-transparent hover:bg-surface-container'
              }`}
            >
              Nháp/Đã ẩn ({categoryFilteredProducts.filter(p => p.status === 'hidden').length})
            </button>
          </div>
        </div>

        {/* Product Table Card */}
        <div
          className="bg-surface-container-lowest rounded-2xl border border-border-warm shadow-ambient-low overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-border-warm text-label-md font-label-md text-text-muted">
                  <th className="py-3 px-4 font-semibold w-12">
                    <input
                      className="rounded border-border-warm text-primary focus:ring-primary/20"
                      type="checkbox"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold">Sản phẩm</th>
                  <th className="py-3 px-4 font-semibold">Danh mục</th>
                  <th className="py-3 px-4 font-semibold">Phân loại</th>
                  <th className="py-3 px-4 font-semibold">Giá bán</th>
                  <th className="py-3 px-4 font-semibold">Tồn kho</th>
                  <th className="py-3 px-4 font-semibold">Trạng thái</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm text-body-md font-body-md">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-text-muted">
                      Đang tải danh sách sản phẩm...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-text-muted">
                      Không tìm thấy sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-surface/50 transition-colors group">
                      <td className="py-3 px-4">
                        <input
                          className="rounded border-border-warm text-primary focus:ring-primary/20"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-lg border border-border-warm overflow-hidden bg-herbal-beige flex-shrink-0 flex items-center justify-center text-primary"
                          >
                            {product.imageUrl ? (
                              <img
                                alt={product.name}
                                className="w-full h-full object-cover"
                                src={product.imageUrl}
                              />
                            ) : (
                              <span className="material-symbols-outlined">eco</span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-on-surface line-clamp-1">
                              {product.name}
                            </div>
                            <div className="text-caption text-text-muted">
                              SKU: {product.sku}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-muted">{product.category}</td>
                      <td className="py-3 px-4 text-text-muted">{product.variants}</td>
                      <td className="py-3 px-4 font-semibold">{product.price}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span
                            className={
                              product.stockStatus === 'outofstock'
                                ? 'text-error-text font-semibold'
                                : product.stockStatus === 'lowstock'
                                ? 'text-tertiary-container font-semibold'
                                : ''
                            }
                          >
                            {product.stock}
                          </span>
                          <span
                            className={`text-caption flex items-center gap-1 ${
                              product.stockStatus === 'outofstock'
                                ? 'text-error-text'
                                : product.stockStatus === 'lowstock'
                                ? 'text-tertiary-container'
                                : 'text-primary'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                product.stockStatus === 'outofstock'
                                  ? 'bg-error-text'
                                  : product.stockStatus === 'lowstock'
                                  ? 'bg-tertiary-container'
                                  : 'bg-primary'
                              }`}
                            ></span>
                            {product.stockText}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-caption border ${
                            product.status === 'active'
                              ? 'bg-success-bg text-primary border-primary/10'
                              : 'bg-surface-variant text-text-muted border-border-warm'
                          }`}
                        >
                          {product.statusText}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <button
                            className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          <button
                            className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button
                            className="p-1.5 text-text-muted hover:text-error rounded-lg hover:bg-error-bg transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div
            className="p-4 border-t border-border-warm flex items-center justify-between text-caption text-text-muted"
          >
            <div>
              Hiển thị 1-{filteredProducts.length} trong số {filteredProducts.length} sản phẩm
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-1 rounded hover:bg-surface-container transition-colors disabled:opacity-50"
                disabled
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                className="w-6 h-6 rounded flex items-center justify-center bg-primary text-on-primary font-semibold"
              >
                1
              </button>
              <button
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-surface-container transition-colors"
              >
                2
              </button>
              <button
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-surface-container transition-colors"
              >
                3
              </button>
              <span>...</span>
              <button className="p-1 rounded hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
