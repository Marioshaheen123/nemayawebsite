import type { Bilingual } from "@/data/types";

export const i18n = {
  heroTitle: { en: "Contact Us", ar: "اتصل بنا" } as Bilingual<string>,
  formTitle: { en: "Contact Form", ar: "نموذج الاتصال" } as Bilingual<string>,
  formDesc: {
    en: "We are here to help you. Please fill out the form below and we will contact you soon.",
    ar: "نحن هنا لمساعدتك. يرجى ملء النموذج أدناه وسنتواصل معك قريباً.",
  } as Bilingual<string>,
  steps: {
    en: ["Personal Information", "Contact Details", "Your Message"],
    ar: ["المعلومات الشخصية", "تفاصيل الاتصال", "رسالتك"],
  } as Bilingual<string[]>,
  fields: {
    en: {
      firstName: "First Name",
      firstNamePlaceholder: "Enter first name",
      lastName: "Last Name",
      lastNamePlaceholder: "Enter last name",
      email: "Email Address",
      emailPlaceholder: "Enter your email",
      phone: "Phone Number",
      phonePlaceholder: "Enter your phone number",
      subject: "Subject",
      subjectPlaceholder: "Enter the subject",
      message: "Message",
      messagePlaceholder: "Write your message here...",
    },
    ar: {
      firstName: "الاسم الأول",
      firstNamePlaceholder: "أدخل الاسم الأول",
      lastName: "اسم العائلة",
      lastNamePlaceholder: "أدخل اسم العائلة",
      email: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      phone: "رقم الهاتف",
      phonePlaceholder: "أدخل رقم هاتفك",
      subject: "الموضوع",
      subjectPlaceholder: "أدخل الموضوع",
      message: "الرسالة",
      messagePlaceholder: "اكتب رسالتك هنا...",
    },
  } as Bilingual<{
    firstName: string;
    firstNamePlaceholder: string;
    lastName: string;
    lastNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    subject: string;
    subjectPlaceholder: string;
    message: string;
    messagePlaceholder: string;
  }>,
  previous: { en: "Previous", ar: "السابق" } as Bilingual<string>,
  next: { en: "Next", ar: "التالي" } as Bilingual<string>,
  submit: { en: "Submit", ar: "إرسال" } as Bilingual<string>,
  success: {
    en: "Thank you! Your message has been sent successfully. We will contact you soon.",
    ar: "شكراً لك! تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.",
  } as Bilingual<string>,
};

export const TOTAL_STEPS = 3;
