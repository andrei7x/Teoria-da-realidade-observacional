import { NextResponse } from "next/server";
import { getAdminToken } from "@/lib/auth";
import { cmsJson } from "@/lib/cms-admin";

export async function GET() {
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { response, data } = await cmsJson({ action: "list", token });
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: Request) {
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const post = await request.json();
  const { response, data } = await cmsJson({ action: "create", token, post });
  return NextResponse.json(data, { status: response.status });
}
