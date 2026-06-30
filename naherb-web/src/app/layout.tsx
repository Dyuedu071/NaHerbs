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

export const metadata: Metadata = {
  title: "NaHerbs",
  description: "Wellness Management Platform",
};

import { QueryProvider } from "@/components/providers/QueryProvider";
import ChatbotShell from "@/components/chatbot/ChatbotShell";
import { GoogleOAuthProvider } from '@react-oauth/google';

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
          <QueryProvider>
            <ChatbotShell>{children}</ChatbotShell>
          </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
