import { NextResponse } from "next/server";
import { adminCookieName, createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Admin não configurado" }, { status: 500 });
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, createSessionToken(email), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  return response;
}
