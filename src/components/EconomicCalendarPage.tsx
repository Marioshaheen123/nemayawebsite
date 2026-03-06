"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";

// ─── Types ───────────────────────────────────────────────────────────────────
interface CalendarEvent {
  time: string;
  currency: string;
  event: string;
  impact: 1 | 2 | 3;
  actual: string | null;
  expected: string | null;
  previous: string | null;
}

interface CalendarDay {
  date: string;
  label: string;
  events: CalendarEvent[];
}

type FilterKey = "all" | "today" | "week" | "nextweek";

interface EconomicCalendarPageProps {
  sampleData: { en: CalendarDay[]; ar: CalendarDay[] };
  i18n: any;
  currencyToCountry: Record<string, string>;
}

async function fetchCalendarEvents(
  filter: FilterKey,
  lang: "en" | "ar",
  sampleData: { en: CalendarDay[]; ar: CalendarDay[] }
): Promise<CalendarDay[]> {
  const res = await fetch(`/api/economic-calendar?filter=${filter}&lang=${lang}`);
  if (!res.ok) throw new Error("Failed to fetch");
  const data: CalendarDay[] = await res.json();
  // If API returns empty (no provider configured yet), fall back to sample data
  return data.length > 0 ? data : sampleData[lang];
}

function CurrencyFlag({ currency, currencyToCountry }: { currency: string; currencyToCountry: Record<string, string> }) {
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
    1: { filled: "var(--color-primary)", border: "var(--color-primary)", bg: "#dff7df" },
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
export default function EconomicCalendarPage({
  sampleData,
  i18n,
  currencyToCountry,
}: EconomicCalendarPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCalendarEvents(activeFilter, lang, sampleData);
      setDays(data);
    } catch {
      setDays(sampleData[lang]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, lang, sampleData]);

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
      <PageHeroBanner
        title={i18n.heroTitle[lang]}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: "/" },
          { label: i18n.heroTitle[lang] },
        ]}
      />

      {/* Calendar Content */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[64px]">
        <div dir={isAr ? "rtl" : undefined} className="max-w-7xl mx-auto px-6">
          {/* Filter Tabs */}
          <div className="bg-[#f9f9f9] rounded-[12px] p-[16px] mb-[40px]">
            <div className="flex flex-wrap gap-[8px]">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-[8px] px-[24px] py-[15px] rounded-[8px] text-[14px] font-medium transition-all cursor-pointer ${
                    activeFilter === f.key
                      ? "bg-site-gradient text-white"
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
                <div className="w-[24px] h-[24px] border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
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
                {headers.map((h: string, i: number) => (
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
                              <CurrencyFlag currency={ev.currency} currencyToCountry={currencyToCountry} />
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
                          <CurrencyFlag currency={ev.currency} currencyToCountry={currencyToCountry} />
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
