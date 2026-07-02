"use client";

import React, { useState } from 'react';

interface FavoriteButtonProps {
  productId: string;
}

export default function FavoriteButton({ productId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Implement actual API call to save favorite status
  };

  return (
    <button 
      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
        isFavorite 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-white/80 backdrop-blur-sm text-primary hover:bg-white active:text-tertiary'
      }`} 
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
    >
      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
        favorite
      </span>
    </button>
  );
}
