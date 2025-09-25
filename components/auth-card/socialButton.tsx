interface SocialButtonProps {
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

export default function SocialButton({
  onClick,
  icon,
  label,
  disabled,
}: SocialButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-quicksand flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 hover:bg-gray-50 hover:text-black ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}
