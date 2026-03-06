"use client";

import { type ReactNode } from "react";

interface SectionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export default function SectionCard({
  id,
  title,
  subtitle,
  isExpanded,
  onToggle,
  children,
}: SectionCardProps) {
  return (
    <div
      id={id}
      className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden scroll-mt-6"
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#f9fafb] transition-colors cursor-pointer"
      >
        <div className="text-left">
          <h3 className="text-[15px] font-semibold text-[#2e263d]">{title}</h3>
          {subtitle && (
            <p className="text-[12px] text-[#6b7280] mt-0.5">{subtitle}</p>
          )}
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-[#e8ecf1]">
          <div className="pt-5 space-y-5">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
