"use client";

interface BilingualInputProps {
  label: string;
  valueEn: string;
  valueAr: string;
  onChangeEn: (val: string) => void;
  onChangeAr: (val: string) => void;
  placeholder?: string;
  type?: string;
}

export default function BilingualInput({
  label,
  valueEn,
  valueAr,
  onChangeEn,
  onChangeAr,
  placeholder,
  type = "text",
}: BilingualInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-[#2e263d]">{label}</label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[11px] text-[#a0a5af] mb-1 block">English</span>
          <input
            type={type}
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            placeholder={placeholder}
            dir="ltr"
            className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>
        <div>
          <span className="text-[11px] text-[#a0a5af] mb-1 block">Arabic</span>
          <input
            type={type}
            value={valueAr}
            onChange={(e) => onChangeAr(e.target.value)}
            placeholder={placeholder}
            dir="rtl"
            className="w-full px-3 py-2 border border-[#e0e3e8] rounded-lg text-[13px] text-[#2e263d] placeholder:text-[#c0c4cc] text-right focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
