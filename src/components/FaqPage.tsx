"use client";

import Image from "next/image";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  name: string;
  questions: FaqItem[];
}

const introText = {
  en: {
    left: "Namaya is dedicated to providing you with all the relevant information to enhance your CFD trading experience.",
    right:
      "The following FAQ page has been created to answer any questions or inquiries you may have while using our web and mobile trading platforms.",
  },
  ar: {
    left: "نامايا ملتزمة بتزويدك بجميع المعلومات ذات الصلة لتعزيز تجربتك في تداول العقود مقابل الفروقات.",
    right:
      "تم إنشاء صفحة الأسئلة الشائعة التالية للإجابة على أي استفسارات أو تساؤلات قد تكون لديك أثناء استخدام منصات التداول على الويب والهاتف المحمول.",
  },
};

const heroTitle = { en: "Frequently Asked\nQuestions", ar: "الأسئلة المتكررة" };

const faqData: { en: FaqCategory[]; ar: FaqCategory[] } = {
  en: [
    {
      name: "Company Profile",
      questions: [
        {
          question: "Who are we?",
          answer:
            "Namaya is a global company specializing in trading and investment solutions, serving clients in Saudi Arabia and the Gulf region. We operate with a team of financial experts with at least 10 years of experience in global markets.",
        },
        {
          question: "Is the company licensed and trustworthy?",
          answer:
            "Namaya is a global company specializing in trading and investment solutions, serving clients in Saudi Arabia and the Gulf region. We operate with a team of financial experts with at least 10 years of experience in global markets.\nTo effectively support our customers, we have local call centers in Saudi Arabia and Dubai, UAE, staffed by a professional team to assist you and answer all your inquiries.",
        },
        {
          question: "Where is the company located?",
          answer:
            "Our headquarters are located in Saudi Arabia, with additional offices and call centers in Dubai, UAE. We serve clients across the Gulf region and beyond.",
        },
        {
          question: "Namaya Awards",
          answer:
            "Namaya has been recognized with multiple industry awards for excellence in trading technology, customer service, and financial innovation across the MENA region.",
        },
        {
          question: "If there are an odd number of blocks",
          answer:
            "Our platform automatically adjusts the layout to accommodate any number of trading blocks, ensuring an optimal experience regardless of your configuration.",
        },
      ],
    },
    {
      name: "Deposit and Withdrawal",
      questions: [
        {
          question: "How do I deposit funds?",
          answer:
            "You can deposit funds via bank transfer, credit/debit card, or cryptocurrency. All deposits are processed securely through our payment partners.",
        },
        {
          question: "How long do withdrawals take?",
          answer:
            "Withdrawal processing times vary: bank transfers take 1-3 business days, card withdrawals take 3-5 business days, and cryptocurrency withdrawals are processed within 24 hours.",
        },
        {
          question: "What are the minimum deposit and withdrawal amounts?",
          answer:
            "The minimum deposit amount depends on your account type. Mini accounts start from $29, Standard from $79, and Gold from $99. Minimum withdrawal is $10.",
        },
      ],
    },
    {
      name: "Trading Platform",
      questions: [
        {
          question: "What trading platforms are available?",
          answer:
            "We offer MetaTrader 4, MetaTrader 5, and our proprietary Namaya Web Trader. All platforms are available on desktop, web, and mobile devices.",
        },
        {
          question: "How do I place a trade?",
          answer:
            "Select your desired instrument, choose your lot size, set your stop-loss and take-profit levels, and click Buy or Sell to execute your trade.",
        },
        {
          question: "Can I use automated trading?",
          answer:
            "Yes, our platforms support Expert Advisors (EAs) and algorithmic trading. You can develop your own strategies or use pre-built solutions from our marketplace.",
        },
      ],
    },
    {
      name: "Financial Instruments",
      questions: [
        {
          question: "What instruments can I trade?",
          answer:
            "We offer a wide range of instruments including Forex pairs, commodities (gold, silver, oil), indices, stocks CFDs, and cryptocurrencies.",
        },
        {
          question: "What are the trading hours?",
          answer:
            "Forex markets are available 24/5 from Sunday 5PM to Friday 5PM EST. Commodity and index trading hours vary by instrument.",
        },
        {
          question: "What leverage is available?",
          answer:
            "Leverage varies by instrument and account type, ranging from 1:30 to 1:500. Higher leverage is available for professional accounts.",
        },
      ],
    },
    {
      name: "Trading Terms",
      questions: [
        {
          question: "What is a spread?",
          answer:
            "A spread is the difference between the bid and ask price of an instrument. Our spreads start from as low as 0.1 pips on major currency pairs.",
        },
        {
          question: "What is margin?",
          answer:
            "Margin is the amount of funds required to open and maintain a leveraged trading position. It acts as collateral for your trades.",
        },
        {
          question: "What is a pip?",
          answer:
            "A pip (percentage in point) is the smallest price movement in a currency pair. For most pairs, it represents 0.0001 of the quote currency.",
        },
      ],
    },
  ],
  ar: [
    {
      name: "ملف الشركة",
      questions: [
        {
          question: "من نحن؟",
          answer:
            "نامايا هي شركة عالمية متخصصة في حلول التجارة والاستثمار، تقدم خدماتها للعملاء في المملكة العربية السعودية ومنطقة الخليج. نحن نعمل بفريق من الخبراء الماليين الذين لديهم خبرة لا تقل عن 10 سنوات في الأسواق العالمية.",
        },
        {
          question: "هل الشركة مرخصة وموثوقة؟",
          answer:
            "نامايا هي شركة عالمية متخصصة في حلول التجارة والاستثمار، تقدم خدماتها للعملاء في المملكة العربية السعودية ومنطقة الخليج. نحن نعمل بفريق من الخبراء الماليين الذين لديهم خبرة لا تقل عن 10 سنوات في الأسواق العالمية.\nلدعم عملائنا بفعالية، لدينا مراكز اتصال محلية في المملكة العربية السعودية ودبي، الإمارات العربية المتحدة، بفريق محترف لمساعدتك والإجابة على جميع استفساراتك.",
        },
        {
          question: "أين تقع الشركة؟",
          answer:
            "يقع مقرنا الرئيسي في المملكة العربية السعودية، مع مكاتب إضافية ومراكز اتصال في دبي، الإمارات العربية المتحدة. نحن نخدم العملاء في منطقة الخليج وخارجها.",
        },
        {
          question: "جوائز نامايا",
          answer:
            "حصلت نامايا على العديد من الجوائز في القطاع للتميز في تكنولوجيا التداول وخدمة العملاء والابتكار المالي في منطقة الشرق الأوسط وشمال أفريقيا.",
        },
        {
          question: "إذا كان هناك عدد فردي من الكتل",
          answer:
            "تقوم منصتنا تلقائيًا بتعديل التخطيط لاستيعاب أي عدد من كتل التداول، مما يضمن تجربة مثالية بغض النظر عن تكوينك.",
        },
      ],
    },
    {
      name: "الإيداع والسحب",
      questions: [
        {
          question: "كيف أقوم بإيداع الأموال؟",
          answer:
            "يمكنك إيداع الأموال عبر التحويل المصرفي أو بطاقة الائتمان/الخصم أو العملات الرقمية. تتم معالجة جميع الودائع بشكل آمن من خلال شركائنا في الدفع.",
        },
        {
          question: "كم تستغرق عمليات السحب؟",
          answer:
            "تختلف أوقات معالجة السحب: التحويلات المصرفية تستغرق 1-3 أيام عمل، سحب البطاقات يستغرق 3-5 أيام عمل، ويتم معالجة سحب العملات الرقمية خلال 24 ساعة.",
        },
        {
          question: "ما هي الحدود الدنيا للإيداع والسحب؟",
          answer:
            "يعتمد الحد الأدنى للإيداع على نوع حسابك. تبدأ الحسابات المصغرة من 3,750 ر.س، والقياسية من 18,750 ر.س، والذهبية من 37,750 ر.س.",
        },
      ],
    },
    {
      name: "منصة التداول",
      questions: [
        {
          question: "ما هي منصات التداول المتاحة؟",
          answer:
            "نحن نقدم MetaTrader 4 و MetaTrader 5 ومنصة نامايا للتداول عبر الويب. جميع المنصات متاحة على سطح المكتب والويب والأجهزة المحمولة.",
        },
        {
          question: "كيف أقوم بتنفيذ صفقة؟",
          answer:
            "اختر الأداة المطلوبة، حدد حجم اللوت، اضبط مستويات وقف الخسارة وجني الأرباح، وانقر على شراء أو بيع لتنفيذ صفقتك.",
        },
        {
          question: "هل يمكنني استخدام التداول الآلي؟",
          answer:
            "نعم، تدعم منصاتنا المستشارين الخبراء والتداول الخوارزمي. يمكنك تطوير استراتيجياتك الخاصة أو استخدام حلول جاهزة من سوقنا.",
        },
      ],
    },
    {
      name: "الأدوات المالية",
      questions: [
        {
          question: "ما هي الأدوات التي يمكنني تداولها؟",
          answer:
            "نحن نقدم مجموعة واسعة من الأدوات بما في ذلك أزواج الفوركس والسلع (الذهب والفضة والنفط) والمؤشرات وعقود الفروقات على الأسهم والعملات الرقمية.",
        },
        {
          question: "ما هي ساعات التداول؟",
          answer:
            "أسواق الفوركس متاحة 24/5 من الأحد 5 مساءً إلى الجمعة 5 مساءً بتوقيت شرق أمريكا. تختلف ساعات تداول السلع والمؤشرات حسب الأداة.",
        },
        {
          question: "ما هي الرافعة المالية المتاحة؟",
          answer:
            "تختلف الرافعة المالية حسب الأداة ونوع الحساب، وتتراوح من 1:30 إلى 1:500. تتوفر رافعة مالية أعلى للحسابات المهنية.",
        },
      ],
    },
    {
      name: "شروط التداول",
      questions: [
        {
          question: "ما هو السبريد؟",
          answer:
            "السبريد هو الفرق بين سعر العرض وسعر الطلب للأداة. تبدأ فروق الأسعار لدينا من 0.1 نقطة على أزواج العملات الرئيسية.",
        },
        {
          question: "ما هو الهامش؟",
          answer:
            "الهامش هو مقدار الأموال المطلوبة لفتح مركز تداول برافعة مالية والحفاظ عليه. يعمل كضمان لصفقاتك.",
        },
        {
          question: "ما هي النقطة؟",
          answer:
            "النقطة (النسبة المئوية في النقطة) هي أصغر حركة سعرية في زوج العملات. بالنسبة لمعظم الأزواج، تمثل 0.0001 من عملة التسعير.",
        },
      ],
    },
  ],
};

export default function FaqPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const categories = faqData[lang];
  const intro = introText[lang];

  const [activeCategory, setActiveCategory] = useState(0);
  const [openQuestion, setOpenQuestion] = useState<number | null>(1); // 2nd question open by default

  const currentCategory = categories[activeCategory];

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
          <h1 className="text-white text-[40px] md:text-[55px] xl:text-[65px] font-extrabold leading-[1.3] whitespace-pre-line">
            {heroTitle[lang]}
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white pt-[40px] md:pt-[50px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[40px]">
            <p className="text-[#12953d] text-[14px] md:text-[15px] leading-[1.5]">
              {intro.left}
            </p>
            <p className="text-[#6084a4] text-[14px] md:text-[15px] leading-[1.5]">
              {intro.right}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-[30px] md:gap-[40px]">
            {/* Sidebar Categories */}
            <div className="md:w-[260px] shrink-0">
              <div className="flex flex-row md:flex-col gap-[8px] overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveCategory(i);
                      setOpenQuestion(null);
                    }}
                    className={`px-[24px] py-[14px] rounded-[10px] text-[14px] md:text-[15px] font-medium whitespace-nowrap md:whitespace-normal text-start transition-all cursor-pointer ${
                      activeCategory === i
                        ? "bg-[#12953d] text-white"
                        : "bg-[#f9f9f9] text-[#0e314c] border border-[#e5e7eb] hover:bg-[#f0f0f0]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="flex-1">
              {/* Category Title */}
              <h2 className="text-[#0e314c] text-[24px] md:text-[28px] font-bold leading-[1.3] mb-[24px]">
                {currentCategory.name}
              </h2>

              {/* Accordion */}
              <div className="flex flex-col gap-[16px]">
                {currentCategory.questions.map((item, i) => {
                  const isOpen = openQuestion === i;
                  return (
                    <div
                      key={i}
                      className={`rounded-[12px] border transition-colors ${
                        isOpen
                          ? "border-[#12953d] bg-[rgba(18,149,61,0.03)]"
                          : "border-[#e5e7eb] bg-white"
                      }`}
                    >
                      <button
                        onClick={() =>
                          setOpenQuestion(isOpen ? null : i)
                        }
                        className="w-full flex items-center justify-between px-[24px] py-[18px] cursor-pointer"
                      >
                        <span className="text-[#0e314c] text-[16px] md:text-[18px] font-semibold leading-[1.4] text-start">
                          {item.question}
                        </span>
                        <div
                          className={`w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isOpen
                              ? "bg-[#12953d]"
                              : "bg-[#12953d]"
                          }`}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-[24px] pb-[20px]">
                          <p className="text-[#6084a4] text-[14px] md:text-[15px] leading-[1.6] whitespace-pre-line">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
