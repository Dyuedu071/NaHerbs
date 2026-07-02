import type { RecommendedProduct } from "@/services/generated/model/recommendedProduct";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export interface StreamChatbotPayload {
  conversationId: string;
  sessionId: string;
  message: string;
  sourcePage?: string;
}

export interface StreamMetaEvent {
  conversationId?: string;
  recommendedProducts?: RecommendedProduct[];
}

export interface StreamDoneEvent {
  conversationId?: string;
  answer?: string;
  disclaimer?: string;
  recommendedProducts?: RecommendedProduct[];
}

export interface StreamChatbotCallbacks {
  onMeta?: (data: StreamMetaEvent) => void;
  onToken?: (text: string) => void;
  onDone?: (data: StreamDoneEvent) => void;
  onError?: (message: string) => void;
}

function parseSseBlock(
  block: string,
  callbacks: StreamChatbotCallbacks,
): void {
  let eventName = "message";
  const dataLines: string[] = [];

  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  }

  if (dataLines.length === 0) {
    return;
  }

  const rawData = dataLines.join("\n");
  try {
    const payload = JSON.parse(rawData) as Record<string, unknown>;
    switch (eventName) {
      case "meta":
        callbacks.onMeta?.(payload as StreamMetaEvent);
        break;
      case "token":
        if (typeof payload.text === "string") {
          callbacks.onToken?.(payload.text);
        }
        break;
      case "done":
        callbacks.onDone?.(payload as StreamDoneEvent);
        break;
      case "error":
        callbacks.onError?.(
          typeof payload.message === "string"
            ? payload.message
            : "Không thể xử lý tin nhắn.",
        );
        break;
      default:
        break;
    }
  } catch {
    callbacks.onError?.("Phản hồi chatbot không hợp lệ.");
  }
}

export async function streamChatbotMessage(
  payload: StreamChatbotPayload,
  callbacks: StreamChatbotCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`${API_BASE}/chatbot/messages/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    credentials: "include",
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    let message = "Không thể gửi tin nhắn. Vui lòng thử lại sau.";
    try {
      const errorBody = (await response.json()) as { message?: string };
      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // ignore parse errors
    }
    callbacks.onError?.(message);
    throw new Error(message);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    const message = "Trình duyệt không hỗ trợ streaming.";
    callbacks.onError?.(message);
    throw new Error(message);
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop() ?? "";

    for (const block of blocks) {
      const normalized = block.replace(/\r/g, "").trim();
      if (normalized) {
        parseSseBlock(normalized, callbacks);
      }
    }
  }

  const trailing = buffer.replace(/\r/g, "").trim();
  if (trailing) {
    parseSseBlock(trailing, callbacks);
  }
}
