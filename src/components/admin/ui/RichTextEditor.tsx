"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table";
import { TableHeader } from "@tiptap/extension-table";
import ImageExt from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { useCallback, useState, useRef, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  dir?: "rtl" | "ltr";
}

// ─── Color Presets ──────────────────────────────────────────────────
const TEXT_COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
  "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
];

type Dropdown = null | "headings" | "textColor" | "highlight";

export default function RichTextEditor({ value, onChange, dir = "ltr" }: RichTextEditorProps) {
  const [showSource, setShowSource] = useState(false);
  const [sourceHtml, setSourceHtml] = useState("");
  const [openDropdown, setOpenDropdown] = useState<Dropdown>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openDropdown]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"], defaultAlignment: "left" }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      ImageExt.configure({ inline: false, allowBase64: false }),
      Youtube.configure({ inline: false }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "min-h-[280px] px-4 py-3 text-[14px] text-[#2e263d] leading-relaxed focus:outline-none prose prose-sm max-w-none [&_table]:border-collapse [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_th]:border [&_th]:border-gray-300 [&_th]:p-2 [&_th]:bg-gray-100 [&_img]:rounded-lg [&_img]:max-w-full [&_iframe]:rounded-lg [&_iframe]:max-w-full",
        dir,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Toggle a dropdown — close all others
  const toggle = (d: Dropdown) => setOpenDropdown((prev) => (prev === d ? null : d));

  // ─── Actions ────────────────────────────────────────────────────────
  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    // If no text is selected, insert the URL as link text
    const { from, to } = editor.state.selection;
    if (from === to) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`)
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  const insertImage = useCallback(() => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  }, []);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await adminFetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      }
    } catch { /* ignore */ }
    e.target.value = "";
  }, [editor]);

  const insertVideo = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("YouTube URL");
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const toggleSource = useCallback(() => {
    if (!editor) return;
    if (showSource) {
      editor.commands.setContent(sourceHtml);
      onChange(sourceHtml);
      setShowSource(false);
    } else {
      setSourceHtml(editor.getHTML());
      setShowSource(true);
    }
  }, [editor, showSource, sourceHtml, onChange]);

  // Indent: sink list item, or wrap in blockquote if not in list
  const handleIndent = useCallback(() => {
    if (!editor) return;
    if (editor.isActive("listItem")) {
      editor.chain().focus().sinkListItem("listItem").run();
    } else if (!editor.isActive("blockquote")) {
      editor.chain().focus().setBlockquote().run();
    }
  }, [editor]);

  // Outdent: lift list item, or unwrap blockquote if not in list
  const handleOutdent = useCallback(() => {
    if (!editor) return;
    if (editor.isActive("listItem")) {
      editor.chain().focus().liftListItem("listItem").run();
    } else if (editor.isActive("blockquote")) {
      editor.chain().focus().unsetBlockquote().run();
    }
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `relative flex items-center justify-center w-[30px] h-[28px] rounded transition-colors ${
      active ? "bg-accent text-white" : "text-[#4b5563] hover:bg-[#e5e7eb]"
    }`;

  const sep = <span className="w-px h-[20px] bg-[#e0e3e8] mx-0.5 self-center shrink-0" />;

  // Current heading label
  const headingLabel = editor.isActive("heading", { level: 1 }) ? "H1"
    : editor.isActive("heading", { level: 2 }) ? "H2"
    : editor.isActive("heading", { level: 3 }) ? "H3"
    : editor.isActive("heading", { level: 4 }) ? "H4"
    : "P";

  // Alignment: check explicitly. TipTap doesn't set textAlign for default, so "left" = no explicit align
  const alignLeft = !editor.isActive({ textAlign: "center" }) && !editor.isActive({ textAlign: "right" }) && !editor.isActive({ textAlign: "justify" });
  const alignCenter = editor.isActive({ textAlign: "center" });
  const alignRight = editor.isActive({ textAlign: "right" });
  const alignJustify = editor.isActive({ textAlign: "justify" });

  // Current text color for the icon underline indicator
  const currentColor = editor.getAttributes("textStyle")?.color || "#000000";

  return (
    <div ref={wrapperRef} className="border border-[#e0e3e8] rounded-lg overflow-hidden focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
      {/* Hidden file input for image upload */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

      {/* Toolbar Row 1 */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-[#e0e3e8] bg-[#fafafa]">
        {/* Undo / Redo */}
        <button type="button" title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btn(false) + " disabled:opacity-30 disabled:cursor-not-allowed"}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 105.13-10.49L1 10"/></svg>
        </button>
        <button type="button" title="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btn(false) + " disabled:opacity-30 disabled:cursor-not-allowed"}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-5.13-10.49L23 10"/></svg>
        </button>

        {sep}

        {/* Format dropdown */}
        <div className="relative">
          <button type="button" title="Format" onClick={() => toggle("headings")} className="flex items-center gap-1 px-2 h-[28px] rounded text-[12px] font-medium text-[#4b5563] hover:bg-[#e5e7eb] transition-colors min-w-[56px]">
            <span>{headingLabel}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
          </button>
          {openDropdown === "headings" && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e3e8] rounded-lg shadow-lg z-50 py-1 min-w-[140px]">
              <button type="button" onClick={() => { editor.chain().focus().setParagraph().run(); setOpenDropdown(null); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#f3f4f6] ${!editor.isActive("heading") ? "text-accent font-semibold" : ""}`}>Paragraph</button>
              {([1, 2, 3, 4] as const).map((level) => (
                <button key={level} type="button" onClick={() => { editor.chain().focus().toggleHeading({ level }).run(); setOpenDropdown(null); }} className={`w-full text-left px-3 py-1.5 hover:bg-[#f3f4f6] ${editor.isActive("heading", { level }) ? "text-accent font-semibold" : ""}`} style={{ fontSize: `${20 - level * 2}px`, fontWeight: 700 }}>
                  Heading {level}
                </button>
              ))}
            </div>
          )}
        </div>

        {sep}

        {/* Bold / Underline / Italic / Strike */}
        <button type="button" title="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))}>
          <svg width="13" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
        </button>
        <button type="button" title="Underline (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive("underline"))}>
          <svg width="14" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>
        </button>
        <button type="button" title="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))}>
          <svg width="13" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
        </button>
        <button type="button" title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive("strike"))}>
          <svg width="14" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>
        </button>

        {sep}

        {/* Subscript / Superscript */}
        <button type="button" title="Subscript" onClick={() => editor.chain().focus().toggleSubscript().run()} className={btn(editor.isActive("subscript"))}>
          <span className="text-[11px] font-bold">X<sub className="text-[8px]">2</sub></span>
        </button>
        <button type="button" title="Superscript" onClick={() => editor.chain().focus().toggleSuperscript().run()} className={btn(editor.isActive("superscript"))}>
          <span className="text-[11px] font-bold">X<sup className="text-[8px]">2</sup></span>
        </button>

        {sep}

        {/* Text Color */}
        <div className="relative">
          <button type="button" title="Font Color" onClick={() => toggle("textColor")} className={btn(false)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2L5.5 16h2.25l1.12-3h6.25l1.12 3h2.25L13 2h-2zm-1.38 9L12 4.67 14.38 11H9.62z"/><rect x="3" y="18" width="18" height="3" fill={currentColor} rx="1"/></svg>
          </button>
          {openDropdown === "textColor" && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e3e8] rounded-lg shadow-lg z-50 p-2 w-[220px]">
              <div className="grid grid-cols-10 gap-1">
                {TEXT_COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => { editor.chain().focus().setColor(c).run(); setOpenDropdown(null); }} className="w-[18px] h-[18px] rounded-sm border border-gray-200 hover:scale-125 transition-transform" style={{ backgroundColor: c }} />
                ))}
              </div>
              <button type="button" onClick={() => { editor.chain().focus().unsetColor().run(); setOpenDropdown(null); }} className="mt-1.5 text-[11px] text-[#6b7280] hover:text-accent w-full text-center">Remove color</button>
            </div>
          )}
        </div>

        {/* Highlight Color */}
        <div className="relative">
          <button type="button" title="Highlight Color" onClick={() => toggle("highlight")} className={btn(editor.isActive("highlight"))}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.5 1.15C17.97 1.15 17.44 1.35 17.03 1.76L9 9.76L14.24 15L22.24 7C23.07 6.14 23.07 4.79 22.24 3.94L20.12 1.82C19.71 1.4 19.11 1.15 18.5 1.15M7.41 11.37L2 22L12.63 16.59L7.41 11.37"/><rect x="1" y="20" width="10" height="3" rx="1" fill="#ffff00" opacity="0.5"/></svg>
          </button>
          {openDropdown === "highlight" && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e3e8] rounded-lg shadow-lg z-50 p-2 w-[220px]">
              <div className="grid grid-cols-10 gap-1">
                {TEXT_COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => { editor.chain().focus().toggleHighlight({ color: c }).run(); setOpenDropdown(null); }} className="w-[18px] h-[18px] rounded-sm border border-gray-200 hover:scale-125 transition-transform" style={{ backgroundColor: c }} />
                ))}
              </div>
              <button type="button" onClick={() => { editor.chain().focus().unsetHighlight().run(); setOpenDropdown(null); }} className="mt-1.5 text-[11px] text-[#6b7280] hover:text-accent w-full text-center">Remove highlight</button>
            </div>
          )}
        </div>

        {sep}

        {/* Alignment */}
        <button type="button" title="Align Left" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={btn(alignLeft)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>
        </button>
        <button type="button" title="Align Center" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={btn(alignCenter)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>
        </button>
        <button type="button" title="Align Right" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={btn(alignRight)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>
        </button>
        <button type="button" title="Justify" onClick={() => editor.chain().focus().setTextAlign("justify").run()} className={btn(alignJustify)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zM3 3v2h18V3H3z"/></svg>
        </button>
      </div>

      {/* Toolbar Row 2 */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-[#e0e3e8] bg-[#fafafa]">
        {/* Lists */}
        <button type="button" title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
        </button>
        <button type="button" title="Ordered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
        </button>

        {sep}

        {/* Outdent / Indent — works in lists AND blockquotes */}
        <button type="button" title="Decrease Indent (Ctrl+[)" onClick={handleOutdent} className={btn(false)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>
        </button>
        <button type="button" title="Increase Indent (Ctrl+])" onClick={handleIndent} className={btn(false)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>
        </button>

        {sep}

        {/* Blockquote */}
        <button type="button" title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
        </button>

        {/* Horizontal Rule */}
        <button type="button" title="Horizontal Line" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="11" width="18" height="2" rx="1"/></svg>
        </button>

        {sep}

        {/* Table */}
        <button type="button" title="Insert Table" onClick={insertTable} className={btn(editor.isActive("table"))}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
        </button>

        {/* Link */}
        <button type="button" title="Link" onClick={setLink} className={btn(editor.isActive("link"))}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        </button>

        {/* Image */}
        <button type="button" title="Insert Image" onClick={insertImage} className={btn(false)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        </button>

        {/* Video */}
        <button type="button" title="Insert YouTube Video" onClick={insertVideo} className={btn(false)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
        </button>

        {sep}

        {/* Code View */}
        <button type="button" title="Code View (HTML Source)" onClick={toggleSource} className={btn(showSource)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </button>
      </div>

      {/* Table controls (contextual — only visible when cursor is inside a table) */}
      {editor.isActive("table") && (
        <div className="flex flex-wrap items-center gap-1 px-2 py-1 border-b border-[#e0e3e8] bg-[#fff8f0]">
          <span className="text-[11px] text-[#9a7b4f] font-medium mr-1">Table:</span>
          <button type="button" onClick={() => editor.chain().focus().addColumnBefore().run()} className="px-1.5 py-0.5 text-[11px] rounded bg-white border border-[#e0e3e8] text-[#4b5563] hover:bg-[#f3f4f6]">+ Col Before</button>
          <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className="px-1.5 py-0.5 text-[11px] rounded bg-white border border-[#e0e3e8] text-[#4b5563] hover:bg-[#f3f4f6]">+ Col After</button>
          <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} className="px-1.5 py-0.5 text-[11px] rounded bg-white border border-[#e0e3e8] text-red-500 hover:bg-red-50">- Col</button>
          <span className="w-px h-[16px] bg-[#e0e3e8]" />
          <button type="button" onClick={() => editor.chain().focus().addRowBefore().run()} className="px-1.5 py-0.5 text-[11px] rounded bg-white border border-[#e0e3e8] text-[#4b5563] hover:bg-[#f3f4f6]">+ Row Before</button>
          <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className="px-1.5 py-0.5 text-[11px] rounded bg-white border border-[#e0e3e8] text-[#4b5563] hover:bg-[#f3f4f6]">+ Row After</button>
          <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} className="px-1.5 py-0.5 text-[11px] rounded bg-white border border-[#e0e3e8] text-red-500 hover:bg-red-50">- Row</button>
          <span className="w-px h-[16px] bg-[#e0e3e8]" />
          <button type="button" onClick={() => editor.chain().focus().mergeCells().run()} className="px-1.5 py-0.5 text-[11px] rounded bg-white border border-[#e0e3e8] text-[#4b5563] hover:bg-[#f3f4f6]">Merge</button>
          <button type="button" onClick={() => editor.chain().focus().splitCell().run()} className="px-1.5 py-0.5 text-[11px] rounded bg-white border border-[#e0e3e8] text-[#4b5563] hover:bg-[#f3f4f6]">Split</button>
          <span className="w-px h-[16px] bg-[#e0e3e8]" />
          <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className="px-1.5 py-0.5 text-[11px] rounded bg-white border border-red-300 text-red-500 hover:bg-red-50">Delete Table</button>
        </div>
      )}

      {/* Editor / Source View */}
      {showSource ? (
        <textarea
          value={sourceHtml}
          onChange={(e) => setSourceHtml(e.target.value)}
          className="w-full min-h-[280px] px-4 py-3 text-[13px] font-mono text-[#2e263d] bg-[#fafafa] focus:outline-none resize-y"
          dir="ltr"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
