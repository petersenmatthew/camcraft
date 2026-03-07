import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ worlds: [] });
}

export async function DELETE() {
  return NextResponse.json({ deleted: [] });
}
