import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["400", "700", "900"],
  subsets: ["latin", "vietnamese"],
});

// Fetch site info từ backend (server-side, không cần auth)
async function fetchSiteInfo(): Promise<Record<string, string>> {
  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
    const res = await fetch(`${apiBase}/v1/settings/site-info`, {
      // Revalidate mỗi 1 giờ — thay đổi settings sẽ phản ánh sau tối đa 1h
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json?.data || json || {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const info = await fetchSiteInfo();

  const title = info.store_seo_title || info.store_name || "NaHerbs";
  const description =
    info.store_seo_description ||
    info.store_tagline ||
    "Thảo dược thiên nhiên cho sức khỏe của bạn";

  return {
    title: {
      default: title,
      // Trang con sẽ render dạng: "Tên trang | NaHerbs"
      template: `%s | ${info.store_name || "NaHerbs"}`,
    },
    description,
    openGraph: {
      title,
      description,
      siteName: info.store_name || "NaHerbs",
      locale: "vi_VN",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

import { QueryProvider } from "@/components/providers/QueryProvider";
import ChatbotShell from "@/components/chatbot/ChatbotShell";
import CartShell from "@/components/cart/CartShell";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastProvider } from '@/contexts/ToastContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy-google-client-id.apps.googleusercontent.com"}>
          <ToastProvider>
            <QueryProvider>
              <CartShell>
                <ChatbotShell>{children}</ChatbotShell>
              </CartShell>
            </QueryProvider>
          </ToastProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
