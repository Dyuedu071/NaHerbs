"use client";

import React from 'react';

interface AddToCartButtonProps {
  productId: string;
  isOutOfStock: boolean;
}

export default function AddToCartButton({ productId, isOutOfStock }: AddToCartButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      // TODO: Implement notify me when available
      return;
    }
    // TODO: Implement actual add to cart logic
    console.log('Add to cart', productId);
  };

  return (
    <button 
      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_20px_-2px_rgba(46,77,57,0.12)] transition-colors ${
        isOutOfStock 
          ? 'bg-surface-container-high text-text-muted cursor-not-allowed' 
          : 'bg-primary text-white hover:bg-on-primary-fixed-variant'
      }`}
      onClick={handleClick}
      aria-label={isOutOfStock ? "Nhận thông báo khi có hàng" : "Thêm vào giỏ hàng"}
    >
      <span className="material-symbols-outlined">
        {isOutOfStock ? 'notifications' : 'add_shopping_cart'}
      </span>
    </button>
  );
}
