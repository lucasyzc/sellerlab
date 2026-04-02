"use client";

import { useState, useRef, useEffect } from "react";

export function ExpandableText({
  children,
  lines = 2,
}: {
  children: React.ReactNode;
  lines?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setNeedsClamp(el.scrollHeight > el.clientHeight + 1);
  }, [children]);

  return (
    <div className="expandable-text-wrap">
      <div
        ref={ref}
        className="expandable-text-body"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : lines,
          WebkitBoxOrient: "vertical",
          overflow: expanded ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
      {needsClamp && (
        <button
          className="expandable-text-toggle"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
