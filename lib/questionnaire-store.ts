import type {
  QuestionnaireAnswers,
  ScoreResult,
  RiskProfilePayload,
  Recommendation,
  Simulation,
} from "@/lib/types";

const ANSWERS_KEY = "arthsetu:questionnaire-answers";
const RESULT_KEY = "arthsetu:questionnaire-result";
const RISK_KEY = "arthsetu:questionnaire-risk";
const RECOMMENDATION_KEY = "arthsetu:questionnaire-recommendation";
const SIMULATION_KEY = "arthsetu:questionnaire-simulation";
const HISTORY_KEY = "arthsetu:assessment-history";

export interface StoredResult {
  score: ScoreResult;
  features: Record<string, number>;
}

function isScoreResult(value: unknown): value is ScoreResult {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<ScoreResult>;
  return (
    typeof candidate.score === "number" &&
    typeof candidate.risk_bucket === "string" &&
    typeof candidate.confidence === "number" &&
    Array.isArray(candidate.top_drivers) &&
    Array.isArray(candidate.improvement_actions)
  );
}

export function saveAnswers(answers: QuestionnaireAnswers) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

export function loadAnswers(): QuestionnaireAnswers | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(ANSWERS_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as QuestionnaireAnswers;
  } catch {
    return null;
  }
}

export function saveResult(data: {
  score: ScoreResult;
  features: Record<string, number>;
  risk: RiskProfilePayload;
  recommendation: Recommendation;
  simulation: Simulation;
}) {
  if (typeof window === "undefined") return;

  const storedResult: StoredResult = {
    score: data.score,
    features: data.features,
  };

  localStorage.setItem(RESULT_KEY, JSON.stringify(storedResult));
  localStorage.setItem(RISK_KEY, JSON.stringify(data.risk));
  localStorage.setItem(
    RECOMMENDATION_KEY,
    JSON.stringify(data.recommendation),
  );
  localStorage.setItem(SIMULATION_KEY, JSON.stringify(data.simulation));

  let history: unknown[] = [];
  try {
    history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") as unknown[];
    if (!Array.isArray(history)) history = [];
  } catch {
    history = [];
  }

  const entry = {
    id: crypto.randomUUID(),
    kind: "questionnaire",
    profile_id: "you",
    summary: {
      score: data.score.score,
      risk_bucket: data.score.risk_bucket,
      confidence: data.score.confidence,
      plan: data.recommendation.plan,
      monthly_amount: data.recommendation.monthly_amount,
      years: data.recommendation.years,
    },
    created_at: new Date().toISOString(),
  };

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify([entry, ...history].slice(0, 50)),
  );
}

export function loadResult(): StoredResult | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(RESULT_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;

    // Current format: { score: ScoreResult, features: Record<string, number> }
    if (parsed && typeof parsed === "object") {
      const candidate = parsed as Partial<StoredResult>;
      if (isScoreResult(candidate.score)) {
        return {
          score: candidate.score,
          features:
            candidate.features && typeof candidate.features === "object"
              ? candidate.features
              : {},
        };
      }
    }

    // Legacy format used by the first production build: ScoreResult directly.
    // Migrate it silently so existing users do not hit a dashboard crash.
    if (isScoreResult(parsed)) {
      const migrated: StoredResult = {
        score: parsed,
        features: {},
      };
      localStorage.setItem(RESULT_KEY, JSON.stringify(migrated));
      return migrated;
    }

    return null;
  } catch {
    return null;
  }
}

export function loadRisk(): RiskProfilePayload | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(RISK_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RiskProfilePayload;
  } catch {
    return null;
  }
}

export function loadRecommendation(): Recommendation | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(RECOMMENDATION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Recommendation;
  } catch {
    return null;
  }
}

export function loadSimulation(): Simulation | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SIMULATION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Simulation;
  } catch {
    return null;
  }
}

export function hasQuestionnaireData(): boolean {
  if (typeof window === "undefined") return false;
  return loadAnswers() !== null && loadResult() !== null;
}

export function clearAll() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ANSWERS_KEY);
  localStorage.removeItem(RESULT_KEY);
  localStorage.removeItem(RISK_KEY);
  localStorage.removeItem(RECOMMENDATION_KEY);
  localStorage.removeItem(SIMULATION_KEY);
}

export function getUserProfile(answers: QuestionnaireAnswers) {
  const income_stability =
    answers.occupation === "salaried"
      ? 5
      : answers.occupation === "business"
        ? 4
        : answers.occupation === "freelancer"
          ? 3
          : answers.occupation === "gig"
            ? 2
            : 1;

  const occupation = answers.occupation || "student";

  return {
    name: "You",
    role: occupation.charAt(0).toUpperCase() + occupation.slice(1),
    city:
      answers.city_tier === "metro"
        ? "Metro City"
        : answers.city_tier === "tier2"
          ? "Tier 2 City"
          : answers.city_tier === "tier3"
            ? "Tier 3 Town"
            : "Rural Area",
    monthly_income: answers.monthly_income,
    monthly_expenses: answers.monthly_expenses,
    monthly_surplus: Math.max(
      0,
      answers.monthly_income - answers.monthly_expenses,
    ),
    emergency_fund_months: answers.has_emergency_fund
      ? Math.min(6, Math.floor(answers.savings_percent / 10))
      : 0,
    income_stability,
  };
}
