import { getAllUsersForAdmin } from "@/lib/admin/actions/user";
import { UsersTable } from "@/components/admin/UsersTable";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const result = await getAllUsersForAdmin();

  if (!result.success) {
    redirect("/admin");
  }

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-7">
        <h2 className="text-xl font-semibold">User Management</h2>
      </div>
      <div className="w-full overflow-hidden">
        <UsersTable data={result.data} />
      </div>
    </section>
  );
}
