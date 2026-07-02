let activeSessionId: string | null = null;

export function getOrCreateSessionId(): string {
  if (!activeSessionId) {
    activeSessionId = crypto.randomUUID();
  }
  return activeSessionId;
}

export function rotateSessionId(): string {
  activeSessionId = crypto.randomUUID();
  return activeSessionId;
}

export function clearSessionId(): void {
  activeSessionId = null;
}

export function clearLegacyChatbotStorage(): void {
  if (typeof window === "undefined") {
    return;
  }
  const keysToRemove: string[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith("naherb_chatbot_")) {
      keysToRemove.push(key);
    }
  }
  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }
  try {
    sessionStorage.removeItem("naherb_chatbot_messages");
  } catch {
    // Ignore cleanup errors.
  }
}
