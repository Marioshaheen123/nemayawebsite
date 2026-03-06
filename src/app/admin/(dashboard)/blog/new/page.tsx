"use client";

import BlogArticleForm from "@/components/admin/editors/BlogArticleForm";

export default function NewBlogArticlePage() {
  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <BlogArticleForm />
    </div>
  );
}
