import React from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50 p-6">
        <h2 className="text-xl font-bold mb-6">IoT Dashboard</h2>

        <nav className="space-y-4">
          <Link href="/dashboard" className="block hover:text-blue-600">
            요약 화면
          </Link>
          <Link href="/dashboard/realtime" className="block hover:text-blue-600">
            실시간 모니터링
          </Link>
          <Link href="/dashboard/control" className="block hover:text-blue-600">
            팬 / 릴레이 제어
          </Link>
          <Link href="/dashboard/history" className="block hover:text-blue-600">
            이력 그래프
          </Link>
        </nav>

        {/* 나중에 SP/SH 그룹트리 자리 */}
        <div className="mt-10">
          <h3 className="font-semibold mb-2">그룹 트리</h3>
          <div className="text-sm text-gray-600">
            (여기에 SP/SH → 축사번호 → EC01~EC06 트리 UI 추가 예정)
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
