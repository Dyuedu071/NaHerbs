import type { RecommendedProduct } from "@/services/generated/model/recommendedProduct";
import type { SuggestedAction } from "@/services/generated/model/suggestedAction";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  disclaimer?: string | null;
  recommendedProducts?: RecommendedProduct[];
  suggestedActions?: SuggestedAction[];
}
