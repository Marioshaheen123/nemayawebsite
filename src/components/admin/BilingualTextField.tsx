"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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
  const enError = errors?.[nameEn];
  const arError = errors?.[nameAr];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* English */}
        <div className="space-y-1">
          <span className="text-xs text-gray-500 font-medium">English</span>
          <Input
            {...register(nameEn, { required: required ? "Required" : false })}
            placeholder={placeholderEn ?? "English text…"}
            className={cn(enError && "border-red-400 focus:ring-red-300")}
          />
          {enError && (
            <p className="text-xs text-red-600">
              {enError.message as string}
            </p>
          )}
        </div>

        {/* Arabic */}
        <div className="space-y-1">
          <span className="text-xs text-gray-500 font-medium">
            Arabic <span className="text-gray-400">(العربية)</span>
          </span>
          <Input
            dir="rtl"
            {...register(nameAr, { required: required ? "Required" : false })}
            placeholder={placeholderAr ?? "النص العربي…"}
            className={cn(arError && "border-red-400 focus:ring-red-300")}
          />
          {arError && (
            <p className="text-xs text-red-600 text-right">
              {arError.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
