import type { Bilingual } from "@/data/types";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface CalendarEvent {
  time: string;
  currency: string;
  event: string;
  impact: 1 | 2 | 3;
  actual: string | null;
  expected: string | null;
  previous: string | null;
}

export interface CalendarDay {
  date: string;
  label: string;
  events: CalendarEvent[];
}

export type FilterKey = "all" | "today" | "week" | "nextweek";

// ─── Sample / fallback data ──────────────────────────────────────────────────
export const sampleData: Bilingual<CalendarDay[]> = {
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
export const i18n = {
  heroTitle: { en: "Economic Calendar", ar: "التقويم الاقتصادي" } as Bilingual<string>,
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
  } as Bilingual<string[]>,
  tableHeaders: {
    en: ["Time", "Currency", "The Event", "Market Fluctuations", "Actual", "Expected", "Previous"],
    ar: ["الوقت", "العملة", "الحدث", "تقلبات السوق", "الفعلية", "المتوقعة", "السابق"],
  } as Bilingual<string[]>,
  loading: { en: "Loading events...", ar: "جاري تحميل الأحداث..." } as Bilingual<string>,
  noEvents: { en: "No events found for this period.", ar: "لم يتم العثور على أحداث لهذه الفترة." } as Bilingual<string>,
};

// ─── Currency -> country code mapping ────────────────────────────────────────
export const currencyToCountry: Record<string, string> = {
  USD: "us", EUR: "eu", GBP: "gb", JPY: "jp", CNY: "cn", CHF: "ch",
  AUD: "au", CAD: "ca", NZD: "nz", SGD: "sg", HKD: "hk", SEK: "se",
  NOK: "no", DKK: "dk", RUB: "ru", TRY: "tr", ZAR: "za", BRL: "br",
  MXN: "mx", INR: "in", KRW: "kr", IDR: "id", MYR: "my", PHP: "ph",
  THB: "th", PLN: "pl", CZK: "cz", HUF: "hu", ILS: "il", SAR: "sa",
  AED: "ae", KWD: "kw", QAR: "qa", BHD: "bh", OMR: "om", EGP: "eg",
  CLP: "cl", COP: "co", PEN: "pe", ARS: "ar", TWD: "tw", VND: "vn",
};
