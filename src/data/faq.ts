import type { Bilingual, FaqItem, FaqCategory } from "@/data/types";

export const homepageFaqItems: Bilingual<FaqItem[]> = {
  en: [
    {
      question: "Can I start with a small amount?",
      answer:
        "Yes, you can start investing with a small amount. Our Mini Account is designed for individuals who want to begin their trading journey with a minimal initial deposit.",
    },
    {
      question: "Who will follow me after I open the wallet?",
      answer:
        "You will have a financial expert who will follow up with you personally on a daily basis, give you recommendations, explain the steps to you, and help you build a plan that suits you.",
    },
    {
      question: "Are my profits guaranteed?",
      answer:
        "While we provide expert guidance and market analysis, profits in trading are not guaranteed. However, our team works closely with you to maximize your potential returns through informed decision-making.",
    },
    {
      question: "How much can I earn per month?",
      answer:
        "Earnings vary based on market conditions, investment amount, and strategy. Our experts will help you set realistic expectations and work toward your financial goals.",
    },
    {
      question: "Is the company licensed and trustworthy?",
      answer:
        "Yes, Namaya is a fully licensed and regulated financial company operating in Saudi Arabia and the Gulf region with over 10 years of experience in global markets.",
    },
    {
      question: "What is the difference between you and the other platforms?",
      answer:
        "Namaya offers Sharia-compliant investment options, dedicated personal financial advisors, daily trading recommendations, and local customer support centers in Saudi Arabia and Dubai.",
    },
  ],
  ar: [
    {
      question: "هل يمكنني البدء بمبلغ صغير؟",
      answer:
        "نعم، يمكنك البدء بالاستثمار بمبلغ صغير. حسابنا المصغر مصمم للأفراد الذين يرغبون في بدء رحلتهم في التداول بإيداع أولي بسيط.",
    },
    {
      question: "من سيتابعني بعد فتح المحفظة؟",
      answer:
        "سيكون لديك خبير مالي يتابع معك شخصياً بشكل يومي، يعطيك توصيات، يشرح لك الخطوات، ويساعدك في بناء خطة تناسبك.",
    },
    {
      question: "هل أرباحي مضمونة؟",
      answer:
        "بينما نقدم إرشادات الخبراء وتحليل السوق، فإن الأرباح في التداول ليست مضمونة. ومع ذلك، يعمل فريقنا معك عن كثب لتعظيم عوائدك المحتملة من خلال اتخاذ قرارات مدروسة.",
    },
    {
      question: "كم يمكنني أن أربح شهرياً؟",
      answer:
        "تختلف الأرباح بناءً على ظروف السوق ومبلغ الاستثمار والاستراتيجية. سيساعدك خبراؤنا في وضع توقعات واقعية والعمل نحو أهدافك المالية.",
    },
    {
      question: "هل الشركة مرخصة وموثوقة؟",
      answer:
        "نعم، نمايا شركة مالية مرخصة ومنظمة بالكامل تعمل في المملكة العربية السعودية ومنطقة الخليج مع أكثر من 10 سنوات من الخبرة في الأسواق العالمية.",
    },
    {
      question: "ما الفرق بينكم وبين المنصات الأخرى؟",
      answer:
        "تقدم نمايا خيارات استثمار متوافقة مع الشريعة، ومستشارين ماليين شخصيين مخصصين، وتوصيات تداول يومية، ومراكز دعم عملاء محلية في السعودية ودبي.",
    },
  ],
};

export const homepageFaqHeading = {
  en: {
    before: "Want to get started, but have ",
    bold: "a few questions?",
  },
  ar: {
    before: "هل ترغب في البدء، ولكن لديك ",
    bold: "بعض الأسئلة؟",
  },
};

export const homepageFaqBadge = {
  label: "FAQ",
  labelAr: "الأسئلة الشائعة",
};

export const faqCategories: Bilingual<FaqCategory[]> = {
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

export const faqPageHeroTitle: Bilingual<string> = {
  en: "Frequently Asked\nQuestions",
  ar: "الأسئلة المتكررة",
};

export const faqPageIntroText = {
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
