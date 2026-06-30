import type { RecommendedProduct } from "@/services/generated/model/recommendedProduct";
import type { SuggestedAction } from "@/services/generated/model/suggestedAction";

const MESSAGES_KEY = "naherb_chatbot_messages";

export type ChatRole = "user" | "assistant";

export interface StoredChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  disclaimer?: string | null;
  recommendedProducts?: RecommendedProduct[];
  suggestedActions?: SuggestedAction[];
}

export function getStoredMessages(): StoredChatMessage[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = sessionStorage.getItem(MESSAGES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as StoredChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setStoredMessages(messages: StoredChatMessage[]): void {
  if (typeof window === "undefined") {
    return;
  }
  sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function clearStoredMessages(): void {
  if (typeof window === "undefined") {
    return;
  }
  sessionStorage.removeItem(MESSAGES_KEY);
}
