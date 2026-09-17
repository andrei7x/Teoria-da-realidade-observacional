import { NextResponse } from "next/server";
import { getAdminToken } from "@/lib/auth";
import { cmsJson } from "@/lib/cms-admin";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const post = await request.json();
  const { response, data } = await cmsJson({ action: "update", token, id, post });
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const { response, data } = await cmsJson({ action: "delete", token, id });
  return NextResponse.json(data, { status: response.status });
}
