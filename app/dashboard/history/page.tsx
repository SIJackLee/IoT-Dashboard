"use client";

// react-date-range 타입 오류 억제
import { DateRange } from "react-date-range";

import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

import { addDays } from "date-fns";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

// payload: "H=34.3,T=17.8"
function parsePayload(payload: string) {
  const h = payload.match(/H=([\d.]+)/);
  const t = payload.match(/T=([\d.]+)/);
  return {
    humidity: h ? Number(h[1]) : null,
    temperature: t ? Number(t[1]) : null,
  };
}

interface LogRow {
  payload: string;
  ts: string;
}

export default function HistoryPage() {
  const [temps, setTemps] = useState<number[]>([]);
  const [hums, setHums] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  // 날짜 범위 State
  const [range, setRange] = useState([
    {
      startDate: addDays(new Date(), -1),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // 데이터 조회 함수
  async function fetchHistory() {
    const start = range[0].startDate.toISOString().slice(0, 10);
    const end = range[0].endDate.toISOString().slice(0, 10);

    const res = await fetch(`/api/history?start=${start}&end=${end}`);
    const json = await res.json();

    if (!json.data) return;

    const tList: number[] = [];
    const hList: number[] = [];
    const lList: string[] = [];

    (json.data as LogRow[]).forEach((row) => {
      const parsed = parsePayload(row.payload);

      if (parsed.temperature !== null) tList.push(parsed.temperature);
      if (parsed.humidity !== null) hList.push(parsed.humidity);

      const timeLabel = new Date(row.ts).toLocaleString("ko-KR", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      lList.push(timeLabel);
    });

    setTemps(tList);
    setHums(hList);
    setLabels(lList);
  }

  const tempData = {
    labels,
    datasets: [
      {
        label: "온도(℃)",
        data: temps,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.3)",
        tension: 0.3,
      },
    ],
  };

  const humData = {
    labels,
    datasets: [
      {
        label: "습도(%)",
        data: hums,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.3)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">이력 그래프</h1>

      {/* 날짜 범위 선택 */}
      <div className="mb-4 border p-4 rounded-xl inline-block">
        <DateRange
          editableDateInputs={true}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(item: any) => setRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={range}
        />
      </div>

      {/* 조회 버튼 */}
      <div className="mb-6">
        <button
          onClick={fetchHistory}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          조회하기
        </button>
      </div>

      {/* 온도 그래프 */}
      <div className="border rounded-xl p-4 mb-10">
        <h3 className="font-bold mb-4">온도 이력</h3>
        <Line data={tempData} height={140} />
      </div>

      {/* 습도 그래프 */}
      <div className="border rounded-xl p-4">
        <h3 className="font-bold mb-4">습도 이력</h3>
        <Line data={humData} height={140} />
      </div>
    </div>
  );
}
