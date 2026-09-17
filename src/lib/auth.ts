import { cookies } from "next/headers";
import { cmsJson } from "@/lib/cms-admin";

const COOKIE = "tro_admin_session";

export async function getAdminToken() {
  const store = await cookies();
  return store.get(COOKIE)?.value ?? "";
}

export async function isAdminSession() {
  const token = await getAdminToken();
  if (!token) return false;
  const { response, data } = await cmsJson({ action: "verify", token });
  return response.ok && data?.ok === true;
}

export const adminCookieName = COOKIE;
