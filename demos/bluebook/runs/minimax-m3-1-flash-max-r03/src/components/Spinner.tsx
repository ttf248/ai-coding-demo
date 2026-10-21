interface Props {
  label?: string;
}

export default function Spinner({ label = "加载中" }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 py-6 text-sm text-neutral-400">
      <svg
        aria-hidden="true"
        className="h-4 w-4 animate-spin-slow text-brand"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      >
        <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
        <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
      </svg>
      <span>{label}…</span>
    </div>
  );
}
