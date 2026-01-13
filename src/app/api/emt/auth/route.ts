import { NextResponse } from "next/server";
import { getEmtAccessToken } from "@/lib/emtAuth";

export async function GET() {
  try {
    const token = await getEmtAccessToken();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "EMT authentication failed" },
      { status: 500 }
    );
  }
}
