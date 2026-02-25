"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/context/LanguageContext";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface CalendarEvent {
  time: string;
  currency: string;
  event: string;
  impact: 1 | 2 | 3; // 1 = low, 2 = medium, 3 = high
  actual: string | null;
  expected: string | null;
  previous: string | null;
}

export interface CalendarDay {
  date: string; // ISO date string e.g. "2026-01-05"
  label: string; // Display label e.g. "Monday, January 5, 2026"
  events: CalendarEvent[];
}

// ─── Sample / fallback data ──────────────────────────────────────────────────
const sampleData: { en: CalendarDay[]; ar: CalendarDay[] } = {
  en: [
    {
      date: "2026-01-05",
      label: "Monday, January 5, 2026",
      events: [
        { time: "02:00", currency: "RUB", event: "New Year's holiday week", impact: 1, actual: null, expected: null, previous: null },
        { time: "02:30", currency: "JPY", event: "S&P Global Manufacturing PMI Finale (December)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "03:15", currency: "CNY", event: "RatingDog PMI Services (December)", impact: 2, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "03:45", currency: "CNY", event: "RatingDog Composite Purchasing Managers' Index (December)", impact: 3, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "04:30", currency: "SGD", event: "Year-on-year retail sales (November)", impact: 3, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "05:00", currency: "SGD", event: "Retail sales on a monthly basis (November)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "05:45", currency: "EUR", event: "Year-on-year retail sales (November)", impact: 2, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "06:20", currency: "TRY", event: "Producer Price Index (PPI) on an annual basis (December)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
      ],
    },
    {
      date: "2026-01-06",
      label: "Tuesday, January 6, 2026",
      events: [
        { time: "02:00", currency: "RUB", event: "New Year's holiday week", impact: 1, actual: null, expected: null, previous: null },
        { time: "02:30", currency: "JPY", event: "S&P Global Manufacturing PMI Finale (December)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "03:15", currency: "CNY", event: "RatingDog PMI Services (December)", impact: 2, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "03:45", currency: "CNY", event: "RatingDog Composite Purchasing Managers' Index (December)", impact: 3, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "04:30", currency: "SGD", event: "Year-on-year retail sales (November)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "05:00", currency: "SGD", event: "Retail sales on a monthly basis (November)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "05:45", currency: "EUR", event: "Year-on-year retail sales (November)", impact: 2, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "06:20", currency: "TRY", event: "Producer Price Index (PPI) on an annual basis (December)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
      ],
    },
  ],
  ar: [
    {
      date: "2026-01-05",
      label: "الإثنين، 5 يناير 2026",
      events: [
        { time: "02:00", currency: "RUB", event: "أسبوع عطلة رأس السنة الجديدة", impact: 1, actual: null, expected: null, previous: null },
        { time: "02:30", currency: "JPY", event: "مؤشر مديري المشتريات التصنيعي من S&P Global (ديسمبر)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "03:15", currency: "CNY", event: "تصنيف خدمات PMI من RatingDog (ديسمبر)", impact: 2, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "03:45", currency: "CNY", event: "مؤشر مديري المشتريات المركب من RatingDog (ديسمبر)", impact: 3, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "04:30", currency: "SGD", event: "مبيعات التجزئة على أساس سنوي (نوفمبر)", impact: 3, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "05:00", currency: "SGD", event: "مبيعات التجزئة على أساس شهري (نوفمبر)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "05:45", currency: "EUR", event: "مبيعات التجزئة على أساس سنوي (نوفمبر)", impact: 2, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "06:20", currency: "TRY", event: "مؤشر أسعار المنتجين (PPI) على أساس سنوي (ديسمبر)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
      ],
    },
    {
      date: "2026-01-06",
      label: "الثلاثاء، 6 يناير 2026",
      events: [
        { time: "02:00", currency: "RUB", event: "أسبوع عطلة رأس السنة الجديدة", impact: 1, actual: null, expected: null, previous: null },
        { time: "02:30", currency: "JPY", event: "مؤشر مديري المشتريات التصنيعي من S&P Global (ديسمبر)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "03:15", currency: "CNY", event: "تصنيف خدمات PMI من RatingDog (ديسمبر)", impact: 2, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "03:45", currency: "CNY", event: "مؤشر مديري المشتريات المركب من RatingDog (ديسمبر)", impact: 3, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "04:30", currency: "SGD", event: "مبيعات التجزئة على أساس سنوي (نوفمبر)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "05:00", currency: "SGD", event: "مبيعات التجزئة على أساس شهري (نوفمبر)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "05:45", currency: "EUR", event: "مبيعات التجزئة على أساس سنوي (نوفمبر)", impact: 2, actual: "50.0", expected: "49.7", previous: "48.7" },
        { time: "06:20", currency: "TRY", event: "مؤشر أسعار المنتجين (PPI) على أساس سنوي (ديسمبر)", impact: 1, actual: "50.0", expected: "49.7", previous: "48.7" },
      ],
    },
  ],
};

// ─── i18n labels ─────────────────────────────────────────────────────────────
const i18n = {
  heroTitle: { en: "Economic Calendar", ar: "التقويم الاقتصادي" },
  filters: {
    en: [
      "Current and Future Economic Events",
      "Today",
      "This Week",
      "Next Week's Events",
    ],
    ar: [
      "الأحداث الاقتصادية الحالية والمستقبلية",
      "اليوم",
      "هذا الأسبوع",
      "أحداث الأسبوع المقبل",
    ],
  },
  tableHeaders: {
    en: ["Time", "Currency", "The Event", "Market Fluctuations", "Actual", "Expected", "Previous"],
    ar: ["الوقت", "العملة", "الحدث", "تقلبات السوق", "الفعلية", "المتوقعة", "السابق"],
  },
  loading: { en: "Loading events...", ar: "جاري تحميل الأحداث..." },
  noEvents: { en: "No events found for this period.", ar: "لم يتم العثور على أحداث لهذه الفترة." },
};

type FilterKey = "all" | "today" | "week" | "nextweek";

// ─── API fetch function (ready to wire up) ───────────────────────────────────
/**
 * Replace this function body with your actual API call.
 * Expected to return CalendarDay[] for the given filter and language.
 *
 * Example API integration:
 *   const res = await fetch(`/api/economic-calendar?filter=${filter}&lang=${lang}`);
 *   return res.json();
 */
async function fetchCalendarEvents(
  filter: FilterKey,
  lang: "en" | "ar"
): Promise<CalendarDay[]> {
  // TODO: Replace with real API call
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));
  return sampleData[lang];
}

// ─── Currency → country code mapping ─────────────────────────────────────────
const currencyToCountry: Record<string, string> = {
  USD: "us", EUR: "eu", GBP: "gb", JPY: "jp", CNY: "cn", CHF: "ch",
  AUD: "au", CAD: "ca", NZD: "nz", SGD: "sg", HKD: "hk", SEK: "se",
  NOK: "no", DKK: "dk", RUB: "ru", TRY: "tr", ZAR: "za", BRL: "br",
  MXN: "mx", INR: "in", KRW: "kr", IDR: "id", MYR: "my", PHP: "ph",
  THB: "th", PLN: "pl", CZK: "cz", HUF: "hu", ILS: "il", SAR: "sa",
  AED: "ae", KWD: "kw", QAR: "qa", BHD: "bh", OMR: "om", EGP: "eg",
  CLP: "cl", COP: "co", PEN: "pe", ARS: "ar", TWD: "tw", VND: "vn",
};

function CurrencyFlag({ currency }: { currency: string }) {
  const code = currencyToCountry[currency.toUpperCase()];
  if (!code) return null;
  return (
    <Image
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={currency}
      width={24}
      height={24}
      className="w-[24px] h-[24px] rounded-full object-cover shrink-0"
    />
  );
}

// ─── Impact star component ───────────────────────────────────────────────────
function ImpactStars({ level }: { level: 1 | 2 | 3 }) {
  const colors: Record<1 | 2 | 3, { filled: string; border: string; bg: string }> = {
    1: { filled: "#12953d", border: "#12953d", bg: "#dff7df" },
    2: { filled: "#e6a817", border: "#e6a817", bg: "#fef9e7" },
    3: { filled: "#e53e3e", border: "#e53e3e", bg: "#fde8e8" },
  };
  const { filled, border, bg } = colors[level];

  return (
    <div
      className="inline-flex items-center gap-[4px] p-[6px] rounded-[4px] border"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      {[1, 2, 3].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= level ? filled : "none"}
          stroke={star <= level ? filled : "#cbd5e0"}
          strokeWidth="2"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function EconomicCalendarPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCalendarEvents(activeFilter, lang);
      setDays(data);
    } catch {
      setDays(sampleData[lang]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, lang]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: i18n.filters[lang][0] },
    { key: "today", label: i18n.filters[lang][1] },
    { key: "week", label: i18n.filters[lang][2] },
    { key: "nextweek", label: i18n.filters[lang][3] },
  ];

  const headers = i18n.tableHeaders[lang];

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
            {i18n.heroTitle[lang]}
          </h1>
        </div>
      </section>

      {/* Calendar Content */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[64px] px-4 md:px-[52px] xl:px-[64px] 2xl:px-[120px]">
        <div dir={isAr ? "rtl" : undefined} className="max-w-[1335px] 2xl:max-w-[1535px] mx-auto">
          {/* Filter Tabs */}
          <div className="bg-[#f9f9f9] rounded-[12px] p-[16px] mb-[40px]">
            <div className="flex flex-wrap gap-[8px]">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-[8px] px-[24px] py-[15px] rounded-[8px] text-[14px] font-medium transition-all cursor-pointer ${
                    activeFilter === f.key
                      ? "bg-[#12953d] text-white"
                      : "bg-white text-[#0e314c] border border-[#e5e7eb] hover:bg-[#f0f0f0]"
                  }`}
                >
                  {f.label}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isAr ? "rotate-180" : ""}
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-[80px]">
              <div className="flex items-center gap-[12px] text-[#6084a4] text-[16px]">
                <div className="w-[24px] h-[24px] border-[3px] border-[#12953d] border-t-transparent rounded-full animate-spin" />
                {i18n.loading[lang]}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && days.length === 0 && (
            <div className="flex items-center justify-center py-[80px]">
              <p className="text-[#6084a4] text-[16px]">{i18n.noEvents[lang]}</p>
            </div>
          )}

          {/* Table */}
          {!loading && days.length > 0 && (
            <div className="rounded-[12px] overflow-hidden border border-[#001005]">
              {/* Table Header */}
              <div className="bg-[#001005] hidden md:flex items-center rounded-t-[12px]">
                {headers.map((h, i) => (
                  <div
                    key={i}
                    className={`px-[12px] py-[16px] text-white text-[14px] font-semibold whitespace-nowrap ${
                      i === 2
                        ? "flex-1"
                        : i === 0
                        ? "w-[105px]"
                        : i === 1
                        ? "w-[102px]"
                        : i === 3
                        ? "w-[128px] text-center"
                        : "w-[100px] text-center"
                    }`}
                  >
                    {h}
                  </div>
                ))}
              </div>

              {/* Days */}
              {days.map((day) => (
                <div key={day.date}>
                  {/* Day header */}
                  <div className="bg-[#f9f9f9] border-b border-[#cacceb] px-[12px] py-[10px] text-center">
                    <span className="text-[#0e314c] text-[14px] font-bold">
                      {day.label}
                    </span>
                  </div>

                  {/* Events */}
                  {day.events.map((ev, ei) => (
                    <div
                      key={ei}
                      className={`flex flex-col md:flex-row md:items-center border-b border-[#cacceb] ${
                        ei % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"
                      }`}
                    >
                      {/* Mobile layout */}
                      <div className="md:hidden p-[16px] flex flex-col gap-[8px]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-[12px]">
                            <span className="text-[#0e314c] text-[14px]">{ev.time}</span>
                            <div className="flex items-center gap-[6px]">
                              <CurrencyFlag currency={ev.currency} />
                              <span className="text-[#00470d] text-[14px] font-bold">{ev.currency}</span>
                            </div>
                          </div>
                          <ImpactStars level={ev.impact} />
                        </div>
                        <p className="text-[#0e314c] text-[14px]">{ev.event}</p>
                        <div className="flex items-center gap-[16px] text-[14px]">
                          <span className={ev.actual !== null ? "text-[#0e314c] bg-[#dff7df] px-[8px] py-[2px] rounded" : "text-[#6b7280]"}>
                            {ev.actual ?? "-"}
                          </span>
                          <span className="text-[#6b7280]">{ev.expected ?? "-"}</span>
                          <span className="text-[#6b7280]">{ev.previous ?? "-"}</span>
                        </div>
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden md:flex md:items-center w-full">
                        {/* Time */}
                        <div className="w-[105px] px-[12px] py-[10px] text-center">
                          <span className="text-[#0e314c] text-[14px]">{ev.time}</span>
                        </div>
                        {/* Currency */}
                        <div className="w-[102px] px-[12px] py-[8px] flex items-center justify-center gap-[6px]">
                          <CurrencyFlag currency={ev.currency} />
                          <span className="text-[#00470d] text-[14px] font-bold">{ev.currency}</span>
                        </div>
                        {/* Event */}
                        <div className="flex-1 px-[12px] py-[10px]">
                          <span className="text-[#0e314c] text-[14px]">{ev.event}</span>
                        </div>
                        {/* Impact */}
                        <div className="w-[128px] px-[12px] py-[10px] flex items-center justify-center">
                          <ImpactStars level={ev.impact} />
                        </div>
                        {/* Actual */}
                        <div className={`w-[100px] px-[12px] py-[10px] text-center ${ev.actual !== null ? "bg-[#dff7df]" : ""}`}>
                          <span className="text-[#0e314c] text-[14px]">{ev.actual ?? "-"}</span>
                        </div>
                        {/* Expected */}
                        <div className="w-[100px] px-[12px] py-[10px] text-center">
                          <span className="text-[#0e314c] text-[14px]">{ev.expected ?? "-"}</span>
                        </div>
                        {/* Previous */}
                        <div className="w-[100px] px-[12px] py-[10px] text-center">
                          <span className="text-[#0e314c] text-[14px]">{ev.previous ?? "-"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
