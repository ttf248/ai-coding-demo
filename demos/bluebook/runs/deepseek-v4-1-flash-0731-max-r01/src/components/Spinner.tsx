export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={
        "inline-block w-4 h-4 rounded-full border-2 border-gray-300 border-t-xhs animate-spin " +
        className
      }
    />
  );
}
