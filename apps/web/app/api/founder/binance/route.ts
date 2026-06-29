import { NextResponse } from "next/server";
import { getBinanceSpotBalances } from "../../../../lib/connectors/binance/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getBinanceSpotBalances();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
