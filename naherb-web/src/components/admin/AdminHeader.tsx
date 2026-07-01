"use client";

import { AXIOS_INSTANCE } from '@/services/api-client';
import { useGetAuthMe } from "@/services/generated/customer-profile/customer-profile";

export default function AdminHeader() {
  const { data } = useGetAuthMe({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
    }
  });
  const user = data as unknown as { avatarUrl?: string } | undefined;
  const handleLogout = async () => {
    try {
      await AXIOS_INSTANCE.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      window.location.href = '/login';
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-md h-16 sticky top-0 z-40 bg-surface/88 backdrop-blur-md shadow-sm border-b border-border-warm">
      <div className="flex items-center gap-md">
        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          >
            search
          </span>
          <input
            className="pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary text-body-md font-body-md w-64 outline-none transition-all"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-lg">
        <span className="text-label-md font-label-md font-semibold text-primary">
          Organic Wellness Core
        </span>
        <div className="flex items-center gap-sm">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined">apps</span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden ml-sm border border-border-warm shadow-sm">
            <img
              className="w-full h-full object-cover"
              alt="Admin Avatar"
              src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC-evsc8zgEtLnYVJ3_1r2ubC3F1RYQkMgOO6zoM_gL7oo0ds_FIjp_ulem8jucVnyU8AnVmUrrppSmxZ0dOkVJFK88By3IT7OKXeqfoO5VrSvHCmszOJzPEsLaOssABaVPSNJk57cj0rfjN6RdKvN8h-8qLwH1eCZTEKM7QX3fXACyDvzP1XpsYTaXPm07z9ai9ExFRuzT2k8UbwC83po4wEz1Erx7LBcsiIc9ixrDjhgHFRYzrCS8QDsuVOblf-P-0sY3CvxCYTE"}
            />
          </div>
          <button 
            onClick={handleLogout}
            className="ml-xs w-10 h-10 rounded-full flex items-center justify-center text-error hover:bg-error-container/30 transition-all"
            title="Đăng xuất"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
