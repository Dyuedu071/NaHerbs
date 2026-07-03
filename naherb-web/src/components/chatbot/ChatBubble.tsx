import type { ChatMessage } from "@/lib/chatbot-messages";
import ChatProductCard from "./ChatProductCard";
import ChatSuggestedActions from "./ChatSuggestedActions";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full min-w-0 max-w-full flex-col gap-xs ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[88%] min-w-0 break-words whitespace-pre-wrap rounded-2xl px-sm py-xs font-body-md text-body-md shadow-sm ${
          isUser
            ? "rounded-tr-sm bg-primary text-on-primary"
            : "rounded-tl-sm border border-border-warm bg-surface text-text-main"
        }`}
      >
        {message.content?.trim() ? (
          message.content
        ) : (
          <span className="flex items-center gap-1 py-0.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-soft-sage [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-soft-sage [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-soft-sage" />
          </span>
        )}
      </div>

      {!isUser && message.disclaimer?.trim() && (
        <p className="max-w-[88%] font-caption text-caption text-text-muted">
          {message.disclaimer}
        </p>
      )}

      {!isUser && (message.recommendedProducts?.length ?? 0) > 0 && (
        <div className="flex w-full min-w-0 max-w-full flex-col gap-xs">
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
