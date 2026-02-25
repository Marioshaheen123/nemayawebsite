"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

interface Article {
  image: string;
  day: string;
  month: string;
  readTime: string;
  title: string;
  excerpt: string;
  body: string[];
  suggestedBreakAfter?: number;
}

interface SuggestedArticle {
  image: string;
  title: string;
  slug: number;
}

const articles: { en: Article[]; ar: Article[] } = {
  en: [
    {
      image: "/images/blog-page-1.jpg",
      day: "10",
      month: "December",
      readTime: "10 min read",
      title:
        "Somalia and Tanzania resume direct flights and strengthen bilateral cooperation",
      excerpt:
        "Somalia and Tanzania have announced an agreement to resume direct flights between Mogadishu and Dar es Salaam.",
      body: [
        "Mogadishu and Dar es Salaam, in a move aimed at strengthening bilateral relations between the two countries.",
        "The announcement came during the celebration of the 65th anniversary of Somalia's independence, held in the Tanzanian capital Dar es Salaam, which also witnessed the reopening of the Somali embassy after extensive renovations.",
        "Tanzania's Minister of Foreign Affairs and East African Cooperation, Mahmoud Thabit Kombo, confirmed that both sides are working on updating the air transport services agreement, which will allow direct flights without stops in intermediate cities such as Nairobi or Addis Ababa, noting that this step will contribute to facilitating movement and enhancing trade, tourism, and cargo transport between the two countries.",
        "The official delegation was headed by Somali Foreign Minister Abdulsalam Abdul Ali, which included 6 ministers and 6 members of parliament.",
        "The minister considered the reopening of the embassy as an expression of his country's intention to expand its diplomatic presence in the region, pointing to the progress made in building national institutions and strengthening internal reconciliation.",
        "The minister revealed plans to form a joint ministerial committee and a parliamentary friendship committee to oversee bilateral cooperation files, praising the role of the Somali community in Tanzania as a link for communication between the two countries.",
        "The discussions between the two sides also included drafts of new agreements in the areas of immigration, education, aviation, fishing, and agriculture, in addition to developing an organized framework for cooperation in these vital sectors.",
        "In a related context, the meeting addressed Somalia's accession to the East African Community, where this development was considered a turning point that will open new horizons for joint regional cooperation.",
      ],
      suggestedBreakAfter: 2,
    },
    {
      image: "/images/blog-page-2.jpg",
      day: "09",
      month: "December",
      readTime: "7 min read",
      title:
        "The IMF calls on Nigeria to readjust its budget to lower oil prices",
      excerpt:
        "The International Monetary Fund and Nigeria needs to adjust its 2025 budget.",
      body: [
        "The International Monetary Fund has called on Nigeria to readjust its budget to reflect lower oil prices and increase cash transfers to protect vulnerable populations.",
        "The recommendation comes amid volatile global oil markets that have significantly impacted Nigeria's fiscal outlook for the current year.",
        "IMF officials emphasized that Nigeria needs to diversify its revenue sources beyond oil exports to build a more resilient economy.",
        "The fund also suggested increasing social protection spending to shield the most vulnerable segments of the population from the effects of economic adjustment.",
      ],
      suggestedBreakAfter: 1,
    },
    {
      image: "/images/blog-page-3.jpg",
      day: "08",
      month: "December",
      readTime: "15 min read",
      title:
        "The IMF announces it is in contact with Senegal despite previously suspending funding",
      excerpt:
        "The International Monetary Fund said it remains engaged with Senegal.",
      body: [
        "The International Monetary Fund said it remains engaged with Senegal, as Prime Minister Ousmane Sonko announced an economic recovery plan.",
        "The plan includes the allocation of billions of dollars to clear debts left by the previous regime and restructure the country's finances.",
        "Despite previously suspending funding due to concerns about fiscal transparency, the IMF indicated willingness to resume discussions.",
        "Senegal's new government has pledged to implement comprehensive reforms to improve governance and attract foreign investment.",
      ],
      suggestedBreakAfter: 1,
    },
  ],
  ar: [
    {
      image: "/images/blog-page-1.jpg",
      day: "10",
      month: "ديسمبر",
      readTime: "10 دقائق قراءة",
      title:
        "الصومال وتنزانيا تستأنفان الرحلات الجوية المباشرة وتعززان التعاون الثنائي",
      excerpt:
        "أعلنت الصومال وتنزانيا عن اتفاق لاستئناف الرحلات الجوية المباشرة بين مقديشو ودار السلام.",
      body: [
        "مقديشو ودار السلام، في خطوة تهدف إلى تعزيز العلاقات الثنائية بين البلدين.",
        "جاء الإعلان خلال الاحتفال بالذكرى الخامسة والستين لاستقلال الصومال، الذي أقيم في العاصمة التنزانية دار السلام، وشهد أيضًا إعادة افتتاح السفارة الصومالية بعد تجديدات واسعة.",
        "أكد وزير الخارجية والتعاون مع شرق إفريقيا في تنزانيا، محمود ثابت كومبو، أن الجانبين يعملان على تحديث اتفاقية خدمات النقل الجوي، والتي ستسمح برحلات مباشرة دون توقف في مدن وسيطة، مثل نيروبي أو أديس أبابا، مشيرًا إلى أن هذه الخطوة ستساهم في تسهيل الحركة وتعزيز التجارة والسياحة ونقل البضائع بين البلدين.",
        "ترأس الوفد الرسمي وزير الخارجية الصومالي عبد السلام عبد علي، والذي ضم 6 وزراء و6 أعضاء من البرلمان.",
        "اعتبر الوزير إعادة افتتاح السفارة تعبيرًا عن نية بلاده توسيع وجودها الدبلوماسي في المنطقة، مشيرًا إلى التقدم المحرز في بناء المؤسسات الوطنية وتعزيز المصالحة الداخلية.",
        "كشف الوزير عن خطط لتشكيل لجنة وزارية مشتركة ولجنة صداقة برلمانية للإشراف على ملفات التعاون الثنائي، مشيدًا بدور الجالية الصومالية في تنزانيا كحلقة وصل للتواصل بين البلدين.",
        "شملت المحادثات بين الجانبين أيضًا مسودات اتفاقيات جديدة في مجالات الهجرة والتعليم والطيران والصيد والزراعة، بالإضافة إلى تطوير إطار عمل منظم للتعاون في هذه القطاعات الحيوية.",
        "في سياق ذي صلة، تناول الاجتماع انضمام الصومال إلى مجتمع شرق إفريقيا، حيث اعتُبر هذا التطور نقطة تحول ستفتح آفاقًا جديدة للتعاون الإقليمي المشترك.",
      ],
      suggestedBreakAfter: 2,
    },
    {
      image: "/images/blog-page-2.jpg",
      day: "09",
      month: "ديسمبر",
      readTime: "15 دقائق قراءة",
      title:
        "يعلن صندوق النقد الدولي أنه على اتصال بالسنغال على الرغم من تعليق التمويل سابقًا",
      excerpt:
        "قال صندوق النقد الدولي إنه لا يزال متفاعلًا مع السنغال.",
      body: [
        "قال صندوق النقد الدولي إنه لا يزال متفاعلًا مع السنغال، حيث أعلن رئيس الوزراء عثمان سونكو عن خطة انتعاش اقتصادي.",
        "تتضمن الخطة تخصيص مليارات الدولارات لسداد الديون المتراكمة من النظام السابق وإعادة هيكلة مالية البلاد.",
        "على الرغم من تعليق التمويل سابقاً بسبب مخاوف تتعلق بالشفافية المالية، أشار صندوق النقد الدولي إلى استعداده لاستئناف المحادثات.",
        "تعهدت الحكومة السنغالية الجديدة بتنفيذ إصلاحات شاملة لتحسين الحوكمة وجذب الاستثمارات الأجنبية.",
      ],
      suggestedBreakAfter: 1,
    },
    {
      image: "/images/blog-page-3.jpg",
      day: "08",
      month: "ديسمبر",
      readTime: "10 دقائق قراءة",
      title:
        "يدعو صندوق النقد الدولي نيجيريا إلى إعادة ضبط ميزانيتها لتخفيض أسعار النفط",
      excerpt:
        "يحتاج صندوق النقد الدولي ونيجيريا إلى تعديل ميزانية 2025.",
      body: [
        "دعا صندوق النقد الدولي نيجيريا إلى إعادة ضبط ميزانيتها لتعكس انخفاض أسعار النفط وزيادة التحويلات النقدية لحماية الفئات الضعيفة.",
        "تأتي هذه التوصية في ظل تقلبات أسواق النفط العالمية التي أثرت بشكل كبير على التوقعات المالية لنيجيريا للعام الحالي.",
        "أكد مسؤولو الصندوق أن نيجيريا بحاجة إلى تنويع مصادر إيراداتها بعيداً عن صادرات النفط لبناء اقتصاد أكثر مرونة.",
        "كما اقترح الصندوق زيادة الإنفاق على الحماية الاجتماعية لحماية أكثر شرائح السكان ضعفاً من آثار التكيف الاقتصادي.",
      ],
      suggestedBreakAfter: 1,
    },
  ],
};

const suggestedArticles: { en: SuggestedArticle[]; ar: SuggestedArticle[] } = {
  en: [
    {
      image: "/images/blog-page-2.jpg",
      title:
        "The United States lifts restrictions on software exports to China as part of a trade agreement",
      slug: 1,
    },
    {
      image: "/images/blog-page-3.jpg",
      title:
        "Saudi Arabia and Indonesia sign agreements worth $27 billion",
      slug: 2,
    },
    {
      image: "/images/blog-page-1.jpg",
      title:
        "Syrian-Jordanian talks to strengthen cooperation in energy and water",
      slug: 0,
    },
    {
      image: "/images/blog-page-2.jpg",
      title: "Trump's budget bill falters in Congress",
      slug: 1,
    },
  ],
  ar: [
    {
      image: "/images/blog-page-2.jpg",
      title:
        "الولايات المتحدة ترفع القيود على صادرات البرمجيات إلى الصين كجزء من اتفاق تجاري",
      slug: 1,
    },
    {
      image: "/images/blog-page-3.jpg",
      title:
        "السعودية وإندونيسيا توقعان اتفاقيات بقيمة 27 مليار دولار",
      slug: 2,
    },
    {
      image: "/images/blog-page-1.jpg",
      title:
        "محادثات سورية-أردنية لتعزيز التعاون في مجالات الطاقة والمياه",
      slug: 0,
    },
    {
      image: "/images/blog-page-2.jpg",
      title: "مشروع ميزانية ترامب يتعثر في الكونغرس",
      slug: 1,
    },
  ],
};

const moreArticlesCards = {
  en: [
    {
      image: "/images/blog-page-1.jpg",
      day: "08",
      month: "December",
      readTime: "15 min read",
      title: "How fintech is changing the game",
      excerpt:
        "How technologies are reshaping the financial landscape and driving business success.",
      slug: 0,
    },
    {
      image: "/images/blog-page-2.jpg",
      day: "09",
      month: "December",
      readTime: "7 min read",
      title: "The power of AI in financial decision-making",
      excerpt:
        "Learn how AI transforms financial strategies through real-time insights.",
      slug: 1,
    },
    {
      image: "/images/blog-page-3.jpg",
      day: "10",
      month: "December",
      readTime: "10 min read",
      title: "5 tips to optimize your financial operations today",
      excerpt:
        "Practical tips to streamline workflow and reduce costs using advanced tools.",
      slug: 2,
    },
  ],
  ar: [
    {
      image: "/images/blog-page-1.jpg",
      day: "08",
      month: "ديسمبر",
      readTime: "15 دقائق قراءة",
      title: "كيف تغير التكنولوجيا المالية قواعد اللعبة",
      excerpt:
        "كيف تعيد التقنيات تشكيل المشهد المالي وتدفع نحو نجاح الأعمال.",
      slug: 0,
    },
    {
      image: "/images/blog-page-2.jpg",
      day: "09",
      month: "ديسمبر",
      readTime: "7 دقائق قراءة",
      title: "قوة الذكاء الاصطناعي في اتخاذ القرارات المالية",
      excerpt:
        "تعلم كيف يقوم الذكاء الاصطناعي بتحويل الاستراتيجيات المالية من خلال رؤى في الوقت الحقيقي.",
      slug: 1,
    },
    {
      image: "/images/blog-page-3.jpg",
      day: "10",
      month: "ديسمبر",
      readTime: "10 دقائق قراءة",
      title: "5 نصائح لتحسين عملياتك المالية اليوم",
      excerpt:
        "نصائح عملية لتبسيط سير العمل وتقليل التكاليف باستخدام أدوات متطورة.",
      slug: 2,
    },
  ],
};

const labels = {
  en: {
    suggestedTopics: "Suggested topics for you",
    moreArticles: "More Articles",
    readMore: "Read More",
  },
  ar: {
    suggestedTopics: "مواضيع مقترحة لك",
    moreArticles: "مقالات أكثر",
    readMore: "اقرأ المزيد",
  },
};

export default function BlogArticlePage({ slug }: { slug: string }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const t = labels[lang];
  const articleList = articles[lang];
  const idx = parseInt(slug, 10);
  const article = articleList[idx] || articleList[0];
  const suggested = suggestedArticles[lang];
  const moreCards = moreArticlesCards[lang];
  const breakAfter = article.suggestedBreakAfter ?? 2;

  const bodyBefore = article.body.slice(0, breakAfter);
  const bodyAfter = article.body.slice(breakAfter);

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
          <h1 className="text-white text-[28px] md:text-[36px] xl:text-[40px] font-medium leading-[1.4] max-w-[776px]">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[64px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[840px] mx-auto relative"
        >
          {/* Date badge + action icons */}
          <div className="flex items-start justify-between mb-[30px] md:mb-[40px]">
            {/* Date badge + read time (right side in RTL) */}
            <div className="flex items-end gap-4">
              <div className="bg-[#12953d] rounded-[15px] overflow-hidden w-[94px]">
                <div className="flex flex-col items-center p-[10px]">
                  <span className="text-white text-[40px] font-bold leading-[40px]">
                    {article.day}
                  </span>
                </div>
                <div className="bg-[#b0f127] rounded-b-[15px] rounded-t-[5px] px-[10px] py-[3px] text-center">
                  <span className="text-[#0e314c] text-[14px] leading-[25.2px]">
                    {article.month}
                  </span>
                </div>
              </div>
              <span className="text-[#6084a4] text-[14px] leading-[25.2px] pb-1">
                {article.readTime}
              </span>
            </div>

            {/* Bookmark + Share icons */}
            <div className="flex items-center gap-[8px]">
              <button className="w-[44px] h-[44px] rounded-full bg-[#f9f9f9] flex items-center justify-center hover:bg-[#eee] transition-colors">
                <svg
                  width="14"
                  height="18"
                  viewBox="0 0 14 18"
                  fill="none"
                  stroke="#0e314c"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 17L7 13L1 17V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H11C11.5304 1 12.0391 1.21071 12.4142 1.58579C12.7893 1.96086 13 2.46957 13 3V17Z" />
                </svg>
              </button>
              <button className="w-[44px] h-[44px] rounded-full bg-[#f9f9f9] flex items-center justify-center hover:bg-[#eee] transition-colors">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0e314c"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
            </div>
          </div>

          {/* Article Image */}
          <div className="relative aspect-[840/470] rounded-[25px] overflow-hidden mb-[40px]">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Body text - before suggested */}
          <div className="flex flex-col gap-[16px] mb-[40px]">
            {bodyBefore.map((p, i) => (
              <p
                key={i}
                className="text-[#6084a4] text-[15px] md:text-[16px] leading-[1.4] text-start"
              >
                {p}
              </p>
            ))}
          </div>

          {/* Suggested Topics */}
          <div className="bg-[#f8f8f8] border border-[#cacceb] rounded-[25px] p-[20px] md:p-[24px] mb-[40px]">
            <h3 className="text-[#0e314c] text-[16px] md:text-[18px] font-bold leading-[21.6px] mb-[16px] text-end">
              {t.suggestedTopics}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              {suggested.map((item, i) => (
                <Link
                  key={i}
                  href={`/blog/${item.slug}`}
                  className="bg-white rounded-[16px] p-[14px] flex items-center gap-[12px] hover:shadow-md transition-shadow"
                >
                  <p className="flex-1 text-[#6084a4] text-[13px] md:text-[14px] font-semibold leading-[21px] text-start">
                    {item.title}
                  </p>
                  <div className="relative w-[71px] h-[60px] rounded-[8px] overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Body text - after suggested */}
          <div className="flex flex-col gap-[16px]">
            {bodyAfter.map((p, i) => (
              <p
                key={i}
                className="text-[#6084a4] text-[15px] md:text-[16px] leading-[1.4] text-start"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* More Articles */}
      <section className="bg-white pb-[60px] md:pb-[80px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto"
        >
          <h2 className="text-[#0e314c] text-[32px] md:text-[40px] leading-[48px] text-center mb-[40px]">
            {t.moreArticles}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[40px]">
            {moreCards.map((card, i) => (
              <div key={i} className="flex flex-col">
                {/* Image */}
                <Link
                  href={`/blog/${card.slug}`}
                  className={`relative aspect-[421/300] overflow-hidden block ${
                    isAr
                      ? "rounded-tr-[125px] rounded-tl-[25px]"
                      : "rounded-tl-[125px] rounded-tr-[25px]"
                  }`}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Content */}
                <div className="border border-[#cacceb] border-t-0 rounded-b-[25px] relative pb-[30px] pt-[56px] px-[30px] text-start">
                  {/* Date badge + read time */}
                  <div
                    className={`flex items-end gap-4 absolute top-0 ${
                      isAr
                        ? "right-[30px] left-[30px] flex-row-reverse"
                        : "left-[30px] right-[30px]"
                    }`}
                  >
                    <div className="relative -mt-[62px]">
                      <div className="bg-[#12953d] rounded-[15px] overflow-hidden w-[94px]">
                        <div className="flex flex-col items-center p-[10px]">
                          <span className="text-white text-[40px] font-bold leading-[40px]">
                            {card.day}
                          </span>
                        </div>
                        <div className="bg-[#b0f127] rounded-b-[15px] rounded-t-[5px] px-[10px] py-[3px] text-center">
                          <span className="text-[#0e314c] text-[14px] leading-[25.2px]">
                            {card.month}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[#6084a4] text-[14px] leading-[25.2px] pb-1">
                      {card.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[#0e314c] text-[20px] md:text-[24px] leading-[26px] md:leading-[28.8px] mb-[10px]">
                    {card.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[#6084a4] text-[14px] leading-[25.2px] mb-[26px] line-clamp-2">
                    {card.excerpt}
                  </p>

                  {/* Read More */}
                  <Link
                    href={`/blog/${card.slug}`}
                    className="inline-flex items-center justify-center px-[36px] py-[15px] border border-[#12953d] rounded-[5px] text-[#0e314c] text-[14px] font-semibold leading-[21px] hover:bg-[#12953d] hover:text-white transition-all"
                  >
                    {t.readMore}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
