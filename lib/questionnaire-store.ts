import type {
  QuestionnaireAnswers,
  ScoreResult,
  RiskProfilePayload,
  Recommendation,
  Simulation,
} from "@/lib/types";

const ACTIVE_SCOPE_KEY = "arthsetu:active-data-scope";
const LEGACY_KEYS = [
  "arthsetu:questionnaire-answers",
  "arthsetu:questionnaire-result",
  "arthsetu:questionnaire-risk",
  "arthsetu:questionnaire-recommendation",
  "arthsetu:questionnaire-simulation",
  "arthsetu:assessment-history",
] as const;

const ANSWERS_KEY = "questionnaire-answers";
const RESULT_KEY = "questionnaire-result";
const RISK_KEY = "questionnaire-risk";
const RECOMMENDATION_KEY = "questionnaire-recommendation";
const SIMULATION_KEY = "questionnaire-simulation";
const HISTORY_KEY = "assessment-history";

export interface StoredResult {
  score: ScoreResult;
  features: Record<string, number>;
}

export interface AccountQuestionnaireState {
  answers: QuestionnaireAnswers;
  features: Record<string, number>;
  score: ScoreResult;
  risk: RiskProfilePayload;
  recommendation: Recommendation;
  simulation: Simulation;
  profile?: Record<string, unknown>;
  saved_at?: string;
}

export interface AccountStateResponse {
  authenticated: boolean;
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
  } | null;
  state: AccountQuestionnaireState | null;
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

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function sanitiseScope(scope: string) {
  return scope.replace(/[^a-zA-Z0-9:_-]/g, "_");
}

function currentScope() {
  if (typeof window === "undefined") return "server";
  return localStorage.getItem(ACTIVE_SCOPE_KEY) || "guest";
}

function storageKey(name: string) {
  return `arthsetu:${sanitiseScope(currentScope())}:${name}`;
}

function removeLegacyUnscopedData() {
  if (typeof window === "undefined") return;

  // Never migrate old unscoped data into a signed-in account. That old
  // behaviour is exactly what caused one user to see another user's results.
  for (const key of LEGACY_KEYS) {
    localStorage.removeItem(key);
  }
}

export function activateAccountScope(userId: string) {
  if (typeof window === "undefined") return;
  removeLegacyUnscopedData();
  localStorage.setItem(ACTIVE_SCOPE_KEY, `user:${userId}`);
}

export function activateDemoScope() {
  if (typeof window === "undefined") return;
  removeLegacyUnscopedData();
  localStorage.setItem(ACTIVE_SCOPE_KEY, "demo");
}

export function releaseActiveAccount() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_SCOPE_KEY);
}

export function saveAnswers(answers: QuestionnaireAnswers) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(ANSWERS_KEY), JSON.stringify(answers));
}

export function loadAnswers(): QuestionnaireAnswers | null {
  if (typeof window === "undefined") return null;
  return safeParse<QuestionnaireAnswers>(
    localStorage.getItem(storageKey(ANSWERS_KEY)),
  );
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

  localStorage.setItem(
    storageKey(RESULT_KEY),
    JSON.stringify(storedResult),
  );
  localStorage.setItem(storageKey(RISK_KEY), JSON.stringify(data.risk));
  localStorage.setItem(
    storageKey(RECOMMENDATION_KEY),
    JSON.stringify(data.recommendation),
  );
  localStorage.setItem(
    storageKey(SIMULATION_KEY),
    JSON.stringify(data.simulation),
  );

  const history =
    safeParse<unknown[]>(
      localStorage.getItem(storageKey(HISTORY_KEY)),
    ) || [];

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
    storageKey(HISTORY_KEY),
    JSON.stringify([entry, ...history].slice(0, 50)),
  );
}

export function hydrateAccountState(state: AccountQuestionnaireState) {
  if (typeof window === "undefined") return;

  saveAnswers(state.answers);
  localStorage.setItem(
    storageKey(RESULT_KEY),
    JSON.stringify({
      score: state.score,
      features: state.features,
    } satisfies StoredResult),
  );
  localStorage.setItem(storageKey(RISK_KEY), JSON.stringify(state.risk));
  localStorage.setItem(
    storageKey(RECOMMENDATION_KEY),
    JSON.stringify(state.recommendation),
  );
  localStorage.setItem(
    storageKey(SIMULATION_KEY),
    JSON.stringify(state.simulation),
  );
}

export async function syncAccountState(): Promise<AccountStateResponse> {
  if (typeof window === "undefined") {
    return {
      authenticated: false,
      user: null,
      state: null,
    };
  }

  // Remove the previous account pointer before asking the server who is
  // currently signed in. This prevents stale data being displayed if a
  // request fails or a different user logs in on the same browser.
  releaseActiveAccount();

  const response = await fetch("/api/account-state", {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(`Unable to load account data (${response.status}).`);
  }

  const payload = (await response.json()) as AccountStateResponse;

  if (payload.authenticated && payload.user?.id) {
    activateAccountScope(payload.user.id);

    if (payload.state) {
      hydrateAccountState(payload.state);
    } else {
      clearAll();
    }
  } else {
    activateDemoScope();
  }

  return payload;
}

export function loadResult(): StoredResult | null {
  if (typeof window === "undefined") return null;

  const parsed = safeParse<unknown>(
    localStorage.getItem(storageKey(RESULT_KEY)),
  );

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

  if (isScoreResult(parsed)) {
    const migrated: StoredResult = {
      score: parsed,
      features: {},
    };

    localStorage.setItem(
      storageKey(RESULT_KEY),
      JSON.stringify(migrated),
    );

    return migrated;
  }

  return null;
}

export function loadRisk(): RiskProfilePayload | null {
  if (typeof window === "undefined") return null;
  return safeParse<RiskProfilePayload>(
    localStorage.getItem(storageKey(RISK_KEY)),
  );
}

export function loadRecommendation(): Recommendation | null {
  if (typeof window === "undefined") return null;
  return safeParse<Recommendation>(
    localStorage.getItem(storageKey(RECOMMENDATION_KEY)),
  );
}

export function loadSimulation(): Simulation | null {
  if (typeof window === "undefined") return null;
  return safeParse<Simulation>(
    localStorage.getItem(storageKey(SIMULATION_KEY)),
  );
}

export function loadLocalHistory() {
  if (typeof window === "undefined") return [];
  return (
    safeParse<unknown[]>(
      localStorage.getItem(storageKey(HISTORY_KEY)),
    ) || []
  );
}

export function clearLocalHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(HISTORY_KEY));
}

export function hasQuestionnaireData(): boolean {
  if (typeof window === "undefined") return false;
  return loadAnswers() !== null && loadResult() !== null;
}

export function clearAll() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(storageKey(ANSWERS_KEY));
  localStorage.removeItem(storageKey(RESULT_KEY));
  localStorage.removeItem(storageKey(RISK_KEY));
  localStorage.removeItem(storageKey(RECOMMENDATION_KEY));
  localStorage.removeItem(storageKey(SIMULATION_KEY));
  localStorage.removeItem(storageKey(HISTORY_KEY));
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
    role:
      occupation.charAt(0).toUpperCase() + occupation.slice(1),
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
