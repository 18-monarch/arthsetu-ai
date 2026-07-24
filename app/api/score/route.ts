import { NextResponse } from "next/server";

import { scoreRawWithMode } from "@/lib/ml-client";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      features?: Record<string, unknown>;
    };

    if (!body.features || typeof body.features !== "object") {
      return NextResponse.json(
        { detail: "A numeric features object is required." },
        { status: 422 },
      );
    }

    const features = Object.fromEntries(
      Object.entries(body.features).map(([key, value]) => [key, Number(value)]),
    );

    if (Object.values(features).some((value) => !Number.isFinite(value))) {
      return NextResponse.json(
        { detail: "Every feature must be a finite number." },
        { status: 422 },
      );
    }

    const result = await scoreRawWithMode(features);

    return NextResponse.json(result.data, {
      headers: {
        "X-ArthSetu-Mode": result.fallback
          ? "feature-based-fallback"
          : "live-ml",
      },
    });
  } catch (caught) {
    return NextResponse.json(
      {
        detail:
          caught instanceof Error ? caught.message : "Score request failed.",
      },
      { status: 400 },
    );
  }
}
