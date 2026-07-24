"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import styles from "./assessment-client.module.css";
import { Loading } from "@/components/ui/loading";
import { ScoreOrbit } from "@/components/ui/score-orbit";
import {
  getUserProfile,
  hasQuestionnaireData,
  loadAnswers,
  loadRecommendation,
} from "@/lib/questionnaire-store";
import type { FullAssessment, RiskProfilePayload } from "@/lib/types";
import * as api from "@/lib/web-api";

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function NoDataState() {
  return (
    <main className="product-main">
      <section className="product-heading">
        <div>
          <span>COMPLETE ASSESSMENT</span>
          <h1>Take the questionnaire first.</h1>
          <p>
            We need your financial profile to generate a full assessment.
          </p>
        </div>
      </section>

      <div className="fatal-card">
        <h1>No data found</h1>
        <p>
          Complete the financial questionnaire to unlock the full assessment
          view.
        </p>
        <Link
          href="/questionnaire"
          className="button-primary"
          style={{ marginTop: 16 }}
        >
          Start Questionnaire <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  );
}

export function AssessmentClient() {
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [monthly, setMonthly] = useState(2000);
  const [years, setYears] = useState(3);
  const [result, setResult] = useState<FullAssessment | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const exists = hasQuestionnaireData();
    setHasData(exists);

    if (exists) {
      const answers = loadAnswers();
      const recommendation = loadRecommendation();

      if (answers) {
        const surplus = Math.max(
          0,
          answers.monthly_income - answers.monthly_expenses,
        );
        setMonthly(
          Math.min(
            5000,
            Math.max(500, Math.round((surplus * 0.3) / 100) * 100),
          ),
        );
      }

      if (recommendation) {
        setMonthly(recommendation.monthly_amount);
        setYears(recommendation.years);
      }
    }
  }, []);

  if (hasData === null) {
    return <Loading />;
  }

  if (!hasData) {
    return <NoDataState />;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const answers = loadAnswers();
    if (!answers) {
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");

    const data = new FormData(event.currentTarget);
    const incomeStability =
      answers.occupation === "salaried"
        ? 5
        : answers.occupation === "business"
          ? 4
          : answers.occupation === "freelancer"
            ? 3
            : answers.occupation === "gig"
              ? 2
              : 1;

    const payload: RiskProfilePayload = {
      profile_id: "questionnaire-user",
      loss_reaction: Number(data.get("loss_reaction")) as 1 | 2 | 3,
      horizon_years: years,
      emergency_fund_months: answers.has_emergency_fund
        ? Math.min(6, Math.floor(answers.savings_percent / 10))
        : 0,
      monthly_income: answers.monthly_income,
      monthly_expenses: answers.monthly_expenses,
      income_stability: incomeStability,
      liquidity_need_months: years * 12,
      investment_experience: Number(
        data.get("investment_experience"),
      ) as 0 | 1 | 2,
      persist: true,
    };

    try {
      const response = await api.fullAssessment(
        "questionnaire-user",
        monthly,
        years,
        payload,
      );

      setResult(response.data);
      setNotice(
        "Assessment complete. Results saved to your browser history.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Assessment failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  const answers = loadAnswers();
  const profile = answers ? getUserProfile(answers) : null;

  return (
    <main className="product-main">
      <section className="product-heading">
        <div>
          <span>COMPLETE ASSESSMENT</span>
          <h1>Full financial review.</h1>
          <p>
            Combine your SetuScore with capacity-aware risk profiling and
            educational investment planning.
          </p>
        </div>

        <Link href="/app/dashboard" className="button-ghost">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </section>

      <div className="assessment-layout">
        <form className="assessment-form" onSubmit={submit}>
          <div className="product-card">
            <div className="card-heading">
              <div>
                <span>RISK PROFILE</span>
                <h3>Investment preferences</h3>
                <p>
                  Answer these to calculate your capacity and appetite.
                </p>
              </div>
              <ShieldCheck size={19} />
            </div>

            <div className="form-grid" style={{ marginTop: 20 }}>
              <label className="form-field">
                <span>Loss reaction</span>
                <select name="loss_reaction" defaultValue="2">
                  <option value="1">Sell immediately</option>
                  <option value="2">Wait and reassess</option>
                  <option value="3">Hold or buy more</option>
                </select>
              </label>

              <label className="form-field">
                <span>Investment experience</span>
                <select name="investment_experience" defaultValue="1">
                  <option value="0">Never invested</option>
                  <option value="1">FDs / Savings only</option>
                  <option value="2">Mutual funds / Stocks</option>
                </select>
              </label>
            </div>

            <div
              className="assessment-sliders"
              style={{ marginTop: 16 }}
            >
              <label>
                <span>MONTHLY INVESTMENT</span>
                <strong>{money(monthly)}</strong>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={monthly}
                  onChange={(event) =>
                    setMonthly(Number(event.target.value))
                  }
                />
              </label>

              <label>
                <span>HORIZON</span>
                <strong>
                  {years} year{years > 1 ? "s" : ""}
                </strong>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={years}
                  onChange={(event) =>
                    setYears(Number(event.target.value))
                  }
                />
              </label>
            </div>

            {profile && (
              <div className={styles.profileSnapshot}>
                <span>YOUR PROFILE</span>
                <div>
                  <article>
                    <small>INCOME</small>
                    <strong>{money(profile.monthly_income)}</strong>
                  </article>
                  <article>
                    <small>EXPENSES</small>
                    <strong>{money(profile.monthly_expenses)}</strong>
                  </article>
                  <article>
                    <small>SURPLUS</small>
                    <strong>{money(profile.monthly_surplus)}</strong>
                  </article>
                </div>
              </div>
            )}

            <button
              className="button-primary assessment-submit"
              type="submit"
              disabled={busy}
              style={{ marginTop: 20, width: "100%" }}
            >
              {busy ? "Running assessment…" : "Run Full Assessment"}
            </button>
          </div>

          {error && (
            <div className={styles.errorNotice}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {notice && (
            <div className={styles.successNotice}>
              <CheckCircle2 size={14} /> {notice}
            </div>
          )}
        </form>

        {result ? (
          <aside className={styles.resultPanel}>
            <div className={styles.scoreHeader}>
              <ScoreOrbit
                compact
                score={result.score.score}
                risk={result.score.risk_bucket}
                confidence={result.score.confidence}
              />

              <div className={styles.scoreSummary}>
                <span>ASSESSMENT COMPLETE</span>
                <h2>{result.recommendation.plan} strategy</h2>
                <p>
                  {result.score.risk_bucket} risk profile with{" "}
                  {result.score.confidence}% model confidence.
                </p>
                <div className={styles.scorePills}>
                  <b>{result.score.score} SetuScore</b>
                  <b>{result.recommendation.years}Y horizon</b>
                </div>
              </div>
            </div>

            <div className="result-stat-grid">
              <div>
                <span>PLAN</span>
                <strong>{result.recommendation.plan}</strong>
              </div>
              <div>
                <span>MONTHLY</span>
                <strong>
                  {money(result.recommendation.monthly_amount)}
                </strong>
              </div>
              <div>
                <span>HORIZON</span>
                <strong>{result.recommendation.years}Y</strong>
              </div>
            </div>

            {result.recommendation.allocation.length > 0 && (
              <section className={styles.allocationSection}>
                <div className={styles.sectionHeading}>
                  <span>ALLOCATION</span>
                  <small>Educational portfolio mix</small>
                </div>

                <div className={styles.allocationList}>
                  {result.recommendation.allocation.map(
                    (allocation, index) => (
                      <article
                        key={allocation.category}
                        className={styles.allocationCard}
                      >
                        <div className={styles.allocationHead}>
                          <i
                            className={
                              styles[
                                `allocationDot${(index % 3) + 1}` as
                                  | "allocationDot1"
                                  | "allocationDot2"
                                  | "allocationDot3"
                              ]
                            }
                          />
                          <strong>{allocation.category}</strong>
                          <b>{allocation.percentage}%</b>
                        </div>

                        <div className={styles.allocationTrack}>
                          <i
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(100, allocation.percentage),
                              )}%`,
                            }}
                          />
                        </div>

                        <p>{allocation.rationale}</p>
                      </article>
                    ),
                  )}
                </div>
              </section>
            )}

            {result.risk_profile.guardrails.length > 0 && (
              <div className="guardrail-list">
                <span>GUARDRAILS</span>
                {result.risk_profile.guardrails.map((guardrail, index) => (
                  <p key={index}>
                    <ShieldCheck size={12} /> {guardrail}
                  </p>
                ))}
              </div>
            )}

            <div className={styles.disclaimer}>
              <AlertCircle size={13} />
              <p>{result.disclaimer}</p>
            </div>
          </aside>
        ) : (
          <aside className={styles.resultPlaceholder}>
            <div className={styles.placeholderIcon}>
              <ShieldCheck size={25} />
            </div>
            <span>READY WHEN YOU ARE</span>
            <h2>Your result will appear here.</h2>
            <p>
              Choose your preferences and run the assessment to generate a
              personalised plan.
            </p>
          </aside>
        )}
      </div>
    </main>
  );
}
