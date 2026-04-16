import type { Metadata } from "next";
import { Rajdhani, Space_Mono } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MS 자격증 추천 퀴즈 - 3분 만에 찾는 나에게 맞는 Microsoft 자격증",
  description: "Microsoft 자격증이 처음이신가요? 7개 질문으로 당신에게 꼭 맞는 자격증을 추천해드립니다. AI, Cloud, Data, Security 등 다양한 분야의 자격증 추천.",
  keywords: "Microsoft 자격증, MS 자격증, Azure, AI-900, AZ-900, 자격증 추천, IT 자격증",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${rajdhani.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className={`${spaceMono.className} min-h-full`}>{children}</body>
    </html>
  );
}
