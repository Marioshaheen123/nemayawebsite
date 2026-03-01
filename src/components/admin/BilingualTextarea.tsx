"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAdminLang } from "@/context/AdminLanguageContext";
import type { FieldErrors, UseFormRegister, FieldValues, Path } from "react-hook-form";

interface BilingualTextareaProps<T extends FieldValues> {
  label: string;
  nameEn: Path<T>;
  nameAr: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  required?: boolean;
  rows?: number;
  placeholderEn?: string;
  placeholderAr?: string;
}

export default function BilingualTextarea<T extends FieldValues>({
  label,
  nameEn,
  nameAr,
  register,
  errors,
  required,
  rows = 4,
  placeholderEn,
  placeholderAr,
}: BilingualTextareaProps<T>) {
  const { adminLang } = useAdminLang();
  const isEn = adminLang === "en";
  const name = isEn ? nameEn : nameAr;
  const error = errors?.[name];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <input type="hidden" {...register(isEn ? nameAr : nameEn)} />
      <div>
        <Textarea
          rows={rows}
          dir={isEn ? undefined : "rtl"}
          {...register(name, { required: required ? "Required" : false })}
          placeholder={isEn ? (placeholderEn ?? "English text…") : (placeholderAr ?? "النص العربي…")}
          className={cn("resize-y", error && "border-red-400 focus:ring-red-300")}
        />
        {error && (
          <p className={cn("text-xs text-red-600 mt-1", !isEn && "text-right")}>
            {error.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
