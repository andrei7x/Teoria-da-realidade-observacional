const ENDPOINT = "https://hjjqxxbzdmotaemvrqsi.supabase.co/functions/v1/cms-admin";

export async function cmsJson(payload: unknown) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await response.json();
  return { response, data };
}

export async function cmsUpload(form: FormData, token: string) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
    body: form,
    cache: "no-store",
  });
  const data = await response.json();
  return { response, data };
}
