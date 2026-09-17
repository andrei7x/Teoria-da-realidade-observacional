function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const endpoint = () => `${required("NEXT_PUBLIC_SUPABASE_URL")}/functions/v1/cms-admin`;

export async function cmsJson(payload: unknown) {
  const response = await fetch(endpoint(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-cms-token": required("CMS_ADMIN_TOKEN"),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await response.json();
  return { response, data };
}

export async function cmsUpload(form: FormData) {
  const response = await fetch(endpoint(), {
    method: "POST",
    headers: { "x-cms-token": required("CMS_ADMIN_TOKEN") },
    body: form,
    cache: "no-store",
  });
  const data = await response.json();
  return { response, data };
}
