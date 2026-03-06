"use client";

import { htmlToPlainText } from "@/lib/body-utils";

interface WordCountProps {
  html: string;
}

export default function WordCount({ html }: WordCountProps) {
  const text = htmlToPlainText(html);
  const count = text ? text.split(/\s+/).length : 0;

  const color =
    count < 300
      ? "text-red-500"
      : count < 800
      ? "text-amber-500"
      : "text-green-600";

  return (
    <div className={`text-[11px] ${color} mt-1`}>
      {count} word{count !== 1 ? "s" : ""}
      {count < 300 && " — too short"}
      {count >= 300 && count < 800 && " — consider adding more"}
      {count >= 800 && " — good length"}
    </div>
  );
}
