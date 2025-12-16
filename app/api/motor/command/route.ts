import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { motor_id, target_rpm, command_type } = body;

    if (
      motor_id === undefined ||
      target_rpm === undefined ||
      !command_type
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    const { error } = await supabase
      .from("motor_command")
      .insert({
        motor_id,
        target_rpm,
        command_type,
        status: "PENDING",
        issued_by: "ADMIN",
        mode: "AUTO",
        flagmap: "0100100100", // 현재 활성 모터 기준 (고정값 OK)
      });

    if (error) {
      console.error("[DB INSERT ERROR]", error);
      return NextResponse.json(
        { error: "DB insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "ok" });

  } catch (err) {
    console.error("[API ERROR]", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
