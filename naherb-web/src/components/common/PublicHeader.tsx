"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useChatbot } from '@/components/chatbot/ChatbotContext';
import { logoutToGuestHome } from '@/lib/auth-logout';
import { useGetAuthMe } from '@/services/generated/customer-profile/customer-profile';

import { useGetCart } from '@/services/generated/cart/cart';
import type { Cart } from '@/services/generated/model/cart';
import NotificationBell from './NotificationBell';

export default function PublicHeader() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { open: openChatbot } = useChatbot();
  const { data } = useGetAuthMe({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
    }
  });

  const user = data as unknown as { id: string; email: string; name: string; role: string; avatarUrl?: string } | undefined;
  const isAuthenticated = !!user;

  const { data: cartResponse } = useGetCart({
    query: {
      enabled: isAuthenticated,
      retry: false,
    },
  });
  
  const cart = (cartResponse as { data?: Cart } | undefined)?.data;
  const cartItemCount = cart?.items?.reduce((acc, item) => acc + (item.quantity ?? 0), 0) ?? 0;

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleLogout = async () => {
    setAccountMenuOpen(false);
    await logoutToGuestHome(queryClient);
  };

  const getLinkClass = (path: string, exact = false) => {
    const isActive = exact ? pathname === path : (pathname?.startsWith(path) && path !== '/');
    if (isActive) {
      return "text-primary font-bold relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-px after:bg-primary font-label-md text-label-md transition-colors";
    }
    return "text-text-main hover:text-primary font-label-md text-label-md transition-colors";
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-surface shadow-sm">
      <div className="flex min-h-9 items-center justify-center bg-[#1f1b15] px-gutter py-1 text-center font-label-md text-[13px] font-semibold leading-tight text-[#f4ead5]">
        Tinh hoa thảo dược, chăm sóc sức khỏe từ thiên nhiên
      </div>

      <div className="relative flex min-h-[72px] items-center justify-between border-b border-border-warm bg-surface px-gutter">
        <div className="flex min-w-0 flex-1 items-center gap-md">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-text-main transition-colors hover:text-primary"
            aria-label="Tìm kiếm"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
          <nav className="hidden items-center gap-md lg:flex">
            <Link className={getLinkClass('/', true)} href="/">Trang chủ</Link>
            <Link className={getLinkClass('/san-pham')} href="/san-pham">Sản phẩm</Link>
            <Link className={getLinkClass('/tin-tuc')} href="/tin-tuc">Tin tức</Link>
            <Link className={getLinkClass('/gioi-thieu')} href="/gioi-thieu">Giới thiệu</Link>
          </nav>
        </div>

        <Link
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center leading-none text-primary"
          href="/"
          aria-label="NaHerbs"
        >
          <img src="/naherbs-logo-transparent.png" alt="" className="h-7 w-auto object-contain" />
          <span className="font-display-lg text-[22px] font-black tracking-normal text-[#40520a]">NaHerbs</span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-sm md:gap-md">
          <NotificationBell />

          {user ? (
            <div className="relative hidden md:flex items-center gap-xs">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((open) => !open)}
                className="flex items-center gap-xs py-1 text-primary transition-colors hover:text-on-primary-fixed-variant"
              >
                <div className="h-8 w-8 overflow-hidden rounded-full border border-primary/20 shadow-sm">
                  <img
                    src={user.avatarUrl || '/images/avatars/default-avatar.jpg'}
                    alt="User Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="max-w-[120px] truncate font-label-md text-label-md font-semibold">
                  {user.name}
                </span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-4 min-w-[220px] border border-herbal-beige bg-surface py-2 shadow-ambient-2">
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setAccountMenuOpen(false)}
                      className="block px-md py-2 font-label-md text-label-md font-semibold text-primary hover:bg-success-bg"
                    >
                      Trang quản lý (Admin)
                    </Link>
                  )}
                  <Link
                    href="/tai-khoan/ho-so"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block px-md py-2 font-label-md text-label-md text-text-main hover:bg-success-bg"
                  >
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    href="/tai-khoan/dia-chi"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block px-md py-2 font-label-md text-label-md text-text-main hover:bg-success-bg"
                  >
                    Địa chỉ giao hàng
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block px-md py-2 font-label-md text-label-md text-text-main hover:bg-success-bg"
                  >
                    Đơn hàng của tôi
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-xs px-md py-2 font-label-md text-label-md text-error hover:bg-error-container"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/dang-nhap" className="hidden font-label-md text-label-md text-text-main transition-colors hover:text-primary md:block">
              Đăng nhập
            </Link>
          )}

          <Link href="/lien-he" className="hidden font-label-md text-label-md text-text-main transition-colors hover:text-primary md:block">
            Liên hệ
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex items-center gap-1 font-label-md text-label-md text-text-main transition-colors hover:text-primary"
            title="Giỏ hàng"
          >
            <span className="hidden sm:inline">Giỏ hàng</span>
            <span className="sm:hidden material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_cart</span>
            <span>({cartItemCount})</span>
          </Link>

          <button
            type="button"
            onClick={openChatbot}
            className="hidden border border-primary px-sm py-xs font-label-md text-label-md text-primary transition-colors hover:bg-primary hover:text-on-primary md:block"
          >
            NAKI
          </button>
        </div>
      </div>
    </header>
  );
}
