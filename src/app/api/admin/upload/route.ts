import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { cmsUpload } from "@/lib/cms-admin";

export async function POST(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const form = await request.formData();
  const { response, data } = await cmsUpload(form);
  return NextResponse.json(data, { status: response.status });
}
