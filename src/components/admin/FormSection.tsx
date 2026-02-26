"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function FormSection({
  title,
  description,
  children,
  defaultOpen = true,
}: FormSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Header — clickable */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
          )}
        </div>
        <span className="ml-3 shrink-0 text-gray-400">
          {open ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </span>
      </button>

      {/* Collapsible content */}
      <div
        className={cn(
          "border-t border-gray-100 px-5 transition-all",
          open ? "py-5" : "hidden"
        )}
      >
        {children}
      </div>
    </div>
  );
}
