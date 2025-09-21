import type * as React from "react";

// Types expected by src/hooks/use-toast.tsx
export type ToastActionElement = React.ReactNode;

export type ToastProps = {
  id?: string;
  open?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  duration?: number;
  variant?: "default" | "destructive";
  onOpenChange?: (open: boolean) => void;
  action?: ToastActionElement;
};

// Minimal visual component (optional)
export function Toast({
  title,
  description,
  variant = "default",
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
}) {
  const base = "p-3 rounded shadow text-sm";
  const classes =
    variant === "destructive"
      ? `${base} bg-red-600 text-white`
      : `${base} bg-white text-black`;
  return (
    <div className={classes}>
      {title && <div className="font-semibold">{title}</div>}
      {description && <div className="mt-1">{description}</div>}
    </div>
  );
}

export default Toast;
