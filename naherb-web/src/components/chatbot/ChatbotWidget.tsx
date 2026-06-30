"use client";

import {
  getStoredMessages,
  setStoredMessages,
  clearStoredMessages,
  type StoredChatMessage,
} from "@/lib/chatbot-messages";
import {
  clearStoredConversationId,
  getOrCreateSessionId,
  getStoredConversationId,
  setStoredConversationId,
} from "@/lib/chatbot-session";
import {
  postChatbotConversations,
  postChatbotMessages,
  useGetChatbotConfigPublic,
} from "@/services/generated/chatbot/chatbot";
import { usePathname } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";
import { useChatbot } from "./ChatbotContext";

function createMessageId(): string {
  return crypto.randomUUID();
}

function extractApiErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }
  return "Không thể gửi tin nhắn. Vui lòng thử lại sau.";
}

export default function ChatbotWidget() {
  const pathname = usePathname();
  const { isOpen, open, close } = useChatbot();
  const [messages, setMessages] = useState<StoredChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: configResponse, isLoading: isConfigLoading } =
    useGetChatbotConfigPublic({
      query: { retry: 1 },
    });

  const config = configResponse?.data;
  const isEnabled = config?.enabled !== false;
  const welcomeMessage =
    config?.welcomeMessage?.trim() ||
    "Xin chào! Tôi là trợ lý AI của NaHerbs. Bạn cần tư vấn sản phẩm nào?";
  const disclaimer =
    config?.disclaimer?.trim() ||
    "Thông tin từ chatbot chỉ mang tính tham khảo, không thay thế tư vấn y khoa.";
  const suggestedQuestions = config?.suggestedQuestions?.filter(Boolean) ?? [];

  const persistMessages = useCallback(
    (updater: StoredChatMessage[] | ((prev: StoredChatMessage[]) => StoredChatMessage[])) => {
      setMessages((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        setStoredMessages(next);
        return next;
      });
    },
    [],
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const ensureConversation = useCallback(async (): Promise<string> => {
    const stored = getStoredConversationId();
    if (stored) {
      setConversationId(stored);
      return stored;
    }

    const sessionId = getOrCreateSessionId();
    const response = await postChatbotConversations({
      sessionId,
      sourcePage: pathname || "/",
    });
    const id = response.data?.id;
    if (!id) {
      throw new Error("Không thể tạo hội thoại chatbot");
    }
    setStoredConversationId(id);
    setConversationId(id);
    return id;
  }, [pathname]);

  const startNewConversation = useCallback(async () => {
    clearStoredConversationId();
    clearStoredMessages();
    setConversationId(null);
    setMessages([]);
    setIsBootstrapping(true);
    try {
      const sessionId = getOrCreateSessionId();
      const response = await postChatbotConversations({
        sessionId,
        sourcePage: pathname || "/",
      });
      const id = response.data?.id;
      if (id) {
        setStoredConversationId(id);
        setConversationId(id);
      }
    } finally {
      setIsBootstrapping(false);
    }
  }, [pathname]);

  useEffect(() => {
    setMessages(getStoredMessages());
    const stored = getStoredConversationId();
    if (stored) {
      setConversationId(stored);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cancelled = false;
    const bootstrap = async () => {
      setIsBootstrapping(true);
      try {
        await ensureConversation();
      } catch {
        // Conversation will be created on first message.
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrap();
    inputRef.current?.focus();

    return () => {
      cancelled = true;
    };
  }, [isOpen, ensureConversation]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isSending, scrollToBottom]);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isSending) {
        return;
      }

      setIsSending(true);
      const userMessage: StoredChatMessage = {
        id: createMessageId(),
        role: "user",
        content: text,
      };
      persistMessages((prev) => [...prev, userMessage]);
      setInput("");

      try {
        const activeConversationId = conversationId ?? (await ensureConversation());
        const sessionId = getOrCreateSessionId();
        const response = await postChatbotMessages({
          conversationId: activeConversationId,
          sessionId,
          message: text,
          sourcePage: pathname || "/",
        });

        const data = response.data;
        const answer =
          data?.answer?.trim() ||
          "Xin lỗi, tôi chưa có câu trả lời phù hợp. Vui lòng thử lại.";

        const assistantMessage: StoredChatMessage = {
          id: createMessageId(),
          role: "assistant",
          content: answer,
          disclaimer: data?.disclaimer,
          recommendedProducts: data?.recommendedProducts,
          suggestedActions: data?.suggestedActions,
        };

        persistMessages((prev) => [...prev, assistantMessage]);

        if (data?.conversationId) {
          setStoredConversationId(data.conversationId);
          setConversationId(data.conversationId);
        }
      } catch (error) {
        const errorMessage: StoredChatMessage = {
          id: createMessageId(),
          role: "assistant",
          content: extractApiErrorMessage(error),
        };
        persistMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, ensureConversation, isSending, pathname, persistMessages],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  if (isConfigLoading || !isEnabled) {
    return null;
  }

  const showWelcome = messages.length === 0;

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={open}
          aria-label="Mở chatbot tư vấn NaHerbs"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-ambient-3 transition-transform duration-300 hover:scale-110 active:scale-95 md:bottom-8 md:right-8"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: "28px" }}
          >
            psychiatry
          </span>
        </button>
      )}

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Đóng chatbot"
            className="fixed inset-0 z-50 bg-inverse-surface/30 backdrop-blur-[2px] md:bg-transparent md:backdrop-blur-none"
            onClick={close}
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-label="NaHerbs AI Tư vấn"
            className="fixed inset-x-0 bottom-0 z-[60] flex max-h-[90vh] flex-col overflow-hidden rounded-t-[1.5rem] border border-border-warm bg-surface shadow-ambient-3 md:inset-auto md:bottom-24 md:right-8 md:h-[min(640px,80vh)] md:w-[min(400px,calc(100vw-2rem))] md:rounded-2xl"
          >
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border-warm md:hidden" />

            <header className="flex items-center justify-between gap-sm border-b border-border-warm bg-primary-container px-md py-sm">
              <div className="flex items-center gap-sm">
                <span
                  className="material-symbols-outlined text-on-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  psychiatry
                </span>
                <div>
                  <h2 className="font-label-md text-label-md text-on-primary">
                    NaHerbs AI Tư vấn
                  </h2>
                  <p className="font-caption text-caption text-on-primary/80">
                    Hỗ trợ 24/7
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => void startNewConversation()}
                  aria-label="Bắt đầu hội thoại mới"
                  title="Hội thoại mới"
                  className="rounded-full p-1 text-on-primary transition-colors hover:bg-on-primary/10"
                >
                  <span className="material-symbols-outlined">add_comment</span>
                </button>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Đóng"
                  className="rounded-full p-1 text-on-primary transition-colors hover:bg-on-primary/10"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col bg-surface-container-low">
              <div className="flex-1 space-y-sm overflow-y-auto px-md py-sm">
                {showWelcome && (
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-border-warm bg-surface px-sm py-xs font-body-md text-body-md text-text-main shadow-sm">
                    {welcomeMessage}
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <ChatBubble message={message} />
                  </div>
                ))}

                {(isSending || isBootstrapping) && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border-warm bg-surface px-sm py-2 shadow-sm">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-soft-sage [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-soft-sage [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-soft-sage" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {showWelcome && suggestedQuestions.length > 0 && (
                <div className="flex flex-wrap gap-xs border-t border-border-warm/60 bg-surface px-md py-sm">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      disabled={isSending}
                      onClick={() => void sendMessage(question)}
                      className="rounded-full border border-herbal-beige bg-success-bg px-sm py-1 font-caption text-caption text-primary transition-colors hover:bg-primary-fixed disabled:opacity-60"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}

              <p className="border-t border-border-warm/60 bg-error-bg/40 px-md py-2 font-caption text-caption text-text-muted">
                {disclaimer}
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex items-end gap-xs border-t border-border-warm bg-surface px-md py-sm"
              >
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage(input);
                    }
                  }}
                  placeholder="Nhập câu hỏi của bạn..."
                  disabled={isSending}
                  className="max-h-24 min-h-[44px] flex-1 resize-none rounded-full border border-border-warm bg-surface-container-low px-sm py-2 font-body-md text-body-md text-text-main placeholder:text-text-muted focus:border-primary focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={isSending || !input.trim()}
                  aria-label="Gửi tin nhắn"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition-colors hover:bg-on-primary-fixed-variant disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </div>
          </section>
        </>
      )}
    </>
  );
}
