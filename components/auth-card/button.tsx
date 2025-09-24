import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps {
  loading?: boolean;
  variant?: "primary" | "outline";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function Button({
  children,
  type = "button",
  disabled,
  variant = "primary",
  className,
  onClick,
}: ButtonProps) {
  const baseStyles =
    "font-quicksand w-full rounded-lg px-4 py-2 text-center font-semibold focus:outline-none focus:ring-2 transition-colors";

  const varients = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed",
    outline:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(baseStyles, varients[variant], className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
