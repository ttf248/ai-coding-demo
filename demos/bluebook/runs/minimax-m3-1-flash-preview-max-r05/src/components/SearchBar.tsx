import { useState } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onPublish: () => void;
}

export default function SearchBar({ value, onChange, onPublish }: Props) {
  const [focus, setFocus] = useState(false);
  return (
    <header className="sticky top-0 z-30 bg-white/92 backdrop-blur border-b border-black/5">
      <div className="h-[52px] px-3 flex items-center gap-3">
        <span className="text-[19px] font-bold tracking-tight text-brand shrink-0">小蓝书</span>
        <div
          className={`flex-1 h-[34px] rounded-full flex items-center gap-1.5 px-3 transition-colors ${
            focus ? "bg-[#f0f1f3] ring-1 ring-brand/40" : "bg-[#f5f5f5]"
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] text-[#9a9a9a]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.6-3.6" />
          </svg>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder="搜索你感兴趣的内容"
            aria-label="搜索你感兴趣的内容"
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#a8a8a8] min-w-0"
          />
          {value && (
            <button type="button" onClick={() => onChange("")} aria-label="清空搜索" className="text-[#b0b0b0]">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>
        <button type="button" onClick={onPublish} className="shrink-0 text-[13.5px] font-medium text-brand active:opacity-60">
          发布
        </button>
      </div>
      {value && (
        <div className="px-3 pb-2.5 flex flex-wrap gap-1.5 animate-fade-in">
          {[value, `${value} 攻略`, `${value} 好物`, `${value} 教程`].map((t, i) => (
            <span key={i} className="px-2.5 py-1 rounded-full bg-[#f5f5f5] text-[12px] text-[#555]">
              {t}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
