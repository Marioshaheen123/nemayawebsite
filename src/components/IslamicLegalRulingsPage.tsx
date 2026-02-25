"use client";

import Image from "next/image";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

interface RulingItem {
  title: string;
  question: string;
  answer: string;
  mufti: string;
}

interface RulingSection {
  name: string;
  items: RulingItem[];
}

const heroTitle = {
  en: "Islamic Legal Rulings",
  ar: "الأحكام القانونية الإسلامية",
};

const sectionLabels = {
  en: { question: "Question:", answer: "Answer:", mufti: "Mufti:" },
  ar: { question: "السؤال:", answer: "الإجابة:", mufti: "المفتي:" },
};

const rulingsData: { en: RulingSection[]; ar: RulingSection[] } = {
  ar: [
    {
      name: "فتاوى اللجنة الشرعية",
      items: [
        {
          title: "الزكاة على الأسهم",
          question:
            "ما حكم الزكاة على الأسهم المملوكة في شركة نمايا؟ وكيف يتم حسابها؟",
          answer:
            "تجب الزكاة على الأسهم إذا بلغت النصاب وحال عليها الحول. وتُحسب الزكاة بنسبة 2.5% من القيمة السوقية للأسهم عند حلول موعد الزكاة، مع مراعاة نية المالك من اقتنائها سواء كانت للتجارة أو للاستثمار طويل الأجل.",
          mufti: "د. إبراهيم شاشو",
        },
        {
          title: "تسجيل الأسهم باسم شخص آخر",
          question:
            "يملك شخص أسهماً في شركة نمايا، وقام شخص آخر بإيداع قيمة ثلاثة أسهم في حساب الشخص الأول بشرط أن يأخذ الأرباح من الأسهم الثلاثة لنفسه. فهل هذا جائز؟",
          answer:
            "نمايا شركة عالمية متخصصة في حلول التداول والاستثمار، تخدم العملاء في المملكة العربية السعودية ومنطقة الخليج. نحن نعمل بفريق من الخبراء الماليين الذين لديهم خبرة لا تقل عن 10 سنوات في الأسواق العالمية.\n\nلدعم عملائنا بفعالية، لدينا مراكز اتصال محلية في المملكة العربية السعودية ودبي، الإمارات العربية المتحدة، بفريق محترف لمساعدتك والإجابة على جميع استفساراتك.",
          mufti: "د. إبراهيم شاشو",
        },
        {
          title: "بيع الأسهم بشرط أن تبقى باسم المالك حتى يتم سداد الدين",
          question:
            "ما حكم بيع الأسهم بشرط بقائها مسجلة باسم البائع حتى يتم سداد كامل الثمن من المشتري؟",
          answer:
            "يجوز بيع الأسهم مع اشتراط بقاء التسجيل باسم البائع كضمان حتى سداد الثمن، بشرط أن يكون البيع منجزاً وأن تنتقل ملكية الأسهم فعلياً للمشتري من حيث الأرباح والخسائر، وأن يكون التسجيل مجرد ضمان لحق البائع في استيفاء الثمن.",
          mufti: "د. إبراهيم شاشو",
        },
        {
          title: "نصيب الشريك من الأرباح",
          question:
            "كيف يتم تحديد نصيب كل شريك من أرباح الأسهم في شركة نمايا؟",
          answer:
            "يتم توزيع الأرباح على الشركاء بحسب نسبة ملكيتهم في الأسهم. فمن يملك نسبة أكبر من الأسهم يحصل على نصيب أكبر من الأرباح، وذلك وفقاً لقاعدة الغنم بالغرم، أي أن الربح يكون بقدر المال المستثمر.",
          mufti: "د. إبراهيم شاشو",
        },
        {
          title: "البيع بالتقسيط",
          question: "ما حكم البيع بالتقسيط في المعاملات المالية الإسلامية؟",
          answer:
            "البيع بالتقسيط جائز شرعاً بشرط أن يكون الثمن معلوماً والأقساط محددة، وألا يكون هناك زيادة في الثمن مقابل التأخير بعد العقد. ويجب أن يتم الاتفاق على الثمن الإجمالي وعدد الأقساط ومواعيدها عند إبرام العقد.",
          mufti: "د. إبراهيم شاشو",
        },
        {
          title:
            "أثر جائحة كورونا على أحكام المعاملات والعقود والالتزامات المالية",
          question:
            "ما أثر جائحة كورونا على أحكام المعاملات والعقود والالتزامات المالية من الناحية الشرعية؟",
          answer:
            "تُعد جائحة كورونا من الظروف الطارئة التي تؤثر على تنفيذ العقود والالتزامات المالية. ويجوز شرعاً تأجيل الالتزامات أو تعديلها بما يحقق العدل بين الأطراف، مع مراعاة قاعدة لا ضرر ولا ضرار.",
          mufti: "د. إبراهيم شاشو",
        },
        {
          title: "التحوط في المعاملات المالية: القواعد والأنظمة",
          question:
            "ما هي القواعد والأنظمة الشرعية المتعلقة بالتحوط في المعاملات المالية؟",
          answer:
            "يجوز التحوط في المعاملات المالية بالوسائل المشروعة كالتأمين التعاوني والمشاركة في المخاطر، مع تجنب المشتقات المالية المحرمة كالعقود الآجلة القائمة على الربا أو الغرر المفرط.",
          mufti: "د. إبراهيم شاشو",
        },
        {
          title: "عمليات التحوط في المؤسسات المالية الإسلامية",
          question:
            "كيف تتم عمليات التحوط في المؤسسات المالية الإسلامية وما ضوابطها الشرعية؟",
          answer:
            "تعتمد المؤسسات المالية الإسلامية على أدوات التحوط المشروعة مثل عقود السلم والاستصناع والمرابحة، مع الالتزام بضوابط الشريعة الإسلامية وتجنب الغرر والميسر.",
          mufti: "د. إبراهيم شاشو",
        },
        {
          title: "التضخم وانخفاض قيمة العملة",
          question:
            "ما الحكم الشرعي في التعامل مع التضخم وانخفاض قيمة العملة وأثره على العقود المالية؟",
          answer:
            "يُراعى في العقود المالية أثر التضخم وانخفاض قيمة العملة، ويجوز ربط العقود بمؤشرات اقتصادية لحماية حقوق الأطراف، مع مراعاة العدل والإنصاف في التعاملات.",
          mufti: "د. إبراهيم شاشو",
        },
      ],
    },
    {
      name: "الأكاديمية الإسلامية الدولية للفقه",
      items: [
        {
          title:
            "دور مجالس الفقه الإسلامي في توجيه تقدم المؤسسات المالية الإسلامية: الآليات والسبل",
          question:
            "ما هو دور مجالس الفقه الإسلامي في توجيه وتطوير المؤسسات المالية الإسلامية؟",
          answer:
            "تلعب مجالس الفقه الإسلامي دوراً محورياً في توجيه المؤسسات المالية الإسلامية من خلال إصدار الفتاوى والقرارات الشرعية، ومراجعة المنتجات المالية، وتطوير المعايير الشرعية التي تضمن التزام هذه المؤسسات بأحكام الشريعة الإسلامية.",
          mufti: "مجمع الفقه الإسلامي الدولي",
        },
        {
          title:
            "دور الرقابة الشرعية في تنظيم عمليات البنوك الإسلامية: أهدافها وشروطها وطبيعة عملها",
          question:
            "ما هي أهداف الرقابة الشرعية وشروطها وطبيعة عملها في تنظيم عمليات البنوك الإسلامية؟",
          answer:
            "تهدف الرقابة الشرعية إلى التأكد من التزام البنوك الإسلامية بأحكام الشريعة في جميع معاملاتها. وتشمل مهامها مراجعة العقود والمنتجات المالية، وإصدار الفتاوى، والإشراف على تطبيق المعايير الشرعية، وتدريب الموظفين على أحكام المعاملات الإسلامية.",
          mufti: "مجمع الفقه الإسلامي الدولي",
        },
      ],
    },
    {
      name: "فتاوى المعاملات المالية",
      items: [
        {
          title:
            "تضمين البنك ضد المخاطر الناجمة عن سوء استخدام أموال العملاء وتعويضهم عن الأضرار الناتجة",
          question:
            "ما حكم تضمين البنك المسؤولية عن المخاطر الناجمة عن سوء استخدام أموال العملاء؟",
          answer:
            "يتحمل البنك المسؤولية الشرعية والقانونية عن حماية أموال العملاء، ويجب عليه تعويضهم في حال تعرض أموالهم للضرر نتيجة سوء الإدارة أو الإهمال، وذلك وفقاً لقواعد الضمان في الفقه الإسلامي.",
          mufti: "هيئة المحاسبة والمراجعة للمؤسسات المالية الإسلامية",
        },
        {
          title: "وقف الأسهم والسندات وحقوق الملكية الفكرية والمنافع",
          question:
            "ما حكم وقف الأسهم والسندات وحقوق الملكية الفكرية والمنافع في الشريعة الإسلامية؟",
          answer:
            "يجوز وقف الأسهم والسندات المباحة وحقوق الملكية الفكرية والمنافع، بشرط أن تكون مملوكة ملكاً تاماً للواقف، وأن يكون الوقف في مصلحة مشروعة، مع مراعاة الشروط الشرعية للوقف.",
          mufti: "هيئة المحاسبة والمراجعة للمؤسسات المالية الإسلامية",
        },
        {
          title: "الضمان التجاري",
          question:
            "ما هي أحكام الضمان التجاري في المعاملات المالية الإسلامية؟",
          answer:
            "الضمان التجاري جائز شرعاً وهو التزام شخص بأداء ما وجب على غيره من حق مالي. ويشترط فيه أن يكون الدين معلوماً، وأن يكون الضامن أهلاً للتبرع، وألا يأخذ الضامن أجراً على ضمانه لأنه من عقود التبرعات.",
          mufti: "هيئة المحاسبة والمراجعة للمؤسسات المالية الإسلامية",
        },
      ],
    },
  ],
  en: [
    {
      name: "Sharia Committee Rulings",
      items: [
        {
          title: "Zakat on Shares",
          question:
            "What is the ruling on Zakat for shares owned in Namaya Company? How is it calculated?",
          answer:
            "Zakat is obligatory on shares when they reach the Nisab threshold and a full lunar year has passed. Zakat is calculated at 2.5% of the market value of shares at the time Zakat is due, taking into account the owner's intention for holding them, whether for trading or long-term investment.",
          mufti: "Dr. Ibrahim Shasho",
        },
        {
          title: "Registering Shares in Another Person's Name",
          question:
            "A person owns shares in Namaya Company, and another person deposited the value of three shares into the first person's account on the condition that he takes the profits from the three shares for himself. Is this permissible?",
          answer:
            "Namaya is a global company specializing in trading and investment solutions, serving clients in Saudi Arabia and the Gulf region. We operate with a team of financial experts with at least 10 years of experience in global markets.\n\nTo effectively support our customers, we have local call centers in Saudi Arabia and Dubai, UAE, staffed by a professional team to assist you and answer all your inquiries.",
          mufti: "Dr. Ibrahim Shasho",
        },
        {
          title:
            "Selling Shares with Condition to Remain in Owner's Name Until Debt is Paid",
          question:
            "What is the ruling on selling shares with the condition that they remain registered in the seller's name until the full price is paid by the buyer?",
          answer:
            "It is permissible to sell shares with the condition that the registration remains in the seller's name as security until the price is paid, provided that the sale is concluded and the ownership of the shares effectively transfers to the buyer in terms of profits and losses, and that the registration is merely a guarantee for the seller's right to receive the price.",
          mufti: "Dr. Ibrahim Shasho",
        },
        {
          title: "Partner's Share of Profits",
          question:
            "How is each partner's share of stock profits determined in Namaya Company?",
          answer:
            "Profits are distributed to partners according to their ownership percentage in shares. Those who own a larger percentage of shares receive a larger share of profits, in accordance with the principle of 'al-ghunm bil-ghurm' (profit follows risk), meaning profit is proportional to the invested capital.",
          mufti: "Dr. Ibrahim Shasho",
        },
        {
          title: "Installment Sales",
          question:
            "What is the ruling on installment sales in Islamic financial transactions?",
          answer:
            "Installment sales are permissible in Sharia provided that the price is known and installments are specified, and there is no increase in price for delay after the contract. The total price, number of installments, and their due dates must be agreed upon at the time of the contract.",
          mufti: "Dr. Ibrahim Shasho",
        },
        {
          title:
            "Impact of COVID-19 on Financial Transactions, Contracts and Obligations",
          question:
            "What is the Sharia impact of COVID-19 on financial transactions, contracts and obligations?",
          answer:
            "The COVID-19 pandemic is considered an extraordinary circumstance affecting the execution of contracts and financial obligations. It is permissible in Sharia to postpone or modify obligations to achieve justice between parties, taking into account the principle of 'no harm and no reciprocal harm'.",
          mufti: "Dr. Ibrahim Shasho",
        },
        {
          title: "Hedging in Financial Transactions: Rules and Regulations",
          question:
            "What are the Sharia rules and regulations related to hedging in financial transactions?",
          answer:
            "Hedging in financial transactions is permissible through legitimate means such as cooperative insurance and risk sharing, while avoiding prohibited financial derivatives such as forward contracts based on usury or excessive uncertainty.",
          mufti: "Dr. Ibrahim Shasho",
        },
        {
          title: "Hedging Operations in Islamic Financial Institutions",
          question:
            "How are hedging operations conducted in Islamic financial institutions and what are their Sharia controls?",
          answer:
            "Islamic financial institutions rely on legitimate hedging tools such as Salam, Istisna'a, and Murabaha contracts, while complying with Islamic Sharia controls and avoiding Gharar (uncertainty) and Maysir (gambling).",
          mufti: "Dr. Ibrahim Shasho",
        },
        {
          title: "Inflation and Currency Depreciation",
          question:
            "What is the Sharia ruling on dealing with inflation and currency depreciation and its impact on financial contracts?",
          answer:
            "The impact of inflation and currency depreciation is considered in financial contracts, and it is permissible to link contracts to economic indicators to protect the rights of parties, while observing justice and fairness in transactions.",
          mufti: "Dr. Ibrahim Shasho",
        },
      ],
    },
    {
      name: "International Islamic Fiqh Academy",
      items: [
        {
          title:
            "Role of Islamic Fiqh Councils in Guiding the Progress of Islamic Financial Institutions: Mechanisms and Means",
          question:
            "What is the role of Islamic Fiqh councils in guiding and developing Islamic financial institutions?",
          answer:
            "Islamic Fiqh councils play a pivotal role in guiding Islamic financial institutions through issuing fatwas and Sharia decisions, reviewing financial products, and developing Sharia standards that ensure these institutions comply with Islamic Sharia rulings.",
          mufti: "International Islamic Fiqh Academy",
        },
        {
          title:
            "Role of Sharia Supervision in Regulating Islamic Bank Operations: Objectives, Conditions and Nature of Work",
          question:
            "What are the objectives, conditions and nature of Sharia supervision in regulating Islamic bank operations?",
          answer:
            "Sharia supervision aims to ensure Islamic banks comply with Sharia rulings in all their transactions. Its tasks include reviewing contracts and financial products, issuing fatwas, supervising the implementation of Sharia standards, and training employees on Islamic transaction rulings.",
          mufti: "International Islamic Fiqh Academy",
        },
      ],
    },
    {
      name: "Financial Transaction Rulings",
      items: [
        {
          title:
            "Bank Liability for Risks from Misuse of Client Funds and Compensation for Resulting Damages",
          question:
            "What is the ruling on holding the bank liable for risks arising from misuse of client funds?",
          answer:
            "The bank bears Sharia and legal responsibility for protecting client funds and must compensate them if their funds are harmed as a result of mismanagement or negligence, in accordance with the rules of guarantee in Islamic jurisprudence.",
          mufti:
            "Accounting and Auditing Organization for Islamic Financial Institutions",
        },
        {
          title:
            "Endowment of Shares, Bonds, Intellectual Property Rights and Benefits",
          question:
            "What is the ruling on endowing shares, bonds, intellectual property rights and benefits in Islamic Sharia?",
          answer:
            "It is permissible to endow permissible shares, bonds, intellectual property rights and benefits, provided they are fully owned by the endower, and the endowment serves a legitimate purpose, while observing the Sharia conditions for endowment.",
          mufti:
            "Accounting and Auditing Organization for Islamic Financial Institutions",
        },
        {
          title: "Commercial Guarantee",
          question:
            "What are the rulings on commercial guarantee in Islamic financial transactions?",
          answer:
            "Commercial guarantee is permissible in Sharia and is a person's commitment to fulfill another's financial obligation. It requires that the debt be known, the guarantor be eligible for donation, and the guarantor does not take a fee for the guarantee as it is a form of charitable contract.",
          mufti:
            "Accounting and Auditing Organization for Islamic Financial Institutions",
        },
      ],
    },
  ],
};

export default function IslamicLegalRulingsPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const sections = rulingsData[lang];
  const labels = sectionLabels[lang];

  const [openItems, setOpenItems] = useState<Record<string, number | null>>({
    "0": 1,
  });

  const toggleItem = (sectionIdx: number, itemIdx: number) => {
    const key = String(sectionIdx);
    setOpenItems((prev) => ({
      ...prev,
      [key]: prev[key] === itemIdx ? null : itemIdx,
    }));
  };

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

      {/* Rulings Content */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[64px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[840px] mx-auto flex flex-col gap-[40px]"
        >
          {sections.map((section, sIdx) => (
            <div
              key={sIdx}
              className="bg-[#f9f9f9] rounded-[25px] p-[20px] md:p-[30px]"
            >
              {/* Section Title */}
              <h2 className="text-[#0e314c] text-[24px] md:text-[35px] font-bold leading-[38.5px] text-start mb-[24px]">
                {section.name}
              </h2>

              {/* Accordion Items */}
              <div className="flex flex-col gap-[24px]">
                {section.items.map((item, iIdx) => {
                  const isOpen = openItems[String(sIdx)] === iIdx;
                  return (
                    <div
                      key={iIdx}
                      className={`bg-white rounded-[25px] border transition-colors ${
                        isOpen
                          ? "border-[#12953d]"
                          : "border-[#cacceb]"
                      }`}
                    >
                      {/* Header */}
                      <button
                        onClick={() => toggleItem(sIdx, iIdx)}
                        className="w-full flex items-center gap-[16px] p-[20px] md:p-[25px] cursor-pointer"
                      >
                        {/* Chevron Circle */}
                        <div className="w-[40px] h-[40px] md:w-[44px] md:h-[44px] rounded-full bg-[#12953d] flex items-center justify-center shrink-0">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 6"
                            fill="none"
                            className={`transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            <path
                              d="M1 1L6 5L11 1"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        {/* Title */}
                        <span className="flex-1 text-[#0e314c] text-[16px] md:text-[20px] font-semibold leading-[24px] text-start">
                          {item.title}
                        </span>
                      </button>

                      {/* Expanded Content */}
                      {isOpen && (
                        <div className="px-[20px] md:px-[25px] pb-[20px] md:pb-[25px] flex flex-col gap-[16px]">
                          {/* Question */}
                          <div className="flex flex-col gap-[9px]">
                            <p className="text-[#0e314c] text-[15px] md:text-[17px] font-bold leading-[20.4px]">
                              {labels.question}
                            </p>
                            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[28px]">
                              {item.question}
                            </p>
                          </div>

                          {/* Answer */}
                          <div className="flex flex-col gap-[9px]">
                            <p className="text-[#0e314c] text-[15px] md:text-[17px] font-bold leading-[20.4px]">
                              {labels.answer}
                            </p>
                            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.4] whitespace-pre-line">
                              {item.answer}
                            </p>
                          </div>

                          {/* Mufti */}
                          <div className="flex flex-col gap-[9px]">
                            <p className="text-[#0e314c] text-[15px] md:text-[17px] font-bold leading-[20.4px]">
                              {labels.mufti}
                            </p>
                            <p className="text-[#6084a4] text-[14px] md:text-[16px] leading-[1.4]">
                              {item.mufti}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
