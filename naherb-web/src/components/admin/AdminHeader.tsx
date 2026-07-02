"use client";

import { extractSessionUser } from "@/lib/current-user";
import { AXIOS_INSTANCE } from "@/services/api-client";
import { useGetAuthMe } from "@/services/generated/customer-profile/customer-profile";

export default function AdminHeader() {
  const { data } = useGetAuthMe({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  });
  const avatarUrl = extractSessionUser(data)?.avatarUrl;

  const handleLogout = async () => {
    try {
      await AXIOS_INSTANCE.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border-warm bg-surface/88 px-md shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-md">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            search
          </span>
          <input
            className="w-64 rounded-full border-none bg-surface-container py-2 pl-10 pr-4 text-body-md font-body-md outline-none transition-all focus:ring-2 focus:ring-primary"
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
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-all hover:bg-surface-container hover:text-primary">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-all hover:bg-surface-container hover:text-primary">
            <span className="material-symbols-outlined">apps</span>
          </button>
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
