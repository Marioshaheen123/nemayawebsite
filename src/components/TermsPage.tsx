"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

const heroTitle = {
  en: "Terms & Conditions",
  ar: "الشروط والأحكام",
};

const sections: {
  en: { title: string; paragraphs: string[] }[];
  ar: { title: string; paragraphs: string[] }[];
} = {
  ar: [
    {
      title: "مقدمة",
      paragraphs: [
        "مرحبًا بكم في نمايا للاستثمار. باستخدامك لموقعنا الإلكتروني وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية قبل استخدام أي من خدماتنا.",
        "تسري هذه الشروط والأحكام على جميع المستخدمين والزوار والعملاء الذين يصلون إلى الموقع أو يستخدمون خدماتنا المالية والاستثمارية.",
      ],
    },
    {
      title: "التعريفات",
      paragraphs: [
        "\"الشركة\" أو \"نحن\" تشير إلى شركة نمايا للاستثمار المسجلة في المملكة العربية السعودية.",
        "\"المستخدم\" أو \"أنت\" يشير إلى أي شخص يستخدم الموقع الإلكتروني أو الخدمات المقدمة.",
        "\"الخدمات\" تشمل جميع خدمات التداول والاستثمار والأدوات المالية المقدمة عبر منصاتنا.",
        "\"الحساب\" يعني حساب التداول الذي يتم فتحه باسم المستخدم لدى الشركة.",
      ],
    },
    {
      title: "شروط فتح الحساب",
      paragraphs: [
        "يجب أن يكون عمر المستخدم 18 عامًا أو أكثر لفتح حساب تداول.",
        "يجب على المستخدم تقديم معلومات دقيقة وكاملة وحديثة أثناء عملية التسجيل والحفاظ على تحديثها.",
        "تحتفظ الشركة بالحق في رفض أي طلب لفتح حساب أو إغلاق أي حساب موجود وفقًا لتقديرها.",
        "يلتزم المستخدم بالحفاظ على سرية بيانات حسابه وكلمة المرور الخاصة به وعدم مشاركتها مع أي طرف ثالث.",
      ],
    },
    {
      title: "خدمات التداول",
      paragraphs: [
        "توفر الشركة خدمات تداول العقود مقابل الفروقات (CFDs) على مجموعة متنوعة من الأصول المالية بما في ذلك العملات الأجنبية والسلع والمؤشرات والأسهم.",
        "تداول العقود مقابل الفروقات ينطوي على مخاطر عالية وقد لا يكون مناسبًا لجميع المستثمرين. يمكن أن تتجاوز الخسائر رأس المال المستثمر.",
        "الشركة غير مسؤولة عن أي خسائر ناجمة عن قرارات التداول التي يتخذها المستخدم.",
        "قد تتغير شروط التداول بما في ذلك الفروقات السعرية والرافعة المالية والهوامش دون إشعار مسبق وفقًا لظروف السوق.",
      ],
    },
    {
      title: "الإيداع والسحب",
      paragraphs: [
        "يمكن إجراء الإيداعات عبر وسائل الدفع المعتمدة من قبل الشركة بما في ذلك التحويل المصرفي وبطاقات الائتمان والعملات الرقمية.",
        "تتم معالجة طلبات السحب خلال أيام العمل وقد تستغرق من 1 إلى 5 أيام عمل حسب طريقة السحب.",
        "تحتفظ الشركة بالحق في طلب مستندات إضافية للتحقق من هوية المستخدم قبل معالجة عمليات السحب.",
        "قد يتم تطبيق رسوم على بعض عمليات السحب وفقًا لطريقة الدفع المستخدمة.",
      ],
    },
    {
      title: "حقوق الملكية الفكرية",
      paragraphs: [
        "جميع المحتويات المنشورة على الموقع بما في ذلك النصوص والرسومات والشعارات والصور والبرمجيات هي ملكية حصرية لشركة نمايا أو مرخصة لها.",
        "لا يجوز نسخ أو إعادة إنتاج أو توزيع أو نشر أي محتوى من الموقع دون إذن كتابي مسبق من الشركة.",
      ],
    },
    {
      title: "إخلاء المسؤولية",
      paragraphs: [
        "المعلومات المقدمة على هذا الموقع هي لأغراض تعليمية وإعلامية فقط ولا تشكل نصيحة استثمارية أو مالية.",
        "لا تضمن الشركة دقة أو اكتمال أو حداثة المعلومات المقدمة على الموقع.",
        "الشركة غير مسؤولة عن أي خسائر أو أضرار ناجمة عن استخدام الموقع أو الاعتماد على المعلومات المقدمة.",
      ],
    },
    {
      title: "التعديلات",
      paragraphs: [
        "تحتفظ الشركة بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم نشر أي تعديلات على هذه الصفحة.",
        "يعتبر استمرار استخدام الموقع بعد نشر التعديلات بمثابة قبول للشروط المعدلة.",
      ],
    },
    {
      title: "القانون المعمول به",
      paragraphs: [
        "تخضع هذه الشروط والأحكام لأنظمة وقوانين المملكة العربية السعودية.",
        "يتم حل أي نزاعات ناشئة عن هذه الشروط أمام المحاكم المختصة في المملكة العربية السعودية.",
      ],
    },
    {
      title: "التواصل",
      paragraphs: [
        "لأي استفسارات تتعلق بهذه الشروط والأحكام، يرجى التواصل معنا عبر البريد الإلكتروني Info@namaya.ar أو الاتصال على الرقم +966135117700.",
      ],
    },
  ],
  en: [
    {
      title: "Introduction",
      paragraphs: [
        "Welcome to Namaya for Investment. By using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before using any of our services.",
        "These Terms and Conditions apply to all users, visitors, and clients who access the website or use our financial and investment services.",
      ],
    },
    {
      title: "Definitions",
      paragraphs: [
        "\"Company\" or \"we\" refers to Namaya Investment Company registered in the Kingdom of Saudi Arabia.",
        "\"User\" or \"you\" refers to any person who uses the website or the services provided.",
        "\"Services\" include all trading and investment services and financial instruments provided through our platforms.",
        "\"Account\" means the trading account opened in the user's name with the Company.",
      ],
    },
    {
      title: "Account Opening Conditions",
      paragraphs: [
        "Users must be 18 years of age or older to open a trading account.",
        "Users must provide accurate, complete, and current information during the registration process and keep it updated.",
        "The Company reserves the right to refuse any account opening request or close any existing account at its discretion.",
        "Users are committed to maintaining the confidentiality of their account data and password and not sharing them with any third party.",
      ],
    },
    {
      title: "Trading Services",
      paragraphs: [
        "The Company provides Contract for Difference (CFD) trading services on a variety of financial assets including foreign currencies, commodities, indices, and stocks.",
        "CFD trading involves high risk and may not be suitable for all investors. Losses can exceed invested capital.",
        "The Company is not responsible for any losses resulting from trading decisions made by the user.",
        "Trading conditions including spreads, leverage, and margins may change without prior notice according to market conditions.",
      ],
    },
    {
      title: "Deposits and Withdrawals",
      paragraphs: [
        "Deposits can be made through payment methods approved by the Company including bank transfer, credit cards, and cryptocurrencies.",
        "Withdrawal requests are processed during business days and may take 1 to 5 business days depending on the withdrawal method.",
        "The Company reserves the right to request additional documents to verify the user's identity before processing withdrawals.",
        "Fees may apply to some withdrawals depending on the payment method used.",
      ],
    },
    {
      title: "Intellectual Property Rights",
      paragraphs: [
        "All content published on the website including text, graphics, logos, images, and software is the exclusive property of Namaya or licensed to it.",
        "No content from the website may be copied, reproduced, distributed, or published without prior written permission from the Company.",
      ],
    },
    {
      title: "Disclaimer",
      paragraphs: [
        "Information provided on this website is for educational and informational purposes only and does not constitute investment or financial advice.",
        "The Company does not guarantee the accuracy, completeness, or currency of the information provided on the website.",
        "The Company is not responsible for any losses or damages resulting from use of the website or reliance on the information provided.",
      ],
    },
    {
      title: "Modifications",
      paragraphs: [
        "The Company reserves the right to modify these Terms and Conditions at any time. Any modifications will be published on this page.",
        "Continued use of the website after publication of modifications constitutes acceptance of the modified terms.",
      ],
    },
    {
      title: "Governing Law",
      paragraphs: [
        "These Terms and Conditions are governed by the regulations and laws of the Kingdom of Saudi Arabia.",
        "Any disputes arising from these terms shall be resolved before the competent courts in the Kingdom of Saudi Arabia.",
      ],
    },
    {
      title: "Contact",
      paragraphs: [
        "For any inquiries regarding these Terms and Conditions, please contact us via email at Info@namaya.ar or call +966135117700.",
      ],
    },
  ],
};

export default function TermsPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const data = sections[lang];

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-[#001005] pt-[69px] md:pt-[100px] xl:pt-[110px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/blog-hero-bg.png"
            alt=""
            fill
            className="object-cover opacity-80"
          />
        </div>
        <div
          dir={isAr ? "rtl" : undefined}
          className="relative px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px] py-[30px] md:py-[40px]"
        >
          <h1 className="text-white text-[40px] md:text-[55px] xl:text-[65px] font-extrabold leading-[1.3]">
            {heroTitle[lang]}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[64px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[840px] mx-auto flex flex-col gap-[40px]"
        >
          {data.map((section, sIdx) => (
            <div key={sIdx}>
              <h2 className="text-[#0e314c] text-[24px] md:text-[30px] font-bold leading-[1.3] mb-[16px]">
                {sIdx + 1}. {section.title}
              </h2>
              <div className="flex flex-col gap-[12px]">
                {section.paragraphs.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-[#6084a4] text-[15px] md:text-[16px] leading-[1.6]"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
