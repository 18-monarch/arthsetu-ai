import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { assessmentRuns } from "@/lib/db/schema";
import { neonAuthConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!neonAuthConfigured()) {
    return NextResponse.json({
      authenticated: false,
      user: null,
      state: null,
    });
  }

  try {
    const { data: session } = await auth.getSession();
    const user = session?.user;
    const db = getDb();

    if (!user?.id) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        state: null,
      });
    }

    if (!db) {
      return NextResponse.json(
        { detail: "DATABASE_URL is not configured." },
        { status: 503 },
      );
    }

    const rows = await db
      .select({
        result: assessmentRuns.result,
      })
      .from(assessmentRuns)
      .where(
        and(
          eq(assessmentRuns.userId, user.id),
          eq(assessmentRuns.profileKey, "account-questionnaire"),
        ),
      )
      .orderBy(desc(assessmentRuns.createdAt))
      .limit(1);

    const result = rows[0]?.result;
    const state =
      result &&
      typeof result === "object" &&
      "account_state" in result
        ? (result.account_state as Record<string, unknown>)
        : null;

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      state,
    });
  } catch (caught) {
    return NextResponse.json(
      {
        detail:
          caught instanceof Error
            ? caught.message
            : "Unable to load account state.",
      },
      { status: 500 },
    );
  }
}
