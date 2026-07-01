"use client";

import { usePathname } from "next/navigation";
import { ChatbotProvider } from "./ChatbotContext";
import ChatbotWidget from "./ChatbotWidget";

const HIDDEN_PREFIXES = ["/admin", "/dang-nhap", "/dang-ky"];

function shouldShowChatbot(pathname: string): boolean {
  return !HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function ChatbotShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "/";
  const showChatbot = shouldShowChatbot(pathname);

  return (
    <ChatbotProvider>
      {children}
      {showChatbot && <ChatbotWidget />}
    </ChatbotProvider>
  );
}
