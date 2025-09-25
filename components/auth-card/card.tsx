import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        (cn(
          "flex w-full max-w-xl flex-col items-center justify-center rounded-2xl border-2 px-5 py-10",
        ),
        className)
      }
    >
      {children}
    </div>
  );
}
