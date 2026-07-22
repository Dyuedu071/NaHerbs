import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CartShell from "@/components/cart/CartShell";
import ChatbotShell from "@/components/chatbot/ChatbotShell";
import { QueryProvider } from "@/components/providers/QueryProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import { WebSocketProvider } from "@/components/websocket/WebSocketContext";
import JsonLd from "@/components/seo/JsonLd";
import {
  DEFAULT_STORE_NAME,
  buildOrganizationJsonLd,
  buildPageMetadata,
  fetchSiteInfo,
  getSiteUrl,
} from "@/lib/seo";
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

export async function generateMetadata(): Promise<Metadata> {
  const info = await fetchSiteInfo();
  const storeName = info.store_name?.trim() || DEFAULT_STORE_NAME;
  const title =
    info.store_seo_title?.trim() ||
    `${storeName} - ${info.store_tagline?.trim() || "Tinh hoa thảo dược"}`;
  const description =
    info.store_seo_description?.trim() ||
    info.store_tagline?.trim() ||
    "Tinh hoa thảo dược, chăm sóc sức khỏe từ thiên nhiên";

  const base = buildPageMetadata({
    title,
    description,
    path: "/",
    absoluteTitle: true,
  });

  return {
    ...base,
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: title,
      template: `%s | ${storeName}`,
    },
    openGraph: {
      ...base.openGraph,
      siteName: storeName,
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
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const info = await fetchSiteInfo();
  const organizationLd = buildOrganizationJsonLd({
    name: info.store_name,
    description: info.store_seo_description || info.store_tagline,
    phone: info.store_hotline || info.store_phone,
    email: info.store_email,
    address: info.store_address,
    city: info.store_city,
    facebookUrl: info.store_facebook_url,
    zaloUrl: info.store_zalo_url,
    instagramUrl: info.store_instagram_url,
  });

  return (
    <html
      lang="vi"
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
      suppressHydrationWarning
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
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <JsonLd data={organizationLd} />
        <GoogleOAuthProvider
          clientId={
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
            "dummy-google-client-id.apps.googleusercontent.com"
          }
        >
          <QueryProvider>
            <WebSocketProvider>
              <ToastProvider />
              <CartShell>
                <ChatbotShell>{children}</ChatbotShell>
              </CartShell>
            </WebSocketProvider>
          </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
