import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/auth";
import { cmsJson } from "@/lib/cms-admin";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const { response: upstream, data } = await cmsJson({ action: "login", email, password });
  if (!upstream.ok || !data?.token) return NextResponse.json({ error: data?.error || "Credenciais inválidas" }, { status: upstream.status });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, data.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  return response;
}
