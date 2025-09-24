export default function SocialButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-3 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
    >
      {icon}
    </button>
  );
}
