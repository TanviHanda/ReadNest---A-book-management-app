import {
  getPendingAccountRequests,
  approveAccountRequest,
  rejectAccountRequest,
} from "@/lib/admin/actions/account-requests";
import { redirect } from "next/navigation";

export default async function AccountRequestsPage() {
  const result = await getPendingAccountRequests();

  if (!result.success) {
    // If fetching fails, go back to admin home
    redirect("/admin");
  }

  const pending = result.data ?? [];

  // Server action wrappers to be used as form actions
  async function handleApprove(formData: FormData) {
    "use server";
    const id = formData.get("userId") as string;
    if (!id) return;
    await approveAccountRequest(id);
  }

  async function handleReject(formData: FormData) {
    "use server";
    const id = formData.get("userId") as string;
    if (!id) return;
    await rejectAccountRequest(id);
  }

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Account Requests</h2>
      </div>

      {pending.length === 0 ? (
        <p className="text-gray-600">No pending account requests.</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm table-auto">
            <thead>
              <tr className="text-left">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">University ID</th>
                <th className="pb-3">Submitted</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(
                (u: {
                  id: string;
                  fullName: string;
                  email: string;
                  universityId?: number | null;
                  universityCard?: string | null;
                  status?: string | null;
                  createdAt?: string | Date | null;
                }) => (
                  <tr key={u.id} className="border-t">
                    <td className="py-3">{u.fullName}</td>
                    <td className="py-3">{u.email}</td>
                    <td className="py-3">{u.universityId}</td>
                    <td className="py-3">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <form action={handleApprove}>
                          <input type="hidden" name="userId" value={u.id} />
                          <button
                            type="submit"
                            className="px-3 py-1 rounded bg-green-600 text-white text-sm"
                          >
                            Approve
                          </button>
                        </form>

                        <form action={handleReject}>
                          <input type="hidden" name="userId" value={u.id} />
                          <button
                            type="submit"
                            className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                          >
                            Reject
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
