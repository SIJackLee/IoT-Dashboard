"use client";

import React from "react";

interface GaugeIndustrialProps {
  value: number;
  min: number;
  max: number;
  warning: number;
  danger: number;
  unit: string;
  label: string;
  baseColor: string;
}

export default function GaugeIndustrial({
  value,
  min,
  max,
  warning,
  danger,
  unit,
  label,
  baseColor,
}: GaugeIndustrialProps) {
  const percent = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const angle = -120 + percent * 240;

  // 색상 선택
  let color = baseColor;
  if (value >= warning) color = "#facc15"; // Yellow
  if (value >= danger) color = "#dc2626"; // Red

  return (
    <div className="flex flex-col items-center">
      {/* 값 */}
      <div className="text-3xl font-bold mb-2" style={{ color }}>
        {value.toFixed(1)}
        {unit}
      </div>

      {/* 게이지 본체 (SVG 내부 바늘) */}
      <svg width="200" height="120" viewBox="0 0 100 60">
        {/* 배경 아치 */}
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />

        {/* 값 아치 */}
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${percent * 126} 200`}
        />

        {/* ⭐ 바늘 (SVG 안에서 정확한 중심 기준 회전) */}
        <g transform={`rotate(${angle} 50 50)`}>
          {/* 바늘 막대 */}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="18"
            stroke="#374151"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* 중심 원 */}
        <circle cx="50" cy="50" r="4" fill="#374151" />
      </svg>

      {/* 하단 라벨 */}
      <div className="mt-1 text-sm text-gray-700">{label}</div>

    </div>
  );
}
