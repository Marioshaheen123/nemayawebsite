"use client";

import { useState, KeyboardEvent } from "react";

interface TagsInputProps {
  value: string; // comma-separated
  onChange: (value: string) => void;
}

export default function TagsInput({ value, onChange }: TagsInputProps) {
  const tags = value ? value.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed].join(", "));
    setInput("");
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index).join(", "));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border border-[#e0e3e8] rounded-lg focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all min-h-[38px]">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f0fdf4] text-accent text-[12px] font-medium rounded-md"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="text-accent/60 hover:text-accent ml-0.5"
          >
            &times;
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input.trim()) addTag(input); }}
        placeholder={tags.length === 0 ? "Type and press Enter" : ""}
        className="flex-1 min-w-[80px] text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] outline-none bg-transparent"
      />
    </div>
  );
}
