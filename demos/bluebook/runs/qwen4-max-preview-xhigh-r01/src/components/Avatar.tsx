interface AvatarProps {
  name: string;
  color: string;
  size?: number;
}

export default function Avatar({ name, color, size = 24 }: AvatarProps) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.46 }}
      aria-hidden="true"
    >
      {name.slice(0, 1)}
    </span>
  );
}