"use client";

import { logoutToGuestHome } from "@/lib/auth-logout";
import { extractSessionUser } from "@/lib/current-user";
import { useGetAuthMe } from "@/services/generated/customer-profile/customer-profile";
import { useQueryClient } from "@tanstack/react-query";
import NotificationBell from "../common/NotificationBell";

export default function AdminHeader() {
  const queryClient = useQueryClient();
  const { data } = useGetAuthMe({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  });
  const avatarUrl = extractSessionUser(data)?.avatarUrl;

  const handleLogout = async () => {
    await logoutToGuestHome(queryClient);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border-warm bg-surface/88 px-md shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-md">
        {/* Placeholder for future left-side items */}
      </div>
      <div className="flex items-center gap-lg">
        <span className="text-label-md font-label-md font-semibold text-primary">
          Hệ thống quản trị NaHerbs
        </span>
        <div className="flex items-center gap-sm">
          <NotificationBell />
          <div className="ml-sm h-8 w-8 overflow-hidden rounded-full border border-border-warm shadow-sm">
            <img
              className="h-full w-full object-cover"
              alt="Admin Avatar"
              src={
                avatarUrl ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuC-evsc8zgEtLnYVJ3_1r2ubC3F1RYQkMgOO6zoM_gL7oo0ds_FIjp_ulem8jucVnyU8AnVmUrrppSmxZ0dOkVJFK88By3IT7OKXeqfoO5VrSvHCmszOJzPEsLaOssABaVPSNJk57cj0rfjN6RdKvN8h-8qLwH1eCZTEKM7QX3fXACyDvzP1XpsYTaXPm07z9ai9ExFRuzT2k8UbwC83po4wEz1Erx7LBcsiIc9ixrDjhgHFRYzrCS8QDsuVOblf-P-0sY3CvxCYTE"
              }
            />
          </div>
          <button
            onClick={handleLogout}
            className="ml-xs flex h-10 w-10 items-center justify-center rounded-full text-error transition-all hover:bg-error-container/30"
            title="Đăng xuất"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
