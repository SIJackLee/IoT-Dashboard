"use client";

import Link from "next/link";

export default function DashboardOverview() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">요약 화면</h1>

      {/* 상단 4개 카드 */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <SummaryCard title="현재 온도" value="20.8°C" color="text-green-600" />
        <SummaryCard title="현재 습도" value="31.5%" color="text-blue-600" />
        <SummaryCard title="팬 상태" value="2단 작동" color="text-gray-700" />
        <SummaryCard title="릴레이 상태" value="정상" color="text-green-600" />
      </div>

      {/* 그래프 자리 */}
      <div className="bg-white shadow rounded-lg p-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">최근 6시간 온습도 변화</h2>
          <Link href="/dashboard/realtime" className="text-blue-600 text-sm">
            자세히 보기 →
          </Link>
        </div>

        <div className="w-full h-64 flex items-center justify-center text-gray-400">
          (그래프는 실시간 모니터링에서 가져올 예정)
        </div>
      </div>

      {/* 하단 장비 상태 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">장비 상태</h2>

        <div className="grid grid-cols-4 gap-4 text-center">
          <StatusBox label="릴레이 1" state="ON" />
          <StatusBox label="릴레이 2" state="OFF" />
          <StatusBox label="릴레이 3" state="OFF" />
          <StatusBox label="릴레이 4" state="ON" />
          <StatusBox label="릴레이 5" state="OFF" />
          <StatusBox label="릴레이 6" state="OFF" />
          <StatusBox label="통신 상태" state="정상" />
          <StatusBox label="데이터 수신" state="1분 전" />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
    </div>
  );
}

function StatusBox({ label, state }: { label: string; state: string }) {
  return (
    <div className="border rounded-lg p-3 bg-gray-50 text-sm">
      <div className="font-semibold">{label}</div>
      <div className="mt-1 text-gray-700">{state}</div>
    </div>
  );
}
