const SESSION_KEY = "naherb_chatbot_session_id";
const CONVERSATION_KEY = "naherb_chatbot_conversation_id";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }
  const sessionId = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

export function getStoredConversationId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(CONVERSATION_KEY);
}

export function setStoredConversationId(conversationId: string): void {
  localStorage.setItem(CONVERSATION_KEY, conversationId);
}

export function clearStoredConversationId(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(CONVERSATION_KEY);
}
