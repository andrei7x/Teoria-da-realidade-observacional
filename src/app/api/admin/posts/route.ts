import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { cmsJson } from "@/lib/cms-admin";

export async function GET() {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { response, data } = await cmsJson({ action: "list" });
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const post = await request.json();
  const { response, data } = await cmsJson({ action: "create", post });
  return NextResponse.json(data, { status: response.status });
}
