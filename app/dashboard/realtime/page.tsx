"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import GaugeIndustrial from "@/components/GaugeIndustrial"; // ⭐ 게이지 컴포넌트 추가

// 센서 데이터 구조
type SensorRow = {
  ts: string;
  device_id: string;
  payload: string;
  value: number;
};

type ChartData = {
  time: string;
  temperature: number | null;
  humidity: number | null;
};

export default function RealtimePage() {
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [currentHum, setCurrentHum] = useState<number | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [rangeHours, setRangeHours] = useState<number>(6);

  /** ✔ 센서 payload 파싱 */
  const parsePayload = (payload: string): { T: number | null; H: number | null } => {
    try {
      const parts = payload.split(",");
      const humidity = parts[0]?.split("=")[1];
      const temperature = parts[1]?.split("=")[1];

      return {
        T: temperature ? Number(temperature) : null,
        H: humidity ? Number(humidity) : null,
      };
    } catch {
      return { T: null, H: null };
    }
  };

  /** ✔ API 호출 */
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/realtime?hours=${rangeHours}`);
      if (!res.ok) return;

      const rows: SensorRow[] = await res.json();

      // 최신값 업데이트
      if (rows.length > 0) {
        const latest = parsePayload(rows[rows.length - 1].payload);
        setCurrentTemp(latest.T);
        setCurrentHum(latest.H);
      }

      // 차트용 데이터 구성
      const formatted: ChartData[] = rows.map((row) => {
        const parsed = parsePayload(row.payload);
        return {
          time: new Date(row.ts).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temperature: parsed.T,
          humidity: parsed.H,
        };
      });

      setChartData(formatted);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [rangeHours]);

  /** ✔ 최초 + 30초마다 자동 갱신 */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchData();
    const timer = setInterval(fetchData, 30000);
    return () => clearInterval(timer);
  }, [fetchData]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">실시간 모니터링</h1>

      {/* 🔥 산업용 게이지 2개 */}
      <div className="flex gap-12 mb-10">
        <GaugeIndustrial
          value={currentTemp ?? 0}
          min={-10}
          max={40}
          warning={28}
          danger={32}
          unit="°C"
          label="온도"
          baseColor="#16a34a"
        />

        <GaugeIndustrial
          value={currentHum ?? 0}
          min={0}
          max={100}
          warning={70}
          danger={85}
          unit="%"
          label="습도"
          baseColor="#2563eb"
        />
      </div>

      {/* 조회 범위 선택 */}
      <div className="p-4 bg-white rounded shadow w-60 mb-6">
        <label className="text-sm font-semibold">조회 기간</label>
        <select
          value={rangeHours}
          onChange={(e) => setRangeHours(Number(e.target.value))}
          className="ml-2 border rounded px-2 py-1"
        >
          <option value={1}>최근 1시간</option>
          <option value={6}>최근 6시간</option>
          <option value={12}>최근 12시간</option>
          <option value={24}>최근 24시간</option>
          <option value={48}>최근 48시간</option>
          <option value={72}>최근 72시간</option>
        </select>
      </div>

      {/* 온도 그래프 */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-lg font-semibold mb-2">온도 추이</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#4287f5"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 습도 그래프 */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-lg font-semibold mb-2">습도 추이</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#1dbf73"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
