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
      return "text-primary font-bold relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-soft-sage after:rounded-full font-label-md text-label-md hover:scale-105 transition-transform duration-200";
    }
    return "text-secondary hover:text-primary font-label-md text-label-md hover:scale-105 transition-transform duration-200";
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/88 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center h-20 px-gutter max-w-container-max mx-auto">
        {/* Brand Logo */}
        <Link className="font-display-lg text-display-lg text-primary tracking-tight" href="/">NaHerbs</Link>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex gap-gutter items-center">
          <Link className={getLinkClass('/', true)} href="/">Trang chủ</Link>
          <Link className={getLinkClass('/san-pham')} href="/san-pham">Sản phẩm</Link>
          <Link className={getLinkClass('/tin-tuc')} href="/tin-tuc">Tin tức</Link>
          <Link className={getLinkClass('/gioi-thieu')} href="/gioi-thieu">Giới thiệu</Link>
          <Link className="text-secondary hover:text-primary font-label-md text-label-md hover:scale-105 transition-transform duration-200" href="/#contact">Liên hệ</Link>
        </nav>

        {/* Trailing Actions */}
        <div className="flex items-center gap-md">
          <Link href="/san-pham" className="text-primary hover:scale-105 transition-transform duration-200 active:scale-95" title="Tìm kiếm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
          </Link>
          <Link
            href="/cart"
            className="text-primary hover:scale-105 transition-transform duration-200 active:scale-95 relative inline-flex items-center"
            title="Giỏ hàng"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border border-surface">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="relative hidden md:flex items-center gap-xs">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((open) => !open)}
                className="flex items-center gap-xs rounded-full py-1 pl-1 pr-2 hover:bg-success-bg transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 shadow-sm">
                  <img
                    src={user.avatarUrl || '/images/avatars/default-avatar.jpg'}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-label-md text-label-md text-primary font-semibold max-w-[120px] truncate">
                  {user.name}
                </span>
                <span className="material-symbols-outlined text-primary text-[18px]">
                  expand_more
                </span>
              </button>
              
              {accountMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-herbal-beige bg-surface py-2 shadow-ambient-2">
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setAccountMenuOpen(false)}
                      className="block px-md py-2 font-label-md text-label-md text-primary font-semibold hover:bg-success-bg border-b border-herbal-beige/50"
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
            <>
              <Link href="/dang-nhap" className="text-primary hover:scale-105 transition-transform duration-200 active:scale-95 hidden md:block">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
              </Link>
              <Link
                href="/dang-nhap"
                className="border border-primary text-primary rounded-full px-sm py-xs font-label-md text-label-md hover:bg-success-bg transition-colors shadow-ambient-1 active:scale-95 hidden md:block">
                Đăng nhập
              </Link>
            </>
          )}
          
          <button
            type="button"
            onClick={openChatbot}
            className="bg-primary text-on-primary rounded-full px-sm py-xs font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-ambient-1 active:scale-95 hidden md:block">
            Tư vấn ngay
          </button>
        </div>
      </div>
    </header>
  );
}
