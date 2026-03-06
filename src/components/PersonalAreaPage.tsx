"use client";
import { useSiteSettings } from "@/context/SiteSettingsContext";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { useUserAuth, type UserProfile } from "@/context/UserAuthContext";
import { COUNTRIES, DEFAULT_PHONE_RULES } from "@/data/countries";

/* ── Sidebar nav items ──────────────────────────────────────────────── */
const sidebarItems = {
  en: {
    clientArea: "Client Area",
    supportSecurity: "Support & Security",
    items: [
      { key: "personal-data", label: "Personal Data", icon: "user" },
      { key: "upload-documents", label: "Upload Documents", icon: "upload" },
      { key: "deposit-funds", label: "Deposit Funds", icon: "cash" },
      { key: "financial-transactions", label: "Financial Transactions", icon: "list" },
      { key: "withdrawals", label: "Withdrawals", icon: "card" },
    ],
    support: [
      { key: "change-password", label: "Change Password", icon: "lock" },
      { key: "contact-us", label: "Contact Us", icon: "chat" },
    ],
    logout: "Logout",
    pageTitles: {
      "personal-data": "Personal Data",
      "upload-documents": "Upload Documents",
      "deposit-funds": "Deposit Funds",
      "financial-transactions": "Financial Transactions",
      "withdrawals": "Withdrawal Request",
      "change-password": "Change Password",
      "contact-us": "Contact Us",
    } as Record<string, string>,
    changePassword: {
      hint: "Use at least 8 characters, including numbers and special symbols for better security.",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      matchNote: "Make sure the new password matches",
      save: "Save",
    },
    uploadPhoto: "Upload New Photo",
    reset: "Reset",
    photoHint: "Allowed JPG, GIF or PNG. Max size of 800K",
    saveChanges: "Save Changes",
    infoNote: "To change or update your data, please contact us at",
    infoEmail: "admin@namaya.ar",
    fields: {
      firstName: "First name",
      lastName: "Last name",
      mobile: "Mobile Number",
      email: "Email",
      id: "ID",
      dateOfBirth: "Date of Birth",
      address: "Address",
      city: "City",
      postalCode: "Postal Code",
      country: "Country",
      profession: "Profession",
      additionalPhone: "Additional Phone Number",
      annualIncome: "Annual Income",
    },
    uploadDocuments: {
      subtitle: "Please upload all required documents to verify your account",
      securityNote: "All documents are securely stored and encrypted",
      waitingUpload: "Waiting for the upload",
      pendingReview: "Pending Review",
      uploadDocument: "Upload Document",
      viewDocument: "View",
      replaceDocument: "Replace",
      uploading: "Uploading...",
      frontLabel: "Front",
      backLabel: "Back",
      uploaded: "Uploaded",
      waiting: "Waiting",
      documents: [
        { key: "credit-card", icon: "creditcard", title: "Credit Card", description: "Image of a credit card", hasImageType: true },
        { key: "personal-identity", icon: "identity", title: "Personal Identity", description: "A clear copy of a valid national ID or passport", hasImageType: true },
        { key: "other-documents", icon: "document", title: "Other Documents", description: "Any other supporting documents such a lease agreement, business license...", hasImageType: false },
        { key: "proof-of-address", icon: "home", title: "Proof of Address", description: "Utility bill not exceeding 3 months or a lease agreement", hasImageType: false },
      ],
      modal: {
        uploadTitle: "Upload",
        chooseImageType: "Choose the Image Type",
        frontFace: "Front Face",
        backFace: "Back Face",
        dragDrop: "Drag and Drop Your File Here.",
        fileHint: "PDF, JPG, and PNG files are accepted, with a maximum size of 5MB.",
        or: "or",
        browseFile: "Browse File",
        cancel: "Cancel",
        saveChanges: "Save Changes",
      },
    },
    withdrawals: {
      cashWithdrawal: "Cash Withdrawal",
      accountNumber: "Account number: 5031830",
      chooseMethod: "Choose a withdrawal method",
      digitalCurrency: "Digital Currency",
      bankTransfer: "Bank Transfer",
      amount: "Amount $",
      bankName: "Bank Name",
      ibanNumber: "IBAN Number",
      currencyType: "Currency Type",
      walletAddress: "Wallet Address",
      confirmText: "I confirm that I want to withdraw the funds and that all the information is correct.",
      withdraw: "Withdraw",
      cancellation: "Cancellation",
      saveChanges: "Save Changes",
      reset: "Reset",
      warningTitle: "To cancel the withdrawal, please contact technical support.",
      warningText: "If multiple withdrawal requests are submitted consecutively, requests will be canceled for 72 hours.",
      securityNote: "All transactions are encrypted and protected with the highest security standards.",
    },
    depositFunds: {
      depositingFunds: "Depositing funds",
      accountNumber: "Account number: 5031830",
      chooseMethod: "Choose a payment method",
      digitalCurrencies: "Digital Currencies",
      creditCard: "Credit Card",
      amount: "Amount $",
      selectCurrency: "Select currency",
      selectNetwork: "Select a network",
      depositAddress: "Deposit address",
      sendPicture: "Send a picture of the transfer",
      recommendedPlatforms: "We recommend using the following platforms:",
      securityNote: "All transactions are encrypted and protected with the highest security standards.",
    },
    contactUs: {
      personalInformation: "Personal Information",
      contactInformation: "Contact Information",
      orderDetails: "Order Details",
      dataReview: "Data Review",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phoneNumber: "Phone Number",
      reasonForCommunication: "Reason for Communication",
      requestType: "Request Type",
      topicDetails: "Topic Details",
      previous: "Previous",
      next: "Next",
      send: "Send",
    },
    financialTransactions: {
      date: "Date",
      paymentMethod: "Payment Method",
      type: "Type",
      amount: "Amount",
      status: "Status",
      rowsPerPage: "Rows per page:",
      of: "of",
      noTransactions: "No transactions yet",
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      bonus: "Bonus",
      completed: "Completed",
      pending: "Pending",
      failed: "Failed",
    },
  },
  ar: {
    clientArea: "منطقة العميل",
    supportSecurity: "الدعم والأمان",
    items: [
      { key: "personal-data", label: "البيانات الشخصية", icon: "user" },
      { key: "upload-documents", label: "رفع المستندات", icon: "upload" },
      { key: "deposit-funds", label: "إيداع الأموال", icon: "cash" },
      { key: "financial-transactions", label: "المعاملات المالية", icon: "list" },
      { key: "withdrawals", label: "السحوبات", icon: "card" },
    ],
    support: [
      { key: "change-password", label: "تغيير كلمة المرور", icon: "lock" },
      { key: "contact-us", label: "اتصل بنا", icon: "chat" },
    ],
    logout: "تسجيل الخروج",
    pageTitles: {
      "personal-data": "البيانات الشخصية",
      "upload-documents": "رفع المستندات",
      "deposit-funds": "إيداع الأموال",
      "financial-transactions": "المعاملات المالية",
      "withdrawals": "طلب سحب",
      "change-password": "تغيير كلمة المرور",
      "contact-us": "اتصل بنا",
    } as Record<string, string>,
    changePassword: {
      hint: "استخدم 8 أحرف على الأقل، بما في ذلك الأرقام والرموز الخاصة لأمان أفضل.",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور الجديدة",
      matchNote: "تأكد من تطابق كلمة المرور الجديدة",
      save: "حفظ",
    },
    uploadPhoto: "رفع صورة جديدة",
    reset: "إعادة تعيين",
    photoHint: "يُسمح بصيغ JPG أو GIF أو PNG. الحجم الأقصى 800K",
    saveChanges: "حفظ التغييرات",
    infoNote: "لتغيير أو تحديث بياناتك، يرجى التواصل معنا على",
    infoEmail: "admin@namaya.ar",
    fields: {
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      mobile: "رقم الجوال",
      email: "البريد الإلكتروني",
      id: "رقم الهوية",
      dateOfBirth: "تاريخ الميلاد",
      address: "العنوان",
      city: "المدينة",
      postalCode: "الرمز البريدي",
      country: "البلد",
      profession: "المهنة",
      additionalPhone: "رقم هاتف إضافي",
      annualIncome: "الدخل السنوي",
    },
    uploadDocuments: {
      subtitle: "يرجى رفع جميع المستندات المطلوبة للتحقق من حسابك",
      securityNote: "جميع المستندات مخزنة ومشفرة بشكل آمن",
      waitingUpload: "في انتظار الرفع",
      pendingReview: "قيد المراجعة",
      uploadDocument: "رفع المستند",
      viewDocument: "عرض",
      replaceDocument: "استبدال",
      uploading: "جاري الرفع...",
      frontLabel: "أمامي",
      backLabel: "خلفي",
      uploaded: "تم الرفع",
      waiting: "انتظار",
      documents: [
        { key: "credit-card", icon: "creditcard", title: "بطاقة الائتمان", description: "صورة بطاقة الائتمان", hasImageType: true },
        { key: "personal-identity", icon: "identity", title: "الهوية الشخصية", description: "نسخة واضحة من بطاقة هوية وطنية صالحة أو جواز سفر", hasImageType: true },
        { key: "other-documents", icon: "document", title: "مستندات أخرى", description: "أي مستندات داعمة أخرى مثل عقد إيجار، رخصة تجارية...", hasImageType: false },
        { key: "proof-of-address", icon: "home", title: "إثبات العنوان", description: "فاتورة خدمات لا تتجاوز 3 أشهر أو عقد إيجار", hasImageType: false },
      ],
      modal: {
        uploadTitle: "رفع",
        chooseImageType: "اختر نوع الصورة",
        frontFace: "الوجه الأمامي",
        backFace: "الوجه الخلفي",
        dragDrop: "اسحب وأفلت ملفك هنا.",
        fileHint: "يتم قبول ملفات PDF و JPG و PNG، بحد أقصى 5 ميجابايت.",
        or: "أو",
        browseFile: "تصفح الملفات",
        cancel: "إلغاء",
        saveChanges: "حفظ التغييرات",
      },
    },
    withdrawals: {
      cashWithdrawal: "سحب نقدي",
      accountNumber: "رقم الحساب: 5031830",
      chooseMethod: "اختر طريقة السحب",
      digitalCurrency: "العملة الرقمية",
      bankTransfer: "تحويل بنكي",
      amount: "المبلغ $",
      bankName: "اسم البنك",
      ibanNumber: "رقم الآيبان",
      currencyType: "نوع العملة",
      walletAddress: "عنوان المحفظة",
      confirmText: "أؤكد أنني أريد سحب الأموال وأن جميع المعلومات صحيحة.",
      withdraw: "سحب",
      cancellation: "إلغاء",
      saveChanges: "حفظ التغييرات",
      reset: "إعادة تعيين",
      warningTitle: "لإلغاء السحب، يرجى التواصل مع الدعم الفني.",
      warningText: "في حال تقديم طلبات سحب متتالية، سيتم إلغاء الطلبات لمدة 72 ساعة.",
      securityNote: "جميع المعاملات مشفرة ومحمية بأعلى معايير الأمان.",
    },
    depositFunds: {
      depositingFunds: "إيداع الأموال",
      accountNumber: "رقم الحساب: 5031830",
      chooseMethod: "اختر طريقة الدفع",
      digitalCurrencies: "العملات الرقمية",
      creditCard: "بطاقة الائتمان",
      amount: "المبلغ $",
      selectCurrency: "اختر العملة",
      selectNetwork: "اختر الشبكة",
      depositAddress: "عنوان الإيداع",
      sendPicture: "أرسل صورة التحويل",
      recommendedPlatforms: "نوصي باستخدام المنصات التالية:",
      securityNote: "جميع المعاملات مشفرة ومحمية بأعلى معايير الأمان.",
    },
    contactUs: {
      personalInformation: "المعلومات الشخصية",
      contactInformation: "معلومات الاتصال",
      orderDetails: "تفاصيل الطلب",
      dataReview: "مراجعة البيانات",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      email: "البريد الإلكتروني",
      phoneNumber: "رقم الهاتف",
      reasonForCommunication: "سبب التواصل",
      requestType: "نوع الطلب",
      topicDetails: "تفاصيل الموضوع",
      previous: "السابق",
      next: "التالي",
      send: "إرسال",
    },
    financialTransactions: {
      date: "التاريخ",
      paymentMethod: "طريقة الدفع",
      type: "النوع",
      amount: "المبلغ",
      status: "الحالة",
      rowsPerPage: "صفوف لكل صفحة:",
      of: "من",
      noTransactions: "لا توجد معاملات بعد",
      deposit: "إيداع",
      withdrawal: "سحب",
      bonus: "مكافأة",
      completed: "مكتمل",
      pending: "قيد الانتظار",
      failed: "فشل",
    },
  },
};

/* ── SVG Icons for sidebar ──────────────────────────────────────────── */
function SidebarIcon({ type, active }: { type: string; active?: boolean }) {
  const color = active ? "white" : "rgba(46,38,61,0.9)";
  const props = { width: 20, height: 20, fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (type) {
    case "user":
      return <svg {...props} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case "upload":
      return <svg {...props} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
    case "cash":
      return <svg {...props} viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><circle cx="12" cy="12" r="3" /><path d="M1 10h2m18 0h2M1 14h2m18 0h2" /></svg>;
    case "list":
      return <svg {...props} viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>;
    case "card":
      return <svg {...props} viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>;
    case "lock":
      return <svg {...props} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
    case "chat":
      return <svg {...props} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
    case "logout":
      return <svg {...props} stroke="#ff4c51" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
    default:
      return null;
  }
}

/* ── Country resolution helper ────────────────────────────────────── */
/**
 * Resolve country iso2 from stored value.
 * Old registrations stored display names like "Saudi Arabia".
 * New registrations store iso2 like "sa".
 * Falls back to detecting dial code from the phone number.
 */
function resolveCountryIso2(storedCountry: string, storedPhone: string): string {
  // Already an iso2 code
  if (COUNTRIES.some((c) => c.iso2 === storedCountry)) return storedCountry;
  // Try matching by English or Arabic name
  const byName = COUNTRIES.find(
    (c) => c.en.toLowerCase() === storedCountry.toLowerCase() || c.ar === storedCountry
  );
  if (byName) return byName.iso2;
  // Detect from phone number prefix (try longest dial codes first)
  if (storedPhone) {
    const phone = storedPhone.startsWith("+") ? storedPhone : "+" + storedPhone;
    const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    for (const c of sorted) {
      if (phone.startsWith(c.dialCode)) return c.iso2;
    }
  }
  // Default to Saudi Arabia
  return "sa";
}

/* ── Phone string helpers ──────────────────────────────────────────── */
function parsePhone(stored: string, dialCode: string): string {
  if (!dialCode) return stored;
  const prefix = dialCode + " ";
  if (stored.startsWith(prefix)) return stored.slice(prefix.length);
  if (stored.startsWith(dialCode)) return stored.slice(dialCode.length).trimStart();
  return stored;
}

function composePhone(dialCode: string, localNumber: string): string {
  const trimmed = localNumber.trim();
  if (!trimmed) return "";
  if (!dialCode) return trimmed;
  return dialCode + " " + trimmed;
}

/* ── Phone validation ─────────────────────────────────────────────── */
function validatePhone(
  localNumber: string,
  countryIso2: string
): { valid: boolean; errorEn?: string; errorAr?: string } {
  const digits = localNumber.replace(/\D/g, "");
  if (!digits) return { valid: true }; // empty is not an error (handled by required)

  const country = COUNTRIES.find((c) => c.iso2 === countryIso2);
  const rules = country?.phoneRules ?? DEFAULT_PHONE_RULES;

  if (digits.length < rules.min) {
    return {
      valid: false,
      errorEn: `Phone number must be at least ${rules.min} digits`,
      errorAr: `يجب أن يكون رقم الهاتف ${rules.min} أرقام على الأقل`,
    };
  }
  if (digits.length > rules.max) {
    return {
      valid: false,
      errorEn: `Phone number must be at most ${rules.max} digits`,
      errorAr: `يجب ألا يتجاوز رقم الهاتف ${rules.max} أرقام`,
    };
  }
  if (rules.startsWith && rules.startsWith.length > 0) {
    const matches = rules.startsWith.some((prefix) => digits.startsWith(prefix));
    if (!matches) {
      const prefixes = rules.startsWith.join(", ");
      return {
        valid: false,
        errorEn: `Phone number must start with ${prefixes}`,
        errorAr: `يجب أن يبدأ رقم الهاتف بـ ${prefixes}`,
      };
    }
  }
  return { valid: true };
}

/* ── Modern input field ─────────────────────────────────────────────── */
function FloatingField({
  label,
  value,
  type = "text",
  required,
  isAr,
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  isAr?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
      <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">
        {label}
        {required && <span className="text-[#ff4c51] ms-[2px]">*</span>}
      </label>
      <input
        type={type}
        dir={type === "tel" ? "ltr" : undefined}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] w-full focus:outline-none focus:border-accent focus:bg-white transition-colors"
      />
    </div>
  );
}

/* ── Phone input with dial code prefix ────────────────────────────── */
function PhoneField({
  label,
  value,
  dialCode,
  countryIso2,
  required,
  error,
  isAr,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  dialCode: string;
  countryIso2: string;
  required?: boolean;
  error?: string;
  isAr?: boolean;
  onChange?: (fullValue: string) => void;
  onBlur?: () => void;
}) {
  const localNumber = parsePhone(value, dialCode);

  const country = COUNTRIES.find((c) => c.iso2 === countryIso2);
  const maxDigits = country?.phoneRules?.max ?? DEFAULT_PHONE_RULES.max;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^\d]/g, "");
    if (cleaned.length > maxDigits) return; // block typing beyond max
    onChange?.(composePhone(dialCode, cleaned));
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
      <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">
        {label}
        {required && <span className="text-[#ff4c51] ms-[2px]">*</span>}
      </label>
      <div
        dir="ltr"
        className={`flex items-center bg-[#f8f9fb] border rounded-[8px] focus-within:border-accent focus-within:bg-white transition-colors overflow-hidden ${
          error ? "border-[#ff4c51]" : "border-[rgba(46,38,61,0.14)]"
        }`}
      >
        {dialCode && (
          <div className="flex items-center gap-[6px] px-[10px] py-[7px] xl:py-[9px] border-r border-[rgba(46,38,61,0.14)] shrink-0 select-none">
            {countryIso2 && (
              <Image
                src={`https://flagcdn.com/w40/${countryIso2}.png`}
                alt={countryIso2.toUpperCase()}
                width={18}
                height={13}
                className="shrink-0 rounded-[2px] object-cover"
                unoptimized
              />
            )}
            <span className="text-[13px] text-[rgba(46,38,61,0.6)] font-medium leading-[20px] whitespace-nowrap">
              {dialCode}
            </span>
          </div>
        )}
        <input
          type="tel"
          value={localNumber}
          onChange={handleChange}
          onBlur={onBlur}
          className={`flex-1 min-w-0 bg-transparent px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] focus:outline-none ${isAr ? "text-right" : "text-left"}`}
        />
      </div>
      {error && (
        <span className="text-[11px] text-[#ff4c51] leading-[16px]">{error}</span>
      )}
    </div>
  );
}

/* ── Country selector with flags ──────────────────────────────────── */
function CountrySelector({
  label,
  value,
  isAr,
  onChange,
}: {
  label: string;
  value: string;
  isAr?: boolean;
  onChange: (iso2: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const lowerQuery = query.toLowerCase();
  const filtered = query
    ? COUNTRIES.filter(
        (c) =>
          c.en.toLowerCase().includes(lowerQuery) ||
          c.ar.includes(query) ||
          c.iso2.startsWith(lowerQuery)
      )
    : COUNTRIES;

  const selected = COUNTRIES.find((c) => c.iso2 === value);
  const displayName = selected ? (isAr ? selected.ar : selected.en) : "";

  return (
    <div ref={ref} className="flex-1 min-w-0 flex flex-col gap-[4px] relative">
      <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">
        {label}
      </label>
      <button
        type="button"
        onClick={() => { setOpen(!open); setQuery(""); }}
        className="bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] flex items-center justify-between w-full hover:border-[rgba(46,38,61,0.3)] transition-colors focus:outline-none focus:border-accent cursor-pointer"
      >
        <span className="flex items-center gap-[8px] min-w-0 truncate">
          {selected && (
            <Image
              src={`https://flagcdn.com/w40/${selected.iso2}.png`}
              alt={selected.en}
              width={20}
              height={15}
              className="shrink-0 rounded-[2px] object-cover"
            />
          )}
          <span className="truncate">{displayName || (isAr ? "اختر الدولة" : "Select country")}</span>
        </span>
        <svg
          className={`shrink-0 ms-[8px] transition-transform ${open ? "rotate-180" : ""}`}
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="rgba(46,38,61,0.4)" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-[4px] left-0 right-0 z-50 bg-white rounded-[8px] border border-[rgba(46,38,61,0.14)] shadow-[0px_8px_24px_rgba(46,38,61,0.14)] flex flex-col overflow-hidden">
          <div className="p-[8px] border-b border-[rgba(46,38,61,0.08)]">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isAr ? "بحث..." : "Search..."}
              className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[6px] px-[10px] py-[6px] text-[13px] text-[rgba(46,38,61,0.9)] placeholder:text-[rgba(46,38,61,0.35)] focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <ul className="overflow-y-auto max-h-[220px]">
            {filtered.length === 0 ? (
              <li className="px-[12px] py-[10px] text-[13px] text-[rgba(46,38,61,0.5)] text-center">
                {isAr ? "لا توجد نتائج" : "No results"}
              </li>
            ) : (
              filtered.map((c) => (
                <li key={c.iso2}>
                  <button
                    type="button"
                    onClick={() => { onChange(c.iso2); setOpen(false); setQuery(""); }}
                    className={`w-full flex items-center gap-[10px] px-[12px] py-[8px] text-[13px] leading-[20px] hover:bg-accent/[0.06] transition-colors text-start ${
                      value === c.iso2 ? "bg-accent/[0.08] font-medium text-accent" : "text-[rgba(46,38,61,0.9)]"
                    }`}
                  >
                    <Image
                      src={`https://flagcdn.com/w40/${c.iso2}.png`}
                      alt={c.en}
                      width={20}
                      height={15}
                      className="shrink-0 rounded-[2px] object-cover"
                    />
                    {isAr ? c.ar : c.en}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── Annual income select ─────────────────────────────────────────── */
const INCOME_OPTIONS_EN = [
  "Less than $50,000",
  "$50,000 – $100,000",
  "$100,000 – $250,000",
  "$250,000 – $500,000",
  "More than $500,000",
];
const INCOME_OPTIONS_AR = [
  "أقل من 50,000$",
  "50,000$ – 100,000$",
  "100,000$ – 250,000$",
  "250,000$ – 500,000$",
  "أكثر من 500,000$",
];

function AnnualIncomeSelect({
  label,
  value,
  isAr,
  onChange,
}: {
  label: string;
  value: string;
  isAr?: boolean;
  onChange: (v: string) => void;
}) {
  const options = isAr ? INCOME_OPTIONS_AR : INCOME_OPTIONS_EN;
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
      <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] focus:outline-none focus:border-accent focus:bg-white transition-colors appearance-none cursor-pointer"
        >
          <option value="" disabled></option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <svg
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isAr ? "left-[14px]" : "right-[14px]"}`}
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="rgba(46,38,61,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}

/* ── Password field with toggle ─────────────────────────────────────── */
function PasswordField({ placeholder, isAr, value, onChange, error }: { placeholder: string; isAr?: boolean; value?: string; onChange?: (v: string) => void; error?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-[4px] w-full">
      <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">
        {placeholder}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="••••••••"
          className={`w-full bg-[#f8f9fb] border rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] placeholder:text-[rgba(46,38,61,0.3)] focus:outline-none focus:border-accent focus:bg-white transition-colors leading-[20px] ${error ? "border-[#ff4c51]" : "border-[rgba(46,38,61,0.14)]"}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className={`absolute top-1/2 -translate-y-1/2 text-[rgba(46,38,61,0.4)] hover:text-[rgba(46,38,61,0.7)] transition-colors cursor-pointer ${isAr ? "left-[14px]" : "right-[14px]"}`}
        >
        {show ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
        </button>
      </div>
      {error && <span className="text-[11px] text-[#ff4c51]">{error}</span>}
    </div>
  );
}

/* ── Personal Data View ─────────────────────────────────────────────── */
function PersonalDataView({ t, user, isAr }: { t: (typeof sidebarItems)["en"]; user: UserProfile; isAr: boolean }) {
  const { updateUser } = useUserAuth();
  // Resolve country iso2 from stored value (handles legacy display names + phone detection)
  const resolvedUser = {
    ...user,
    country: resolveCountryIso2(user.country, user.mobile),
  };
  const [formData, setFormData] = useState<UserProfile>(resolvedUser);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "err">("idle");
  const [phoneError, setPhoneError] = useState("");
  const [addPhoneError, setAddPhoneError] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({
      ...user,
      country: resolveCountryIso2(user.country, user.mobile),
    });
  }, [user]);

  const set = (field: keyof UserProfile) => (v: string) =>
    setFormData((prev) => ({ ...prev, [field]: v }));

  const currentDialCode = COUNTRIES.find((c) => c.iso2 === formData.country)?.dialCode ?? "";

  const handleCountryChange = (newIso2: string) => {
    const newCountry = COUNTRIES.find((c) => c.iso2 === newIso2);
    const newDialCode = newCountry?.dialCode ?? "";
    setFormData((prev) => {
      const oldDialCode = COUNTRIES.find((c) => c.iso2 === prev.country)?.dialCode ?? "";
      const mobileLocal = parsePhone(prev.mobile, oldDialCode);
      const addPhoneLocal = parsePhone(prev.additionalPhone, oldDialCode);
      return {
        ...prev,
        country: newIso2,
        mobile: composePhone(newDialCode, mobileLocal),
        additionalPhone: composePhone(newDialCode, addPhoneLocal),
      };
    });
    // Re-validate phones when country changes
    setPhoneError("");
    setAddPhoneError("");
  };

  const handlePhoneBlur = () => {
    const local = parsePhone(formData.mobile, currentDialCode);
    if (!local) { setPhoneError(""); return; }
    const result = validatePhone(local, formData.country);
    setPhoneError(result.valid ? "" : (isAr ? result.errorAr! : result.errorEn!));
  };

  const handleAddPhoneBlur = () => {
    const local = parsePhone(formData.additionalPhone, currentDialCode);
    if (!local) { setAddPhoneError(""); return; }
    const result = validatePhone(local, formData.country);
    setAddPhoneError(result.valid ? "" : (isAr ? result.errorAr! : result.errorEn!));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/user/avatar", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok && json.url) {
        updateUser({ avatar: json.url });
        setAvatarPreview(json.url);
        URL.revokeObjectURL(objectUrl);
      } else {
        setAvatarPreview(null);
      }
    } catch {
      setAvatarPreview(null);
    }
    e.target.value = "";
  };

  const handleReset = () => {
    setAvatarPreview(null);
    updateUser({ avatar: "" });
  };

  const handleSave = async () => {
    // Validate phone numbers before saving
    const mobileLocal = parsePhone(formData.mobile, currentDialCode);
    const addPhoneLocal = parsePhone(formData.additionalPhone, currentDialCode);

    if (mobileLocal) {
      const mobileResult = validatePhone(mobileLocal, formData.country);
      if (!mobileResult.valid) {
        setPhoneError(isAr ? mobileResult.errorAr! : mobileResult.errorEn!);
        return;
      }
    }
    if (addPhoneLocal) {
      const addResult = validatePhone(addPhoneLocal, formData.country);
      if (!addResult.valid) {
        setAddPhoneError(isAr ? addResult.errorAr! : addResult.errorEn!);
        return;
      }
    }

    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        updateUser(formData);
        setSaveStatus("ok");
      } else {
        setSaveStatus("err");
      }
    } catch {
      setSaveStatus("err");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const displayAvatar = avatarPreview || (user.avatar && user.avatar !== "/images/avatar-placeholder.png" ? user.avatar : null);

  return (
    <div className="flex-1 flex items-center justify-center">
    <div className="p-[12px] md:p-[16px] overflow-hidden w-full max-w-[900px] xl:max-w-[1100px] bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)]">
      {/* Profile photo section */}
      <div className="flex flex-col sm:flex-row items-center gap-[12px] sm:gap-[16px] mb-[16px] xl:mb-[24px]">
        <div className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-[6px] overflow-hidden bg-[#e0e0e0] shrink-0 flex items-center justify-center">
          {displayAvatar ? (
            <Image
              src={displayAvatar}
              alt="avatar"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-[20px] sm:text-[28px] font-semibold text-[rgba(46,38,61,0.5)]">
              {user.firstName[0]}{user.lastName[0]}
            </span>
          )}
        </div>
        <div className="flex flex-col items-center sm:items-start gap-[8px] sm:gap-[12px]">
          <div className="flex items-center gap-[10px]">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="cta-gradient rounded-[4px] px-[12px] py-[5px] text-white text-[12px] font-medium leading-[18px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer"
            >
              {t.uploadPhoto}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="border border-[#ff4c51] rounded-[4px] px-[12px] py-[5px] text-[#ff4c51] text-[12px] font-medium leading-[18px] hover:bg-[#ff4c51] hover:text-white transition-all cursor-pointer"
            >
              {t.reset}
            </button>
          </div>
          <p className="text-[rgba(46,38,61,0.7)] text-[12px] sm:text-[13px] leading-[18px] text-center sm:text-start">
            {t.photoHint}
          </p>
        </div>
      </div>

      {/* Form fields grid */}
      <div className="flex flex-col gap-[10px] xl:gap-[14px]">
        <div className="flex flex-col md:flex-row gap-[10px] xl:gap-[14px]">
          <FloatingField label={t.fields.firstName} value={formData.firstName} required isAr={isAr} onChange={set("firstName")} />
          <FloatingField label={t.fields.lastName} value={formData.lastName} required isAr={isAr} onChange={set("lastName")} />
        </div>
        <div className="flex flex-col md:flex-row gap-[10px] xl:gap-[14px]">
          <PhoneField label={t.fields.mobile} value={formData.mobile} dialCode={currentDialCode} countryIso2={formData.country} required error={phoneError} isAr={isAr} onChange={set("mobile")} onBlur={handlePhoneBlur} />
          <FloatingField label={t.fields.email} value={formData.email} type="email" required isAr={isAr} onChange={set("email")} />
        </div>
        <div className="flex flex-col md:flex-row gap-[10px] xl:gap-[14px]">
          <FloatingField label={t.fields.id} value={formData.id} isAr={isAr} onChange={set("id")} />
          <FloatingField label={t.fields.dateOfBirth} value={formData.dateOfBirth} isAr={isAr} onChange={set("dateOfBirth")} />
        </div>
        <div className="flex flex-col md:flex-row gap-[10px] xl:gap-[14px]">
          <FloatingField label={t.fields.address} value={formData.address} isAr={isAr} onChange={set("address")} />
          <FloatingField label={t.fields.city} value={formData.city} isAr={isAr} onChange={set("city")} />
        </div>
        <div className="flex flex-col md:flex-row gap-[10px] xl:gap-[14px]">
          <FloatingField label={t.fields.postalCode} value={formData.postalCode} isAr={isAr} onChange={set("postalCode")} />
          <CountrySelector label={t.fields.country} value={formData.country} isAr={isAr} onChange={handleCountryChange} />
        </div>
        <div className="flex flex-col md:flex-row gap-[10px] xl:gap-[14px]">
          <FloatingField label={t.fields.profession} value={formData.profession} isAr={isAr} onChange={set("profession")} />
          <PhoneField label={t.fields.additionalPhone} value={formData.additionalPhone} dialCode={currentDialCode} countryIso2={formData.country} error={addPhoneError} isAr={isAr} onChange={set("additionalPhone")} onBlur={handleAddPhoneBlur} />
        </div>
        <div className="flex flex-col md:flex-row gap-[10px] xl:gap-[14px]">
          <AnnualIncomeSelect label={t.fields.annualIncome} value={formData.annualIncome} isAr={isAr} onChange={set("annualIncome")} />
          <div className="flex-1 min-w-0" />
        </div>
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="cta-gradient rounded-[6px] px-[16px] py-[6px] text-white text-[14px] font-medium leading-[20px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            {saving ? (isAr ? "جارٍ الحفظ..." : "Saving...") : t.saveChanges}
          </button>
          {saveStatus === "ok" && (
            <span className="text-[13px] text-accent font-medium">
              {isAr ? "تم الحفظ بنجاح" : "Saved successfully"}
            </span>
          )}
          {saveStatus === "err" && (
            <span className="text-[13px] text-[#ff4c51] font-medium">
              {isAr ? "فشل الحفظ" : "Save failed"}
            </span>
          )}
        </div>
        <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[12px]">
          <p className="text-[rgba(46,38,61,0.7)] text-[14px] leading-[20px]">
            {t.infoNote}{" "}
            <span className="font-medium text-[rgba(46,38,61,0.9)]">{t.infoEmail}</span>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

/* ── Change Password View ───────────────────────────────────────────── */
function ChangePasswordView({ t, isAr }: { t: (typeof sidebarItems)["en"]; isAr: boolean }) {
  const cp = t.changePassword;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [apiError, setApiError] = useState("");

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!currentPassword) e.current = isAr ? "يرجى إدخال كلمة المرور الحالية" : "Please enter your current password";
    if (!newPassword) {
      e.new = isAr ? "يرجى إدخال كلمة المرور الجديدة" : "Please enter a new password";
    } else if (newPassword.length < 8) {
      e.new = isAr ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" : "Password must be at least 8 characters";
    } else if (!/\d/.test(newPassword)) {
      e.new = isAr ? "يجب أن تحتوي على رقم واحد على الأقل" : "Must contain at least one number";
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      e.new = isAr ? "يجب أن تحتوي على رمز خاص واحد على الأقل" : "Must contain at least one special character";
    }
    if (!confirmPassword) {
      e.confirm = isAr ? "يرجى تأكيد كلمة المرور الجديدة" : "Please confirm your new password";
    } else if (newPassword && confirmPassword !== newPassword) {
      e.confirm = isAr ? "كلمات المرور غير متطابقة" : "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    setApiError("");
    setStatus("idle");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 && data.error?.includes("Current password")) {
          setErrors((prev) => ({ ...prev, current: isAr ? "كلمة المرور الحالية غير صحيحة" : "Current password is incorrect" }));
        } else {
          setApiError(data.error || (isAr ? "حدث خطأ" : "An error occurred"));
        }
        setStatus("err");
        return;
      }

      setStatus("ok");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setApiError(isAr ? "حدث خطأ في الاتصال" : "Connection error");
      setStatus("err");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center min-h-[calc(100vh-96px)]">
      <div className="overflow-hidden w-full max-w-[480px] bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)]">
        <div className="flex flex-col gap-[14px] items-center justify-center px-[16px] pt-[16px] pb-[14px]">
          {/* Hint text */}
          <p className="text-[rgba(46,38,61,0.7)] text-[14px] leading-[20px] text-center w-full">
            {cp.hint}
          </p>

          {/* Password fields */}
          <div className="flex flex-col gap-[14px] w-full max-w-[420px]">
            <PasswordField
              placeholder={cp.currentPassword}
              isAr={isAr}
              value={currentPassword}
              onChange={(v) => { setCurrentPassword(v); setErrors((p) => { const n = { ...p }; delete n.current; return n; }); }}
              error={errors.current}
            />
            <PasswordField
              placeholder={cp.newPassword}
              isAr={isAr}
              value={newPassword}
              onChange={(v) => { setNewPassword(v); setErrors((p) => { const n = { ...p }; delete n.new; return n; }); }}
              error={errors.new}
            />
            <PasswordField
              placeholder={cp.confirmPassword}
              isAr={isAr}
              value={confirmPassword}
              onChange={(v) => { setConfirmPassword(v); setErrors((p) => { const n = { ...p }; delete n.confirm; return n; }); }}
              error={errors.confirm}
            />

            {/* Match note */}
            <p className="text-[rgba(46,38,61,0.9)] text-[14px] leading-[20px]">
              {cp.matchNote}
            </p>

            {/* Status messages */}
            {status === "ok" && (
              <div className="bg-[rgba(40,199,111,0.12)] rounded-[6px] px-[14px] py-[10px] text-[14px] text-[#28c76f] font-medium leading-[20px]">
                {isAr ? "تم تغيير كلمة المرور بنجاح" : "Password changed successfully"}
              </div>
            )}
            {apiError && (
              <div className="bg-[rgba(255,76,81,0.12)] rounded-[6px] px-[14px] py-[10px] text-[14px] text-[#ff4c51] font-medium leading-[20px]">
                {apiError}
              </div>
            )}

            {/* Save button - full width */}
            <button
              onClick={handleSave}
              disabled={submitting}
              className="w-full cta-gradient rounded-[6px] px-[16px] py-[6px] text-white text-[14px] font-medium leading-[20px] text-center shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (isAr ? "جارٍ الحفظ..." : "Saving...") : cp.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Document card icon ────────────────────────────────────────────── */
function DocIcon({ type }: { type: string }) {
  const props = { width: 28, height: 28, fill: "none", stroke: "rgba(46,38,61,0.9)", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "home":
      return <svg {...props} viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
    case "identity":
      return <svg {...props} viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" rx="2" /><circle cx="9" cy="10" r="2.5" /><path d="M5 17c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" /><line x1="15" y1="8" x2="19" y2="8" /><line x1="15" y1="12" x2="19" y2="12" /></svg>;
    case "document":
      return <svg {...props} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
    case "creditcard":
      return <svg {...props} viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /><line x1="6" y1="15" x2="10" y2="15" /></svg>;
    default:
      return null;
  }
}

/* ── Upload icon for button ───────────────────────────────────────── */
function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/* ── Upload Modal ─────────────────────────────────────────────────── */
type UploadModalStep = "image-type" | "drag-drop";

function UploadModal({
  docTitle,
  docKey,
  hasImageType,
  t,
  onClose,
  onUpload,
  uploading,
}: {
  docTitle: string;
  docKey: string;
  hasImageType: boolean;
  t: (typeof sidebarItems)["en"];
  onClose: () => void;
  onUpload: (docKey: string, file: File, face?: string) => Promise<void>;
  uploading: boolean;
}) {
  const modal = t.uploadDocuments.modal;
  const [step, setStep] = useState<UploadModalStep>(hasImageType ? "image-type" : "drag-drop");
  const [selectedFace, setSelectedFace] = useState<"front" | "back">("front");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  }, []);

  return (
    <div className="fixed inset-0 bg-[rgba(46,38,61,0.22)] z-50 flex items-center justify-center px-[24px]" onClick={onClose}>
      <div className="bg-white rounded-[6px] w-full max-w-[420px] flex flex-col gap-[20px] px-[20px] pt-[20px] pb-[16px]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px]">
            {modal.uploadTitle} {docTitle}
          </h3>
          <button onClick={onClose} className="text-[rgba(46,38,61,0.6)] hover:text-[rgba(46,38,61,0.9)] transition-colors cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Step 1: Choose Image Type */}
        {step === "image-type" && (
          <>
            <div className="border border-dashed border-[rgba(46,38,61,0.12)] rounded-[6px] px-[21px] py-[49px] flex flex-col items-center gap-[16px]">
              <h4 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px] text-center">
                {modal.chooseImageType}
              </h4>
              <div className="flex flex-col gap-[20px] w-full">
                {/* Front Face */}
                <button
                  onClick={() => { setSelectedFace("front"); setStep("drag-drop"); }}
                  className={`w-full rounded-[6px] flex flex-col items-center gap-[8px] p-[20px] transition-all cursor-pointer ${
                    selectedFace === "front"
                      ? "bg-accent/10 border border-accent shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)]"
                      : "bg-[rgba(46,38,61,0.04)] border border-[rgba(46,38,61,0.12)] hover:border-[rgba(46,38,61,0.24)]"
                  }`}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={selectedFace === "front" ? "var(--color-accent)" : "rgba(46,38,61,0.9)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span className={`text-[18px] font-medium leading-[28px] ${selectedFace === "front" ? "text-accent" : "text-[rgba(46,38,61,0.9)]"}`}>
                    {modal.frontFace}
                  </span>
                </button>
                {/* Back Face */}
                <button
                  onClick={() => { setSelectedFace("back"); setStep("drag-drop"); }}
                  className={`w-full rounded-[6px] flex flex-col items-center gap-[8px] p-[20px] transition-all cursor-pointer ${
                    selectedFace === "back"
                      ? "bg-accent/10 border border-accent shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)]"
                      : "bg-[rgba(46,38,61,0.04)] border border-[rgba(46,38,61,0.12)] hover:border-[rgba(46,38,61,0.24)]"
                  }`}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={selectedFace === "back" ? "var(--color-accent)" : "rgba(46,38,61,0.9)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span className={`text-[18px] font-medium leading-[28px] ${selectedFace === "back" ? "text-accent" : "text-[rgba(46,38,61,0.9)]"}`}>
                    {modal.backFace}
                  </span>
                </button>
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="border border-[#8a8d93] rounded-[6px] px-[18px] py-[8px] text-[#8a8d93] text-[15px] font-medium leading-[22px] opacity-45 hover:opacity-100 transition-opacity cursor-pointer"
              >
                {modal.cancel}
              </button>
            </div>
          </>
        )}

        {/* Step 2: Drag and Drop */}
        {step === "drag-drop" && (
          <>
            <div
              className={`border border-dashed rounded-[6px] px-[21px] py-[49px] flex flex-col items-center gap-[8px] transition-colors ${
                dragOver ? "border-accent bg-accent/[0.05]" : "border-[rgba(46,38,61,0.12)]"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Upload icon */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-accent" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>

              <h4 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px] text-center">
                {modal.dragDrop}
              </h4>
              <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[22px] text-center">
                {modal.fileHint}
              </p>

              {selectedFile ? (
                <div className="mt-[8px] flex items-center gap-[8px] bg-accent/10 rounded-[6px] px-[12px] py-[8px]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[13px] text-accent font-medium">{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)} className="text-accent hover:text-accent-dark cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[rgba(46,38,61,0.4)] text-[15px] leading-[22px] text-center">{modal.or}</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="cta-gradient rounded-[4px] px-[14px] py-[8px] text-white text-[13px] font-medium leading-[18px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer"
                  >
                    {modal.browseFile}
                  </button>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <button
                onClick={hasImageType ? () => setStep("image-type") : onClose}
                className="border border-[#8a8d93] rounded-[6px] px-[18px] py-[8px] text-[#8a8d93] text-[15px] font-medium leading-[22px] opacity-45 hover:opacity-100 transition-opacity cursor-pointer"
              >
                {modal.cancel}
              </button>
              <button
                className={`cta-gradient rounded-[6px] px-[18px] py-[8px] text-white text-[15px] font-medium leading-[22px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer ${
                  selectedFile && !uploading ? "" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!selectedFile || uploading}
                onClick={() => {
                  if (selectedFile) {
                    onUpload(docKey, selectedFile, hasImageType ? selectedFace : undefined);
                  }
                }}
              >
                {uploading ? t.uploadDocuments.uploading : modal.saveChanges}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Upload Documents View ────────────────────────────────────────── */
function UploadDocumentsView({ t }: { t: (typeof sidebarItems)["en"] }) {
  const ud = t.uploadDocuments;
  const { user, updateUser } = useUserAuth();
  const [uploadModal, setUploadModal] = useState<{ title: string; key: string; hasImageType: boolean } | null>(null);
  const [uploading, setUploading] = useState(false);

  const userDocs = user?.documents ?? {};

  // Check if a document (or face) has been uploaded
  const isDocUploaded = (docKey: string, face?: string) => {
    const compositeKey = face ? `${docKey}-${face}` : docKey;
    return !!userDocs[compositeKey];
  };

  // For face-type docs, check if any face is uploaded
  const hasAnyUpload = (docKey: string, hasImageType: boolean) => {
    if (!hasImageType) return isDocUploaded(docKey);
    return isDocUploaded(docKey, "front") || isDocUploaded(docKey, "back");
  };

  // Get the first uploaded URL for "View" action
  const getViewUrl = (docKey: string, hasImageType: boolean) => {
    if (!hasImageType) return userDocs[docKey]?.url;
    return userDocs[`${docKey}-front`]?.url || userDocs[`${docKey}-back`]?.url;
  };

  const handleUpload = async (docKey: string, file: File, face?: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docKey", docKey);
      if (face) formData.append("face", face);

      const res = await fetch("/api/user/documents", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Upload failed");
        return;
      }
      const data = await res.json();
      const compositeKey = face ? `${docKey}-${face}` : docKey;
      updateUser({
        documents: {
          ...userDocs,
          [compositeKey]: {
            url: data.url,
            fileName: file.name,
            uploadedAt: new Date().toISOString(),
            face: face || undefined,
          },
        },
      });
      setUploadModal(null);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="flex-1 flex items-center justify-center">
      <div className="overflow-hidden w-full max-w-[900px] xl:max-w-[1100px] bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)]">
        <div className="flex flex-col gap-[20px] p-[12px] md:p-[16px]">
          {/* Documents section */}
          <div className="flex flex-col gap-[14px]">
            <p className="text-[rgba(46,38,61,0.7)] text-[14px] leading-[20px]">
              {ud.subtitle}
            </p>

            {/* Document cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              {ud.documents.map((doc) => {
                const anyUploaded = hasAnyUpload(doc.key, doc.hasImageType);
                return (
                  <div
                    key={doc.key}
                    className="bg-white rounded-[6px] border border-[rgba(46,38,61,0.12)] overflow-hidden"
                  >
                    <div className="flex flex-col gap-[10px] items-end p-[14px]">
                      {/* Icon + Status row */}
                      <div className="flex items-center justify-between w-full">
                        <DocIcon type={doc.icon} />
                        {anyUploaded ? (
                          <span className="bg-[rgba(255,171,0,0.16)] text-[#e09200] text-[13px] font-medium leading-[20px] px-[12px] py-[2px] rounded-[16px]">
                            {ud.pendingReview}
                          </span>
                        ) : (
                          <span className="bg-[rgba(22,177,255,0.16)] text-[#16b1ff] text-[13px] font-medium leading-[20px] px-[12px] py-[2px] rounded-[16px]">
                            {ud.waitingUpload}
                          </span>
                        )}
                      </div>

                      {/* Title + Description */}
                      <div className="flex flex-col gap-[6px] w-full">
                        <h3 className="text-[16px] font-medium text-[rgba(46,38,61,0.9)] leading-[24px]">
                          {doc.title}
                        </h3>
                        <p className="text-[12px] text-[rgba(46,38,61,0.7)] leading-[18px]">
                          {doc.description}
                        </p>
                      </div>

                      {/* Face-type status indicators */}
                      {doc.hasImageType && (
                        <div className="flex items-center gap-[12px] w-full text-[12px]">
                          <span className={`flex items-center gap-[4px] ${isDocUploaded(doc.key, "front") ? "text-accent" : "text-[rgba(46,38,61,0.4)]"}`}>
                            {isDocUploaded(doc.key, "front") ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>
                            )}
                            {ud.frontLabel}: {isDocUploaded(doc.key, "front") ? ud.uploaded : ud.waiting}
                          </span>
                          <span className={`flex items-center gap-[4px] ${isDocUploaded(doc.key, "back") ? "text-accent" : "text-[rgba(46,38,61,0.4)]"}`}>
                            {isDocUploaded(doc.key, "back") ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>
                            )}
                            {ud.backLabel}: {isDocUploaded(doc.key, "back") ? ud.uploaded : ud.waiting}
                          </span>
                        </div>
                      )}

                      {/* Action buttons */}
                      {anyUploaded ? (
                        <div className="flex items-center gap-[8px] w-full">
                          <button
                            onClick={() => {
                              const url = getViewUrl(doc.key, doc.hasImageType);
                              if (url) window.open(url, "_blank");
                            }}
                            className="flex-1 bg-[rgba(46,38,61,0.04)] border border-[rgba(46,38,61,0.12)] rounded-[6px] px-[14px] py-[6px] flex items-center justify-center gap-[6px] text-[rgba(46,38,61,0.9)] text-[14px] font-medium leading-[20px] hover:border-[rgba(46,38,61,0.24)] transition-all cursor-pointer"
                          >
                            {ud.viewDocument}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setUploadModal({ title: doc.title, key: doc.key, hasImageType: doc.hasImageType })}
                            className="flex-1 cta-gradient rounded-[6px] px-[14px] py-[6px] flex items-center justify-center gap-[6px] text-white text-[14px] font-medium leading-[20px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer"
                          >
                            {ud.replaceDocument}
                            <UploadIcon />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setUploadModal({ title: doc.title, key: doc.key, hasImageType: doc.hasImageType })}
                          className="w-full cta-gradient rounded-[6px] px-[14px] py-[6px] flex items-center justify-center gap-[6px] text-white text-[14px] font-medium leading-[20px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer"
                        >
                          {ud.uploadDocument}
                          <UploadIcon />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security notice */}
          <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[12px] flex items-center justify-center">
            <p className="text-[rgba(46,38,61,0.7)] text-[13px] leading-[20px] text-center">
              🔒 {ud.securityNote}
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <UploadModal
          docTitle={uploadModal.title}
          docKey={uploadModal.key}
          hasImageType={uploadModal.hasImageType}
          t={t}
          onClose={() => setUploadModal(null)}
          onUpload={handleUpload}
          uploading={uploading}
        />
      )}
    </>
  );
}

/* ── Deposit method icons ──────────────────────────────────────────── */
function DepositMethodIcon({ type, active }: { type: "crypto" | "card"; active?: boolean }) {
  const color = active ? "var(--color-accent)" : "rgba(46,38,61,0.9)";
  if (type === "crypto") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

/* ── Deposit Funds View ───────────────────────────────────────────── */
function DepositFundsView({ t, isAr }: { t: (typeof sidebarItems)["en"]; isAr: boolean }) {
  const df = t.depositFunds;
  const [method, setMethod] = useState<"crypto" | "card" | null>("crypto");
  const [copied, setCopied] = useState(false);
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [paymentConfig, setPaymentConfig] = useState<{
    active: boolean;
    providerName?: string;
    linkTemplate?: string;
    amounts?: number[];
    currency?: string;
    currencySymbol?: string;
  } | null>(null);
  const [cryptoConfig, setCryptoConfig] = useState<{
    enabled: boolean;
    walletAddress?: string;
    currency?: string;
    network?: string;
    qrImage?: string;
    recommendedPlatforms?: { name: string; logo: string }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/payments/config")
      .then((r) => r.json())
      .then(setPaymentConfig)
      .catch(() => setPaymentConfig({ active: false }));
    fetch("/api/payments/crypto-config")
      .then((r) => r.json())
      .then(setCryptoConfig)
      .catch(() => setCryptoConfig({ enabled: false }));
  }, []);

  const depositAddress = cryptoConfig?.walletAddress || "TBgDkELwenLnx33TpEAMsvfNgzeHfxD7Tb";
  const cryptoCurrency = cryptoConfig?.currency || "USDT  TetherUS";
  const cryptoNetwork = cryptoConfig?.network || "TRX  Tron (TRC20)";
  const cryptoQrImage = cryptoConfig?.qrImage || "";
  const cryptoPlatforms = cryptoConfig?.recommendedPlatforms || [];
  const creditAmounts = paymentConfig?.active && paymentConfig.amounts?.length
    ? paymentConfig.amounts
    : [500, 1000, 2500, 5000];
  const currencySymbol = paymentConfig?.active ? (paymentConfig.currencySymbol || "$") : "$";

  const handleDeposit = (amount: number) => {
    if (paymentConfig?.active && paymentConfig.linkTemplate) {
      const url = paymentConfig.linkTemplate.replace("{amount}", String(amount));
      window.open(url, "_blank");
    }
  };

  const [proofUploading, setProofUploading] = useState(false);
  const [proofStatus, setProofStatus] = useState<"idle" | "ok" | "err">("idle");
  const proofInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofUploading(true);
    setProofStatus("idle");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("amount", cryptoAmount || "0");
      const res = await fetch("/api/user/deposit-proof", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed");
      }
      setProofStatus("ok");
      setTimeout(() => setProofStatus("idle"), 4000);
    } catch {
      setProofStatus("err");
      setTimeout(() => setProofStatus("idle"), 4000);
    } finally {
      setProofUploading(false);
      if (proofInputRef.current) proofInputRef.current.value = "";
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="p-[12px] md:p-[16px] overflow-hidden w-full max-w-[900px] xl:max-w-[1100px] bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)]">
        <div className="flex flex-col gap-[14px]">
          {/* Header */}
          <div>
            <h2 className="text-[16px] font-medium text-[rgba(46,38,61,0.9)] leading-[24px]">
              {df.depositingFunds}
            </h2>
            <p className="text-[14px] text-[rgba(46,38,61,0.7)] leading-[20px]">
              {df.accountNumber}
            </p>
          </div>

          {/* Method selection */}
          <div className="flex flex-col gap-[10px] items-center">
            <p className="text-[14px] font-medium text-[rgba(46,38,61,0.6)] leading-[20px] self-stretch">
              {df.chooseMethod}
            </p>
            <div className="flex gap-[10px] w-full max-w-[480px]">
              <button
                onClick={() => setMethod("crypto")}
                className={`flex-1 flex items-center justify-center gap-[10px] rounded-[8px] px-[14px] py-[12px] cursor-pointer border ${
                  method === "crypto"
                    ? "bg-accent text-white border-accent"
                    : "bg-[#f8f9fb] text-[rgba(46,38,61,0.8)] border-[rgba(46,38,61,0.1)] hover:border-[rgba(46,38,61,0.2)]"
                }`}
              >
                <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 ${method === "crypto" ? "bg-white/20" : "bg-white"}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <span className="text-[14px] font-medium leading-[20px]">{df.digitalCurrencies}</span>
              </button>
              <button
                onClick={() => setMethod("card")}
                className={`flex-1 flex items-center justify-center gap-[10px] rounded-[8px] px-[14px] py-[12px] cursor-pointer border ${
                  method === "card"
                    ? "bg-accent text-white border-accent"
                    : "bg-[#f8f9fb] text-[rgba(46,38,61,0.8)] border-[rgba(46,38,61,0.1)] hover:border-[rgba(46,38,61,0.2)]"
                }`}
              >
                <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 ${method === "card" ? "bg-white/20" : "bg-white"}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <span className="text-[14px] font-medium leading-[20px]">{df.creditCard}</span>
              </button>
            </div>
          </div>

          {method && (
            <>

              {/* Digital Currencies form */}
              {method === "crypto" && (
                <div className="flex flex-col gap-[14px]">
                  {/* Section title with icon */}
                  <div className="flex items-center gap-[8px]">
                    <DepositMethodIcon type="crypto" active />
                    <h3 className="text-[16px] font-medium text-[rgba(46,38,61,0.9)] leading-[24px]">
                      {df.digitalCurrencies}
                    </h3>
                  </div>

                  {/* Form fields */}
                  <div className="flex flex-col md:flex-row gap-[10px] xl:gap-[14px]">
                    <FloatingField label={df.amount} value={cryptoAmount} onChange={setCryptoAmount} isAr={isAr} />
                    <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                      <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">
                        {df.selectCurrency}
                      </label>
                      <div className="bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] w-full">
                        {cryptoCurrency}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                      <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">
                        {df.selectNetwork}
                      </label>
                      <div className="bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] w-full">
                        {cryptoNetwork}
                      </div>
                    </div>
                  </div>

                  {/* Deposit address section */}
                  <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[12px] flex flex-col md:flex-row items-start md:items-center justify-between gap-[12px]">
                    <div className="flex flex-col gap-[6px] flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[rgba(46,38,61,0.9)] leading-[20px]">
                        {df.depositAddress}
                      </p>
                      <div className="flex items-center gap-[8px]">
                        <p className="text-[14px] text-[rgba(46,38,61,0.7)] leading-[20px] break-all">
                          {depositAddress}
                        </p>
                        <button
                          onClick={handleCopy}
                          className="shrink-0 p-[4px] hover:bg-[rgba(46,38,61,0.08)] rounded transition-colors cursor-pointer"
                          title="Copy"
                        >
                          {copied ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(46,38,61,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    {/* QR Code */}
                    <div className="shrink-0 w-[80px] h-[80px] bg-white border border-[rgba(46,38,61,0.12)] rounded-[6px] flex items-center justify-center overflow-hidden">
                      {cryptoQrImage ? (
                        <Image src={cryptoQrImage} alt="QR Code" width={80} height={80} className="w-full h-full object-contain" unoptimized />
                      ) : (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(46,38,61,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                          <rect x="14" y="14" width="3" height="3" /><rect x="18" y="14" width="3" height="3" /><rect x="14" y="18" width="3" height="3" /><rect x="18" y="18" width="3" height="3" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Send a picture button */}
                  <input
                    ref={proofInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={handleProofUpload}
                  />
                  <button
                    onClick={() => proofInputRef.current?.click()}
                    disabled={proofUploading}
                    className={`cta-gradient rounded-[6px] px-[16px] py-[6px] text-white text-[14px] font-medium leading-[20px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer self-start w-full md:w-auto ${proofUploading ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {proofUploading ? (isAr ? "جاري الرفع..." : "Uploading...") : proofStatus === "ok" ? (isAr ? "تم الإرسال ✓" : "Sent ✓") : proofStatus === "err" ? (isAr ? "فشل الرفع" : "Upload failed") : df.sendPicture}
                  </button>

                  {/* Recommended platforms */}
                  {cryptoPlatforms.length > 0 && (
                    <div className="flex flex-col gap-[8px]">
                      <p className="text-[14px] font-medium text-[rgba(46,38,61,0.9)] leading-[20px]">
                        {df.recommendedPlatforms}
                      </p>
                      <div className="flex items-center gap-[24px] flex-wrap">
                        {cryptoPlatforms.map((platform, idx) => (
                          <div key={idx} className="flex items-center gap-[8px]">
                            {platform.logo && (
                              <Image src={platform.logo} alt={platform.name} width={32} height={32} className="h-[28px] w-auto object-contain" unoptimized />
                            )}
                            {platform.name && (
                              <span className="text-[14px] font-semibold text-[rgba(46,38,61,0.9)]">{platform.name}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Credit Card form */}
              {method === "card" && (
                <div className="flex flex-col gap-[14px]">
                  {/* Amount buttons */}
                  <div className="flex flex-col gap-[8px] w-full max-w-[500px] mx-auto items-center">
                    <div className="flex items-center gap-[8px]">
                      <DepositMethodIcon type="card" active />
                      <h3 className="text-[16px] font-medium text-[rgba(46,38,61,0.9)] leading-[24px]">
                        {df.creditCard}
                      </h3>
                    </div>
                    {paymentConfig === null ? (
                      <div className="flex flex-col gap-[8px] w-full">
                        {[1,2,3].map((i) => (
                          <div key={i} className="w-full h-[32px] bg-[rgba(46,38,61,0.08)] rounded-[6px] animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      creditAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleDeposit(amount)}
                          className="w-full cta-gradient rounded-[6px] px-[16px] py-[6px] text-white text-[14px] font-medium leading-[20px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer text-center"
                        >
                          {currencySymbol}{amount}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Security note */}
          <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[12px] flex items-center justify-center">
            <p className="text-[rgba(46,38,61,0.7)] text-[13px] leading-[20px] text-center">
              🔒 {df.securityNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Withdrawal method icons ────────────────────────────────────────── */
function WithdrawalMethodIcon({ type, active }: { type: "digital" | "bank"; active?: boolean }) {
  const color = active ? "var(--color-accent)" : "rgba(46,38,61,0.9)";
  if (type === "digital") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.7 0-3 1-3 2.5S10.3 13 12 13c1.7 0 3 1 3 2.5s-1.3 2.5-3 2.5c-1 0-2-.5-2.5-1.5" />
        <line x1="12" y1="6" x2="12" y2="8" />
        <line x1="12" y1="16" x2="12" y2="18" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M3 10h18" />
      <path d="M5 6l7-3 7 3" />
      <line x1="4" y1="10" x2="4" y2="21" />
      <line x1="20" y1="10" x2="20" y2="21" />
      <line x1="8" y1="14" x2="8" y2="17" />
      <line x1="12" y1="14" x2="12" y2="17" />
      <line x1="16" y1="14" x2="16" y2="17" />
    </svg>
  );
}

/* ── Financial Transactions View ────────────────────────────────────── */
interface TransactionRecord {
  id: string;
  date: string;
  method: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
}

function FinancialTransactionsView({ t, isAr }: { t: (typeof sidebarItems)["en"]; isAr: boolean }) {
  const ft = t.financialTransactions;
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/user/transactions?page=${page}&limit=${rowsPerPage}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setTransactions(data.transactions ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const typeColors: Record<string, { bg: string; text: string }> = {
    Deposit: { bg: "bg-accent/10", text: "text-accent" },
    Withdrawal: { bg: "bg-[rgba(255,76,81,0.1)]", text: "text-[#ff4c51]" },
    Bonus: { bg: "bg-[rgba(255,171,0,0.1)]", text: "text-[#e09200]" },
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    Completed: { bg: "bg-accent/10", text: "text-accent" },
    Pending: { bg: "bg-[rgba(255,171,0,0.1)]", text: "text-[#e09200]" },
    Failed: { bg: "bg-[rgba(255,76,81,0.1)]", text: "text-[#ff4c51]" },
  };

  const typeLabel = (type: string) => {
    if (type === "Deposit") return ft.deposit;
    if (type === "Withdrawal") return ft.withdrawal;
    return ft.bonus;
  };

  const statusLabel = (status: string) => {
    if (status === "Completed") return ft.completed;
    if (status === "Pending") return ft.pending;
    return ft.failed;
  };

  const methodIcon = (method: string) => {
    if (method.includes("Credit") || method.includes("Card")) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    }
    if (method.includes("Bank")) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" /><path d="M3 10h18" /><path d="M12 3l9 7H3l9-7z" /><path d="M5 10v11" /><path d="M19 10v11" /><path d="M9 10v11" /><path d="M15 10v11" />
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    );
  };

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString(isAr ? "ar-SA" : "en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const totalRows = total;
  const paged = transactions;
  const start = totalRows === 0 ? 0 : page * rowsPerPage + 1;
  const end = Math.min((page + 1) * rowsPerPage, totalRows);

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="overflow-hidden w-full max-w-[900px] xl:max-w-[1100px] bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)]">

        {/* ── Loading state ────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-[60px]">
            <div className="w-[32px] h-[32px] border-[3px] border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        )}

        {/* ── Error state ──────────────────────────────────────────── */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
            <p className="text-[14px] text-[rgba(46,38,61,0.6)]">
              {isAr ? "فشل تحميل المعاملات" : "Failed to load transactions"}
            </p>
            <button
              onClick={fetchTransactions}
              className="px-[16px] py-[6px] cta-gradient text-white text-[13px] font-medium rounded-[6px] cursor-pointer"
            >
              {isAr ? "إعادة المحاولة" : "Retry"}
            </button>
          </div>
        )}

        {/* ── Desktop table (hidden on mobile) ─────────────────────── */}
        {!loading && !error && (
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(46,38,61,0.08)]">
                <th className="text-start px-[20px] py-[14px] text-[12px] font-semibold text-[rgba(46,38,61,0.5)] uppercase tracking-[0.06em] leading-[16px]">
                  {ft.date}
                </th>
                <th className="text-start px-[20px] py-[14px] text-[12px] font-semibold text-[rgba(46,38,61,0.5)] uppercase tracking-[0.06em] leading-[16px]">
                  {ft.paymentMethod}
                </th>
                <th className="text-start px-[20px] py-[14px] text-[12px] font-semibold text-[rgba(46,38,61,0.5)] uppercase tracking-[0.06em] leading-[16px]">
                  {ft.type}
                </th>
                <th className="text-start px-[20px] py-[14px] text-[12px] font-semibold text-[rgba(46,38,61,0.5)] uppercase tracking-[0.06em] leading-[16px]">
                  {ft.amount}
                </th>
                <th className="text-start px-[20px] py-[14px] text-[12px] font-semibold text-[rgba(46,38,61,0.5)] uppercase tracking-[0.06em] leading-[16px]">
                  {ft.status}
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-[60px] text-[14px] text-[rgba(46,38,61,0.5)]">
                    {ft.noTransactions}
                  </td>
                </tr>
              )}
              {paged.map((tx, i) => {
                const tc = typeColors[tx.type] ?? typeColors.Bonus;
                const sc = statusColors[tx.status] ?? statusColors.Completed;
                return (
                  <tr key={i} className="border-b border-[rgba(46,38,61,0.06)] hover:bg-[rgba(46,38,61,0.02)] transition-colors">
                    <td className="px-[20px] py-[16px] text-[14px] text-[rgba(46,38,61,0.6)] leading-[20px]">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-[20px] py-[16px]">
                      <div className="flex items-center gap-[8px] text-[rgba(46,38,61,0.8)]">
                        {methodIcon(tx.method)}
                        <span className="text-[14px] leading-[20px]">{tx.method}</span>
                      </div>
                    </td>
                    <td className="px-[20px] py-[16px]">
                      <span className={`inline-block px-[10px] py-[3px] rounded-full text-[12px] font-medium leading-[18px] ${tc.bg} ${tc.text}`}>
                        {typeLabel(tx.type)}
                      </span>
                    </td>
                    <td className={`px-[20px] py-[16px] text-[14px] font-semibold leading-[20px] ${tx.amount >= 0 ? "text-accent" : "text-[#ff4c51]"}`}>
                      {tx.amount >= 0 ? "+" : ""}{tx.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    </td>
                    <td className="px-[20px] py-[16px]">
                      <span className={`inline-flex items-center gap-[4px] px-[10px] py-[3px] rounded-full text-[12px] font-medium leading-[18px] ${sc.bg} ${sc.text}`}>
                        <span className={`w-[6px] h-[6px] rounded-full ${tx.status === "Completed" ? "bg-accent" : tx.status === "Pending" ? "bg-[#e09200]" : "bg-[#ff4c51]"}`} />
                        {statusLabel(tx.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}

        {/* ── Mobile card list (hidden on desktop) ─────────────────── */}
        {!loading && !error && transactions.length === 0 && (
          <div className="md:hidden flex items-center justify-center py-[60px]">
            <p className="text-[14px] text-[rgba(46,38,61,0.5)]">{ft.noTransactions}</p>
          </div>
        )}
        {!loading && !error && transactions.length > 0 && (
        <div className="md:hidden flex flex-col">
          {paged.map((tx, i) => {
            const tc = typeColors[tx.type] ?? typeColors.Bonus;
            const sc = statusColors[tx.status] ?? statusColors.Completed;
            return (
              <div key={i} className={`flex items-center gap-[12px] px-[16px] py-[14px] ${i < paged.length - 1 ? "border-b border-[rgba(46,38,61,0.06)]" : ""}`}>
                {/* Icon circle */}
                <div className={`shrink-0 w-[40px] h-[40px] rounded-full flex items-center justify-center ${tc.bg}`}>
                  <span className={tc.text}>{methodIcon(tx.method)}</span>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-[8px]">
                    <span className="text-[14px] font-medium text-[rgba(46,38,61,0.9)] leading-[20px] truncate">
                      {tx.method}
                    </span>
                    <span className={`text-[14px] font-semibold leading-[20px] shrink-0 ${tx.amount >= 0 ? "text-accent" : "text-[#ff4c51]"}`}>
                      {tx.amount >= 0 ? "+" : ""}{tx.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-[8px] mt-[4px]">
                    <div className="flex items-center gap-[6px]">
                      <span className="text-[12px] text-[rgba(46,38,61,0.5)] leading-[16px]">
                        {formatDate(tx.date)}
                      </span>
                      <span className={`inline-block px-[8px] py-[1px] rounded-full text-[11px] font-medium leading-[16px] ${tc.bg} ${tc.text}`}>
                        {typeLabel(tx.type)}
                      </span>
                    </div>
                    <span className={`inline-flex items-center gap-[3px] text-[11px] font-medium leading-[16px] ${sc.text}`}>
                      <span className={`w-[5px] h-[5px] rounded-full ${tx.status === "Completed" ? "bg-accent" : tx.status === "Pending" ? "bg-[#e09200]" : "bg-[#ff4c51]"}`} />
                      {statusLabel(tx.status)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* ── Pagination footer ────────────────────────────────────── */}
        {!loading && !error && transactions.length > 0 && (
        <div className="flex items-center justify-end gap-[8px] sm:gap-[16px] px-[16px] sm:px-[20px] h-[48px] border-t border-[rgba(46,38,61,0.08)]">
          <div className="flex items-center gap-[4px] sm:gap-[8px]">
            <span className="text-[12px] sm:text-[13px] text-[rgba(46,38,61,0.5)] leading-[16px]">
              {ft.rowsPerPage}
            </span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
              className="text-[12px] sm:text-[13px] text-[rgba(46,38,61,0.9)] bg-transparent border-none outline-none cursor-pointer appearance-none pe-[12px]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='rgba(46,38,61,0.5)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: isAr ? "left center" : "right center" }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
          <span className="text-[12px] sm:text-[13px] text-[rgba(46,38,61,0.5)] leading-[16px]">
            {start}–{end} {ft.of} {totalRows}
          </span>
          <div className="flex items-center gap-[2px]">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-[4px] rounded-[4px] hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(46,38,61,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isAr ? "rotate-180" : ""}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => setPage(Math.min(Math.ceil(totalRows / rowsPerPage) - 1, page + 1))}
              disabled={end >= totalRows}
              className="p-[4px] rounded-[4px] hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(46,38,61,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isAr ? "rotate-180" : ""}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

/* ── Withdrawals View ───────────────────────────────────────────────── */
function isWithinTradingHours(config: { timezone: string; schedule: Array<{ day: number; slots: Array<{ from: string; to: string }> }> }): boolean {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: config.timezone,
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      weekday: "short",
    }).formatToParts(now);
    const hour = Number(parts.find((p) => p.type === "hour")?.value);
    const minute = Number(parts.find((p) => p.type === "minute")?.value);
    const weekday = parts.find((p) => p.type === "weekday")?.value;
    const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const currentDay = dayMap[weekday!];
    const daySchedule = config.schedule.find((s) => s.day === currentDay);
    if (!daySchedule) return false;
    const currentMinutes = hour * 60 + minute;
    return daySchedule.slots.some((slot) => {
      const [fromH, fromM] = slot.from.split(":").map(Number);
      const [toH, toM] = slot.to.split(":").map(Number);
      return currentMinutes >= fromH * 60 + fromM && currentMinutes < toH * 60 + toM;
    });
  } catch {
    return true;
  }
}

function WithdrawalsView({ t, isAr }: { t: (typeof sidebarItems)["en"]; isAr: boolean }) {
  const wd = t.withdrawals;
  const [method, setMethod] = useState<"digital" | "bank" | null>("bank");
  const [bankOptions, setBankOptions] = useState<{ value: string; en: string; ar: string }[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "ok" | "err">("idle");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Bank form state
  const [bankAmount, setBankAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [ibanNumber, setIbanNumber] = useState("");

  // Digital form state
  const [digitalAmount, setDigitalAmount] = useState("");
  const [currencyType, setCurrencyType] = useState("USDT");
  const [walletAddress, setWalletAddress] = useState("");

  const [tradingHours, setTradingHours] = useState<{
    enabled: boolean;
    timezone: string;
    schedule: Array<{ day: number; slots: Array<{ from: string; to: string }> }>;
    popupTitle: { en: string; ar: string };
    popupMessage: { en: string; ar: string };
  } | null>(null);
  const [showClosedPopup, setShowClosedPopup] = useState(false);

  useEffect(() => {
    fetch("/api/withdrawal/trading-hours")
      .then((r) => r.json())
      .then((data: any) => {
        if (!data.schedule && data.days) {
          data.schedule = data.days.map((d: number) => ({ day: d, slots: [{ from: data.from || "09:00", to: data.to || "17:00" }] }));
        }
        if (!data.schedule) data.schedule = [];
        setTradingHours(data);
      })
      .catch(() => setTradingHours({ enabled: false, timezone: "", schedule: [], popupTitle: { en: "", ar: "" }, popupMessage: { en: "", ar: "" } }));
    fetch("/api/withdrawal/bank-options")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setBankOptions(data); })
      .catch(() => {});
  }, []);

  // Per-field validators — used both on blur and on submit
  const validateAmount = (val: string): string | null => {
    const amt = parseFloat(val);
    if (!val || isNaN(amt) || amt <= 0) return isAr ? "يرجى إدخال مبلغ صحيح" : "Please enter a valid amount";
    return null;
  };
  const validateBankName = (val: string): string | null => {
    if (!val) return isAr ? "يرجى اختيار البنك" : "Please select a bank";
    return null;
  };
  const validateIban = (val: string): string | null => {
    const digits = val.replace(/\s/g, "");
    if (!digits) return isAr ? "يرجى إدخال رقم الآيبان" : "Please enter your IBAN number";
    if (!/^\d+$/.test(digits)) return isAr ? "رقم الآيبان يجب أن يحتوي على أرقام فقط" : "IBAN must contain digits only";
    if (digits.length !== 22) {
      return isAr
        ? `رقم الآيبان السعودي يجب أن يكون 22 رقمًا بعد SA (أدخلت ${digits.length} من 22)`
        : `Saudi IBAN must be 22 digits after SA (you entered ${digits.length} of 22)`;
    }
    // Mod-97 checksum (ISO 13616)
    const full = "SA" + digits;
    const rearranged = full.slice(4) + full.slice(0, 4);
    let numStr = "";
    for (const ch of rearranged) {
      const code = ch.charCodeAt(0);
      numStr += code >= 65 && code <= 90 ? (code - 55).toString() : ch;
    }
    let remainder = 0;
    for (let i = 0; i < numStr.length; i++) {
      remainder = (remainder * 10 + parseInt(numStr[i], 10)) % 97;
    }
    if (remainder !== 1) {
      return isAr
        ? "رقم الآيبان غير صحيح — تحقق من الأرقام (مثال: SA03 8000 0000 6080 1016 7519)"
        : "Invalid IBAN — please check your digits (e.g. SA03 8000 0000 6080 1016 7519)";
    }
    return null;
  };
  const validateCurrency = (val: string): string | null => {
    if (!val) return isAr ? "يرجى إدخال نوع العملة" : "Please enter the currency type";
    return null;
  };
  const validateWallet = (val: string): string | null => {
    if (!val) return isAr ? "يرجى إدخال عنوان المحفظة" : "Please enter the wallet address";
    return null;
  };

  const setFieldError = (key: string, msg: string | null) => {
    setFormErrors((prev) => {
      const next = { ...prev };
      if (msg) next[key] = msg; else delete next[key];
      return next;
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (method === "bank") {
      const amtErr = validateAmount(bankAmount); if (amtErr) errors.amount = amtErr;
      const bnkErr = validateBankName(bankName); if (bnkErr) errors.bankName = bnkErr;
      const ibnErr = validateIban(ibanNumber); if (ibnErr) errors.iban = ibnErr;
    } else {
      const amtErr = validateAmount(digitalAmount); if (amtErr) errors.amount = amtErr;
      const curErr = validateCurrency(currencyType); if (curErr) errors.currency = curErr;
      const walErr = validateWallet(walletAddress); if (walErr) errors.wallet = walErr;
    }
    if (!confirmed) errors.confirm = isAr ? "يرجى تأكيد صحة البيانات" : "Please confirm the information is correct";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleWithdraw = async () => {
    // Check trading hours
    if (tradingHours && tradingHours.enabled && !isWithinTradingHours(tradingHours)) {
      setShowClosedPopup(true);
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitStatus("idle");
    try {
      const payload = method === "bank"
        ? { method: "bank" as const, amount: parseFloat(bankAmount), bankName, ibanNumber }
        : { method: "digital" as const, amount: parseFloat(digitalAmount), currencyType, walletAddress };

      const res = await fetch("/api/withdrawal/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Request failed");
      }

      setSubmitStatus("ok");
      // Reset form
      if (method === "bank") {
        setBankAmount("");
        setBankName("");
        setIbanNumber("");
      } else {
        setDigitalAmount("");
        setWalletAddress("");
      }
      setConfirmed(false);
      setFormErrors({});
      setTimeout(() => setSubmitStatus("idle"), 4000);
    } catch {
      setSubmitStatus("err");
      setTimeout(() => setSubmitStatus("idle"), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (method === "bank") {
      setBankAmount("");
      setBankName("");
      setIbanNumber("");
    } else {
      setDigitalAmount("");
      setWalletAddress("");
    }
    setConfirmed(false);
    setFormErrors({});
    setSubmitStatus("idle");
  };

  // Button is disabled until all required fields are filled + confirmed
  const canSubmit = method === "bank"
    ? (!!bankAmount && parseFloat(bankAmount) > 0 && !!bankName && ibanNumber.length === 22 && confirmed)
    : (!!digitalAmount && parseFloat(digitalAmount) > 0 && !!currencyType && !!walletAddress && confirmed);

  return (
    <>
      {/* Trading Hours Closed Popup */}
      {showClosedPopup && tradingHours && (
        <div
          className="fixed inset-0 bg-[rgba(46,38,61,0.22)] z-50 flex items-center justify-center px-[24px]"
          onClick={() => setShowClosedPopup(false)}
        >
          <div
            className="bg-white rounded-[12px] shadow-[0px_8px_30px_rgba(46,38,61,0.18)] p-[28px] max-w-[420px] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-[16px]">
              {/* Clock icon */}
              <div className="w-[56px] h-[56px] rounded-full bg-[rgba(255,180,0,0.16)] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffab1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="text-[18px] font-semibold text-[rgba(46,38,61,0.9)] leading-[26px]">
                {isAr ? tradingHours.popupTitle.ar : tradingHours.popupTitle.en}
              </h3>
              <p className="text-[14px] text-[rgba(46,38,61,0.7)] leading-[22px] whitespace-pre-line">
                {isAr ? tradingHours.popupMessage.ar : tradingHours.popupMessage.en}
              </p>
              <button
                onClick={() => setShowClosedPopup(false)}
                className="mt-[4px] cta-gradient rounded-[8px] px-[24px] py-[10px] text-white text-[14px] font-medium leading-[20px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer w-full"
              >
                {isAr ? "حسنًا" : "Got it"}
              </button>
            </div>
          </div>
        </div>
      )}

    <div className="flex-1 flex items-center justify-center">
    <div className="overflow-hidden flex flex-col w-full max-w-[900px] xl:max-w-[1100px] bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)]">
      {/* Header */}
      <div className="flex flex-col gap-[4px] px-[16px] pt-[16px] pb-[12px]">
        <h2 className="text-[16px] font-medium text-[rgba(46,38,61,0.9)] leading-[24px]">
          {wd.cashWithdrawal}
        </h2>
        <p className="text-[14px] text-[rgba(46,38,61,0.7)] leading-[20px]">
          {wd.accountNumber}
        </p>
      </div>

      <div className="flex flex-col gap-[20px] px-[16px] pb-[16px]">
        {/* Method selection */}
        <div className="flex flex-col gap-[10px] items-center">
          <h3 className="text-[14px] font-medium text-[rgba(46,38,61,0.6)] leading-[20px] self-stretch">
            {wd.chooseMethod}
          </h3>
          <div className="flex gap-[10px] w-full max-w-[480px]">
            <button
              onClick={() => { setMethod("digital"); setConfirmed(false); }}
              className={`flex-1 flex items-center justify-center gap-[10px] rounded-[8px] px-[14px] py-[12px] cursor-pointer border ${
                method === "digital"
                  ? "bg-accent text-white border-accent"
                  : "bg-[#f8f9fb] text-[rgba(46,38,61,0.8)] border-[rgba(46,38,61,0.1)] hover:border-[rgba(46,38,61,0.2)]"
              }`}
            >
              <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 ${method === "digital" ? "bg-white/20" : "bg-white"}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <span className="text-[14px] font-medium leading-[20px]">{wd.digitalCurrency}</span>
            </button>
            <button
              onClick={() => { setMethod("bank"); setConfirmed(false); }}
              className={`flex-1 flex items-center justify-center gap-[10px] rounded-[8px] px-[14px] py-[12px] cursor-pointer border ${
                method === "bank"
                  ? "bg-accent text-white border-accent"
                  : "bg-[#f8f9fb] text-[rgba(46,38,61,0.8)] border-[rgba(46,38,61,0.1)] hover:border-[rgba(46,38,61,0.2)]"
              }`}
            >
              <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 ${method === "bank" ? "bg-white/20" : "bg-white"}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" /><path d="M3 10h18" /><path d="M12 3l9 7H3l9-7z" /><path d="M5 10v11" /><path d="M19 10v11" /><path d="M9 10v11" /><path d="M15 10v11" />
                </svg>
              </div>
              <span className="text-[14px] font-medium leading-[20px]">{wd.bankTransfer}</span>
            </button>
          </div>
        </div>

        {/* Form section */}
        {method && (
          <div className="flex flex-col gap-[14px]">
            {/* Method heading with icon */}
            <div className="flex items-center gap-[8px]">
              <WithdrawalMethodIcon type={method} />
              <h3 className="text-[16px] font-medium text-[rgba(46,38,61,0.9)] leading-[24px]">
                {method === "bank" ? wd.bankTransfer : wd.digitalCurrency}
              </h3>
            </div>

            {/* Form fields */}
            <div className="flex flex-col gap-[10px] xl:gap-[14px]">
              {method === "bank" ? (
                <>
                  <div className="flex flex-col md:flex-row gap-[10px] xl:gap-[14px]">
                    {/* Amount */}
                    <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                      <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">
                        {wd.amount}
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={bankAmount}
                        onChange={(e) => { setBankAmount(e.target.value); setFieldError("amount", null); }}
                        onBlur={() => setFieldError("amount", validateAmount(bankAmount))}
                        placeholder={isAr ? "أدخل المبلغ" : "Enter amount"}
                        className={`bg-[#f8f9fb] border rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] w-full focus:outline-none focus:border-accent focus:bg-white transition-colors ${formErrors.amount ? "border-[#ff4c51]" : "border-[rgba(46,38,61,0.14)]"}`}
                      />
                      {formErrors.amount && <span className="text-[11px] text-[#ff4c51]">{formErrors.amount}</span>}
                    </div>
                    {/* Bank Name dropdown */}
                    <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                      <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">
                        {wd.bankName}
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => { setBankName(e.target.value); setFieldError("bankName", validateBankName(e.target.value)); }}
                        onBlur={() => setFieldError("bankName", validateBankName(bankName))}
                        className={`bg-[#f8f9fb] border rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] w-full focus:outline-none focus:border-accent focus:bg-white transition-colors appearance-none cursor-pointer ${formErrors.bankName ? "border-[#ff4c51]" : "border-[rgba(46,38,61,0.14)]"}`}
                      >
                        <option value="">{isAr ? "اختر البنك" : "Select bank"}</option>
                        {bankOptions.map((b) => (
                          <option key={b.value} value={b.value}>{isAr ? b.ar : b.en}</option>
                        ))}
                      </select>
                      {formErrors.bankName && <span className="text-[11px] text-[#ff4c51]">{formErrors.bankName}</span>}
                    </div>
                  </div>
                  {/* IBAN */}
                  <div className="flex flex-col gap-[4px]">
                    <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">
                      {wd.ibanNumber}
                    </label>
                    <div dir="ltr" className="flex gap-[8px] items-center">
                      <div className="bg-[#f0f1f4] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[7px] xl:py-[9px] shrink-0 w-[54px] flex items-center justify-center">
                        <span className="text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px]">SA</span>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={ibanNumber.length <= 2 ? ibanNumber : ibanNumber.slice(0, 2) + " " + ibanNumber.slice(2).replace(/(.{4})/g, "$1 ").trim()}
                        onChange={(e) => { const digits = e.target.value.replace(/\D/g, ""); if (digits.length > 22) return; setIbanNumber(digits); setFieldError("iban", null); }}
                        onBlur={() => setFieldError("iban", validateIban(ibanNumber))}
                        placeholder="** **** **** **** **** ****"
                        className={`bg-[#f8f9fb] border rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] w-full focus:outline-none focus:border-accent focus:bg-white transition-colors tracking-[0.5px] ${formErrors.iban ? "border-[#ff4c51]" : "border-[rgba(46,38,61,0.14)]"}`}
                      />
                    </div>
                    {formErrors.iban && <span className="text-[11px] text-[#ff4c51] leading-[16px]">{formErrors.iban}</span>}
                  </div>
                </>
              ) : (
                <>
                  {/* Digital - Amount */}
                  <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                    <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">
                      {wd.amount}
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={digitalAmount}
                      onChange={(e) => { setDigitalAmount(e.target.value); setFieldError("amount", null); }}
                      onBlur={() => setFieldError("amount", validateAmount(digitalAmount))}
                      placeholder={isAr ? "أدخل المبلغ" : "Enter amount"}
                      className={`bg-[#f8f9fb] border rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] w-full focus:outline-none focus:border-accent focus:bg-white transition-colors ${formErrors.amount ? "border-[#ff4c51]" : "border-[rgba(46,38,61,0.14)]"}`}
                    />
                    {formErrors.amount && <span className="text-[11px] text-[#ff4c51]">{formErrors.amount}</span>}
                  </div>
                  {/* Digital - Currency Type */}
                  <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                    <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">
                      {wd.currencyType}
                    </label>
                    <div className="bg-[#f0f1f4] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] w-full">
                      TetherUS (USDT) - TRC20
                    </div>
                  </div>
                  {/* Digital - Wallet Address */}
                  <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                    <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">
                      {wd.walletAddress}
                    </label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => { setWalletAddress(e.target.value); setFieldError("wallet", null); }}
                      onBlur={() => setFieldError("wallet", validateWallet(walletAddress))}
                      placeholder={isAr ? "أدخل عنوان المحفظة" : "Enter wallet address"}
                      className={`bg-[#f8f9fb] border rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] w-full focus:outline-none focus:border-accent focus:bg-white transition-colors ${formErrors.wallet ? "border-[#ff4c51]" : "border-[rgba(46,38,61,0.14)]"}`}
                    />
                    {formErrors.wallet && <span className="text-[11px] text-[#ff4c51]">{formErrors.wallet}</span>}
                  </div>
                </>
              )}
            </div>

            {/* Confirmation checkbox */}
            <div className="flex items-start gap-[8px]">
              <button
                onClick={() => { setConfirmed(!confirmed); setFormErrors((p) => { const n = { ...p }; delete n.confirm; return n; }); }}
                className={`shrink-0 w-[24px] h-[24px] rounded-[4px] flex items-center justify-center transition-all cursor-pointer mt-[1px] ${
                  confirmed
                    ? "bg-accent"
                    : formErrors.confirm ? "border-2 border-[#ff4c51]" : "border-2 border-[rgba(46,38,61,0.22)]"
                }`}
              >
                {confirmed && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <div className="flex flex-col">
                <p className="text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px]">
                  {wd.confirmText}
                </p>
                {formErrors.confirm && <span className="text-[11px] text-[#ff4c51]">{formErrors.confirm}</span>}
              </div>
            </div>

            {/* Submit status messages */}
            {submitStatus === "ok" && (
              <div className="bg-[rgba(40,199,111,0.12)] rounded-[6px] px-[14px] py-[10px] text-[14px] text-[#28c76f] font-medium leading-[20px]">
                {isAr ? "تم إرسال طلب السحب بنجاح" : "Withdrawal request submitted successfully"}
              </div>
            )}
            {submitStatus === "err" && (
              <div className="bg-[rgba(255,76,81,0.12)] rounded-[6px] px-[14px] py-[10px] text-[14px] text-[#ff4c51] font-medium leading-[20px]">
                {isAr ? "حدث خطأ، يرجى المحاولة مرة أخرى" : "An error occurred, please try again"}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-[12px]">
              <button
                onClick={handleWithdraw}
                disabled={!canSubmit || submitting}
                className="cta-gradient rounded-[6px] px-[16px] py-[6px] text-white text-[14px] font-medium leading-[20px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (isAr ? "جارٍ الإرسال..." : "Submitting...") : (method === "bank" ? wd.withdraw : wd.saveChanges)}
              </button>
              <button
                onClick={handleReset}
                disabled={submitting}
                className="border border-[#8a8d93] rounded-[6px] px-[16px] py-[6px] text-[rgba(46,38,61,0.7)] text-[14px] font-medium leading-[20px] hover:bg-gray-50 transition-all cursor-pointer flex-1 sm:flex-none disabled:opacity-60"
              >
                {method === "bank" ? wd.cancellation : wd.reset}
              </button>
            </div>
          </div>
        )}

        {/* Warning alert + Security note */}
        <div className="flex flex-col gap-[14px]">
          <div className="bg-[rgba(255,180,0,0.16)] rounded-[6px] p-[12px] flex gap-[12px] items-start">
            <div className="bg-[#ffab1d] rounded-[6px] w-[26px] h-[26px] shrink-0 flex items-center justify-center opacity-90">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="flex flex-col gap-[2px] flex-1 overflow-hidden">
              <p className="text-[14px] font-medium text-[#ffa63d] leading-[20px] tracking-[0.15px]">
                {wd.warningTitle}
              </p>
              <p className="text-[12px] text-[#ffa63d] leading-[17px]">
                {wd.warningText}
              </p>
            </div>
          </div>

          <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[12px] flex items-center justify-center">
            <p className="text-[rgba(46,38,61,0.7)] text-[13px] leading-[20px] text-center">
              🔒 {wd.securityNote}
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}

/* ── Contact Us Wizard View ─────────────────────────────────────────── */
function ContactUsView({ t, isAr }: { t: (typeof sidebarItems)["en"]; isAr: boolean }) {
  const cu = t.contactUs;
  const [step, setStep] = useState(0);
  const totalSteps = 4;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    reason: "",
    requestType: "",
    topicDetails: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "ok" | "err">("idle");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const stepTitles = [cu.personalInformation, cu.contactInformation, cu.orderDetails, cu.dataReview];
  const progressWidths = ["7%", "33%", "66%", "78%"];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "email") setEmailError("");
    if (field === "phoneNumber") setPhoneError("");
  };

  const handlePhoneChange = (value: string) => {
    let digits = value.replace(/\D/g, "");
    const max = digits.startsWith("05") ? 10 : 9;
    if (digits.length > max) digits = digits.slice(0, max);
    setFormData((prev) => ({ ...prev, phoneNumber: digits }));
    setPhoneError("");
  };

  const validateStep1 = (): boolean => {
    let valid = true;
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      setEmailError(isAr ? "البريد الإلكتروني مطلوب" : "Email is required");
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      setEmailError(isAr ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email address");
      valid = false;
    }
    // Phone validation - Saudi format
    const phone = formData.phoneNumber;
    if (!phone) {
      setPhoneError(isAr ? "رقم الهاتف مطلوب" : "Phone number is required");
      valid = false;
    } else if (phone.startsWith("05")) {
      if (phone.length !== 10) {
        setPhoneError(isAr ? "يجب أن يتكون الرقم من 10 أرقام عند البدء بـ 05" : "Number must be exactly 10 digits when starting with 05");
        valid = false;
      }
    } else if (phone.startsWith("5")) {
      if (phone.length !== 9) {
        setPhoneError(isAr ? "يجب أن يتكون الرقم من 9 أرقام عند البدء بـ 5" : "Number must be exactly 9 digits when starting with 5");
        valid = false;
      }
    } else {
      setPhoneError(isAr ? "يجب أن يبدأ الرقم بـ 5 أو 05" : "Number must start with 5 or 05");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.reason || !formData.requestType) {
      setSubmitStatus("err");
      setTimeout(() => setSubmitStatus("idle"), 3000);
      return;
    }
    setSubmitting(true);
    setSubmitStatus("idle");
    try {
      const res = await fetch("/api/user/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitStatus("ok");
    } catch {
      setSubmitStatus("err");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {/* Success Popup Modal */}
      {submitStatus === "ok" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-[20px] p-[32px] md:p-[48px] max-w-[460px] w-full flex flex-col items-center gap-[20px] shadow-xl">
            <div className="w-[70px] h-[70px] rounded-full bg-site-gradient flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-[#0e314c] text-[22px] font-bold text-center leading-[1.3]">
              {isAr ? "تم استلام طلبك" : "Request Received"}
            </h3>
            <p className="text-[#6084a4] text-[15px] leading-[1.5] text-center">
              {isAr ? "تم استلام طلبك بنجاح وسيتم التواصل معك قريباً" : "Your request has been received and you will be contacted shortly."}
            </p>
            <a
              href="/"
              className="cta-gradient inline-block rounded-[12px] px-[36px] py-[14px] text-[14px] font-semibold hover:opacity-90 transition-opacity mt-[8px]"
            >
              {isAr ? "العودة للموقع الرئيسي" : "Back to Main Website"}
            </a>
          </div>
        </div>
      )}

      <div className="overflow-hidden w-full max-w-[480px] flex flex-col items-center justify-center bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)]">
        <div className="flex flex-col gap-[14px] items-center justify-center pb-[14px] pt-[16px] px-[16px] w-full max-w-[460px]">
          {/* Step title */}
          <h2 className="text-[16px] font-medium text-[rgba(46,38,61,0.9)] leading-[24px] text-center">
            {stepTitles[step]}
          </h2>

          <div className="flex flex-col gap-[16px] w-full">
            {/* Progress bar */}
            <div className="bg-[#f4f5fa] h-[14px] rounded-[100px] overflow-hidden w-full">
              <div
                className="h-[14px] rounded-[100px] transition-all duration-300"
                style={{
                  width: progressWidths[step],
                  backgroundImage: "linear-gradient(270deg, rgb(66, 196, 93) 0%, rgb(3, 128, 58) 100%)",
                }}
              />
            </div>

            {/* Step content */}
            <div className="flex flex-col gap-[14px] w-full">
              {step === 0 && (
                <div className="flex flex-col gap-[14px]">
                  <div className="flex flex-col gap-[4px]">
                    <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">{cu.firstName}</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] focus:outline-none focus:border-accent focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">{cu.lastName}</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] focus:outline-none focus:border-accent focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-[14px]">
                  <div className="flex flex-col gap-[4px]">
                    <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">{cu.email}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`w-full bg-[#f8f9fb] border rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] focus:outline-none focus:bg-white transition-colors ${emailError ? "border-[#ff4c51] focus:border-[#ff4c51]" : "border-[rgba(46,38,61,0.14)] focus:border-accent"}`}
                    />
                    {emailError && <p className="text-[#ff4c51] text-[11px] mt-[2px]">{emailError}</p>}
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">{cu.phoneNumber}</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="5XXXXXXXX"
                      dir="ltr"
                      maxLength={10}
                      className={`w-full bg-[#f8f9fb] border rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] focus:outline-none focus:bg-white transition-colors ${phoneError ? "border-[#ff4c51] focus:border-[#ff4c51]" : "border-[rgba(46,38,61,0.14)] focus:border-accent"}`}
                    />
                    {phoneError && <p className="text-[#ff4c51] text-[11px] mt-[2px]">{phoneError}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-[14px]">
                  <div className="flex flex-col gap-[4px]">
                    <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">{cu.reasonForCommunication}</label>
                    <input
                      type="text"
                      value={formData.reason}
                      onChange={(e) => handleChange("reason", e.target.value)}
                      className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] focus:outline-none focus:border-accent focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">{cu.requestType}</label>
                    <div className="relative">
                      <select
                        value={formData.requestType}
                        onChange={(e) => handleChange("requestType", e.target.value)}
                        className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] focus:outline-none focus:border-accent focus:bg-white transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" disabled></option>
                        <option value="General Inquiry">{isAr ? "استفسار عام" : "General Inquiry"}</option>
                        <option value="Technical Support">{isAr ? "دعم فني" : "Technical Support"}</option>
                        <option value="Account Issue">{isAr ? "مشكلة في الحساب" : "Account Issue"}</option>
                        <option value="Deposit/Withdrawal">{isAr ? "إيداع/سحب" : "Deposit/Withdrawal"}</option>
                      </select>
                      <svg className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isAr ? "left-[14px]" : "right-[14px]"}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(46,38,61,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <label className="text-[12px] font-medium text-[rgba(46,38,61,0.6)] leading-[16px] tracking-[0.02em] uppercase">{cu.topicDetails}</label>
                    <textarea
                      value={formData.topicDetails}
                      onChange={(e) => handleChange("topicDetails", e.target.value)}
                      rows={3}
                      className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[7px] xl:py-[9px] text-[14px] text-[rgba(46,38,61,0.9)] leading-[20px] focus:outline-none focus:border-accent focus:bg-white transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-[12px]">
                  {/* Personal Information review card */}
                  <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[12px] flex flex-col gap-[8px]">
                    <h3 className="text-[15px] font-medium text-[rgba(46,38,61,0.9)] leading-[22px]">
                      {cu.personalInformation}
                    </h3>
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[14px] text-[rgba(46,38,61,0.7)] leading-[20px]">
                        {cu.firstName}: <span className="text-black">{formData.firstName || "—"}</span>
                      </p>
                      <p className="text-[14px] text-[rgba(46,38,61,0.7)] leading-[20px]">
                        {cu.lastName}: <span className="text-black">{formData.lastName || "—"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Contact Information review card */}
                  <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[12px] flex flex-col gap-[8px]">
                    <h3 className="text-[15px] font-medium text-[rgba(46,38,61,0.9)] leading-[22px]">
                      {cu.contactInformation}
                    </h3>
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[14px] text-[rgba(46,38,61,0.7)] leading-[20px]">
                        {cu.email}: <span className="text-black">{formData.email || "—"}</span>
                      </p>
                      <p className="text-[14px] text-[rgba(46,38,61,0.7)] leading-[20px]">
                        {cu.phoneNumber}: <span className="text-black">{formData.phoneNumber || "—"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Order Details review card */}
                  <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[12px] flex flex-col gap-[8px]">
                    <h3 className="text-[15px] font-medium text-[rgba(46,38,61,0.9)] leading-[22px]">
                      {cu.orderDetails}
                    </h3>
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[14px] text-[rgba(46,38,61,0.7)] leading-[20px]">
                        {cu.reasonForCommunication}: <span className="text-black">{formData.reason || "—"}</span>
                      </p>
                      <p className="text-[14px] text-[rgba(46,38,61,0.7)] leading-[20px]">
                        {cu.requestType}: <span className="text-black">{formData.requestType || "—"}</span>
                      </p>
                      <p className="text-[14px] text-[rgba(46,38,61,0.7)] leading-[20px]">
                        {cu.topicDetails}: <span className="text-black">{formData.topicDetails || "—"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className={`border border-[#8a8d93] rounded-[6px] px-[14px] py-[6px] text-[#8a8d93] text-[14px] font-medium leading-[20px] flex items-center gap-[4px] transition-all cursor-pointer ${step === 0 ? "opacity-45 cursor-not-allowed" : "hover:bg-gray-50"}`}
                >
                  <svg className={isAr ? "rotate-180" : ""} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8d93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  {cu.previous}
                </button>
                {step < totalSteps - 1 ? (
                  <button
                    onClick={() => {
                      if (step === 1 && !validateStep1()) return;
                      setStep((s) => Math.min(totalSteps - 1, s + 1));
                    }}
                    className="cta-gradient rounded-[6px] px-[14px] py-[6px] text-white text-[14px] font-medium leading-[20px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer flex items-center gap-[4px]"
                  >
                    {cu.next}
                    <svg className={isAr ? "rotate-180" : ""} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`cta-gradient rounded-[6px] px-[14px] py-[6px] text-white text-[14px] font-medium leading-[20px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] cursor-pointer ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {submitting ? (isAr ? "جاري الإرسال..." : "Sending...") : submitStatus === "err" ? (isAr ? "فشل الإرسال" : "Failed") : cu.send}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────── */
export default function PersonalAreaPage() {
  const { mainLogo } = useSiteSettings();
  const { lang, toggleLang } = useLang();
  const { user, isLoggedIn, loading, logout } = useUserAuth();
  const router = useRouter();
  const isAr = lang === "ar";
  const t = sidebarItems[lang];
  const [activeItem, setActiveItem] = useState("personal-data");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [loading, isLoggedIn, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f5fa]">
        <div className="w-[40px] h-[40px] border-[3px] border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn || !user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="flex min-h-screen bg-[#f4f5fa]">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-[14px] ${isAr ? "right-3" : "left-3"} z-50 lg:hidden bg-white rounded-[6px] p-2 shadow-md`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(46,38,61,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className={`fixed lg:sticky top-0 ${isAr ? "right-0" : "left-0"} z-40 h-screen w-[260px] bg-[#f8f9fb] shadow-[2px_0_8px_rgba(0,0,0,0.06)] flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : isAr ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className={`flex flex-col flex-1`}>
          {/* Logo */}
          <div className="flex items-center px-[22px] py-[20px]">
            <Link href="/">
              <Image src={mainLogo} alt="Namaya" width={116} height={32} className="h-[32px] w-auto" />
            </Link>
          </div>

          {/* Nav items */}
          <nav className="flex-1 flex flex-col justify-between pb-[20px] overflow-y-auto">
            <div className="flex flex-col gap-[24px]">
              {/* Client Area section */}
              <div>
                <div className="flex items-center gap-[10px] h-[32px] py-[7px] px-0 overflow-hidden">
                  <div className="bg-[rgba(46,38,61,0.12)] h-px w-[14px]" />
                  <span className="text-[13px] text-[rgba(46,38,61,0.7)] leading-[18px] whitespace-nowrap">{t.clientArea}</span>
                  <div className="bg-[rgba(46,38,61,0.12)] h-px flex-1" />
                </div>
                <div className="flex flex-col gap-[6px]">
                  {t.items.map((item) => {
                    const isActive = activeItem === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setActiveItem(item.key)}
                        className={`flex items-center gap-[8px] min-h-[30px] ${isAr ? "pl-[14px] pr-[22px] rounded-bl-[50px] rounded-tl-[50px]" : "pl-[22px] pr-[14px] rounded-br-[50px] rounded-tr-[50px]"} py-[8px] w-full transition-all cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-l from-primary-dark to-primary-light text-white"
                            : "text-[rgba(46,38,61,0.9)] hover:bg-[rgba(46,38,61,0.04)]"
                        }`}
                      >
                        <SidebarIcon type={item.icon} active={isActive} />
                        <span className="text-[15px] leading-[22px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Support & Security section */}
              <div>
                <div className="flex items-center gap-[10px] h-[32px] py-[7px] px-0 overflow-hidden">
                  <div className="bg-[rgba(46,38,61,0.12)] h-px w-[14px]" />
                  <span className="text-[13px] text-[rgba(46,38,61,0.7)] leading-[18px] whitespace-nowrap">{t.supportSecurity}</span>
                  <div className="bg-[rgba(46,38,61,0.12)] h-px flex-1" />
                </div>
                <div className="flex flex-col gap-[6px]">
                  {t.support.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setActiveItem(item.key)}
                      className={`flex items-center gap-[8px] min-h-[30px] ${isAr ? "pl-[14px] pr-[22px] rounded-bl-[50px] rounded-tl-[50px]" : "pl-[22px] pr-[14px] rounded-br-[50px] rounded-tr-[50px]"} py-[8px] w-full transition-all cursor-pointer ${
                        activeItem === item.key
                          ? "bg-gradient-to-l from-primary-dark to-primary-light text-white"
                          : "text-[rgba(46,38,61,0.9)] hover:bg-[rgba(46,38,61,0.04)]"
                      }`}
                    >
                      <SidebarIcon type={item.icon} active={activeItem === item.key} />
                      <span className="text-[15px] leading-[22px]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-[8px] min-h-[30px] ${isAr ? "pl-[14px] pr-[22px] rounded-bl-[50px] rounded-tl-[50px]" : "pl-[22px] pr-[14px] rounded-br-[50px] rounded-tr-[50px]"} py-[8px] w-full text-[#ff4c51] hover:bg-red-50 transition-all cursor-pointer`}
            >
              <SidebarIcon type="logout" />
              <span className="text-[15px] leading-[22px]">{t.logout}</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* ── Main content area ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-[60px] min-h-[60px] px-[12px] md:px-[20px] bg-[#f8f9fb] shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
          <h1 className="text-[16px] md:text-[20px] font-medium text-[rgba(46,38,61,0.9)] leading-[32px] ps-[48px] lg:ps-0">
            {t.pageTitles[activeItem] || t.pageTitles["personal-data"]}
          </h1>
          <div className="flex items-center gap-[4px]">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="p-[8px] rounded-[19px] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(46,38,61,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </button>
            {/* User avatar */}
            <div className={`${isAr ? "pr-[8px]" : "pl-[8px]"} relative`}>
              <div className="w-[38px] h-[38px] rounded-full overflow-hidden bg-[#f4f5fa] border-2 border-white shadow-sm">
                {user.avatar && user.avatar !== "/images/avatar-placeholder.png" && user.avatar !== "" ? (
                  <Image src={user.avatar} alt="avatar" width={38} height={38} className="w-full h-full object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full bg-[#e0e0e0] flex items-center justify-center text-[14px] font-semibold text-[rgba(46,38,61,0.7)]">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-[8px] h-[8px] bg-[#56ca00] rounded-full ring-2 ring-white" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-[12px] md:px-[20px] pt-[6px] pb-[16px] flex flex-col max-w-[1200px] w-full mx-auto">
          {activeItem === "change-password" ? (
            <ChangePasswordView t={t} isAr={isAr} />
          ) : activeItem === "upload-documents" ? (
            <UploadDocumentsView t={t} />
          ) : activeItem === "deposit-funds" ? (
            <DepositFundsView t={t} isAr={isAr} />
          ) : activeItem === "financial-transactions" ? (
            <FinancialTransactionsView t={t} isAr={isAr} />
          ) : activeItem === "withdrawals" ? (
            <WithdrawalsView t={t} isAr={isAr} />
          ) : activeItem === "contact-us" ? (
            <ContactUsView t={t} isAr={isAr} />
          ) : (
            <PersonalDataView t={t} user={user} isAr={isAr} />
          )}
        </main>
      </div>
    </div>
  );
}
