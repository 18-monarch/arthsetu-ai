"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  BrainCircuit,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";

import { Loading } from "@/components/ui/loading";
import {
  loadAnswers,
  loadResult,
} from "@/lib/questionnaire-store";
import type {
  QuestionnaireAnswers,
  ScoreResult,
} from "@/lib/types";

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value));
}

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function ImprovementLabClient() {
  const [answers, setAnswers] = useState<QuestionnaireAnswers | null>(null);
  const [current, setCurrent] = useState<ScoreResult | null>(null);
  const [baseFeatures, setBaseFeatures] = useState<Record<string, number> | null>(
    null,
  );
  const [savingsRatio, setSavingsRatio] = useState(0.2);
  const [expenseRatio, setExpenseRatio] = useState(0.75);
  const [lateBills, setLateBills] = useState(1);
  const [projected, setProjected] = useState<ScoreResult | null>(null);
  const [mode, setMode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = loadResult();
    const savedAnswers = loadAnswers();

    if (stored && savedAnswers) {
      setAnswers(savedAnswers);
      setCurrent(stored.score);
      setBaseFeatures(stored.features);
      setSavingsRatio(stored.features.savings_ratio ?? savedAnswers.savings_percent / 100);
      setExpenseRatio(
        stored.features.expense_ratio ??
          savedAnswers.monthly_expenses / Math.max(savedAnswers.monthly_income, 1),
      );
      setLateBills(
        Math.round(stored.features.late_bill_count ?? savedAnswers.late_bills_12m),
      );
    }
  }, []);

  const scenarioFeatures = useMemo(() => {
    if (!baseFeatures) return null;

    const paymentConsistency = clamp(100 - lateBills * 12, 0, 100);
    const baseSavings = (baseFeatures.savings_ratio ?? 0) * 100;
    const nextSavings = savingsRatio * 100;
    const basePayment = baseFeatures.payment_consistency ?? paymentConsistency;
    const baseExpense = baseFeatures.expense_ratio ?? expenseRatio;

    const financialDiscipline = clamp(
      (baseFeatures.financial_discipline ?? 60) +
        (nextSavings - baseSavings) * 0.8 +
        (paymentConsistency - basePayment) * 0.3 -
        (expenseRatio - baseExpense) * 22,
      0,
      100,
    );

    return {
      ...baseFeatures,
      savings_ratio: savingsRatio,
      expense_ratio: expenseRatio,
      late_bill_count: lateBills,
      payment_consistency: paymentConsistency,
      financial_discipline: financialDiscipline,
    };
  }, [baseFeatures, savingsRatio, expenseRatio, lateBills]);

  if (!answers || !current || !baseFeatures || !scenarioFeatures) {
    return (
      <main className="product-main">
        <section className="product-heading">
          <div>
            <span>IMPROVEMENT LAB</span>
            <h1>Complete your questionnaire first.</h1>
            <p>The simulator needs your own score and feature profile.</p>
          </div>
        </section>
        <div className="fatal-card">
          <Target size={28} />
          <h1>No personal profile found</h1>
          <p>Answer the questionnaire before exploring improvement scenarios.</p>
          <Link className="button-primary" href="/questionnaire">
            Start Questionnaire <ArrowUpRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  async function simulate() {
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_id: "improvement-scenario",
          features: scenarioFeatures,
        }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { detail?: string };
        throw new Error(body.detail || `Simulation failed (${response.status}).`);
      }

      setProjected((await response.json()) as ScoreResult);
      setMode(response.headers.get("X-ArthSetu-Mode") || "live-ml");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to run the scenario.",
      );
    } finally {
      setBusy(false);
    }
  }

  function realisticPreset() {
    setSavingsRatio(clamp(savingsRatio + 0.05, 0, 0.5));
    setExpenseRatio(clamp(expenseRatio - 0.05, 0.4, 1.2));
    setLateBills(Math.max(0, lateBills - 1));
    setProjected(null);
  }

  function reset() {
    setSavingsRatio(baseFeatures.savings_ratio ?? 0.2);
    setExpenseRatio(baseFeatures.expense_ratio ?? 0.75);
    setLateBills(Math.round(baseFeatures.late_bill_count ?? 1));
    setProjected(null);
    setError("");
  }

  const gain = projected ? projected.score - current.score : 0;

  return (
    <main className="product-main">
      <section className="product-heading">
        <div>
          <span>IMPROVEMENT LAB</span>
          <h1>See how better habits could change the score.</h1>
          <p>
            Adjust realistic behaviours, rerun the model and compare the result.
            This is an educational counterfactual—not a guarantee.
          </p>
        </div>
        <Link href="/app/dashboard" className="button-ghost">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </section>

      <section className="improve-hero">
        <article>
          <span>CURRENT</span>
          <strong>{current.score}</strong>
          <small>{current.risk_bucket} risk</small>
        </article>
        <div className="improve-bridge">
          <i />
          <BrainCircuit size={20} />
          <span>MODEL RE-SCORE</span>
        </div>
        <article className={projected ? "projected ready" : "projected"}>
          <span>PROJECTED</span>
          <strong>{projected?.score ?? "—"}</strong>
          <small>
            {projected
              ? `${gain >= 0 ? "+" : ""}${gain} points · ${projected.risk_bucket} risk`
              : "Run your scenario"}
          </small>
        </article>
      </section>

      <section className="product-grid wide-left improve-grid">
        <article className="product-card">
          <div className="card-heading">
            <div>
              <span>WHAT-IF CONTROLS</span>
              <h3>Change three habits</h3>
              <p>These inputs also update related financial-discipline signals.</p>
            </div>
            <Target size={19} />
          </div>

          <div className="improve-controls">
            <label>
              <div>
                <span>SAVINGS RATE</span>
                <strong>{percent(savingsRatio)}</strong>
              </div>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={savingsRatio}
                onChange={(event) => {
                  setSavingsRatio(Number(event.target.value));
                  setProjected(null);
                }}
              />
              <small>Higher monthly savings generally improves resilience.</small>
            </label>

            <label>
              <div>
                <span>EXPENSE-TO-INCOME</span>
                <strong>{percent(expenseRatio)}</strong>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.2"
                step="0.01"
                value={expenseRatio}
                onChange={(event) => {
                  setExpenseRatio(Number(event.target.value));
                  setProjected(null);
                }}
              />
              <small>Lower is safer when the change is genuinely sustainable.</small>
            </label>

            <label>
              <div>
                <span>LATE BILLS / YEAR</span>
                <strong>{lateBills}</strong>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={lateBills}
                onChange={(event) => {
                  setLateBills(Number(event.target.value));
                  setProjected(null);
                }}
              />
              <small>Fewer late bills improve payment consistency.</small>
            </label>
          </div>

          {error && (
            <div className="improve-error">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="improve-actions">
            <button className="button-ghost" type="button" onClick={realisticPreset}>
              <Sparkles size={14} /> Apply realistic 30-day change
            </button>
            <button className="button-ghost" type="button" onClick={reset}>
              <RotateCcw size={14} /> Reset
            </button>
            <button
              className="button-primary"
              type="button"
              disabled={busy}
              onClick={simulate}
            >
              {busy ? "Re-scoring…" : "Run ML Scenario"}
              <ArrowUpRight size={14} />
            </button>
          </div>
        </article>

        <aside className="product-card improve-summary">
          <div className="card-heading">
            <div>
              <span>SCENARIO SUMMARY</span>
              <h3>{projected ? "Model comparison" : "Ready to simulate"}</h3>
            </div>
          </div>

          <div className="scenario-deltas">
            <div>
              <span>Savings</span>
              <strong>
                {percent(baseFeatures.savings_ratio ?? 0)} → {percent(savingsRatio)}
              </strong>
            </div>
            <div>
              <span>Expense ratio</span>
              <strong>
                {percent(baseFeatures.expense_ratio ?? 0)} → {percent(expenseRatio)}
              </strong>
            </div>
            <div>
              <span>Late bills</span>
              <strong>
                {Math.round(baseFeatures.late_bill_count ?? 0)} → {lateBills}
              </strong>
            </div>
          </div>

          {projected ? (
            <div className="scenario-result">
              <span>ESTIMATED CHANGE</span>
              <strong className={gain >= 0 ? "positive" : "negative"}>
                {gain >= 0 ? "+" : ""}{gain} points
              </strong>
              <p>
                Response mode: <b>{mode}</b>. The result is a model scenario,
                not a promised future outcome.
              </p>
            </div>
          ) : (
            <p className="empty-copy">
              Use the controls, then run the scenario to compare the same model
              against a modified behaviour profile.
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}
