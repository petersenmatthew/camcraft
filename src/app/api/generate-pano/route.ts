import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Custom world generation is disabled. Choose a sample world from /worlds instead.",
    },
    { status: 403 }
  );
}
