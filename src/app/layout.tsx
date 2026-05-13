import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "英语单词测试",
  description: "考研 · 四六级 · 单词测试",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
