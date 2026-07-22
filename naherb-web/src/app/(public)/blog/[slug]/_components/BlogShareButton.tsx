"use client";

import { useState } from "react";

type BlogShareButtonProps = {
  title: string;
};

export default function BlogShareButton({ title }: BlogShareButtonProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-8 h-8 rounded-full bg-surface-variant text-on-surface flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors relative"
      title="Chia sẻ bài viết"
    >
      <span className="material-symbols-outlined text-[18px]">share</span>
      {copySuccess && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[11px] px-2 py-1 rounded whitespace-nowrap">
          Đã sao chép!
        </span>
      )}
    </button>
  );
}
