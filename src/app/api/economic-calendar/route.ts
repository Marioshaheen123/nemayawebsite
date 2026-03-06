import { NextRequest, NextResponse } from "next/server";
import { safeErrorResponse } from "@/lib/error-handler";

/**
 * Public economic calendar endpoint.
 *
 * TODO: Integrate with a real economic calendar data provider
 * (e.g., TradingEconomics, Forex Factory API, or your own CRM backend).
 *
 * For now, returns empty data — the frontend falls back to sample data
 * passed from the server component when the API returns no events.
 *
 * Query params:
 *   - filter: "all" | "today" | "week" | "nextweek"
 *   - lang: "en" | "ar"
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";
    const lang = searchParams.get("lang") || "en";

    // TODO: Replace with real data provider integration
    // Example:
    //   const events = await fetchFromProvider(filter, lang);
    //   return NextResponse.json(events);

    // Return empty array — frontend will use server-provided sample data as fallback
    return NextResponse.json([]);
  } catch (err) {
    return safeErrorResponse(err, "GET /api/economic-calendar");
  }
}
