"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { useUserAuth, type UserProfile } from "@/context/UserAuthContext";

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
      uploadDocument: "Upload Document",
      documents: [
        { key: "proof-of-address", icon: "home", title: "Proof of Address", description: "Utility bill not exceeding 3 months or a lease agreement", hasImageType: false },
        { key: "personal-identity", icon: "identity", title: "Personal Identity", description: "A clear copy of a valid national ID or passport", hasImageType: true },
        { key: "other-documents", icon: "document", title: "Other Documents", description: "Any other supporting documents such a lease agreement, business license...", hasImageType: false },
        { key: "credit-card", icon: "creditcard", title: "Credit Card", description: "Image of a credit card", hasImageType: true },
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
      uploadDocument: "رفع المستند",
      documents: [
        { key: "proof-of-address", icon: "home", title: "إثبات العنوان", description: "فاتورة خدمات لا تتجاوز 3 أشهر أو عقد إيجار", hasImageType: false },
        { key: "personal-identity", icon: "identity", title: "الهوية الشخصية", description: "نسخة واضحة من بطاقة هوية وطنية صالحة أو جواز سفر", hasImageType: true },
        { key: "other-documents", icon: "document", title: "مستندات أخرى", description: "أي مستندات داعمة أخرى مثل عقد إيجار، رخصة تجارية...", hasImageType: false },
        { key: "credit-card", icon: "creditcard", title: "بطاقة الائتمان", description: "صورة بطاقة الائتمان", hasImageType: true },
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

/* ── Modern input field ─────────────────────────────────────────────── */
function FloatingField({
  label,
  value,
  type = "text",
  readOnly,
  required,
  isSelect,
  isAr,
}: {
  label: string;
  value: string;
  type?: string;
  readOnly?: boolean;
  required?: boolean;
  isSelect?: boolean;
  isAr?: boolean;
}) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-[6px]">
      <label className="text-[13px] font-medium text-[rgba(46,38,61,0.6)] leading-[18px] tracking-[0.02em] uppercase">
        {label}
        {required && <span className="text-[#ff4c51] ms-[2px]">*</span>}
      </label>
      <div className="bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[11px] xl:py-[13px] flex items-center justify-between transition-colors hover:border-[rgba(46,38,61,0.3)]">
        <span className="text-[15px] text-[rgba(46,38,61,0.9)] leading-[22px] truncate">
          {value}
        </span>
        {isSelect && (
          <svg className="shrink-0 ms-[8px]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(46,38,61,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </div>
    </div>
  );
}

/* ── Password field with toggle ─────────────────────────────────────── */
function PasswordField({ placeholder, isAr }: { placeholder: string; isAr?: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-[6px] w-full">
      <label className="text-[13px] font-medium text-[rgba(46,38,61,0.6)] leading-[18px] tracking-[0.02em] uppercase">
        {placeholder}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder="••••••••"
          className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[11px] xl:py-[13px] text-[15px] text-[rgba(46,38,61,0.9)] placeholder:text-[rgba(46,38,61,0.3)] focus:outline-none focus:border-[#057e33] focus:bg-white transition-colors leading-[22px]"
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
    </div>
  );
}

/* ── Personal Data View ─────────────────────────────────────────────── */
function PersonalDataView({ t, user, isAr }: { t: (typeof sidebarItems)["en"]; user: UserProfile; isAr: boolean }) {
  return (
    <div className="bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] p-[16px] md:p-[20px] overflow-hidden">
      {/* Profile photo section */}
      <div className="flex flex-col sm:flex-row items-center gap-[16px] sm:gap-[24px] mb-[24px] xl:mb-[40px]">
        <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-[6px] overflow-hidden bg-[#e0e0e0] shrink-0 flex items-center justify-center">
          <span className="text-[24px] sm:text-[32px] font-semibold text-[rgba(46,38,61,0.5)]">
            {user.firstName[0]}{user.lastName[0]}
          </span>
        </div>
        <div className="flex flex-col items-center sm:items-start gap-[12px] sm:gap-[16px]">
          <div className="flex items-center gap-[12px] sm:gap-[16px]">
            <button className="border border-[#057e33] rounded-[4px] px-[14px] py-[8px] text-[#057e33] text-[13px] font-medium leading-[18px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#057e33] hover:text-white transition-all cursor-pointer">
              {t.uploadPhoto}
            </button>
            <button className="border border-[#ff4c51] rounded-[4px] px-[15px] py-[7.8px] text-[#ff4c51] text-[13px] font-medium leading-[18px] hover:bg-[#ff4c51] hover:text-white transition-all cursor-pointer">
              {t.reset}
            </button>
          </div>
          <p className="text-[rgba(46,38,61,0.7)] text-[13px] sm:text-[15px] leading-[22px] text-center sm:text-start">
            {t.photoHint}
          </p>
        </div>
      </div>

      {/* Form fields grid */}
      <div className="flex flex-col gap-[14px] xl:gap-[20px]">
        <div className="flex flex-col md:flex-row gap-[14px] xl:gap-[20px]">
          <FloatingField label={t.fields.firstName} value={user.firstName} required isAr={isAr} />
          <FloatingField label={t.fields.lastName} value={user.lastName} required isAr={isAr} />
        </div>
        <div className="flex flex-col md:flex-row gap-[14px] xl:gap-[20px]">
          <FloatingField label={t.fields.mobile} value={user.mobile} required isAr={isAr} />
          <FloatingField label={t.fields.email} value={user.email} required isAr={isAr} />
        </div>
        <div className="flex flex-col md:flex-row gap-[14px] xl:gap-[20px]">
          <FloatingField label={t.fields.id} value={user.id} isAr={isAr} />
          <FloatingField label={t.fields.dateOfBirth} value={user.dateOfBirth} isAr={isAr} />
        </div>
        <div className="flex flex-col md:flex-row gap-[14px] xl:gap-[20px]">
          <FloatingField label={t.fields.address} value={user.address} isAr={isAr} />
          <FloatingField label={t.fields.city} value={user.city} isAr={isAr} />
        </div>
        <div className="flex flex-col md:flex-row gap-[14px] xl:gap-[20px]">
          <FloatingField label={t.fields.postalCode} value={user.postalCode} isAr={isAr} />
          <FloatingField label={t.fields.country} value={user.country} isSelect isAr={isAr} />
        </div>
        <div className="flex flex-col md:flex-row gap-[14px] xl:gap-[20px]">
          <FloatingField label={t.fields.profession} value={user.profession} isAr={isAr} />
          <FloatingField label={t.fields.additionalPhone} value={user.additionalPhone} isAr={isAr} />
        </div>
        <div className="flex flex-col md:flex-row gap-[14px] xl:gap-[20px]">
          <FloatingField label={t.fields.annualIncome} value={user.annualIncome} isSelect isAr={isAr} />
          <FloatingField label={t.fields.country} value={user.country} isSelect isAr={isAr} />
        </div>
        <div>
          <button className="bg-[#057e33] rounded-[6px] px-[18px] py-[8px] text-white text-[15px] font-medium leading-[22px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all cursor-pointer">
            {t.saveChanges}
          </button>
        </div>
        <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[16px]">
          <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[21.56px]">
            {t.infoNote}{" "}
            <span className="font-medium text-[rgba(46,38,61,0.9)]">{t.infoEmail}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Change Password View ───────────────────────────────────────────── */
function ChangePasswordView({ t, isAr }: { t: (typeof sidebarItems)["en"]; isAr: boolean }) {
  const cp = t.changePassword;
  return (
    <div className="flex flex-1 items-center justify-center min-h-[calc(100vh-96px)]">
      <div className="bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] overflow-hidden w-full max-w-[600px]">
        <div className="flex flex-col gap-[20px] items-center justify-center px-[20px] pt-[20px] pb-[16px]">
          {/* Hint text */}
          <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[22px] text-center w-full">
            {cp.hint}
          </p>

          {/* Password fields */}
          <div className="flex flex-col gap-[20px] w-full max-w-[500px]">
            <PasswordField placeholder={cp.currentPassword} isAr={isAr} />
            <PasswordField placeholder={cp.newPassword} isAr={isAr} />
            <PasswordField placeholder={cp.confirmPassword} isAr={isAr} />

            {/* Match note */}
            <p className="text-[rgba(46,38,61,0.9)] text-[15px] leading-[22px]">
              {cp.matchNote}
            </p>

            {/* Save button - full width */}
            <button className="w-full bg-[#057e33] rounded-[6px] px-[18px] py-[8px] text-white text-[15px] font-medium leading-[22px] text-center shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all cursor-pointer">
              {cp.save}
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
  hasImageType,
  t,
  onClose,
}: {
  docTitle: string;
  hasImageType: boolean;
  t: (typeof sidebarItems)["en"];
  onClose: () => void;
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
                      ? "bg-[rgba(5,126,51,0.1)] border border-[#057e33] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)]"
                      : "bg-white shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] hover:shadow-[0px_4px_14px_0px_rgba(46,38,61,0.3)]"
                  }`}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={selectedFace === "front" ? "#057e33" : "rgba(46,38,61,0.9)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span className={`text-[18px] font-medium leading-[28px] ${selectedFace === "front" ? "text-[#057e33]" : "text-[rgba(46,38,61,0.9)]"}`}>
                    {modal.frontFace}
                  </span>
                </button>
                {/* Back Face */}
                <button
                  onClick={() => { setSelectedFace("back"); setStep("drag-drop"); }}
                  className={`w-full rounded-[6px] flex flex-col items-center gap-[8px] p-[20px] transition-all cursor-pointer ${
                    selectedFace === "back"
                      ? "bg-[rgba(5,126,51,0.1)] border border-[#057e33] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)]"
                      : "bg-white shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] hover:shadow-[0px_4px_14px_0px_rgba(46,38,61,0.3)]"
                  }`}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={selectedFace === "back" ? "#057e33" : "rgba(46,38,61,0.9)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span className={`text-[18px] font-medium leading-[28px] ${selectedFace === "back" ? "text-[#057e33]" : "text-[rgba(46,38,61,0.9)]"}`}>
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
                dragOver ? "border-[#057e33] bg-[rgba(5,126,51,0.05)]" : "border-[rgba(46,38,61,0.12)]"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Upload icon */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#057e33" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>

              <h4 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px] text-center">
                {modal.dragDrop}
              </h4>
              <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[22px] text-center">
                {modal.fileHint}
              </p>

              {selectedFile ? (
                <div className="mt-[8px] flex items-center gap-[8px] bg-[rgba(5,126,51,0.1)] rounded-[6px] px-[12px] py-[8px]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#057e33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[13px] text-[#057e33] font-medium">{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)} className="text-[#057e33] hover:text-[#046b2b] cursor-pointer">
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
                    className="border border-[#057e33] rounded-[4px] px-[14px] py-[8px] text-[#057e33] text-[13px] font-medium leading-[18px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#057e33] hover:text-white transition-all cursor-pointer"
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
                className={`bg-[#057e33] rounded-[6px] px-[18px] py-[8px] text-white text-[15px] font-medium leading-[22px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] transition-all cursor-pointer ${
                  selectedFile ? "hover:bg-[#046b2b]" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!selectedFile}
              >
                {modal.saveChanges}
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
  const [uploadModal, setUploadModal] = useState<{ title: string; hasImageType: boolean } | null>(null);

  return (
    <>
      <div className="bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] overflow-hidden flex flex-col flex-1">
        <div className="flex flex-col flex-1 gap-[48px] p-[16px] md:p-[20px]">
          {/* Documents section */}
          <div className="flex flex-col gap-[20px]">
            <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[22px]">
              {ud.subtitle}
            </p>

            {/* Document cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              {ud.documents.map((doc) => (
                <div
                  key={doc.key}
                  className="bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] overflow-hidden"
                >
                  <div className="flex flex-col gap-[16px] items-end p-[20px]">
                    {/* Icon + Status row */}
                    <div className="flex items-center justify-between w-full">
                      <DocIcon type={doc.icon} />
                      <span className="bg-[rgba(22,177,255,0.16)] text-[#16b1ff] text-[13px] font-medium leading-[20px] px-[12px] py-[2px] rounded-[16px]">
                        {ud.waitingUpload}
                      </span>
                    </div>

                    {/* Title + Description */}
                    <div className="flex flex-col gap-[8px] w-full min-h-[76px]">
                      <h3 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px]">
                        {doc.title}
                      </h3>
                      <p className="text-[13px] text-[rgba(46,38,61,0.7)] leading-[20px]">
                        {doc.description}
                      </p>
                    </div>

                    {/* Upload button */}
                    <button
                      onClick={() => setUploadModal({ title: doc.title, hasImageType: doc.hasImageType })}
                      className="w-full bg-[#057e33] rounded-[6px] px-[18px] py-[8px] flex items-center justify-center gap-[8px] text-white text-[15px] font-medium leading-[22px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all cursor-pointer"
                    >
                      {ud.uploadDocument}
                      <UploadIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security notice */}
          <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[16px] flex items-center justify-center">
            <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[21.56px] text-center">
              🔒 {ud.securityNote}
            </p>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <UploadModal
          docTitle={uploadModal.title}
          hasImageType={uploadModal.hasImageType}
          t={t}
          onClose={() => setUploadModal(null)}
        />
      )}
    </>
  );
}

/* ── Deposit method icons ──────────────────────────────────────────── */
function DepositMethodIcon({ type, active }: { type: "crypto" | "card"; active?: boolean }) {
  const color = active ? "#057e33" : "rgba(46,38,61,0.9)";
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
  const [method, setMethod] = useState<"crypto" | "card" | null>(null);
  const [copied, setCopied] = useState(false);

  const depositAddress = "TBgDkELwenLnx33TpEAMsvfNgzeHfxD7Tb";
  const creditAmounts = [500, 1000, 2500, 5000];

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1">
      <div className="bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] p-[16px] md:p-[20px] overflow-hidden">
        <div className="flex flex-col gap-[20px]">
          {/* Header */}
          <div>
            <h2 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px]">
              {df.depositingFunds}
            </h2>
            <p className="text-[15px] text-[rgba(46,38,61,0.7)] leading-[22px]">
              {df.accountNumber}
            </p>
          </div>

          {/* Method selection - show when no method selected OR always on desktop */}
          {method === null ? (
            <>
              <p className="text-[15px] font-medium text-[rgba(46,38,61,0.9)] leading-[22px]">
                {df.chooseMethod}
              </p>
              <div className="flex flex-col md:flex-row gap-[16px]">
                <button
                  onClick={() => setMethod("crypto")}
                  className="flex-1 border-2 border-[rgba(46,38,61,0.12)] rounded-[6px] p-[20px] flex flex-col items-center gap-[12px] hover:border-[#057e33] hover:bg-[rgba(5,126,51,0.04)] transition-all cursor-pointer"
                >
                  <DepositMethodIcon type="crypto" />
                  <span className="text-[15px] font-medium text-[rgba(46,38,61,0.9)] leading-[22px]">{df.digitalCurrencies}</span>
                </button>
                <button
                  onClick={() => setMethod("card")}
                  className="flex-1 border-2 border-[rgba(46,38,61,0.12)] rounded-[6px] p-[20px] flex flex-col items-center gap-[12px] hover:border-[#057e33] hover:bg-[rgba(5,126,51,0.04)] transition-all cursor-pointer"
                >
                  <DepositMethodIcon type="card" />
                  <span className="text-[15px] font-medium text-[rgba(46,38,61,0.9)] leading-[22px]">{df.creditCard}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Method cards - visible on md+ when method is selected */}
              <div className="hidden md:block">
                <p className="text-[15px] font-medium text-[rgba(46,38,61,0.9)] leading-[22px] mb-[16px]">
                  {df.chooseMethod}
                </p>
                <div className="flex gap-[16px]">
                  <button
                    onClick={() => setMethod("crypto")}
                    className={`flex-1 border-2 rounded-[6px] p-[20px] flex flex-col items-center gap-[12px] transition-all cursor-pointer ${
                      method === "crypto"
                        ? "border-[#057e33] bg-[rgba(5,126,51,0.04)]"
                        : "border-[rgba(46,38,61,0.12)] hover:border-[#057e33]"
                    }`}
                  >
                    <DepositMethodIcon type="crypto" active={method === "crypto"} />
                    <span className={`text-[15px] font-medium leading-[22px] ${method === "crypto" ? "text-[#057e33]" : "text-[rgba(46,38,61,0.9)]"}`}>{df.digitalCurrencies}</span>
                  </button>
                  <button
                    onClick={() => setMethod("card")}
                    className={`flex-1 border-2 rounded-[6px] p-[20px] flex flex-col items-center gap-[12px] transition-all cursor-pointer ${
                      method === "card"
                        ? "border-[#057e33] bg-[rgba(5,126,51,0.04)]"
                        : "border-[rgba(46,38,61,0.12)] hover:border-[#057e33]"
                    }`}
                  >
                    <DepositMethodIcon type="card" active={method === "card"} />
                    <span className={`text-[15px] font-medium leading-[22px] ${method === "card" ? "text-[#057e33]" : "text-[rgba(46,38,61,0.9)]"}`}>{df.creditCard}</span>
                  </button>
                </div>
              </div>

              {/* Digital Currencies form */}
              {method === "crypto" && (
                <div className="flex flex-col gap-[20px]">
                  {/* Section title with icon */}
                  <div className="flex items-center gap-[8px]">
                    <DepositMethodIcon type="crypto" active />
                    <h3 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px]">
                      {df.digitalCurrencies}
                    </h3>
                  </div>

                  {/* Form fields */}
                  <div className="flex flex-col md:flex-row gap-[14px] xl:gap-[20px]">
                    <FloatingField label={df.amount} value="900" isAr={isAr} />
                    <FloatingField label={df.selectCurrency} value="USDT  TetherUS" isSelect isAr={isAr} />
                    <FloatingField label={df.selectNetwork} value="TRX   Tron (TRC20)" isSelect isAr={isAr} />
                  </div>

                  {/* Deposit address section */}
                  <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[16px] flex flex-col md:flex-row items-start md:items-center justify-between gap-[16px]">
                    <div className="flex flex-col gap-[8px] flex-1 min-w-0">
                      <p className="text-[15px] font-medium text-[rgba(46,38,61,0.9)] leading-[22px]">
                        {df.depositAddress}
                      </p>
                      <div className="flex items-center gap-[8px]">
                        <p className="text-[15px] text-[rgba(46,38,61,0.7)] leading-[22px] break-all">
                          {depositAddress}
                        </p>
                        <button
                          onClick={handleCopy}
                          className="shrink-0 p-[4px] hover:bg-[rgba(46,38,61,0.08)] rounded transition-colors cursor-pointer"
                          title="Copy"
                        >
                          {copied ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#057e33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    {/* QR Code placeholder */}
                    <div className="shrink-0 w-[80px] h-[80px] bg-white border border-[rgba(46,38,61,0.12)] rounded-[6px] flex items-center justify-center">
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <rect x="2" y="2" width="18" height="18" rx="2" fill="rgba(46,38,61,0.9)" />
                        <rect x="5" y="5" width="12" height="12" rx="1" fill="white" />
                        <rect x="8" y="8" width="6" height="6" rx="0.5" fill="rgba(46,38,61,0.9)" />
                        <rect x="40" y="2" width="18" height="18" rx="2" fill="rgba(46,38,61,0.9)" />
                        <rect x="43" y="5" width="12" height="12" rx="1" fill="white" />
                        <rect x="46" y="8" width="6" height="6" rx="0.5" fill="rgba(46,38,61,0.9)" />
                        <rect x="2" y="40" width="18" height="18" rx="2" fill="rgba(46,38,61,0.9)" />
                        <rect x="5" y="43" width="12" height="12" rx="1" fill="white" />
                        <rect x="8" y="46" width="6" height="6" rx="0.5" fill="rgba(46,38,61,0.9)" />
                        <rect x="24" y="2" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="24" y="10" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="32" y="2" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="24" y="24" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="32" y="24" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="2" y="24" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="10" y="24" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="40" y="24" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="48" y="24" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="40" y="40" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="48" y="40" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="56" y="40" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="40" y="48" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="48" y="48" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="40" y="56" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="56" y="56" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="24" y="32" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="32" y="32" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="2" y="32" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                        <rect x="10" y="32" width="4" height="4" fill="rgba(46,38,61,0.9)" />
                      </svg>
                    </div>
                  </div>

                  {/* Send a picture button */}
                  <button className="bg-[#057e33] rounded-[6px] px-[18px] py-[10px] text-white text-[15px] font-medium leading-[22px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all cursor-pointer self-start w-full md:w-auto">
                    {df.sendPicture}
                  </button>

                  {/* Recommended platforms */}
                  <div className="flex flex-col gap-[12px]">
                    <p className="text-[15px] font-medium text-[rgba(46,38,61,0.9)] leading-[22px]">
                      {df.recommendedPlatforms}
                    </p>
                    <div className="flex items-center gap-[24px]">
                      {/* OKX logo */}
                      <svg width="80" height="30" viewBox="0 0 80 30" fill="none">
                        <rect x="0" y="4" width="22" height="22" rx="4" fill="#000" />
                        <rect x="7" y="11" width="8" height="8" rx="1" fill="#fff" />
                        <text x="26" y="20" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="16" fill="#000">OKX</text>
                      </svg>
                      {/* Binance logo */}
                      <div className="flex items-center gap-[6px]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L6.5 7.5L8.6 9.6L12 6.2L15.4 9.6L17.5 7.5L12 2Z" fill="#F3BA2F" />
                          <path d="M4.4 9.6L2 12L4.4 14.4L6.8 12L4.4 9.6Z" fill="#F3BA2F" />
                          <path d="M12 17.8L8.6 14.4L6.5 16.5L12 22L17.5 16.5L15.4 14.4L12 17.8Z" fill="#F3BA2F" />
                          <path d="M19.6 9.6L17.2 12L19.6 14.4L22 12L19.6 9.6Z" fill="#F3BA2F" />
                          <path d="M14.1 12L12 9.9L9.9 12L12 14.1L14.1 12Z" fill="#F3BA2F" />
                        </svg>
                        <span className="text-[18px] font-bold text-[#F3BA2F] tracking-[0.05em]">BINANCE</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Credit Card form */}
              {method === "card" && (
                <div className="flex flex-col gap-[20px]">
                  {/* Section title with icon */}
                  <div className="flex items-center gap-[8px]">
                    <DepositMethodIcon type="card" active />
                    <h3 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px]">
                      {df.creditCard}
                    </h3>
                  </div>

                  {/* Amount buttons */}
                  <div className="flex flex-col gap-[12px] max-w-[400px]">
                    {creditAmounts.map((amount) => (
                      <button
                        key={amount}
                        className="w-full bg-[#057e33] rounded-[6px] px-[18px] py-[10px] text-white text-[15px] font-medium leading-[22px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all cursor-pointer text-center"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Security note */}
          <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[16px] flex items-center justify-center">
            <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[21.56px] text-center">
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
  const color = active ? "#057e33" : "rgba(46,38,61,0.9)";
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

/* ── Withdrawals View ───────────────────────────────────────────────── */
function WithdrawalsView({ t, isAr }: { t: (typeof sidebarItems)["en"]; isAr: boolean }) {
  const wd = t.withdrawals;
  const [method, setMethod] = useState<"digital" | "bank" | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] overflow-hidden flex flex-col flex-1">
      {/* Header */}
      <div className="flex flex-col gap-[8px] px-[20px] pt-[20px] pb-[16px]">
        <h2 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px]">
          {wd.cashWithdrawal}
        </h2>
        <p className="text-[15px] text-[rgba(46,38,61,0.7)] leading-[22px]">
          {wd.accountNumber}
        </p>
      </div>

      <div className="flex flex-col gap-[48px] px-[20px] pb-[20px]">
        {/* Method selection - hidden on mobile when method is selected */}
        <div className={`flex flex-col gap-[20px] ${method ? "hidden md:flex" : "flex"}`}>
          <h3 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px]">
            {wd.chooseMethod}
          </h3>
          <div className="flex flex-col md:flex-row gap-[20px]">
            <button
              onClick={() => { setMethod("digital"); setConfirmed(false); }}
              className={`flex-1 rounded-[6px] flex flex-col items-center gap-[16px] p-[20px] transition-all cursor-pointer ${
                method === "digital"
                  ? "bg-[rgba(5,126,51,0.1)] border border-[#057e33] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)]"
                  : "bg-white shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] hover:shadow-[0px_4px_14px_0px_rgba(46,38,61,0.3)]"
              }`}
            >
              <WithdrawalMethodIcon type="digital" active={method === "digital"} />
              <span className={`text-[18px] font-medium leading-[28px] text-center ${
                method === "digital" ? "text-[#057e33]" : "text-[rgba(46,38,61,0.9)]"
              }`}>
                {wd.digitalCurrency}
              </span>
            </button>
            <button
              onClick={() => { setMethod("bank"); setConfirmed(false); }}
              className={`flex-1 rounded-[6px] flex flex-col items-center gap-[16px] p-[20px] transition-all cursor-pointer ${
                method === "bank"
                  ? "bg-[rgba(5,126,51,0.1)] border border-[#057e33] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)]"
                  : "bg-white shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] hover:shadow-[0px_4px_14px_0px_rgba(46,38,61,0.3)]"
              }`}
            >
              <WithdrawalMethodIcon type="bank" active={method === "bank"} />
              <span className={`text-[18px] font-medium leading-[28px] text-center ${
                method === "bank" ? "text-[#057e33]" : "text-[rgba(46,38,61,0.9)]"
              }`}>
                {wd.bankTransfer}
              </span>
            </button>
          </div>
        </div>

        {/* Form section */}
        {method && (
          <div className="flex flex-col gap-[20px]">
            {/* Method heading with icon */}
            <div className="flex items-center gap-[8px]">
              <WithdrawalMethodIcon type={method} />
              <h3 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px]">
                {method === "bank" ? wd.bankTransfer : wd.digitalCurrency}
              </h3>
            </div>

            {/* Form fields */}
            <div className="flex flex-col gap-[14px] xl:gap-[20px]">
              {method === "bank" ? (
                <>
                  <div className="flex flex-col md:flex-row gap-[14px] xl:gap-[20px]">
                    <FloatingField label={wd.amount} value="900" isAr={isAr} />
                    <FloatingField label={wd.bankName} value="SABB Bank" isSelect isAr={isAr} />
                  </div>
                  <div className="flex gap-[8px] items-end">
                    <FloatingField label={wd.ibanNumber} value="11 7181 8181 8181 8181 8188" isAr={isAr} />
                    <div className="bg-[#f0f1f4] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[11px] xl:py-[13px] shrink-0 w-[54px] flex items-center justify-center">
                      <span className="text-[15px] text-[rgba(46,38,61,0.9)] leading-[22px]">SA</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <FloatingField label={wd.amount} value="900" isAr={isAr} />
                  <FloatingField label={wd.currencyType} value="TetherUS (USDT) - TRC20 (TRON)" isAr={isAr} />
                  <FloatingField label={wd.walletAddress} value="TRX  Tron (TRC20)" isAr={isAr} />
                </>
              )}
            </div>

            {/* Confirmation checkbox */}
            <div className="flex items-start gap-[8px]">
              <button
                onClick={() => setConfirmed(!confirmed)}
                className={`shrink-0 w-[24px] h-[24px] rounded-[4px] flex items-center justify-center transition-all cursor-pointer mt-[1px] ${
                  confirmed
                    ? "bg-[#057e33]"
                    : "border-2 border-[rgba(46,38,61,0.22)]"
                }`}
              >
                {confirmed && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <p className="text-[15px] text-[rgba(46,38,61,0.9)] leading-[22px]">
                {wd.confirmText}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-[20px]">
              <button className="bg-[#057e33] rounded-[6px] px-[18px] py-[8px] text-white text-[15px] font-medium leading-[22px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all cursor-pointer flex-1 sm:flex-none">
                {method === "bank" ? wd.withdraw : wd.saveChanges}
              </button>
              <button
                onClick={() => { setMethod(null); setConfirmed(false); }}
                className="border border-[#8a8d93] rounded-[6px] px-[18px] py-[8px] text-[rgba(46,38,61,0.7)] text-[15px] font-medium leading-[22px] hover:bg-gray-50 transition-all cursor-pointer flex-1 sm:flex-none"
              >
                {method === "bank" ? wd.cancellation : wd.reset}
              </button>
            </div>
          </div>
        )}

        {/* Warning alert + Security note */}
        <div className="flex flex-col gap-[20px]">
          <div className="bg-[rgba(255,180,0,0.16)] rounded-[6px] p-[16px] flex gap-[16px] items-start">
            <div className="bg-[#ffab1d] rounded-[6px] w-[30px] h-[30px] shrink-0 flex items-center justify-center opacity-90">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="flex flex-col gap-[4px] flex-1 overflow-hidden">
              <p className="text-[15px] font-medium text-[#ffa63d] leading-[22px] tracking-[0.15px]">
                {wd.warningTitle}
              </p>
              <p className="text-[13px] text-[#ffa63d] leading-[18.69px]">
                {wd.warningText}
              </p>
            </div>
          </div>

          <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[16px] flex items-center justify-center">
            <p className="text-[rgba(46,38,61,0.7)] text-[15px] leading-[21.56px] text-center">
              🔒 {wd.securityNote}
            </p>
          </div>
        </div>
      </div>
    </div>
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

  const stepTitles = [cu.personalInformation, cu.contactInformation, cu.orderDetails, cu.dataReview];
  const progressWidths = ["7%", "33%", "66%", "78%"];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="bg-white rounded-[6px] shadow-[0px_4px_10px_0px_rgba(46,38,61,0.2)] overflow-hidden flex-1 w-full flex flex-col items-center justify-center">
        <div className="flex flex-col gap-[20px] items-center justify-center pb-[16px] pt-[20px] px-[20px] w-full max-w-[540px]">
          {/* Step title */}
          <h2 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px] text-center">
            {stepTitles[step]}
          </h2>

          <div className="flex flex-col gap-[30px] w-full">
            {/* Progress bar */}
            <div className="bg-[#f4f5fa] h-[22px] rounded-[100px] overflow-hidden w-full">
              <div
                className="h-[22px] rounded-[100px] transition-all duration-300"
                style={{
                  width: progressWidths[step],
                  backgroundImage: "linear-gradient(270deg, rgb(66, 196, 93) 0%, rgb(3, 128, 58) 100%)",
                }}
              />
            </div>

            {/* Step content */}
            <div className="flex flex-col gap-[20px] w-full">
              {step === 0 && (
                <div className="flex flex-col gap-[20px]">
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[13px] font-medium text-[rgba(46,38,61,0.6)] leading-[18px] tracking-[0.02em] uppercase">{cu.firstName}</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[11px] xl:py-[13px] text-[15px] text-[rgba(46,38,61,0.9)] leading-[22px] focus:outline-none focus:border-[#057e33] focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[13px] font-medium text-[rgba(46,38,61,0.6)] leading-[18px] tracking-[0.02em] uppercase">{cu.lastName}</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[11px] xl:py-[13px] text-[15px] text-[rgba(46,38,61,0.9)] leading-[22px] focus:outline-none focus:border-[#057e33] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-[20px]">
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[13px] font-medium text-[rgba(46,38,61,0.6)] leading-[18px] tracking-[0.02em] uppercase">{cu.email}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[11px] xl:py-[13px] text-[15px] text-[rgba(46,38,61,0.9)] leading-[22px] focus:outline-none focus:border-[#057e33] focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[13px] font-medium text-[rgba(46,38,61,0.6)] leading-[18px] tracking-[0.02em] uppercase">{cu.phoneNumber}</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[11px] xl:py-[13px] text-[15px] text-[rgba(46,38,61,0.9)] leading-[22px] focus:outline-none focus:border-[#057e33] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-[20px]">
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[13px] font-medium text-[rgba(46,38,61,0.6)] leading-[18px] tracking-[0.02em] uppercase">{cu.reasonForCommunication}</label>
                    <input
                      type="text"
                      value={formData.reason}
                      onChange={(e) => handleChange("reason", e.target.value)}
                      className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[11px] xl:py-[13px] text-[15px] text-[rgba(46,38,61,0.9)] leading-[22px] focus:outline-none focus:border-[#057e33] focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[13px] font-medium text-[rgba(46,38,61,0.6)] leading-[18px] tracking-[0.02em] uppercase">{cu.requestType}</label>
                    <div className="relative">
                      <select
                        value={formData.requestType}
                        onChange={(e) => handleChange("requestType", e.target.value)}
                        className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[11px] xl:py-[13px] text-[15px] text-[rgba(46,38,61,0.9)] leading-[22px] focus:outline-none focus:border-[#057e33] focus:bg-white transition-colors appearance-none cursor-pointer"
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
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[13px] font-medium text-[rgba(46,38,61,0.6)] leading-[18px] tracking-[0.02em] uppercase">{cu.topicDetails}</label>
                    <textarea
                      value={formData.topicDetails}
                      onChange={(e) => handleChange("topicDetails", e.target.value)}
                      rows={4}
                      className="w-full bg-[#f8f9fb] border border-[rgba(46,38,61,0.14)] rounded-[8px] px-[14px] py-[11px] xl:py-[13px] text-[15px] text-[rgba(46,38,61,0.9)] leading-[22px] focus:outline-none focus:border-[#057e33] focus:bg-white transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-[20px]">
                  {/* Personal Information review card */}
                  <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[16px] flex flex-col gap-[12px]">
                    <h3 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px]">
                      {cu.personalInformation}
                    </h3>
                    <div className="flex flex-col gap-[8px]">
                      <p className="text-[15px] text-[rgba(46,38,61,0.7)] leading-[22px]">
                        {cu.firstName}: <span className="text-black">{formData.firstName || "—"}</span>
                      </p>
                      <p className="text-[15px] text-[rgba(46,38,61,0.7)] leading-[22px]">
                        {cu.lastName}: <span className="text-black">{formData.lastName || "—"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Contact Information review card */}
                  <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[16px] flex flex-col gap-[12px]">
                    <h3 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px]">
                      {cu.contactInformation}
                    </h3>
                    <div className="flex flex-col gap-[8px]">
                      <p className="text-[15px] text-[rgba(46,38,61,0.7)] leading-[22px]">
                        {cu.email}: <span className="text-black">{formData.email || "—"}</span>
                      </p>
                      <p className="text-[15px] text-[rgba(46,38,61,0.7)] leading-[22px]">
                        {cu.phoneNumber}: <span className="text-black">{formData.phoneNumber || "—"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Order Details review card */}
                  <div className="bg-[rgba(46,38,61,0.04)] rounded-[6px] p-[16px] flex flex-col gap-[12px]">
                    <h3 className="text-[18px] font-medium text-[rgba(46,38,61,0.9)] leading-[28px]">
                      {cu.orderDetails}
                    </h3>
                    <div className="flex flex-col gap-[8px]">
                      <p className="text-[15px] text-[rgba(46,38,61,0.7)] leading-[22px]">
                        {cu.reasonForCommunication}: <span className="text-black">{formData.reason || "—"}</span>
                      </p>
                      <p className="text-[15px] text-[rgba(46,38,61,0.7)] leading-[22px]">
                        {cu.requestType}: <span className="text-black">{formData.requestType || "—"}</span>
                      </p>
                      <p className="text-[15px] text-[rgba(46,38,61,0.7)] leading-[22px]">
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
                  className={`border border-[#8a8d93] rounded-[6px] px-[18px] py-[8px] text-[#8a8d93] text-[15px] font-medium leading-[22px] flex items-center gap-[4px] transition-all cursor-pointer ${step === 0 ? "opacity-45 cursor-not-allowed" : "hover:bg-gray-50"}`}
                >
                  <svg className={isAr ? "rotate-180" : ""} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8d93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  {cu.previous}
                </button>
                {step < totalSteps - 1 ? (
                  <button
                    onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
                    className="bg-[#057e33] rounded-[6px] px-[18px] py-[8px] text-white text-[15px] font-medium leading-[22px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all cursor-pointer flex items-center gap-[4px]"
                  >
                    {cu.next}
                    <svg className={isAr ? "rotate-180" : ""} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    className="bg-[#057e33] rounded-[6px] px-[18px] py-[8px] text-white text-[15px] font-medium leading-[22px] shadow-[0px_2px_4px_0px_rgba(46,38,61,0.16)] hover:bg-[#046b2b] transition-all cursor-pointer"
                  >
                    {cu.send}
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
  const { lang, toggleLang } = useLang();
  const { user, isLoggedIn, logout } = useUserAuth();
  const router = useRouter();
  const isAr = lang === "ar";
  const t = sidebarItems[lang];
  const [activeItem, setActiveItem] = useState("personal-data");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

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
        className={`fixed top-4 ${isAr ? "right-4" : "left-4"} z-50 lg:hidden bg-white rounded-[6px] p-2 shadow-md`}
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
      <aside className={`fixed lg:sticky top-0 ${isAr ? "right-0" : "left-0"} z-40 h-screen w-[260px] bg-white shadow-[2px_0_8px_rgba(0,0,0,0.06)] flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : isAr ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className={`flex flex-col flex-1`}>
          {/* Logo */}
          <div className="flex items-center px-[22px] py-[20px]">
            <Link href="/">
              <Image src="/images/nemayalogo.png" alt="Namaya" width={116} height={32} className="h-[32px] w-auto" />
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
                            ? "bg-gradient-to-l from-[#03803a] to-[#42c45d] text-white"
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
                          ? "bg-gradient-to-l from-[#03803a] to-[#42c45d] text-white"
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
      <div className="flex-1 flex flex-col">
        {/* Header bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-[64px] min-h-[64px] px-[16px] md:px-[24px] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
          <h1 className="text-[18px] md:text-[24px] font-medium text-[rgba(46,38,61,0.9)] leading-[38px] ps-[40px] lg:ps-0">
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
            {/* Notification bell */}
            <button className="relative p-[8px] rounded-[19px] hover:bg-black/5 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(46,38,61,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-[4px] right-[4px] w-[8px] h-[8px] bg-[#ff4c51] rounded-full ring-2 ring-white" />
            </button>
            {/* User avatar */}
            <div className={`${isAr ? "pr-[8px]" : "pl-[8px]"} relative`}>
              <div className="w-[38px] h-[38px] rounded-full overflow-hidden bg-[#f4f5fa] border-2 border-white shadow-sm">
                <div className="w-full h-full bg-[#e0e0e0] flex items-center justify-center text-[14px] font-semibold text-[rgba(46,38,61,0.7)]">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-[8px] h-[8px] bg-[#56ca00] rounded-full ring-2 ring-white" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-[16px] md:px-[24px] pt-[8px] pb-[24px] flex flex-col">
          {activeItem === "change-password" ? (
            <ChangePasswordView t={t} isAr={isAr} />
          ) : activeItem === "upload-documents" ? (
            <UploadDocumentsView t={t} />
          ) : activeItem === "deposit-funds" ? (
            <DepositFundsView t={t} isAr={isAr} />
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
