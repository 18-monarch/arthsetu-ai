"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Brand } from "@/components/brand";
import { SystemStatusCard } from "@/components/system/system-status-card";
import { ScoreOrbit } from "@/components/ui/score-orbit";
import type { DashboardBundle } from "@/lib/types";

const demoProfiles = [
  {
    id: "amit",
    label: "Stable earner",
    note: "Regular income and disciplined behaviour",
  },
  {
    id: "ravi",
    label: "Developing profile",
    note: "Good digital trail with improvement potential",
  },
  {
    id: "manish",
    label: "Financially stressed",
    note: "Limited capacity and stronger guardrails",
  },
];

export function JudgeDemoClient() {
  const [bundles, setBundles] = useState<Record<string, DashboardBundle>>({});
  const [selected, setSelected] = useState("ravi");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const entries = await Promise.all(
        demoProfiles.map(async (profile) => {
          const response = await fetch(
            `/api/profiles/${profile.id}/dashboard?monthly_amount=2000&years=3`,
            { cache: "no-store" },
          );
          if (!response.ok) throw new Error(`Unable to load ${profile.id}.`);
          setMode(response.headers.get("X-ArthSetu-Mode") || "web");
          return [profile.id, (await response.json()) as DashboardBundle] as const;
        }),
      );
      setBundles(Object.fromEntries(entries));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Demo loading failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const active = bundles[selected];

  return (
    <div className="judge-page">
      <header className="marketing-nav judge-nav">
        <Brand />
        <nav>
          <Link href="/">Home</Link>
          <Link href="/model-transparency">Model transparency</Link>
        </nav>
        <Link href="/questionnaire" className="button-primary small">
          Try Your Own Data <ArrowRight size={14} />
        </Link>
      </header>

      <main className="judge-main">
        <section className="judge-hero">
          <div>
            <span>JUDGE DEMO · 90-SECOND PRODUCT PROOF</span>
            <h1>Compare three financial journeys instantly.</h1>
            <p>
              Switch profiles to see how the same ML engine changes the score,
              explanation, improvement missions and capacity-aware plan.
            </p>
          </div>
          <button className="button-ghost" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading ? "status-spin" : ""} />
            Refresh demo
          </button>
        </section>

        {error && <div className="judge-error">{error}</div>}

        <section className="judge-profile-grid">
          {demoProfiles.map((profile) => {
            const bundle = bundles[profile.id];
            return (
              <button
                type="button"
                key={profile.id}
                className={`judge-profile-card ${selected === profile.id ? "active" : ""}`}
                onClick={() => setSelected(profile.id)}
              >
                <span>{profile.label}</span>
                <h3>{bundle?.profile.name || "Loading…"}</h3>
                <p>{bundle?.profile.role || profile.note}</p>
                <div>
                  <strong>{bundle?.score.score ?? "—"}</strong>
                  <small>{bundle?.score.risk_bucket || "—"} risk</small>
                </div>
              </button>
            );
          })}
        </section>

        {active && (
          <section className="judge-detail-grid">
            <article className="judge-score-panel">
              <ScoreOrbit
                score={active.score.score}
                risk={active.score.risk_bucket}
                confidence={active.score.confidence}
              />
              <div>
                <span>SELECTED JOURNEY</span>
                <h2>{active.profile.name}</h2>
                <p>
                  {active.profile.role} · {active.profile.city}
                </p>
                <div className="judge-pills">
                  <b>{active.recommendation.plan} plan</b>
                  <b>{active.score.confidence}% confidence</b>
                  <b>{mode}</b>
                </div>
              </div>
            </article>

            <article className="product-card judge-explanation">
              <div className="card-heading">
                <div>
                  <span>WHY THIS SCORE?</span>
                  <h3>Top explainable drivers</h3>
                </div>
                <BrainCircuit size={19} />
              </div>
              <div className="judge-driver-list">
                {active.score.top_drivers.slice(0, 3).map((driver) => (
                  <div key={driver.feature} className={driver.direction}>
                    {driver.direction === "positive" ? (
                      <CheckCircle2 size={15} />
                    ) : (
                      <TrendingUp size={15} />
                    )}
                    <div>
                      <strong>{driver.label}</strong>
                      <span>{driver.explanation}</span>
                    </div>
                    <b>
                      {driver.direction === "positive" ? "+" : ""}
                      {driver.impact_points}
                    </b>
                  </div>
                ))}
              </div>
            </article>

            <article className="product-card judge-missions">
              <div className="card-heading">
                <div>
                  <span>WHAT NEXT?</span>
                  <h3>Improvement missions</h3>
                </div>
                <Sparkles size={19} />
              </div>
              <div>
                {active.score.improvement_actions.slice(0, 3).map((action) => (
                  <article key={action.feature}>
                    <ShieldCheck size={15} />
                    <div>
                      <strong>{action.label}</strong>
                      <p>{action.action}</p>
                    </div>
                    <b>+{action.score_gain}</b>
                  </article>
                ))}
              </div>
            </article>
          </section>
        )}

        <SystemStatusCard />
      </main>
    </div>
  );
}
