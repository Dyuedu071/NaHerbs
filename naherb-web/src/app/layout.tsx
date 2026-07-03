import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CartShell from "@/components/cart/CartShell";
import ChatbotShell from "@/components/chatbot/ChatbotShell";
import { QueryProvider } from "@/components/providers/QueryProvider";
import ToastProvider from "@/components/providers/ToastProvider";
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

async function fetchSiteInfo(): Promise<Record<string, string>> {
  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
    const res = await fetch(`${apiBase}/v1/settings/site-info`, {
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

  const title = "NaHerbs - Tinh hoa thảo dược";
  const description = "Tinh hoa thảo dược, chăm sóc sức khỏe từ thiên nhiên";

  return {
    title: {
      default: title,
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
    icons: {
      icon: [
        {
          url: "/naherbs-icon.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/apple-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="icon"
          href="/naherbs-icon.png?v=20260703-2"
          type="image/png"
          sizes="512x512"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-icon.png?v=20260703-2"
          sizes="180x180"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <GoogleOAuthProvider
          clientId={
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
            "dummy-google-client-id.apps.googleusercontent.com"
          }
        >
          <QueryProvider>
            <ToastProvider />
            <CartShell>
              <ChatbotShell>{children}</ChatbotShell>
            </CartShell>
          </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
