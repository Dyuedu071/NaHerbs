"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePostAdminProducts } from '@/services/generated/admin-products/admin-products';
import ProductForm from '../_components/ProductForm';
import { toast } from 'react-hot-toast';

export default function CreateProductPage() {
  const router = useRouter();
  const createProductMutation = usePostAdminProducts();

  const handleSubmit = async (data: any) => {
    try {
      await createProductMutation.mutateAsync({ data });
      toast.success('Tạo sản phẩm thành công!');
      // Redirect back to list on success
      router.push('/admin/san-pham');
    } catch (error: any) {
      console.error('Failed to create product', error);
      const errorMsg = error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm.';
      toast.error(errorMsg);
    }
  };

  return (
    <ProductForm
      title="Thêm sản phẩm mới"
      onSubmit={handleSubmit}
      isLoading={createProductMutation.isPending}
    />
  );
}
