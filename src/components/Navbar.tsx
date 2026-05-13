"use client";

import Link from "next/link";

export default function Navbar({ loggedIn }: { loggedIn: boolean }) {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur border-b shadow-sm">
      <Link href="/" className="text-lg font-bold text-indigo-600 hover:text-indigo-700 transition">
        📝 英语单词测试
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {loggedIn ? (
          <>
            <Link href="/profile" className="text-slate-600 hover:text-indigo-600 transition">个人中心</Link>
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-medium shadow-sm">
              U
            </span>
          </>
        ) : (
          <Link href="/auth" className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition text-sm font-medium shadow-sm">
            登录 / 注册
          </Link>
        )}
      </div>
    </nav>
  );
}
