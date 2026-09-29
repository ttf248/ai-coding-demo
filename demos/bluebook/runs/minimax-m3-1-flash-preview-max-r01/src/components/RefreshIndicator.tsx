import { Spinner } from "./FooterStates";

interface Props {
  offset: number;
  progress: number;
  armed: boolean;
  refreshing: boolean;
}

export default function RefreshIndicator({ offset, progress, armed, refreshing }: Props) {
  const visible = offset > 8 || refreshing;
  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-30 flex justify-center"
      style={{ transform: `translateY(${visible ? offset - 8 : -48}px)`, transition: refreshing ? "none" : "transform 0.2s ease-out" }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md">
        {refreshing ? (
          <Spinner className="h-4 w-4 text-brand" />
        ) : (
          <span
            className={`text-base transition-transform ${armed ? "text-brand" : "text-[#bbb]"}`}
            style={{ transform: `rotate(${progress * 270}deg)`, opacity: 0.4 + progress * 0.6 }}
            title={armed ? "松开即可刷新" : "下拉刷新"}
          >
            ↓
          </span>
        )}
      </div>
    </div>
  );
}
