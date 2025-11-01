"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    // global-error must include html and body tags
    <div>
      <p className="text-4xl font-bold">{error.message}!</p>
    </div>
  );
}
