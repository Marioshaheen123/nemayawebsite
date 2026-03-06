"use client";

import sanitizeHtml from "sanitize-html";

const ALLOWED: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "h1", "h2", "h3", "h4", "strong", "em", "u", "s", "del",
    "ul", "ol", "li", "a", "blockquote", "br", "hr",
    "sub", "sup", "span", "mark",
    "table", "thead", "tbody", "tr", "th", "td",
    "img", "figure", "figcaption",
    "iframe", "div",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    span: ["style"],
    mark: ["data-color", "style"],
    p: ["style"],
    h1: ["style"],
    h2: ["style"],
    h3: ["style"],
    h4: ["style"],
    td: ["colspan", "rowspan", "style"],
    th: ["colspan", "rowspan", "style"],
    iframe: ["src", "width", "height", "frameborder", "allowfullscreen", "allow"],
    div: ["data-youtube-video", "style"],
  },
  allowedStyles: {
    "*": {
      "color": [/.*/],
      "background-color": [/.*/],
      "text-align": [/^(left|right|center|justify)$/],
    },
  },
  allowedIframeHostnames: ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com"],
};

interface RichContentProps {
  html: string;
  className?: string;
  dir?: "rtl" | "ltr";
}

export default function RichContent({ html, className = "", dir }: RichContentProps) {
  const clean = sanitizeHtml(html, ALLOWED);
  return (
    <div
      dir={dir}
      className={`prose prose-gray max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
