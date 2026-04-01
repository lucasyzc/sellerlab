"use client";

import type { ReactNode } from "react";
import {
  Crosshair,
  Tag,
  Coins,
  ShoppingCart,
  Package,
  Warehouse,
  Settings,
  SlidersHorizontal,
  Store,
  TrendingUp,
  Percent,
  Calendar,
  CreditCard,
  Megaphone,
  PenLine,
  LayoutList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  target: Crosshair,
  pricing: Tag,
  costs: Coins,
  "your costs": Coins,
  "cost inputs": Coins,
  "product and operating costs": Coins,
  "sale configuration": ShoppingCart,
  "sale setup": ShoppingCart,
  "fba product info": Package,
  "fba storage": Warehouse,
  "wfs storage (optional)": Warehouse,
  "amazon settings": Settings,
  "ebay settings": Settings,
  options: SlidersHorizontal,
  advanced: SlidersHorizontal,
  "store setup": Store,
  "revenue inputs": TrendingUp,
  "tax handling": Percent,
  "monthly overhead allocation": Calendar,
  "third-party processor fees": CreditCard,
  marketing: Megaphone,
  "manual fee inputs": PenLine,
};

function resolveIcon(children: ReactNode): LucideIcon {
  if (typeof children === "string") {
    return ICON_MAP[children.toLowerCase()] ?? LayoutList;
  }
  return LayoutList;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  const Icon = resolveIcon(children);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "var(--color-primary)",
        background: "var(--color-primary-light)",
        borderLeft: "3px solid var(--color-primary)",
        borderRadius: "var(--radius-sm)",
        padding: "6px 10px",
        marginTop: 4,
      }}
    >
      <Icon size={15} strokeWidth={2.2} style={{ flexShrink: 0 }} />
      {children}
    </div>
  );
}
