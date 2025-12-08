"use client";

export default function ControlPlaceholder() {
  return (
    <div className="p-10 flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-4">팬 / 릴레이 제어</h1>

      <div className="text-gray-600 text-lg mb-6">
        이 기능은 현재 개발 중입니다.<br />
        조만간 원격 제어 기능이 제공될 예정입니다.
      </div>

      {/* 임시 박스 — 나중에 실제 제어 UI가 들어올 영역 */}
      <div className="w-full max-w-2xl p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
        <p className="text-gray-500">
          제어 패널 UI 영역<br />
          (릴레이 스위치, 팬 속도 조절 등)
        </p>
      </div>

      {/* 간단한 부가 정보 */}
      <div className="mt-6 text-sm text-gray-500">
        버전 0.1 · 기능 준비 중
      </div>
    </div>
  );
}
