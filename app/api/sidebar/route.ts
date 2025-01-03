import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const open = body.open === true;

  const response = NextResponse.json({ success: true });
  response.cookies.set("sidebar_open", String(open), {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 săptămână
  });

  return response;
}