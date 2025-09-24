import { ReactNode } from "react";

export default function SubTitle({
  as: Tag = "h1",
  children,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag className="md:textsm font-quicksand max-w-lg text-center text-sm text-gray-600 my-2 dark:text-gray-300">
      {children}
    </Tag>
  );
}
