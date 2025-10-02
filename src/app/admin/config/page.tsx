import { getSystemConfigs } from "@/lib/admin/actions/config";
import { ConfigForm } from "@/components/admin/ConfigForm";
import { redirect } from "next/navigation";

export default async function ConfigPage() {
  const result = await getSystemConfigs();

  if (!result.success) {
    redirect("/admin");
  }

  const maxBooksConfig = result.data.find((c) => c.key === "max_books_allowed");
  const maxBooks = maxBooksConfig
    ? Number.parseInt(maxBooksConfig.value, 10)
    : 5;

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="mb-7">
        <h2 className="text-xl font-semibold">System Configuration</h2>
        <p className="text-gray-600 mt-2">
          Manage system-wide settings for the library management system.
        </p>
      </div>

      <ConfigForm initialMaxBooks={maxBooks} />
    </section>
  );
}
