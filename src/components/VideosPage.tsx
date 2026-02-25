"use client";

import Image from "next/image";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

interface Video {
  title: string;
  desc: string;
  fullDesc: string;
  takeaways: string[];
  linkText: string;
  day: string;
  month: string;
  duration: string;
  videoUrl: string;
  label?: string;
}

const videos: { en: Video[]; ar: Video[] } = {
  en: [
    {
      title: "Finding Instruments",
      desc: "Learn how to quickly find currencies, commodities, or stocks.",
      fullDesc:
        "Learn how to navigate the Namaya platform to find any asset in seconds. This guide covers currencies, commodities, and stocks.",
      takeaways: [
        "How to use the global search bar.",
        "Filtering by asset class (Forex, Metals, Indices).",
        "Adding an instrument to your Favorites.",
      ],
      linkText: "Try searching in the Trading Platform",
      day: "10",
      month: "December",
      duration: "2 min watch",
      videoUrl: "",
    },
    {
      title: "Login Guide",
      desc: "Easy steps to access your Namaya trading platform.",
      fullDesc:
        "A step-by-step walkthrough to access your Namaya trading account. Learn how to log in securely and set up your profile.",
      takeaways: [
        "How to create your account credentials.",
        "Secure login best practices.",
        "Setting up two-factor authentication.",
      ],
      linkText: "Access the Trading Platform",
      day: "09",
      month: "December",
      duration: "5 min watch",
      videoUrl: "",
    },
    {
      title: "Trade Details",
      desc: "Master the key parameters before opening a new trade.",
      fullDesc:
        "Understand the essential details of every trade. This guide covers order types, lot sizes, and risk management basics.",
      takeaways: [
        "Understanding order types (Market, Limit, Stop).",
        "Setting the right lot size for your account.",
        "Using stop-loss and take-profit levels.",
      ],
      linkText: "Open a trade in the Trading Platform",
      day: "06",
      month: "December",
      duration: "3 min watch",
      videoUrl: "",
    },
    {
      title: "Finding Instruments",
      desc: "Learn how to quickly find currencies, commodities, or stocks.",
      fullDesc:
        "Learn how to navigate the Namaya platform to find any asset in seconds. This guide covers currencies, commodities, and stocks.",
      takeaways: [
        "How to use the global search bar.",
        "Filtering by asset class (Forex, Metals, Indices).",
        "Adding an instrument to your Favorites.",
      ],
      linkText: "Try searching in the Trading Platform",
      day: "02",
      month: "December",
      duration: "2 min watch",
      label: "Video Lesson",
      videoUrl: "",
    },
    {
      title: "Login Guide",
      desc: "Easy steps to access your Namaya trading platform.",
      fullDesc:
        "A step-by-step walkthrough to access your Namaya trading account. Learn how to log in securely and set up your profile.",
      takeaways: [
        "How to create your account credentials.",
        "Secure login best practices.",
        "Setting up two-factor authentication.",
      ],
      linkText: "Access the Trading Platform",
      day: "05",
      month: "November",
      duration: "5 min watch",
      label: "Video Lesson",
      videoUrl: "",
    },
    {
      title: "Trade Details",
      desc: "Master the key parameters before opening a new trade.",
      fullDesc:
        "Understand the essential details of every trade. This guide covers order types, lot sizes, and risk management basics.",
      takeaways: [
        "Understanding order types (Market, Limit, Stop).",
        "Setting the right lot size for your account.",
        "Using stop-loss and take-profit levels.",
      ],
      linkText: "Open a trade in the Trading Platform",
      day: "03",
      month: "November",
      duration: "3 min watch",
      label: "Video Lesson",
      videoUrl: "",
    },
    {
      title: "Finding Instruments",
      desc: "Learn how to quickly find currencies, commodities, or stocks.",
      fullDesc:
        "Learn how to navigate the Namaya platform to find any asset in seconds. This guide covers currencies, commodities, and stocks.",
      takeaways: [
        "How to use the global search bar.",
        "Filtering by asset class (Forex, Metals, Indices).",
        "Adding an instrument to your Favorites.",
      ],
      linkText: "Try searching in the Trading Platform",
      day: "02",
      month: "October",
      duration: "2 min watch",
      label: "Video Lesson",
      videoUrl: "",
    },
    {
      title: "Login Guide",
      desc: "Easy steps to access your Namaya trading platform.",
      fullDesc:
        "A step-by-step walkthrough to access your Namaya trading account. Learn how to log in securely and set up your profile.",
      takeaways: [
        "How to create your account credentials.",
        "Secure login best practices.",
        "Setting up two-factor authentication.",
      ],
      linkText: "Access the Trading Platform",
      day: "05",
      month: "October",
      duration: "5 min watch",
      label: "Video Lesson",
      videoUrl: "",
    },
    {
      title: "Trade Details",
      desc: "Master the key parameters before opening a new trade.",
      fullDesc:
        "Understand the essential details of every trade. This guide covers order types, lot sizes, and risk management basics.",
      takeaways: [
        "Understanding order types (Market, Limit, Stop).",
        "Setting the right lot size for your account.",
        "Using stop-loss and take-profit levels.",
      ],
      linkText: "Open a trade in the Trading Platform",
      day: "03",
      month: "October",
      duration: "3 min watch",
      label: "Video Lesson",
      videoUrl: "",
    },
  ],
  ar: [
    {
      title: "البحث عن الأدوات",
      desc: "تعلم كيفية العثور بسرعة على العملات أو السلع أو الأسهم.",
      fullDesc:
        "تعلم كيفية التنقل في منصة نمايا للعثور على أي أصل في ثوانٍ. يغطي هذا الدليل العملات والسلع والأسهم.",
      takeaways: [
        "كيفية استخدام شريط البحث العام.",
        "التصفية حسب فئة الأصول (فوركس، معادن، مؤشرات).",
        "إضافة أداة إلى المفضلة.",
      ],
      linkText: "جرب البحث في منصة التداول",
      day: "10",
      month: "ديسمبر",
      duration: "شاهد لمدة دقيقتين",
      videoUrl: "",
    },
    {
      title: "دليل تسجيل الدخول",
      desc: "خطوات سهلة للوصول إلى منصة تداول نامايا الخاصة بك.",
      fullDesc:
        "دليل خطوة بخطوة للوصول إلى حساب تداول نمايا الخاص بك. تعلم كيفية تسجيل الدخول بأمان وإعداد ملفك الشخصي.",
      takeaways: [
        "كيفية إنشاء بيانات اعتماد حسابك.",
        "أفضل ممارسات تسجيل الدخول الآمن.",
        "إعداد المصادقة الثنائية.",
      ],
      linkText: "الوصول إلى منصة التداول",
      day: "09",
      month: "ديسمبر",
      duration: "شاهد لمدة خمس دقائق",
      videoUrl: "",
    },
    {
      title: "تفاصيل التجارة",
      desc: "إتقان المعلمات الأساسية قبل فتح صفقة جديدة.",
      fullDesc:
        "فهم التفاصيل الأساسية لكل صفقة. يغطي هذا الدليل أنواع الأوامر وأحجام اللوت وأساسيات إدارة المخاطر.",
      takeaways: [
        "فهم أنواع الأوامر (سوق، حد، وقف).",
        "تحديد حجم اللوت المناسب لحسابك.",
        "استخدام مستويات وقف الخسارة وجني الأرباح.",
      ],
      linkText: "افتح صفقة في منصة التداول",
      day: "06",
      month: "ديسمبر",
      duration: "شاهد لمدة ثلاث دقائق",
      videoUrl: "",
    },
    {
      title: "البحث عن الأدوات",
      desc: "تعلم كيفية العثور بسرعة على العملات أو السلع أو الأسهم.",
      fullDesc:
        "تعلم كيفية التنقل في منصة نمايا للعثور على أي أصل في ثوانٍ. يغطي هذا الدليل العملات والسلع والأسهم.",
      takeaways: [
        "كيفية استخدام شريط البحث العام.",
        "التصفية حسب فئة الأصول (فوركس، معادن، مؤشرات).",
        "إضافة أداة إلى المفضلة.",
      ],
      linkText: "جرب البحث في منصة التداول",
      day: "02",
      month: "ديسمبر",
      duration: "دقيقة مشاهدة",
      label: "درس الفيديو",
      videoUrl: "",
    },
    {
      title: "دليل تسجيل الدخول",
      desc: "خطوات سهلة للوصول إلى منصة تداول نامايا الخاصة بك.",
      fullDesc:
        "دليل خطوة بخطوة للوصول إلى حساب تداول نمايا الخاص بك. تعلم كيفية تسجيل الدخول بأمان وإعداد ملفك الشخصي.",
      takeaways: [
        "كيفية إنشاء بيانات اعتماد حسابك.",
        "أفضل ممارسات تسجيل الدخول الآمن.",
        "إعداد المصادقة الثنائية.",
      ],
      linkText: "الوصول إلى منصة التداول",
      day: "05",
      month: "نوفمبر",
      duration: "دقيقة مشاهدة",
      label: "درس الفيديو",
      videoUrl: "",
    },
    {
      title: "تفاصيل التجارة",
      desc: "إتقان المعلمات الأساسية قبل فتح صفقة جديدة.",
      fullDesc:
        "فهم التفاصيل الأساسية لكل صفقة. يغطي هذا الدليل أنواع الأوامر وأحجام اللوت وأساسيات إدارة المخاطر.",
      takeaways: [
        "فهم أنواع الأوامر (سوق، حد، وقف).",
        "تحديد حجم اللوت المناسب لحسابك.",
        "استخدام مستويات وقف الخسارة وجني الأرباح.",
      ],
      linkText: "افتح صفقة في منصة التداول",
      day: "03",
      month: "نوفمبر",
      duration: "دقيقة مشاهدة",
      label: "درس الفيديو",
      videoUrl: "",
    },
    {
      title: "البحث عن الأدوات",
      desc: "تعلم كيفية العثور بسرعة على العملات أو السلع أو الأسهم.",
      fullDesc:
        "تعلم كيفية التنقل في منصة نمايا للعثور على أي أصل في ثوانٍ. يغطي هذا الدليل العملات والسلع والأسهم.",
      takeaways: [
        "كيفية استخدام شريط البحث العام.",
        "التصفية حسب فئة الأصول (فوركس، معادن، مؤشرات).",
        "إضافة أداة إلى المفضلة.",
      ],
      linkText: "جرب البحث في منصة التداول",
      day: "02",
      month: "أكتوبر",
      duration: "دقيقة مشاهدة",
      label: "درس الفيديو",
      videoUrl: "",
    },
    {
      title: "دليل تسجيل الدخول",
      desc: "خطوات سهلة للوصول إلى منصة تداول نامايا الخاصة بك.",
      fullDesc:
        "دليل خطوة بخطوة للوصول إلى حساب تداول نمايا الخاص بك. تعلم كيفية تسجيل الدخول بأمان وإعداد ملفك الشخصي.",
      takeaways: [
        "كيفية إنشاء بيانات اعتماد حسابك.",
        "أفضل ممارسات تسجيل الدخول الآمن.",
        "إعداد المصادقة الثنائية.",
      ],
      linkText: "الوصول إلى منصة التداول",
      day: "05",
      month: "أكتوبر",
      duration: "دقيقة مشاهدة",
      label: "درس الفيديو",
      videoUrl: "",
    },
    {
      title: "تفاصيل التجارة",
      desc: "إتقان المعلمات الأساسية قبل فتح صفقة جديدة.",
      fullDesc:
        "فهم التفاصيل الأساسية لكل صفقة. يغطي هذا الدليل أنواع الأوامر وأحجام اللوت وأساسيات إدارة المخاطر.",
      takeaways: [
        "فهم أنواع الأوامر (سوق، حد، وقف).",
        "تحديد حجم اللوت المناسب لحسابك.",
        "استخدام مستويات وقف الخسارة وجني الأرباح.",
      ],
      linkText: "افتح صفقة في منصة التداول",
      day: "03",
      month: "أكتوبر",
      duration: "دقيقة مشاهدة",
      label: "درس الفيديو",
      videoUrl: "",
    },
  ],
};

const heroTitle = { en: "Video", ar: "فيديو" };
const watchNowLabel = { en: "Watch Now", ar: "شاهد الآن" };
const moreVideoLabel = { en: "More video", ar: "المزيد من الفيديو" };
const keyTakeawaysLabel = { en: "Key Takeaways:", ar: "النقاط الرئيسية:" };
const directLinkLabel = { en: "Direct Link to Tool:", ar: "رابط مباشر للأداة:" };

export default function VideosPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const items = videos[lang];

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Detail view
  if (selectedIndex !== null) {
    const video = items[selectedIndex];
    const otherVideos = items.filter((_, i) => i !== selectedIndex).slice(0, 3);

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
            <h1 className="text-white text-[28px] md:text-[36px] xl:text-[40px] font-medium leading-[1.4]">
              {video.title}
            </h1>
          </div>
        </section>

        {/* Video Detail Content */}
        <section className="bg-white py-[40px] md:py-[60px] xl:py-[64px] px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
          <div
            dir={isAr ? "rtl" : undefined}
            className="max-w-[840px] mx-auto"
          >
            {/* Video Player + Sidebar */}
            <div className="flex flex-col lg:flex-row gap-[24px] lg:gap-[40px] items-start">
              {/* Video Player */}
              <div className="w-full lg:flex-1">
                <div className="relative aspect-[840/470] bg-[#001005] rounded-[16px] overflow-hidden">
                  {isPlaying && video.videoUrl ? (
                    <video
                      src={video.videoUrl}
                      controls
                      autoPlay
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <Image
                        src="/images/video-card-bg.jpg"
                        alt={video.title}
                        fill
                        className="object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-[rgba(91,255,187,0.1)]" />
                      {/* Play button */}
                      <button
                        onClick={() => {
                          if (video.videoUrl) setIsPlaying(true);
                        }}
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      >
                        <div className="w-[80px] md:w-[120px] h-[80px] md:h-[120px] rounded-full bg-white/24 flex items-center justify-center">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Sidebar: Date + Actions */}
              <div className="flex lg:flex-col items-center lg:items-start gap-[16px]">
                {/* Date badge */}
                <div className="flex items-end gap-[16px]">
                  <div className="bg-[#12953d] rounded-[15px] overflow-hidden w-[94px]">
                    <div className="flex flex-col items-center p-[10px]">
                      <span className="text-white text-[40px] font-bold leading-[40px]">
                        {video.day}
                      </span>
                    </div>
                    <div className="bg-[#b0f127] rounded-b-[15px] rounded-t-[5px] px-[10px] py-[3px] text-center">
                      <span className="text-[#0e314c] text-[14px] leading-[25.2px]">
                        {video.month}
                      </span>
                    </div>
                  </div>
                  <span className="text-[#6084a4] text-[14px] leading-[25.2px] pb-[4px]">
                    {video.duration}
                  </span>
                </div>
                {/* Share + Bookmark */}
                <div className="flex items-center gap-[8px]">
                  <button className="w-[44px] h-[44px] rounded-full bg-[#f9f9f9] flex items-center justify-center hover:bg-[#e9e9e9] transition-colors">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0e314c"
                      strokeWidth="2"
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
                  <button className="w-[44px] h-[44px] rounded-full bg-[#f9f9f9] flex items-center justify-center hover:bg-[#e9e9e9] transition-colors">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0e314c"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-[40px] flex flex-col gap-[24px]">
              <p className="text-[#6084a4] text-[16px] leading-[1.4]">
                {video.fullDesc}
              </p>

              {/* Key Takeaways */}
              <div className="flex flex-col gap-[16px]">
                <h3 className="text-[#0e314c] text-[18px] font-bold leading-[21.6px]">
                  {keyTakeawaysLabel[lang]}
                </h3>
                <ul className="list-disc text-[#6084a4] text-[16px] leading-[1.4] ms-[24px] flex flex-col gap-[4px]">
                  {video.takeaways.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              {/* Direct Link */}
              <div className="flex flex-col gap-[16px]">
                <h3 className="text-[#0e314c] text-[18px] font-bold leading-[21.6px]">
                  {directLinkLabel[lang]}
                </h3>
                <a
                  href="/trading-platforms"
                  className="inline-flex items-center gap-[8px] text-[#6084a4] text-[16px] font-bold leading-[1.4] underline hover:text-[#0e314c] transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  {video.linkText}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* More Videos Section */}
        <section className="bg-white pb-[60px] md:pb-[80px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
          <div
            dir={isAr ? "rtl" : undefined}
            className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto"
          >
            <h2 className="text-[#0e314c] text-[32px] md:text-[40px] font-normal leading-[48px] text-center mb-[40px]">
              {moreVideoLabel[lang]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[30px]">
              {otherVideos.map((v, i) => {
                const originalIndex = items.indexOf(v);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedIndex(originalIndex);
                      setIsPlaying(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex flex-col text-start cursor-pointer"
                  >
                    {/* Card thumbnail */}
                    <div className="relative h-[200px] w-full rounded-tl-[125px] rounded-tr-[25px] overflow-hidden bg-[#001005]">
                      <Image
                        src="/images/video-card-bg.jpg"
                        alt={v.title}
                        fill
                        className="object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-[rgba(91,255,187,0.1)]" />
                      {/* Nemaya logo watermark */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[80px] h-[80px] rounded-full bg-white border border-[#cacceb] flex items-center justify-center">
                          <Image
                            src="/images/nemayalogo.png"
                            alt=""
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="relative border border-[#cacceb] border-t-0 rounded-b-[25px] pt-[56px] pb-[30px] px-[30px] flex flex-col gap-[26px]">
                      {/* Date badge - overlapping */}
                      <div
                        className={`absolute top-0 flex items-end gap-[16px] ${
                          isAr ? "right-[29px]" : "left-[29px]"
                        }`}
                      >
                        <div className="bg-[#12953d] rounded-[15px] overflow-hidden w-[94px] -mt-[62px]">
                          <div className="flex flex-col items-center p-[10px]">
                            <span className="text-white text-[40px] font-bold leading-[40px]">
                              {v.day}
                            </span>
                          </div>
                          <div className="bg-[#b0f127] rounded-b-[15px] rounded-t-[5px] px-[10px] py-[3px] text-center">
                            <span className="text-[#0e314c] text-[14px] leading-[25.2px]">
                              {v.month}
                            </span>
                          </div>
                        </div>
                        <span className="text-[#6084a4] text-[14px] leading-[25.2px] pb-[4px]">
                          {v.duration}
                        </span>
                      </div>

                      {/* Title + Desc */}
                      <div className="flex flex-col gap-[10px]">
                        <h3 className="text-[#0e314c] text-[24px] font-normal leading-[28.8px]">
                          {v.title}
                        </h3>
                        <p className="text-[#6084a4] text-[14px] leading-[25.2px]">
                          {v.desc}
                        </p>
                      </div>

                      {/* Watch Now */}
                      <span className="inline-flex items-center justify-center self-start px-[36px] py-[15px] rounded-[5px] border border-[#12953d] text-[#0e314c] text-[14px] font-semibold hover:bg-[#12953d] hover:text-white transition-all">
                        {watchNowLabel[lang]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </>
    );
  }

  // Grid listing view
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

      {/* Video Grid */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[80px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[30px]">
            {items.map((video, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedIndex(i);
                  setIsPlaying(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex flex-col text-start cursor-pointer"
              >
                {/* Card thumbnail */}
                <div className="relative h-[200px] w-full rounded-tl-[125px] rounded-tr-[25px] overflow-hidden bg-[#001005]">
                  <Image
                    src="/images/video-card-bg.jpg"
                    alt={video.title}
                    fill
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-[rgba(91,255,187,0.1)]" />
                  {/* Nemaya logo watermark */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[80px] h-[80px] rounded-full bg-white border border-[#cacceb] flex items-center justify-center">
                      <Image
                        src="/images/nemayalogo.png"
                        alt=""
                        width={30}
                        height={30}
                      />
                    </div>
                  </div>
                </div>

                {/* Card content */}
                <div className="relative border border-[#cacceb] border-t-0 rounded-b-[25px] pt-[56px] pb-[30px] px-[30px] flex flex-col gap-[26px] w-full">
                  {/* Date badge - overlapping */}
                  <div
                    className={`absolute top-0 flex items-end gap-[16px] ${
                      isAr ? "right-[29px]" : "left-[29px]"
                    }`}
                  >
                    <div className="bg-[#12953d] rounded-[15px] overflow-hidden w-[94px] -mt-[62px]">
                      <div className="flex flex-col items-center p-[10px]">
                        <span className="text-white text-[40px] font-bold leading-[40px]">
                          {video.day}
                        </span>
                      </div>
                      <div className="bg-[#b0f127] rounded-b-[15px] rounded-t-[5px] px-[10px] py-[3px] text-center">
                        <span className="text-[#0e314c] text-[14px] leading-[25.2px]">
                          {video.month}
                        </span>
                      </div>
                    </div>
                    <span className="text-[#6084a4] text-[14px] leading-[25.2px] pb-[4px]">
                      {video.duration}
                    </span>
                  </div>

                  {/* Title + Desc */}
                  <div className="flex flex-col gap-[10px]">
                    <h3 className="text-[#0e314c] text-[24px] font-normal leading-[28.8px]">
                      {video.title}
                    </h3>
                    <p className="text-[#6084a4] text-[14px] leading-[25.2px]">
                      {video.desc}
                    </p>
                  </div>

                  {/* Watch Now */}
                  <span className="inline-flex items-center justify-center self-start px-[36px] py-[15px] rounded-[5px] border border-[#12953d] text-[#0e314c] text-[14px] font-semibold hover:bg-[#12953d] hover:text-white transition-all">
                    {watchNowLabel[lang]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
