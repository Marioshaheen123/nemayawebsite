import type { Bilingual } from "@/data/types";

// ─── Login ──────────────────────────────────────────────────────────────────
export const loginText: Bilingual<{
  title: string;
  subtitle: string;
  accountNumber: string;
  password: string;
  rememberMe: string;
  forgotPassword: string;
  loginBtn: string;
  newHere: string;
  createAccount: string;
}> = {
  en: {
    title: "Log in",
    subtitle: "Welcome back, please enter your details to continue.",
    accountNumber: "Account Number",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    loginBtn: "Log In",
    newHere: "New on our platform?",
    createAccount: "Create an account",
  },
  ar: {
    title: "تسجيل الدخول",
    subtitle: "مرحبًا بعودتك، يرجى إدخال بياناتك للمتابعة.",
    accountNumber: "رقم الحساب",
    password: "كلمة المرور",
    rememberMe: "تذكرني",
    forgotPassword: "نسيت كلمة المرور؟",
    loginBtn: "تسجيل الدخول",
    newHere: "جديد على منصتنا؟",
    createAccount: "إنشاء حساب",
  },
};

// ─── Register ───────────────────────────────────────────────────────────────
export interface RegisterField {
  name: string;
  label: string;
  type: string;
}

export interface RegisterStep {
  title: string;
  subtitle: string;
  fields: RegisterField[];
}

export const registerText: Bilingual<{
  mainTitle: string;
  mainSubtitle: string;
  steps: RegisterStep[];
  previous: string;
  next: string;
  finish: string;
  alreadyHave: string;
  login: string;
}> = {
  en: {
    mainTitle: "Create a new account",
    mainSubtitle: "Join us and begin your journey in the world of investment.",
    steps: [
      {
        title: "Account Information",
        subtitle: "Create your account",
        fields: [
          { name: "firstName", label: "First Name", type: "text" },
          { name: "lastName", label: "Last Name", type: "text" },
        ],
      },
      {
        title: "Contact Details",
        subtitle: "Enter your email and phone number",
        fields: [
          { name: "mobile", label: "Mobile Number", type: "tel" },
          { name: "email", label: "Email", type: "email" },
        ],
      },
      {
        title: "Security Setup",
        subtitle: "Set a secure password",
        fields: [
          { name: "password", label: "Password", type: "password" },
          { name: "confirmPassword", label: "Confirm Password", type: "password" },
        ],
      },
      {
        title: "Investment Details",
        subtitle: "Tell us a bit more before you start",
        fields: [
          { name: "age", label: "Age", type: "select" },
          { name: "country", label: "Country of residence or birth", type: "select" },
          { name: "callTime", label: "When should we call?", type: "select" },
        ],
      },
    ],
    previous: "Previous",
    next: "Next",
    finish: "Finish",
    alreadyHave: "Already have an account?",
    login: "Log in",
  },
  ar: {
    mainTitle: "إنشاء حساب جديد",
    mainSubtitle: "انضم إلينا وابدأ رحلتك في عالم الاستثمار.",
    steps: [
      {
        title: "معلومات الحساب",
        subtitle: "أنشئ حسابك",
        fields: [
          { name: "firstName", label: "الاسم الأول", type: "text" },
          { name: "lastName", label: "اسم العائلة", type: "text" },
        ],
      },
      {
        title: "بيانات الاتصال",
        subtitle: "أدخل بريدك الإلكتروني ورقم هاتفك",
        fields: [
          { name: "mobile", label: "رقم الجوال", type: "tel" },
          { name: "email", label: "البريد الإلكتروني", type: "email" },
        ],
      },
      {
        title: "إعداد الأمان",
        subtitle: "قم بتعيين كلمة مرور آمنة",
        fields: [
          { name: "password", label: "كلمة المرور", type: "password" },
          { name: "confirmPassword", label: "تأكيد كلمة المرور", type: "password" },
        ],
      },
      {
        title: "تفاصيل الاستثمار",
        subtitle: "أخبرنا المزيد قبل البدء",
        fields: [
          { name: "age", label: "العمر", type: "select" },
          { name: "country", label: "بلد الإقامة أو الميلاد", type: "select" },
          { name: "callTime", label: "متى يمكننا الاتصال بك؟", type: "select" },
        ],
      },
    ],
    previous: "السابق",
    next: "التالي",
    finish: "إنهاء",
    alreadyHave: "لديك حساب بالفعل؟",
    login: "تسجيل الدخول",
  },
};

export const ageOptions: Bilingual<string[]> = {
  en: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
  ar: ["18-24", "25-34", "35-44", "45-54", "55-64", "+65"],
};

export const countryOptions: Bilingual<string[]> = {
  en: [
    "Saudi Arabia", "United Arab Emirates", "Kuwait", "Bahrain",
    "Qatar", "Oman", "Jordan", "Egypt", "Iraq", "Lebanon", "Other",
  ],
  ar: [
    "المملكة العربية السعودية", "الإمارات العربية المتحدة", "الكويت", "البحرين",
    "قطر", "عُمان", "الأردن", "مصر", "العراق", "لبنان", "أخرى",
  ],
};

export const callTimeOptions: Bilingual<string[]> = {
  en: ["Morning (9 AM - 12 PM)", "Afternoon (12 PM - 5 PM)", "Evening (5 PM - 9 PM)"],
  ar: ["صباحاً (9 ص - 12 م)", "ظهراً (12 م - 5 م)", "مساءً (5 م - 9 م)"],
};

// ─── Forgot Password ────────────────────────────────────────────────────────
export const forgotPasswordText: Bilingual<{
  title: string;
  description: string;
  emailLabel: string;
  sendBtn: string;
  backToLogin: string;
}> = {
  en: {
    title: "Forgot Password",
    description: "Enter your email and we'll send you instructions to reset your password",
    emailLabel: "Email",
    sendBtn: "Send Reset Link",
    backToLogin: "Back to Login",
  },
  ar: {
    title: "نسيت كلمة المرور",
    description: "أدخل بريدك الإلكتروني وسنرسل لك تعليمات لإعادة تعيين كلمة المرور",
    emailLabel: "البريد الإلكتروني",
    sendBtn: "إرسال رابط إعادة التعيين",
    backToLogin: "العودة لتسجيل الدخول",
  },
};

// ─── Reset Password ─────────────────────────────────────────────────────────
export const resetPasswordText: Bilingual<{
  title: string;
  description: string;
  passwordLabel: string;
  confirmLabel: string;
  resetBtn: string;
  backToLogin: string;
}> = {
  en: {
    title: "Reset Password",
    description: "Your new password must be different from previously used passwords",
    passwordLabel: "Password",
    confirmLabel: "Confirm Password",
    resetBtn: "Set New Password",
    backToLogin: "Back to Login",
  },
  ar: {
    title: "إعادة تعيين كلمة المرور",
    description: "يجب أن تكون كلمة المرور الجديدة مختلفة عن كلمات المرور المستخدمة سابقًا",
    passwordLabel: "كلمة المرور",
    confirmLabel: "تأكيد كلمة المرور",
    resetBtn: "تعيين كلمة المرور الجديدة",
    backToLogin: "العودة لتسجيل الدخول",
  },
};

// ─── Verify Email ───────────────────────────────────────────────────────────
export const verifyEmailText: Bilingual<{
  title: string;
  description: string;
  descriptionEnd: string;
  email: string;
  skipBtn: string;
  didntGet: string;
  resend: string;
}> = {
  en: {
    title: "Verify your email",
    description: "Account activation link sent to your email address: ",
    descriptionEnd: " Please follow the link inside to continue.",
    email: "john.doe@email.com",
    skipBtn: "Skip For Now",
    didntGet: "Didn't get the mail?",
    resend: "Resend",
  },
  ar: {
    title: "تحقق من بريدك الإلكتروني",
    description: "تم إرسال رابط تفعيل الحساب إلى بريدك الإلكتروني: ",
    descriptionEnd: " يرجى اتباع الرابط بالداخل للمتابعة.",
    email: "john.doe@email.com",
    skipBtn: "تخطي الآن",
    didntGet: "لم تستلم البريد؟",
    resend: "إعادة الإرسال",
  },
};

// ─── Verify Number ──────────────────────────────────────────────────────────
export const verifyNumberText: Bilingual<{
  title: string;
  description: string;
  mobileLabel: string;
  sendBtn: string;
  backToLogin: string;
}> = {
  en: {
    title: "Verify Your Number",
    description: "For security reasons, please verify your mobile number before continuing. We'll send a one-time verification code to this number.",
    mobileLabel: "Mobile Number",
    sendBtn: "Send Verification Code",
    backToLogin: "Back to Login",
  },
  ar: {
    title: "تحقق من رقمك",
    description: "لأسباب أمنية، يرجى التحقق من رقم هاتفك المحمول قبل المتابعة. سنرسل رمز تحقق لمرة واحدة إلى هذا الرقم.",
    mobileLabel: "رقم الجوال",
    sendBtn: "إرسال رمز التحقق",
    backToLogin: "العودة لتسجيل الدخول",
  },
};

// ─── Verify Code ────────────────────────────────────────────────────────────
export const verifyCodeText: Bilingual<{
  title: string;
  description: string;
  maskedNumber: string;
  codeLabel: string;
  verifyBtn: string;
  didntGet: string;
  resend: string;
}> = {
  en: {
    title: "Enter Verification Code",
    description: "We sent a verification code to your mobile. Enter the code from the mobile in the field below.",
    maskedNumber: "******1234",
    codeLabel: "Type your 6 digit security code",
    verifyBtn: "Verify & Continue",
    didntGet: "Didn't get the code?",
    resend: "Resend",
  },
  ar: {
    title: "أدخل رمز التحقق",
    description: "لقد أرسلنا رمز تحقق إلى هاتفك المحمول. أدخل الرمز من الهاتف في الحقل أدناه.",
    maskedNumber: "******1234",
    codeLabel: "أدخل رمز الأمان المكون من 6 أرقام",
    verifyBtn: "تحقق وتابع",
    didntGet: "لم تحصل على الرمز؟",
    resend: "إعادة الإرسال",
  },
};
