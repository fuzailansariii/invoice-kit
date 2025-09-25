import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-md border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
