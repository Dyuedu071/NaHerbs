"use client";

import { useGetAuthMe } from "@/services/generated/customer-profile/customer-profile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetAuthMe({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (!isLoading && (isError || !data)) {
      router.replace("/login");
    }
  }, [data, isError, isLoading, router]);

  return { isLoading, isAuthenticated: !isLoading && !isError && !!data };
}
