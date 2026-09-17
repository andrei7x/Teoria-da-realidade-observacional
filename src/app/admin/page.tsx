import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/auth";
import AdminEditor from "./admin-editor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminSession())) redirect("/admin/login");
  return <AdminEditor />;
}
