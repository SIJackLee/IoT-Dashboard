import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // 기본: 최근 24시간
  let since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  let until = new Date().toISOString();

  if (start && end) {
    since = new Date(start).toISOString();
    until = new Date(end).toISOString();
  }

  const { data, error } = await supabase
    .from("farm_logs")
    .select("*")
    .gte("ts", since)
    .lte("ts", until)
    .order("ts", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error });
  }

  return NextResponse.json({ data });
}
