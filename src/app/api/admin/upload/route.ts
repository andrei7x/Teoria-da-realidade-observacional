import { NextResponse } from "next/server";
import { getAdminToken } from "@/lib/auth";
import { cmsUpload } from "@/lib/cms-admin";

export async function POST(request: Request) {
  const token = await getAdminToken();
  if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const form = await request.formData();
  const { response, data } = await cmsUpload(form, token);
  return NextResponse.json(data, { status: response.status });
}
