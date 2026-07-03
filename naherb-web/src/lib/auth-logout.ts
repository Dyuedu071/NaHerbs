import { clearLegacyChatbotStorage, clearSessionId } from "@/lib/chatbot-session";
import { AXIOS_INSTANCE } from "@/services/api-client";
import { getGetAuthMeQueryKey } from "@/services/generated/customer-profile/customer-profile";
import type { QueryClient } from "@tanstack/react-query";

export async function logoutToGuestHome(queryClient?: QueryClient): Promise<void> {
  try {
    await AXIOS_INSTANCE.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    clearSessionId();
    clearLegacyChatbotStorage();
    queryClient?.removeQueries({ queryKey: getGetAuthMeQueryKey() });
    window.location.href = "/";
  }
}
