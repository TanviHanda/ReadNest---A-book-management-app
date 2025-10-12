"use client";

import { useState } from "react";
import { updateMaxBooksAllowed } from "@/lib/admin/actions/config";
import { useRouter } from "next/navigation";
import { Alert, AlertTitle } from "@/components/ui/alert";
interface ConfigFormProps {
  initialMaxBooks: number;
}

export function ConfigForm({ initialMaxBooks }: ConfigFormProps) {
  const [maxBooks, setMaxBooks] = useState(initialMaxBooks);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateMaxBooksAllowed(maxBooks);
      if (result.success) {
        <Alert>
          <AlertTitle>Configuration updated successfully!</AlertTitle>
        </Alert>;
        router.refresh();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch {
      <Alert>
        <AlertTitle>An unexpected error occurred.</AlertTitle>
      </Alert>;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="maxBooks"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Maximum Books Per User
        </label>
        <input
          type="number"
          id="maxBooks"
          min="1"
          max="100"
          value={maxBooks}
          onChange={(e) => setMaxBooks(Number.parseInt(e.target.value, 10))}
          className="px-4 py-2 border rounded-md w-full max-w-xs"
          required
        />
        <p className="mt-2 text-sm text-gray-500">
          Set the maximum number of books a user can borrow at once.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Save Configuration"}
      </button>
    </form>
  );
}
