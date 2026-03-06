"use client";

import { type ReactNode } from "react";

interface ArrayEditorProps<T> {
  items: T[];
  onUpdate: (items: T[]) => void;
  renderItem: (item: T, index: number, onChange: (item: T) => void) => ReactNode;
  createItem: () => T;
  label: string;
  addLabel?: string;
}

export default function ArrayEditor<T>({
  items,
  onUpdate,
  renderItem,
  createItem,
  label,
  addLabel = "Add Item",
}: ArrayEditorProps<T>) {
  const handleItemChange = (index: number, item: T) => {
    const next = [...items];
    next[index] = item;
    onUpdate(next);
  };

  const handleRemove = (index: number) => {
    onUpdate(items.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onUpdate(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onUpdate(next);
  };

  const handleAdd = () => {
    onUpdate([...items, createItem()]);
  };

  return (
    <div className="space-y-3">
      <label className="text-[13px] font-medium text-[#2e263d]">{label}</label>

      {items.map((item, index) => (
        <div
          key={index}
          className="relative bg-[#f9fafb] border border-[#e8ecf1] rounded-lg p-4"
        >
          {/* Item controls */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleMoveUp(index)}
              disabled={index === 0}
              className="p-1 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
              title="Move up"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleMoveDown(index)}
              disabled={index === items.length - 1}
              className="p-1 text-[#a0a5af] hover:text-[#2e263d] disabled:opacity-30 transition-colors cursor-pointer"
              title="Move down"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-1 text-[#a0a5af] hover:text-red-500 transition-colors cursor-pointer"
              title="Remove"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="text-[11px] text-[#a0a5af] font-medium mb-2">
            #{index + 1}
          </div>

          {renderItem(item, index, (updated) => handleItemChange(index, updated))}
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {addLabel}
      </button>
    </div>
  );
}
