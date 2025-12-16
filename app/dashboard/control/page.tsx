"use client";
import { useEffect, useState } from "react";

type MotorStatus = {
  motor_id: number;
  current_rpm: number;
  is_running: boolean;
};


export default function ControlPage() {
  const [motors, setMotors] = useState<MotorStatus[]>([]);
  const [rpmMap, setRpmMap] = useState<Record<number, number>>({});
  const [uiCommandMap, setUiCommandMap] = useState<
    Record<number, "START" | "STOP" | null>
  >({});

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch("/api/motor/status");
      const data = await res.json();
      setMotors(data);

      setRpmMap((prev) => {
        const next = { ...prev };
        data.forEach((m: MotorStatus) => {
          if (next[m.motor_id] === undefined) {
            next[m.motor_id] = m.current_rpm;
          }
        });
        return next;
      });
    };

    fetchStatus();
    const timer = setInterval(fetchStatus, 2000);
    return () => clearInterval(timer);
  }, []);

  const sendCommand = async (
    motor_id: number,
    target_rpm: number,
    command_type: "START" | "STOP"
  ) => {
    await fetch("/api/motor/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        motor_id,
        target_rpm,
        command_type,
      }),
    });
  };
  const handlerStart = (motor_id: number) => {
    setUiCommandMap((prev) => ({
      ...prev,
      [motor_id]: "START",
    }));
    sendCommand(motor_id, rpmMap[motor_id], "START");
  };
  const handlerStop = (motor_id: number) => {
    setUiCommandMap((prev) => ({
      ...prev,
      [motor_id]: "STOP",
    }));
    sendCommand(motor_id, 1, "STOP");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Motor Control</h2>

      {motors.map((m) => (
        <div
          key={m.motor_id}
          style={{
            border: "1px solid #ccc",
            padding: 16,
            marginBottom: 12,
            borderRadius: 8,
          }}
        >
          <h3>Motor #{m.motor_id}</h3>

          <p>
            상태:{" "}
            <b style={{ color: m.is_running ? "green" : "red" }}>
              {m.is_running ? "RUNNING" : "STOPPED"}
            </b>
          </p>
          <p>Current RPM: {m.current_rpm}</p>

          <input
            type="range"
            min={0}
            max={1200}
            step={50}
            value={rpmMap[m.motor_id] ?? 0}
            onChange={(e) =>
              setRpmMap({
                ...rpmMap,
                [m.motor_id]: Number(e.target.value),
              })
            }
          />

          <div>Target RPM: {rpmMap[m.motor_id]}</div>

          <div style={{ 
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,

           }}>
            <button
              onClick={() => handlerStart(m.motor_id)}
              style={{
                padding: "12px 0",
                fontSize: 16,
                background:
                  uiCommandMap[m.motor_id] === "START" ? "#16a34a" : "#e5e7eb",
                color:
                  uiCommandMap[m.motor_id] === "START" ? "white" : "black",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
              >
              START
            </button>
            <button
              onClick={() => handlerStop(m.motor_id)}
              style={{
                marginLeft: 8,
                padding: "12px 0",
                fontSize: 16,
                background:
                  uiCommandMap[m.motor_id] === "STOP" ? "#dc2626" : "#e5e7eb",
                color:
                  uiCommandMap[m.motor_id] === "STOP" ? "white" : "black",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              STOP
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
