"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAdminLang } from "@/context/AdminLanguageContext";
import type { FieldErrors, UseFormRegister, FieldValues, Path } from "react-hook-form";

interface BilingualTextFieldProps<T extends FieldValues> {
  label: string;
  nameEn: Path<T>;
  nameAr: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  required?: boolean;
  placeholderEn?: string;
  placeholderAr?: string;
}

export default function BilingualTextField<T extends FieldValues>({
  label,
  nameEn,
  nameAr,
  register,
  errors,
  required,
  placeholderEn,
  placeholderAr,
}: BilingualTextFieldProps<T>) {
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
      {/* Keep the hidden language registered so its value is preserved on save */}
      <input type="hidden" {...register(isEn ? nameAr : nameEn)} />
      <div>
        <Input
          dir={isEn ? undefined : "rtl"}
          {...register(name, { required: required ? "Required" : false })}
          placeholder={isEn ? (placeholderEn ?? "English text…") : (placeholderAr ?? "النص العربي…")}
          className={cn(error && "border-red-400 focus:ring-red-300")}
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
