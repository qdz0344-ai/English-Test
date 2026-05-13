"use client";

import Link from "next/link";

export default function Navbar({ loggedIn }: { loggedIn: boolean }) {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
      <Link href="/" className="text-lg font-bold text-indigo-600">
        📝 英语单词测试
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {loggedIn ? (
          <>
            <Link href="/profile" className="hover:text-indigo-600">个人中心</Link>
            <span className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">
              U
            </span>
          </>
        ) : (
          <Link href="/auth" className="text-indigo-600 hover:underline">
            登录 / 注册
          </Link>
        )}
      </div>
    </nav>
  );
}
