import type { StoredChatMessage } from "@/lib/chatbot-messages";
import ChatProductCard from "./ChatProductCard";
import ChatSuggestedActions from "./ChatSuggestedActions";

interface ChatBubbleProps {
  message: StoredChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex flex-col gap-xs ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-sm py-xs font-body-md text-body-md shadow-sm ${
          isUser
            ? "rounded-tr-sm bg-primary text-on-primary"
            : "rounded-tl-sm border border-border-warm bg-surface text-text-main"
        }`}
      >
        {message.content}
      </div>

      {!isUser && message.disclaimer?.trim() && (
        <p className="max-w-[88%] font-caption text-caption text-text-muted">
          {message.disclaimer}
        </p>
      )}

      {!isUser && (message.recommendedProducts?.length ?? 0) > 0 && (
        <div className="flex w-full max-w-[92%] flex-col gap-xs">
          {message.recommendedProducts!.map((product) => (
            <ChatProductCard key={`${product.productId}-${product.skuId}`} product={product} />
          ))}
        </div>
      )}

      {!isUser && (message.suggestedActions?.length ?? 0) > 0 && (
        <ChatSuggestedActions actions={message.suggestedActions!} />
      )}
    </div>
  );
}
