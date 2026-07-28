"use client";

import { useRef, useEffect, useCallback } from "react";

interface TimeWheelProps {
  value: string;
  onChange: (value: string) => void;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const COLUMN_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export default function TimeWheel({ value, onChange }: TimeWheelProps) {
  const [hour, minute] = value ? value.split(":") : ["", ""];
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollTo = useCallback((ref: HTMLDivElement | null, val: string, items: readonly string[]) => {
    if (!ref) return;
    const idx = items.indexOf(val);
    if (idx >= 0) {
      ref.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "instant" as ScrollBehavior });
    }
  }, []);

  // 外部 value 变化时同步滚轮位置
  useEffect(() => {
    scrollTo(hourRef.current, hour || "12", HOURS);
  }, [hour, scrollTo]);

  useEffect(() => {
    scrollTo(minuteRef.current, minute || "00", MINUTES);
  }, [minute, scrollTo]);

  const snap = useCallback(
    (ref: HTMLDivElement | null, items: readonly string[], type: "hour" | "minute") => {
      if (!ref) return;
      const idx = Math.round(ref.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(idx, items.length - 1));
      ref.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: "smooth" });

      const val = items[clamped];
      if (type === "hour") {
        onChange(`${val}:${minute || "00"}`);
      } else {
        onChange(`${hour || "12"}:${val}`);
      }
    },
    [hour, minute, onChange]
  );

  const debouncedSnap = useCallback(
    (ref: HTMLDivElement | null, items: readonly string[], type: "hour" | "minute") => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => snap(ref, items, type), 150);
    },
    [snap]
  );

  const handleItemClick = useCallback(
    (item: string, items: readonly string[], type: "hour" | "minute", ref: HTMLDivElement | null) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const idx = items.indexOf(item);
      if (ref) ref.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
      if (type === "hour") {
        onChange(`${item}:${minute || "00"}`);
      } else {
        onChange(`${hour || "12"}:${item}`);
      }
    },
    [hour, minute, onChange]
  );

  return (
    <div className="flex gap-3 select-none">
      <Column
        ref={hourRef}
        items={HOURS}
        selected={hour || "12"}
        label="Hour"
        onScroll={(ref) => debouncedSnap(ref, HOURS, "hour")}
        onItemClick={(item, ref) => handleItemClick(item, HOURS, "hour", ref)}
      />
      <div
        className="flex items-center justify-center text-[#c8a951] font-bold text-xl shrink-0"
        style={{ height: COLUMN_HEIGHT }}
      >
        :
      </div>
      <Column
        ref={minuteRef}
        items={MINUTES}
        selected={minute || "00"}
        label="Minute"
        onScroll={(ref) => debouncedSnap(ref, MINUTES, "minute")}
        onItemClick={(item, ref) => handleItemClick(item, MINUTES, "minute", ref)}
      />
    </div>
  );
}

function Column({
  ref,
  items,
  selected,
  label,
  onScroll,
  onItemClick,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  items: readonly string[];
  selected: string;
  label: string;
  onScroll: (ref: HTMLDivElement) => void;
  onItemClick: (item: string, ref: HTMLDivElement) => void;
}) {
  return (
    <div className="flex-1">
      <div
        className="bg-[#1a1a1a] border-2 border-[#2a2a2a] rounded-xl overflow-hidden relative"
        style={{ height: COLUMN_HEIGHT }}
      >
        {/* 中间高亮条 */}
        <div
          className="absolute left-0 right-0 z-10 pointer-events-none rounded-lg border border-[#c8a951]/30"
          style={{
            top: PADDING,
            height: ITEM_HEIGHT,
            background:
              "linear-gradient(180deg, rgba(200,169,81,0.08) 0%, rgba(200,169,81,0.12) 50%, rgba(200,169,81,0.08) 100%)",
          }}
        />
        {/* 顶部渐变遮罩 */}
        <div
          className="absolute left-0 right-0 z-10 pointer-events-none"
          style={{
            top: 0,
            height: PADDING,
            background: "linear-gradient(180deg, #1a1a1a 0%, transparent 100%)",
          }}
        />
        {/* 底部渐变遮罩 */}
        <div
          className="absolute left-0 right-0 z-10 pointer-events-none"
          style={{
            bottom: 0,
            height: PADDING,
            background: "linear-gradient(0deg, #1a1a1a 0%, transparent 100%)",
          }}
        />
        {/* 滚动区域 */}
        <div
          ref={ref}
          className="overflow-y-scroll scrollbar-none"
          style={{ height: COLUMN_HEIGHT }}
          onScroll={(e) => onScroll(e.currentTarget)}
        >
          <div style={{ height: PADDING }} />
          {items.map((item) => (
            <div
              key={item}
              onClick={() => onItemClick(item, ref.current!)}
              className={`flex items-center justify-center select-none cursor-pointer transition-colors duration-150 ${
                item === selected
                  ? "text-[#c8a951] font-semibold text-base"
                  : "text-[#6b6459] text-sm hover:text-[#9c9588]"
              }`}
              style={{ height: ITEM_HEIGHT }}
            >
              {item}
            </div>
          ))}
          <div style={{ height: PADDING }} />
        </div>
      </div>
      <p className="text-xs text-[#6b6459] text-center mt-1.5">{label}</p>
    </div>
  );
}
