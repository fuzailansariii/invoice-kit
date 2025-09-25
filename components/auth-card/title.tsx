import { ReactNode } from "react";

export default function Title({
  children,
  as: Tag = "h1",
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag className="text-2xl font-bold tracking-tighter text-gray-900 drop-shadow-lg md:text-4xl dark:text-white">
      {children}
    </Tag>
  );
}
