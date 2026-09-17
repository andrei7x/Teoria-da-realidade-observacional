import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase";

const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX = 4 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });
  if (!allowed.has(file.type)) return NextResponse.json({ error: "Formato não permitido. Use JPG, PNG ou WEBP." }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "Imagem maior que 4 MB." }, { status: 400 });
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${new Date().toISOString().slice(0,10)}/${crypto.randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const supabase = adminSupabase();
  const { error } = await supabase.storage.from("consciousness-images").upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const { data } = supabase.storage.from("consciousness-images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
