"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

const backLabel = {
  en: "Back to Financial Assets",
  ar: "العودة إلى الأصول المالية",
};

const ctaSection = {
  en: {
    title: "Ready to Start Trading?",
    desc: "Open your account now and start trading with competitive conditions.",
    btn: "Open Account",
  },
  ar: {
    title: "مستعد لبدء التداول؟",
    desc: "افتح حسابك الآن وابدأ التداول بشروط تنافسية.",
    btn: "افتح حسابك",
  },
};

const tableHeaders = {
  en: {
    instrument: "Instrument",
    symbol: "Symbol",
    spread: "Spread",
    leverage: "Leverage",
    hours: "Trading Hours",
  },
  ar: {
    instrument: "الأداة",
    symbol: "الرمز",
    spread: "الفروقات",
    leverage: "الرافعة المالية",
    hours: "ساعات التداول",
  },
};

const sectionTitles = {
  en: {
    instruments: "Available Instruments",
    whatIs: "What is",
    whyTrade: "Why Trade {name} with Namaya?",
    howToStart: "How to Start Trading",
    faq: "Frequently Asked Questions",
  },
  ar: {
    instruments: "الأدوات المتاحة",
    whatIs: "ما هو",
    whyTrade: "لماذا تتداول {name} مع نمايا؟",
    howToStart: "كيف تبدأ التداول",
    faq: "الأسئلة الشائعة",
  },
};

const howToStartSteps = {
  en: [
    {
      step: "1",
      title: "Open an Account",
      desc: "Register in minutes by completing the online form. Verify your identity and get approved quickly.",
    },
    {
      step: "2",
      title: "Fund Your Account",
      desc: "Deposit using bank transfer, credit card, or e-wallets. Funds are available instantly with most methods.",
    },
    {
      step: "3",
      title: "Start Trading",
      desc: "Choose your instruments, analyze the market using our tools, and place your first trade with confidence.",
    },
  ],
  ar: [
    {
      step: "1",
      title: "افتح حساب",
      desc: "سجّل في دقائق من خلال إكمال النموذج الإلكتروني. تحقق من هويتك واحصل على الموافقة بسرعة.",
    },
    {
      step: "2",
      title: "موّل حسابك",
      desc: "أودع عبر التحويل البنكي أو بطاقة الائتمان أو المحافظ الإلكترونية. الأموال متاحة فورًا مع معظم الطرق.",
    },
    {
      step: "3",
      title: "ابدأ التداول",
      desc: "اختر أدواتك وحلّل السوق باستخدام أدواتنا وضع صفقتك الأولى بثقة.",
    },
  ],
};

interface Instrument {
  name: string;
  symbol: string;
  spread: string;
  leverage: string;
  hours: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface AssetDetail {
  slug: string;
  name: string;
  headline: string;
  description: string;
  image: string;
  instruments: Instrument[];
  whatIs: string[];
  advantages: { title: string; desc: string }[];
  faq: FaqItem[];
}

const assets: { en: AssetDetail[]; ar: AssetDetail[] } = {
  ar: [
    {
      slug: "forex",
      name: "الفوركس",
      headline: "تداول العملات الأجنبية",
      description:
        "تداول أزواج العملات الرئيسية والثانوية والنادرة في أكبر سوق مالي في العالم بحجم تداول يومي يتجاوز 6 تريليون دولار. استفد من السيولة العالية والتداول على مدار 24 ساعة خلال 5 أيام في الأسبوع.",
      image: "/images/asset-forex.jpg",
      instruments: [
        { name: "يورو / دولار أمريكي", symbol: "EUR/USD", spread: "0.1", leverage: "1:500", hours: "24/5" },
        { name: "جنيه إسترليني / دولار", symbol: "GBP/USD", spread: "0.3", leverage: "1:500", hours: "24/5" },
        { name: "دولار / ين ياباني", symbol: "USD/JPY", spread: "0.2", leverage: "1:500", hours: "24/5" },
        { name: "دولار أسترالي / دولار", symbol: "AUD/USD", spread: "0.4", leverage: "1:400", hours: "24/5" },
        { name: "دولار / فرنك سويسري", symbol: "USD/CHF", spread: "0.4", leverage: "1:400", hours: "24/5" },
        { name: "دولار / دولار كندي", symbol: "USD/CAD", spread: "0.5", leverage: "1:400", hours: "24/5" },
        { name: "يورو / جنيه إسترليني", symbol: "EUR/GBP", spread: "0.5", leverage: "1:400", hours: "24/5" },
        { name: "يورو / ين ياباني", symbol: "EUR/JPY", spread: "0.6", leverage: "1:400", hours: "24/5" },
        { name: "نيوزيلندي / دولار", symbol: "NZD/USD", spread: "0.6", leverage: "1:300", hours: "24/5" },
        { name: "يورو / دولار أسترالي", symbol: "EUR/AUD", spread: "0.8", leverage: "1:300", hours: "24/5" },
      ],
      whatIs: [
        "سوق الفوركس (سوق الصرف الأجنبي) هو أكبر سوق مالي في العالم حيث يتم تداول العملات على مدار الساعة. يتجاوز حجم التداول اليومي 6 تريليون دولار، مما يجعله أكثر الأسواق سيولة على الإطلاق.",
        "يعمل سوق الفوركس من خلال تبادل عملة مقابل أخرى في أزواج مثل EUR/USD أو GBP/USD. يستفيد المتداولون من تحركات أسعار الصرف لتحقيق أرباح سواء ارتفعت الأسعار أو انخفضت.",
        "يتميز سوق الفوركس بإمكانية التداول على مدار 24 ساعة خلال 5 أيام في الأسبوع، والسيولة العالية التي تضمن تنفيذ الأوامر بسرعة، وإمكانية استخدام الرافعة المالية لتعظيم القوة الشرائية.",
      ],
      advantages: [
        { title: "فروقات سعرية ضيقة", desc: "فروقات تبدأ من 0.1 نقطة على الأزواج الرئيسية لتقليل تكاليف التداول إلى أقصى حد." },
        { title: "رافعة مالية مرنة", desc: "رافعة مالية تصل حتى 1:500 تمكنك من فتح صفقات كبيرة برأس مال صغير." },
        { title: "تنفيذ فائق السرعة", desc: "تنفيذ الأوامر بسرعة أقل من 30 مللي ثانية مع أقل نسبة انزلاق سعري." },
        { title: "تداول على مدار الساعة", desc: "تداول 24 ساعة في اليوم، 5 أيام في الأسبوع دون انقطاع." },
      ],
      faq: [
        { q: "ما هو الحد الأدنى للإيداع لتداول الفوركس؟", a: "يمكنك البدء بإيداع 100 دولار فقط وفتح صفقات على أزواج العملات الرئيسية والثانوية." },
        { q: "هل يمكنني تداول الفوركس على الهاتف المحمول؟", a: "نعم، توفر نمايا تطبيقات تداول متقدمة على iOS و Android بالإضافة إلى منصات MetaTrader 4 و 5." },
        { q: "ما هي المخاطر المرتبطة بتداول الفوركس؟", a: "تداول الفوركس ينطوي على مخاطر عالية بسبب الرافعة المالية. ننصح باستخدام أوامر وقف الخسارة وعدم المخاطرة بأكثر مما يمكنك تحمل خسارته." },
      ],
    },
    {
      slug: "commodities",
      name: "السلع",
      headline: "تداول السلع والمعادن الثمينة",
      description:
        "نوّع محفظتك الاستثمارية من خلال تداول السلع الأكثر طلبًا في العالم. من الذهب والفضة إلى النفط والغاز الطبيعي، استفد من تحركات أسعار السلع العالمية بشروط تنافسية.",
      image: "/images/asset-commodities.jpg",
      instruments: [
        { name: "الذهب", symbol: "XAU/USD", spread: "0.3", leverage: "1:200", hours: "23/5" },
        { name: "الفضة", symbol: "XAG/USD", spread: "0.03", leverage: "1:200", hours: "23/5" },
        { name: "النفط الخام", symbol: "CL", spread: "0.03", leverage: "1:100", hours: "23/5" },
        { name: "الغاز الطبيعي", symbol: "NG", spread: "0.01", leverage: "1:100", hours: "23/5" },
        { name: "البلاتين", symbol: "XPT/USD", spread: "1.5", leverage: "1:100", hours: "23/5" },
        { name: "البلاديوم", symbol: "XPD/USD", spread: "3.0", leverage: "1:50", hours: "23/5" },
        { name: "النحاس", symbol: "HG", spread: "0.005", leverage: "1:100", hours: "23/5" },
        { name: "القمح", symbol: "ZW", spread: "0.5", leverage: "1:50", hours: "15h/5" },
      ],
      whatIs: [
        "تداول السلع يشمل شراء وبيع المواد الخام والموارد الطبيعية مثل الذهب والفضة والنفط والغاز الطبيعي والمنتجات الزراعية. تُعتبر السلع من أقدم أشكال التداول في العالم.",
        "يتأثر سعر السلع بعوامل مثل العرض والطلب العالمي والأحداث الجيوسياسية والتضخم وسياسات البنوك المركزية. يعتبر الذهب ملاذًا آمنًا تقليديًا في أوقات عدم اليقين الاقتصادي.",
        "من خلال عقود الفروقات (CFDs)، يمكنك التداول على أسعار السلع دون الحاجة لامتلاك السلعة فعليًا، مما يوفر مرونة عالية وإمكانية الربح من ارتفاع وانخفاض الأسعار.",
      ],
      advantages: [
        { title: "تنويع المحفظة", desc: "السلع تتحرك غالبًا بشكل مستقل عن الأسهم والعملات مما يوفر تنويعًا فعالًا لمحفظتك." },
        { title: "حماية من التضخم", desc: "أسعار السلع ترتفع عادة مع التضخم مما يجعلها أداة تحوط طبيعية." },
        { title: "فروقات تنافسية على الذهب", desc: "فروقات سعرية تبدأ من 0.3 نقطة على الذهب مع رافعة تصل إلى 1:200." },
        { title: "تداول النفط بسهولة", desc: "تداول النفط الخام بفروقات من 0.03 نقطة واستفد من تحركات أسعار الطاقة." },
      ],
      faq: [
        { q: "ما الفرق بين تداول السلع وشراء الذهب الفعلي؟", a: "عند تداول السلع كعقود فروقات (CFDs) فإنك تتداول على سعر السلعة دون امتلاكها فعليًا. هذا يتيح لك الربح من الارتفاع والانخفاض دون تكاليف التخزين." },
        { q: "ما هي أفضل أوقات تداول الذهب؟", a: "يكون الذهب أكثر نشاطًا خلال الجلسة الأمريكية والأوروبية المتداخلة (14:00-18:00 بتوقيت غرينتش)." },
        { q: "هل يمكنني تداول السلع الزراعية؟", a: "نعم، نوفر تداول القمح والسلع الزراعية الأخرى بشروط تنافسية." },
      ],
    },
    {
      slug: "stocks",
      name: "الأسهم",
      headline: "تداول أسهم الشركات العالمية",
      description:
        "تداول عقود الفروقات على أسهم أكبر الشركات العالمية في بورصات نيويورك ولندن وطوكيو وغيرها. استثمر في شركات التكنولوجيا والطاقة والرعاية الصحية والقطاع المالي بدون الحاجة لامتلاك الأسهم فعلياً.",
      image: "/images/asset-stocks.jpg",
      instruments: [
        { name: "أبل", symbol: "AAPL", spread: "0.5", leverage: "1:20", hours: "16:30-23:00" },
        { name: "تسلا", symbol: "TSLA", spread: "0.8", leverage: "1:20", hours: "16:30-23:00" },
        { name: "أمازون", symbol: "AMZN", spread: "0.6", leverage: "1:20", hours: "16:30-23:00" },
        { name: "مايكروسوفت", symbol: "MSFT", spread: "0.5", leverage: "1:20", hours: "16:30-23:00" },
        { name: "جوجل", symbol: "GOOGL", spread: "0.7", leverage: "1:20", hours: "16:30-23:00" },
        { name: "ميتا", symbol: "META", spread: "0.6", leverage: "1:20", hours: "16:30-23:00" },
        { name: "إنفيديا", symbol: "NVDA", spread: "0.8", leverage: "1:20", hours: "16:30-23:00" },
        { name: "أرامكو السعودية", symbol: "2222.SR", spread: "0.02", leverage: "1:10", hours: "10:00-15:00" },
      ],
      whatIs: [
        "تداول الأسهم عبر عقود الفروقات (CFDs) يتيح لك المضاربة على أسعار أسهم أكبر الشركات العالمية مثل Apple و Tesla و Amazon دون الحاجة لشراء السهم فعليًا.",
        "يمكنك الاستفادة من ارتفاع وانخفاض أسعار الأسهم من خلال فتح صفقات شراء أو بيع. كما يمكنك استخدام الرافعة المالية لزيادة قوتك الشرائية.",
        "تتأثر أسعار الأسهم بنتائج الشركات المالية والأخبار الاقتصادية وتوقعات النمو وسياسات البنوك المركزية، مما يوفر فرص تداول متنوعة على مدار العام.",
      ],
      advantages: [
        { title: "0% عمولة", desc: "تداول الأسهم دون أي عمولات إضافية. أنت تدفع فقط الفروقات السعرية." },
        { title: "+500 سهم عالمي", desc: "وصول إلى أسهم أكبر الشركات في أمريكا وأوروبا والشرق الأوسط." },
        { title: "البيع على المكشوف", desc: "استفد من انخفاض الأسعار عبر فتح صفقات بيع على الأسهم." },
        { title: "تداول بأجزاء الأسهم", desc: "لست بحاجة لشراء سهم كامل. تداول بأي مبلغ يناسب ميزانيتك." },
      ],
      faq: [
        { q: "هل أحصل على أرباح الأسهم عند تداول عقود الفروقات؟", a: "نعم، عند امتلاك صفقة شراء مفتوحة وقت توزيع الأرباح، يتم إضافة مبلغ معادل لحسابك." },
        { q: "ما هي أوقات تداول الأسهم الأمريكية؟", a: "تتداول الأسهم الأمريكية من 16:30 إلى 23:00 بتوقيت السعودية (خلال فترة التوقيت الشتوي)." },
        { q: "هل يمكنني تداول الأسهم السعودية؟", a: "نعم، نوفر تداول أسهم الشركات المدرجة في تداول السعودي مثل أرامكو وسابك." },
      ],
    },
    {
      slug: "indices",
      name: "المؤشرات",
      headline: "تداول المؤشرات العالمية",
      description:
        "تداول مؤشرات الأسواق العالمية الرئيسية وتابع أداء الاقتصادات الكبرى. من داو جونز وناسداك إلى فوتسي وداكس، استفد من تحركات الأسواق العالمية بشروط تنافسية.",
      image: "/images/asset-indices.jpg",
      instruments: [
        { name: "ستاندرد آند بورز 500", symbol: "S&P 500", spread: "0.4", leverage: "1:100", hours: "23/5" },
        { name: "داو جونز 30", symbol: "DJ30", spread: "1.0", leverage: "1:100", hours: "23/5" },
        { name: "ناسداك 100", symbol: "NAS100", spread: "0.8", leverage: "1:100", hours: "23/5" },
        { name: "فوتسي 100", symbol: "FTSE100", spread: "1.0", leverage: "1:100", hours: "10:00-18:30" },
        { name: "داكس 40", symbol: "DAX40", spread: "0.8", leverage: "1:100", hours: "09:00-23:00" },
        { name: "نيكاي 225", symbol: "NI225", spread: "5.0", leverage: "1:100", hours: "02:00-23:00" },
        { name: "تداول السعودي", symbol: "TASI", spread: "1.5", leverage: "1:50", hours: "10:00-15:00" },
        { name: "أبوظبي", symbol: "ADX", spread: "1.5", leverage: "1:50", hours: "10:00-14:00" },
      ],
      whatIs: [
        "مؤشرات الأسواق هي مقاييس إحصائية تعكس أداء مجموعة من الأسهم التي تمثل قطاعًا أو سوقًا بأكمله. مثلاً، مؤشر S&P 500 يتتبع أداء 500 شركة أمريكية كبرى.",
        "تداول المؤشرات يتيح لك الاستثمار في اقتصاد بأكمله بدلاً من شركة واحدة، مما يقلل المخاطر المرتبطة بأداء شركة فردية ويوفر تنويعًا طبيعيًا.",
        "تتأثر المؤشرات بالبيانات الاقتصادية الكلية مثل الناتج المحلي الإجمالي ومعدلات البطالة وقرارات أسعار الفائدة، مما يجعلها أداة ممتازة للتداول على الأحداث الاقتصادية.",
      ],
      advantages: [
        { title: "تنويع تلقائي", desc: "تداول على أداء عشرات أو مئات الأسهم في صفقة واحدة بدلاً من شركة فردية." },
        { title: "فروقات من 0.4 نقطة", desc: "فروقات سعرية تنافسية على المؤشرات الرئيسية مثل S&P 500 و NASDAQ." },
        { title: "تداول نقدي وآجل", desc: "اختر بين العقود النقدية للتداول قصير الأجل والعقود الآجلة للمراكز طويلة الأجل." },
        { title: "مؤشرات إقليمية", desc: "تداول مؤشرات الشرق الأوسط مثل تداول السعودي (TASI) وأبوظبي (ADX)." },
      ],
      faq: [
        { q: "ما الفرق بين تداول المؤشرات والأسهم الفردية؟", a: "المؤشرات تمثل أداء مجموعة أسهم مما يوفر تنويعًا أفضل. الأسهم الفردية تتأثر بأخبار الشركة بينما المؤشرات تتأثر بالاقتصاد الكلي." },
        { q: "هل يمكنني تداول المؤشرات السعودية والخليجية؟", a: "نعم، نوفر تداول مؤشر تداول السعودي (TASI) ومؤشر أبوظبي (ADX) بشروط تنافسية." },
        { q: "ما هي أفضل المؤشرات للمبتدئين؟", a: "S&P 500 و NASDAQ 100 من أكثر المؤشرات شعبية للمبتدئين بسبب سيولتها العالية وفروقاتها الضيقة." },
      ],
    },
    {
      slug: "crypto",
      name: "العملات الرقمية",
      headline: "تداول العملات الرقمية",
      description:
        "ادخل عالم العملات الرقمية وتداول أشهر العملات المشفرة مثل بيتكوين وإيثريوم وغيرها. استفد من التقلبات السعرية العالية مع إدارة المخاطر المتقدمة وبدون الحاجة لمحفظة رقمية.",
      image: "/images/asset-crypto.jpg",
      instruments: [
        { name: "بيتكوين", symbol: "BTC/USD", spread: "30", leverage: "1:10", hours: "24/7" },
        { name: "إيثريوم", symbol: "ETH/USD", spread: "2.0", leverage: "1:10", hours: "24/7" },
        { name: "ريبل", symbol: "XRP/USD", spread: "0.005", leverage: "1:5", hours: "24/7" },
        { name: "لايتكوين", symbol: "LTC/USD", spread: "0.5", leverage: "1:5", hours: "24/7" },
        { name: "كاردانو", symbol: "ADA/USD", spread: "0.003", leverage: "1:5", hours: "24/7" },
        { name: "سولانا", symbol: "SOL/USD", spread: "0.1", leverage: "1:5", hours: "24/7" },
        { name: "بولكادوت", symbol: "DOT/USD", spread: "0.05", leverage: "1:5", hours: "24/7" },
        { name: "أفالانش", symbol: "AVAX/USD", spread: "0.1", leverage: "1:5", hours: "24/7" },
      ],
      whatIs: [
        "العملات الرقمية هي أصول رقمية لا مركزية تعمل على تقنية البلوكتشين. أشهرها بيتكوين التي أُطلقت عام 2009 وأصبحت أكبر عملة رقمية من حيث القيمة السوقية.",
        "تتميز العملات الرقمية بتقلبات سعرية عالية مما يوفر فرصًا كبيرة للمتداولين. يمكن أن ترتفع أو تنخفض الأسعار بنسب كبيرة خلال ساعات قليلة.",
        "من خلال تداول عقود الفروقات على العملات الرقمية مع نمايا، لا تحتاج إلى محفظة رقمية أو التعامل مع تعقيدات تقنية البلوكتشين. يمكنك الربح من الارتفاع والانخفاض على حد سواء.",
      ],
      advantages: [
        { title: "تداول 24/7", desc: "سوق العملات الرقمية لا يغلق أبدًا. تداول في أي وقت يناسبك بما في ذلك عطلات نهاية الأسبوع." },
        { title: "+30 عملة رقمية", desc: "تداول البيتكوين والإيثريوم وعشرات العملات الرقمية الأخرى في مكان واحد." },
        { title: "بدون محفظة رقمية", desc: "تداول على أسعار العملات الرقمية دون الحاجة لإنشاء محفظة رقمية أو مفاتيح خاصة." },
        { title: "إدارة مخاطر متقدمة", desc: "استخدم أوامر وقف الخسارة وجني الأرباح والحماية من الرصيد السلبي." },
      ],
      faq: [
        { q: "هل أمتلك العملة الرقمية فعليًا عند التداول؟", a: "لا، عند تداول عقود الفروقات فإنك تتداول على سعر العملة دون امتلاكها. هذا يعني أنك لا تحتاج لمحفظة رقمية." },
        { q: "ما هي مخاطر تداول العملات الرقمية؟", a: "العملات الرقمية متقلبة جدًا ويمكن أن تخسر قيمة كبيرة بسرعة. استخدم دائمًا إدارة مخاطر صارمة ولا تستثمر أكثر مما يمكنك تحمل خسارته." },
        { q: "هل تداول العملات الرقمية متوافق مع الشريعة الإسلامية؟", a: "نوفر حسابات إسلامية خالية من فوائد التبييت. للتفاصيل حول التوافق الشرعي، يرجى مراجعة صفحة الأحكام القانونية الإسلامية." },
      ],
    },
  ],
  en: [
    {
      slug: "forex",
      name: "Forex",
      headline: "Foreign Currency Trading",
      description:
        "Trade major, minor, and exotic currency pairs in the world's largest financial market with daily trading volume exceeding $6 trillion. Benefit from high liquidity and 24-hour trading, 5 days a week.",
      image: "/images/asset-forex.jpg",
      instruments: [
        { name: "Euro / US Dollar", symbol: "EUR/USD", spread: "0.1", leverage: "1:500", hours: "24/5" },
        { name: "British Pound / US Dollar", symbol: "GBP/USD", spread: "0.3", leverage: "1:500", hours: "24/5" },
        { name: "US Dollar / Japanese Yen", symbol: "USD/JPY", spread: "0.2", leverage: "1:500", hours: "24/5" },
        { name: "Australian Dollar / US Dollar", symbol: "AUD/USD", spread: "0.4", leverage: "1:400", hours: "24/5" },
        { name: "US Dollar / Swiss Franc", symbol: "USD/CHF", spread: "0.4", leverage: "1:400", hours: "24/5" },
        { name: "US Dollar / Canadian Dollar", symbol: "USD/CAD", spread: "0.5", leverage: "1:400", hours: "24/5" },
        { name: "Euro / British Pound", symbol: "EUR/GBP", spread: "0.5", leverage: "1:400", hours: "24/5" },
        { name: "Euro / Japanese Yen", symbol: "EUR/JPY", spread: "0.6", leverage: "1:400", hours: "24/5" },
        { name: "New Zealand Dollar / US Dollar", symbol: "NZD/USD", spread: "0.6", leverage: "1:300", hours: "24/5" },
        { name: "Euro / Australian Dollar", symbol: "EUR/AUD", spread: "0.8", leverage: "1:300", hours: "24/5" },
      ],
      whatIs: [
        "The Forex market (Foreign Exchange) is the world's largest financial market where currencies are traded around the clock. Daily trading volume exceeds $6 trillion, making it the most liquid market in existence.",
        "Forex trading works by exchanging one currency for another in pairs such as EUR/USD or GBP/USD. Traders profit from exchange rate movements whether prices rise or fall.",
        "The Forex market features 24-hour trading during 5 days a week, high liquidity ensuring fast order execution, and the ability to use leverage to maximize purchasing power.",
      ],
      advantages: [
        { title: "Tight Spreads", desc: "Spreads starting from 0.1 pips on major pairs to minimize your trading costs." },
        { title: "Flexible Leverage", desc: "Leverage up to 1:500 enables you to open large positions with a small capital." },
        { title: "Ultra-Fast Execution", desc: "Order execution in less than 30 milliseconds with minimal slippage." },
        { title: "24/5 Trading", desc: "Trade 24 hours a day, 5 days a week without interruption." },
      ],
      faq: [
        { q: "What is the minimum deposit to trade Forex?", a: "You can start with just $100 and open positions on major and minor currency pairs." },
        { q: "Can I trade Forex on mobile?", a: "Yes, Namaya provides advanced trading apps on iOS and Android, plus MetaTrader 4 and 5 platforms." },
        { q: "What are the risks of Forex trading?", a: "Forex trading carries high risk due to leverage. We recommend using stop-loss orders and never risking more than you can afford to lose." },
      ],
    },
    {
      slug: "commodities",
      name: "Commodities",
      headline: "Trade Commodities & Precious Metals",
      description:
        "Diversify your investment portfolio by trading the most sought-after commodities in the world. From gold and silver to oil and natural gas, benefit from global commodity price movements with competitive conditions.",
      image: "/images/asset-commodities.jpg",
      instruments: [
        { name: "Gold", symbol: "XAU/USD", spread: "0.3", leverage: "1:200", hours: "23/5" },
        { name: "Silver", symbol: "XAG/USD", spread: "0.03", leverage: "1:200", hours: "23/5" },
        { name: "Crude Oil", symbol: "CL", spread: "0.03", leverage: "1:100", hours: "23/5" },
        { name: "Natural Gas", symbol: "NG", spread: "0.01", leverage: "1:100", hours: "23/5" },
        { name: "Platinum", symbol: "XPT/USD", spread: "1.5", leverage: "1:100", hours: "23/5" },
        { name: "Palladium", symbol: "XPD/USD", spread: "3.0", leverage: "1:50", hours: "23/5" },
        { name: "Copper", symbol: "HG", spread: "0.005", leverage: "1:100", hours: "23/5" },
        { name: "Wheat", symbol: "ZW", spread: "0.5", leverage: "1:50", hours: "15h/5" },
      ],
      whatIs: [
        "Commodity trading involves buying and selling raw materials and natural resources such as gold, silver, oil, natural gas, and agricultural products. Commodities are among the oldest forms of trading in the world.",
        "Commodity prices are influenced by global supply and demand, geopolitical events, inflation, and central bank policies. Gold is traditionally considered a safe-haven asset during times of economic uncertainty.",
        "Through CFDs (Contracts for Difference), you can trade commodity prices without physically owning the commodity, providing high flexibility and the ability to profit from both rising and falling prices.",
      ],
      advantages: [
        { title: "Portfolio Diversification", desc: "Commodities often move independently of stocks and currencies, providing effective portfolio diversification." },
        { title: "Inflation Hedge", desc: "Commodity prices typically rise with inflation, making them a natural hedging tool." },
        { title: "Competitive Gold Spreads", desc: "Spreads starting from 0.3 pips on gold with leverage up to 1:200." },
        { title: "Easy Oil Trading", desc: "Trade crude oil with spreads from 0.03 pips and benefit from energy price movements." },
      ],
      faq: [
        { q: "What's the difference between CFD trading and buying physical gold?", a: "With CFDs you trade on the price without owning the asset. This allows profiting from both rises and falls without storage costs." },
        { q: "What are the best times to trade gold?", a: "Gold is most active during the overlapping US and European sessions (14:00-18:00 GMT)." },
        { q: "Can I trade agricultural commodities?", a: "Yes, we offer wheat and other agricultural commodities with competitive conditions." },
      ],
    },
    {
      slug: "stocks",
      name: "Stocks",
      headline: "Trade Global Company Stocks",
      description:
        "Trade CFDs on stocks of the world's largest companies on the New York, London, Tokyo exchanges and more. Invest in technology, energy, healthcare, and financial sectors without needing to own the shares.",
      image: "/images/asset-stocks.jpg",
      instruments: [
        { name: "Apple", symbol: "AAPL", spread: "0.5", leverage: "1:20", hours: "16:30-23:00" },
        { name: "Tesla", symbol: "TSLA", spread: "0.8", leverage: "1:20", hours: "16:30-23:00" },
        { name: "Amazon", symbol: "AMZN", spread: "0.6", leverage: "1:20", hours: "16:30-23:00" },
        { name: "Microsoft", symbol: "MSFT", spread: "0.5", leverage: "1:20", hours: "16:30-23:00" },
        { name: "Google", symbol: "GOOGL", spread: "0.7", leverage: "1:20", hours: "16:30-23:00" },
        { name: "Meta", symbol: "META", spread: "0.6", leverage: "1:20", hours: "16:30-23:00" },
        { name: "NVIDIA", symbol: "NVDA", spread: "0.8", leverage: "1:20", hours: "16:30-23:00" },
        { name: "Saudi Aramco", symbol: "2222.SR", spread: "0.02", leverage: "1:10", hours: "10:00-15:00" },
      ],
      whatIs: [
        "Stock CFD trading allows you to speculate on share prices of the world's largest companies like Apple, Tesla, and Amazon without physically buying the stock.",
        "You can profit from both rising and falling share prices by opening buy or sell positions. You can also use leverage to increase your purchasing power.",
        "Stock prices are influenced by company earnings, economic news, growth expectations, and central bank policies, providing diverse trading opportunities throughout the year.",
      ],
      advantages: [
        { title: "0% Commission", desc: "Trade stocks with zero commissions. You only pay the spread." },
        { title: "500+ Global Stocks", desc: "Access shares from the biggest companies in the US, Europe, and Middle East." },
        { title: "Short Selling", desc: "Profit from falling prices by opening sell positions on stocks." },
        { title: "Fractional Trading", desc: "No need to buy a full share. Trade with any amount that suits your budget." },
      ],
      faq: [
        { q: "Do I receive dividends when trading stock CFDs?", a: "Yes, when holding an open buy position at the time of dividend distribution, an equivalent amount is credited to your account." },
        { q: "What are US stock trading hours?", a: "US stocks trade from 16:30 to 23:00 Saudi time (during winter time)." },
        { q: "Can I trade Saudi stocks?", a: "Yes, we offer trading on companies listed on the Saudi Tadawul exchange such as Aramco and SABIC." },
      ],
    },
    {
      slug: "indices",
      name: "Indices",
      headline: "Trade Global Indices",
      description:
        "Trade the world's major market indices and follow the performance of major economies. From Dow Jones and NASDAQ to FTSE and DAX, benefit from global market movements with competitive conditions.",
      image: "/images/asset-indices.jpg",
      instruments: [
        { name: "S&P 500", symbol: "S&P 500", spread: "0.4", leverage: "1:100", hours: "23/5" },
        { name: "Dow Jones 30", symbol: "DJ30", spread: "1.0", leverage: "1:100", hours: "23/5" },
        { name: "NASDAQ 100", symbol: "NAS100", spread: "0.8", leverage: "1:100", hours: "23/5" },
        { name: "FTSE 100", symbol: "FTSE100", spread: "1.0", leverage: "1:100", hours: "10:00-18:30" },
        { name: "DAX 40", symbol: "DAX40", spread: "0.8", leverage: "1:100", hours: "09:00-23:00" },
        { name: "Nikkei 225", symbol: "NI225", spread: "5.0", leverage: "1:100", hours: "02:00-23:00" },
        { name: "Saudi TASI", symbol: "TASI", spread: "1.5", leverage: "1:50", hours: "10:00-15:00" },
        { name: "Abu Dhabi ADX", symbol: "ADX", spread: "1.5", leverage: "1:50", hours: "10:00-14:00" },
      ],
      whatIs: [
        "Market indices are statistical measures that reflect the performance of a group of stocks representing a sector or an entire market. For example, the S&P 500 tracks the performance of 500 major US companies.",
        "Index trading allows you to invest in an entire economy rather than a single company, reducing risks associated with individual company performance and providing natural diversification.",
        "Indices are influenced by macroeconomic data such as GDP, unemployment rates, and interest rate decisions, making them an excellent tool for trading on economic events.",
      ],
      advantages: [
        { title: "Automatic Diversification", desc: "Trade the performance of dozens or hundreds of stocks in a single position instead of individual companies." },
        { title: "Spreads from 0.4 pips", desc: "Competitive spreads on major indices like S&P 500 and NASDAQ." },
        { title: "Cash & Futures", desc: "Choose between cash contracts for short-term trading and futures for long-term positions." },
        { title: "Regional Indices", desc: "Trade Middle East indices like Saudi TASI and Abu Dhabi ADX." },
      ],
      faq: [
        { q: "What's the difference between trading indices and individual stocks?", a: "Indices represent the performance of a group of stocks providing better diversification. Individual stocks are affected by company news while indices are influenced by the broader economy." },
        { q: "Can I trade Saudi and Gulf indices?", a: "Yes, we offer trading on the Saudi Tadawul index (TASI) and Abu Dhabi index (ADX) with competitive conditions." },
        { q: "Which indices are best for beginners?", a: "S&P 500 and NASDAQ 100 are the most popular indices for beginners due to their high liquidity and tight spreads." },
      ],
    },
    {
      slug: "crypto",
      name: "Crypto",
      headline: "Trade Cryptocurrencies",
      description:
        "Enter the world of digital currencies and trade the most popular cryptocurrencies like Bitcoin and Ethereum. Benefit from high price volatility with advanced risk management and without needing a digital wallet.",
      image: "/images/asset-crypto.jpg",
      instruments: [
        { name: "Bitcoin", symbol: "BTC/USD", spread: "30", leverage: "1:10", hours: "24/7" },
        { name: "Ethereum", symbol: "ETH/USD", spread: "2.0", leverage: "1:10", hours: "24/7" },
        { name: "Ripple", symbol: "XRP/USD", spread: "0.005", leverage: "1:5", hours: "24/7" },
        { name: "Litecoin", symbol: "LTC/USD", spread: "0.5", leverage: "1:5", hours: "24/7" },
        { name: "Cardano", symbol: "ADA/USD", spread: "0.003", leverage: "1:5", hours: "24/7" },
        { name: "Solana", symbol: "SOL/USD", spread: "0.1", leverage: "1:5", hours: "24/7" },
        { name: "Polkadot", symbol: "DOT/USD", spread: "0.05", leverage: "1:5", hours: "24/7" },
        { name: "Avalanche", symbol: "AVAX/USD", spread: "0.1", leverage: "1:5", hours: "24/7" },
      ],
      whatIs: [
        "Cryptocurrencies are decentralized digital assets that operate on blockchain technology. The most famous is Bitcoin, launched in 2009, which became the largest cryptocurrency by market capitalization.",
        "Cryptocurrencies feature high price volatility, providing significant opportunities for traders. Prices can rise or fall dramatically within just a few hours.",
        "By trading cryptocurrency CFDs with Namaya, you don't need a digital wallet or deal with blockchain technicalities. You can profit from both rising and falling prices.",
      ],
      advantages: [
        { title: "24/7 Trading", desc: "The crypto market never closes. Trade at any time that suits you, including weekends." },
        { title: "30+ Cryptocurrencies", desc: "Trade Bitcoin, Ethereum, and dozens of other digital currencies in one place." },
        { title: "No Digital Wallet", desc: "Trade crypto prices without creating a digital wallet or managing private keys." },
        { title: "Advanced Risk Management", desc: "Use stop-loss, take-profit orders, and negative balance protection." },
      ],
      faq: [
        { q: "Do I actually own the cryptocurrency when trading?", a: "No, with CFDs you trade on the price without owning the asset. This means you don't need a digital wallet." },
        { q: "What are the risks of crypto trading?", a: "Cryptocurrencies are highly volatile and can lose significant value quickly. Always use strict risk management and never invest more than you can afford to lose." },
        { q: "Is crypto trading Sharia-compliant?", a: "We offer Islamic accounts free of overnight interest. For details on Sharia compliance, please visit our Islamic Legal Rulings page." },
      ],
    },
  ],
};

export default function FinancialAssetDetailPage({ slug }: { slug: string }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const data = assets[lang];
  const asset = data.find((a) => a.slug === slug);
  const cta = ctaSection[lang];
  const headers = tableHeaders[lang];
  const titles = sectionTitles[lang];
  const steps = howToStartSteps[lang];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!asset) {
    return (
      <section className="py-[200px] text-center">
        <h1 className="text-[#0e314c] text-[28px] font-bold mb-[16px]">
          {lang === "ar" ? "الصفحة غير موجودة" : "Page Not Found"}
        </h1>
        <Link
          href="/financial-assets"
          className="text-[#12953d] text-[16px] font-semibold hover:underline"
        >
          {backLabel[lang]}
        </Link>
      </section>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-[#001005] pt-[69px] md:pt-[100px] xl:pt-[110px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image src="/images/blog-hero-bg.png" alt="" fill className="object-cover opacity-80" />
        </div>
        <div
          dir={isAr ? "rtl" : undefined}
          className="relative px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px] py-[30px] md:py-[50px]"
        >
          <Link
            href="/financial-assets"
            className="inline-flex items-center gap-[8px] text-[#b0f127] text-[14px] md:text-[15px] font-medium mb-[20px] hover:underline"
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={isAr ? "" : "rotate-180"}
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
            {backLabel[lang]}
          </Link>
          <h1 className="text-white text-[40px] md:text-[55px] xl:text-[65px] font-extrabold leading-[1.3]">
            {asset.headline}
          </h1>
          <p className="text-[#c5c5c5] text-[16px] md:text-[18px] leading-[1.5] max-w-[680px] mt-[16px]">
            {asset.description}
          </p>
        </div>
      </section>

      {/* Instrument Table */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div dir={isAr ? "rtl" : undefined} className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
          <h2 className="text-[#0e314c] text-[28px] md:text-[36px] xl:text-[40px] font-bold leading-[1.3] mb-[30px] md:mb-[40px]">
            {titles.instruments}
          </h2>
          <div className="overflow-x-auto rounded-[20px] border border-[#cacceb]">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-[#0e314c]">
                  <th className="text-white text-[13px] md:text-[14px] font-semibold text-start px-[20px] py-[16px]">{headers.instrument}</th>
                  <th className="text-white text-[13px] md:text-[14px] font-semibold text-start px-[20px] py-[16px]">{headers.symbol}</th>
                  <th className="text-white text-[13px] md:text-[14px] font-semibold text-start px-[20px] py-[16px]">{headers.spread}</th>
                  <th className="text-white text-[13px] md:text-[14px] font-semibold text-start px-[20px] py-[16px]">{headers.leverage}</th>
                  <th className="text-white text-[13px] md:text-[14px] font-semibold text-start px-[20px] py-[16px]">{headers.hours}</th>
                </tr>
              </thead>
              <tbody>
                {asset.instruments.map((inst, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[#f0f0f0] ${i % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"} hover:bg-[rgba(18,149,61,0.04)] transition-colors`}
                  >
                    <td className="text-[#0e314c] text-[14px] md:text-[15px] font-medium px-[20px] py-[14px]">{inst.name}</td>
                    <td className="text-[#6084a4] text-[14px] md:text-[15px] px-[20px] py-[14px] font-mono">{inst.symbol}</td>
                    <td className="text-[#6084a4] text-[14px] md:text-[15px] px-[20px] py-[14px]">{inst.spread}</td>
                    <td className="text-[#6084a4] text-[14px] md:text-[15px] px-[20px] py-[14px]">{inst.leverage}</td>
                    <td className="text-[#6084a4] text-[14px] md:text-[15px] px-[20px] py-[14px]">{inst.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What Is Section */}
      <section className="bg-[#f9f9f9] py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div dir={isAr ? "rtl" : undefined} className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-[30px] md:gap-[40px] items-center">
            <div className="flex-1">
              <h2 className="text-[#0e314c] text-[28px] md:text-[36px] xl:text-[40px] font-bold leading-[1.3] mb-[24px]">
                {titles.whatIs} {asset.name}؟
              </h2>
              <div className="flex flex-col gap-[16px]">
                {asset.whatIs.map((p, i) => (
                  <p key={i} className="text-[#6084a4] text-[15px] md:text-[16px] leading-[1.7]">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div className="relative w-full lg:w-[440px] xl:w-[500px] h-[260px] md:h-[320px] rounded-[20px] overflow-hidden shrink-0">
              <Image src={asset.image} alt={asset.headline} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Trade with Namaya */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div dir={isAr ? "rtl" : undefined} className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
          <h2 className="text-[#0e314c] text-[28px] md:text-[36px] xl:text-[40px] font-bold leading-[1.3] text-center mb-[40px] md:mb-[50px]">
            {titles.whyTrade.replace("{name}", asset.name)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[24px]">
            {asset.advantages.map((adv, i) => (
              <div
                key={i}
                className="flex gap-[16px] bg-[#f9f9f9] border border-[#cacceb] rounded-[20px] p-[24px] md:p-[28px] hover:border-[#12953d] hover:shadow-[0_4px_20px_rgba(18,149,61,0.08)] transition-all"
              >
                <div className="w-[48px] h-[48px] rounded-full bg-[#12953d] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[#0e314c] text-[18px] md:text-[20px] font-bold leading-[1.3] mb-[6px]">
                    {adv.title}
                  </h3>
                  <p className="text-[#6084a4] text-[14px] md:text-[15px] leading-[1.6]">
                    {adv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Start Trading */}
      <section className="bg-[#f9f9f9] py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div dir={isAr ? "rtl" : undefined} className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
          <h2 className="text-[#0e314c] text-[28px] md:text-[36px] xl:text-[40px] font-bold leading-[1.3] text-center mb-[40px] md:mb-[50px]">
            {titles.howToStart}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] md:gap-[24px]">
            {steps.map((step, i) => (
              <div key={i} className="bg-white border border-[#cacceb] rounded-[20px] p-[28px] md:p-[32px] text-center">
                <div className="w-[60px] h-[60px] rounded-full bg-[#12953d] flex items-center justify-center mx-auto mb-[20px]">
                  <span className="text-white text-[24px] font-bold">{step.step}</span>
                </div>
                <h3 className="text-[#0e314c] text-[20px] md:text-[22px] font-bold leading-[1.3] mb-[10px]">
                  {step.title}
                </h3>
                <p className="text-[#6084a4] text-[14px] md:text-[15px] leading-[1.6]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div dir={isAr ? "rtl" : undefined} className="max-w-[840px] mx-auto">
          <h2 className="text-[#0e314c] text-[28px] md:text-[36px] xl:text-[40px] font-bold leading-[1.3] text-center mb-[40px] md:mb-[50px]">
            {titles.faq}
          </h2>
          <div className="flex flex-col gap-[12px]">
            {asset.faq.map((item, i) => (
              <div
                key={i}
                className={`border rounded-[16px] overflow-hidden transition-colors ${
                  openFaq === i ? "border-[#12953d] bg-[rgba(18,149,61,0.02)]" : "border-[#cacceb]"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-[24px] py-[18px] text-start cursor-pointer"
                >
                  <span className="text-[#0e314c] text-[16px] md:text-[17px] font-semibold leading-[1.4] flex-1">
                    {item.q}
                  </span>
                  <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12953d"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`shrink-0 transition-transform duration-300 ${isAr ? "mr-[16px]" : "ml-[16px]"} ${openFaq === i ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-[24px] pb-[18px] text-[#6084a4] text-[14px] md:text-[15px] leading-[1.7]">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#001005] py-[50px] md:py-[70px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Image src="/images/blog-hero-bg.png" alt="" fill className="object-cover opacity-40" />
        </div>
        <div dir={isAr ? "rtl" : undefined} className="relative max-w-[700px] mx-auto text-center">
          <h2 className="text-white text-[28px] md:text-[36px] xl:text-[40px] font-bold leading-[1.3] mb-[16px]">
            {cta.title}
          </h2>
          <p className="text-[#c5c5c5] text-[16px] md:text-[18px] leading-[1.5] mb-[32px]">
            {cta.desc}
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center px-[40px] py-[18px] bg-[#12953d] border border-[#b0f127] rounded-[8px] text-white text-[16px] font-semibold hover:bg-[#0e7a31] transition-colors"
          >
            {cta.btn}
          </a>
        </div>
      </section>
    </>
  );
}
