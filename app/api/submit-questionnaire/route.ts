import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import {
  assessmentRuns,
  consentEvents,
} from "@/lib/db/schema";
import { neonAuthConfigured } from "@/lib/env";
import { runAssessment } from "@/lib/ml-client";
import { answersToFeatures } from "@/lib/questionnaire-map";
import { questionnaireSchema } from "@/lib/validators";
import type { RiskProfilePayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = questionnaireSchema.safeParse(body.answers);

    if (!parsed.success) {
      return NextResponse.json(
        { detail: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const answers = parsed.data;
    const {
      features,
      risk,
      profile_summary: profile,
    } = answersToFeatures(answers);

    const riskPayload: RiskProfilePayload = {
      profile_id: "questionnaire-user",
      loss_reaction: risk.loss_reaction,
      horizon_years: risk.horizon_years,
      emergency_fund_months: risk.emergency_fund_months,
      monthly_income: risk.monthly_income,
      monthly_expenses: risk.monthly_expenses,
      income_stability: risk.income_stability,
      liquidity_need_months: risk.liquidity_need_months,
      investment_experience: risk.investment_experience,
      persist: false,
    };

    const monthlyAmount = answers.monthly_invest_amount;
    const years = answers.investment_horizon;

    const assessment = await runAssessment({
      profile_id: "questionnaire-user",
      features,
      profile: {
        ...profile,
        consent_sources: ["self-reported questionnaire"],
      },
      monthly_amount: monthlyAmount,
      years,
      risk_profile: riskPayload,
      persist: false,
    });

    let persisted = false;
    let persistenceError: string | null = null;

    if (neonAuthConfigured()) {
      try {
        const { data: session } = await auth.getSession();
        const userId = session?.user?.id;
        const db = getDb();

        if (userId && db) {
          const accountState = {
            answers,
            features,
            score: assessment.data.score,
            risk: riskPayload,
            recommendation: assessment.data.recommendation,
            simulation: assessment.data.simulation,
            profile,
            saved_at: new Date().toISOString(),
          };

          await db.insert(assessmentRuns).values({
            userId,
            profileKey: "account-questionnaire",
            score: assessment.data.score.score,
            riskBucket: assessment.data.score.risk_bucket,
            confidence: assessment.data.score.confidence,
            plan: assessment.data.recommendation.plan,
            monthlyAmount,
            years,
            result: {
              account_state: accountState,
              assessment: assessment.data,
            },
          });

          await db.insert(consentEvents).values({
            userId,
            consentType: "questionnaire-financial-signals",
            status: "granted",
            metadata: {
              source: "self-reported questionnaire",
              fields: Object.keys(features),
              purpose:
                "Educational SetuScore and investment-plan generation",
            },
          });

          persisted = true;
        }
      } catch (caught) {
        persistenceError =
          caught instanceof Error
            ? caught.message
            : "Unable to save account data in Neon.";
      }
    }

    return NextResponse.json(
      {
        score: assessment.data.score,
        risk_profile: assessment.data.risk_profile,
        recommendation: assessment.data.recommendation,
        simulation: assessment.data.simulation,
        features,
        _meta: {
          live_ml: !assessment.fallback,
          persisted,
          persistence_error: persistenceError,
        },
      },
      {
        headers: {
          "X-ArthSetu-Mode": assessment.fallback
            ? "feature-based-fallback"
            : "live-ml",
        },
      },
    );
  } catch (caught) {
    return NextResponse.json(
      {
        detail:
          caught instanceof Error
            ? caught.message
            : "Assessment failed.",
      },
      { status: 500 },
    );
  }
}
