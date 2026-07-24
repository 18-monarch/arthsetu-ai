import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Database,
  Eye,
  Scale,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { Brand } from "@/components/brand";
import { SystemStatusCard } from "@/components/system/system-status-card";

export const metadata: Metadata = {
  title: "Model Transparency",
  description: "How the ArthSetu ML prototype is trained, evaluated and limited.",
};

const importances = [
  ["Financial discipline", 59.78],
  ["Late bill count", 24.18],
  ["Savings ratio", 8.34],
  ["Digital activity", 3.24],
  ["Payment consistency", 1.29],
  ["UPI transactions", 1.07],
] as const;

export default function ModelTransparencyPage() {
  return (
    <div className="transparency-page">
      <header className="marketing-nav transparency-nav">
        <Brand />
        <nav>
          <Link href="/">Home</Link>
          <Link href="/judge-demo">Judge demo</Link>
        </nav>
        <Link href="/questionnaire" className="button-primary small">
          Try the Model <ArrowRight size={14} />
        </Link>
      </header>

      <main className="transparency-main">
        <section className="transparency-hero">
          <Link href="/" className="button-text">
            <ArrowLeft size={14} /> Back to ArthSetu
          </Link>
          <span>MODEL TRANSPARENCY · CREDIT-DATASET-V1</span>
          <h1>Show the evidence. Show the limits.</h1>
          <p>
            ArthSetu uses machine learning for prediction and explainability,
            while safety-sensitive investment guidance remains rule-based and
            understandable.
          </p>
        </section>

        <section className="transparency-metrics">
          <article>
            <strong>10,000</strong>
            <span>Synthetic profiles</span>
          </article>
          <article>
            <strong>13</strong>
            <span>Input features</span>
          </article>
          <article>
            <strong>6.58</strong>
            <span>Test MAE</span>
          </article>
          <article>
            <strong>0.9649</strong>
            <span>Test R²</span>
          </article>
          <article>
            <strong>93.15%</strong>
            <span>Category accuracy</span>
          </article>
        </section>

        <section className="transparency-grid">
          <article className="transparency-card pipeline-card">
            <div className="transparency-card-head">
              <BrainCircuit />
              <div>
                <span>ML PIPELINE</span>
                <h2>From answers to SetuScore</h2>
              </div>
            </div>
            <div className="pipeline-flow">
              <div><b>01</b><strong>Questionnaire</strong><span>Self-reported indicators</span></div>
              <i>→</i>
              <div><b>02</b><strong>Feature mapping</strong><span>13 numeric signals</span></div>
              <i>→</i>
              <div><b>03</b><strong>StandardScaler</strong><span>Consistent feature scale</span></div>
              <i>→</i>
              <div><b>04</b><strong>Gradient Boosting</strong><span>300–900 prediction</span></div>
            </div>
          </article>

          <article className="transparency-card">
            <div className="transparency-card-head">
              <Eye />
              <div>
                <span>EXPLAINABILITY</span>
                <h2>Feature importance</h2>
              </div>
            </div>
            <div className="importance-list">
              {importances.map(([label, value]) => (
                <div key={label}>
                  <div><strong>{label}</strong><span>{value}%</span></div>
                  <i><b style={{ width: `${value}%` }} /></i>
                </div>
              ))}
            </div>
          </article>

          <article className="transparency-card">
            <div className="transparency-card-head">
              <Database />
              <div>
                <span>TRAINING DATA</span>
                <h2>What the model has seen</h2>
              </div>
            </div>
            <ul className="transparency-list">
              <li>10,000 generated profiles—not real customer records.</li>
              <li>Targets were generated for an educational prototype.</li>
              <li>No Aadhaar number, bank password or UPI PIN is collected.</li>
              <li>Real-world lending use would require independent validation.</li>
            </ul>
          </article>

          <article className="transparency-card warning-card">
            <div className="transparency-card-head">
              <TriangleAlert />
              <div>
                <span>LIMITATIONS</span>
                <h2>What we do not claim</h2>
              </div>
            </div>
            <ul className="transparency-list">
              <li>SetuScore is not a bureau score or loan decision.</li>
              <li>High model metrics on synthetic data do not prove real-world fairness.</li>
              <li>Age is included in this prototype and requires fairness review before production use.</li>
              <li>Investment scenarios are educational—not promised returns.</li>
            </ul>
          </article>

          <article className="transparency-card responsible-card">
            <div className="transparency-card-head">
              <Scale />
              <div>
                <span>RESPONSIBLE DESIGN</span>
                <h2>ML where useful; rules where safer</h2>
              </div>
            </div>
            <div className="responsibility-split">
              <div>
                <strong>Machine learning</strong>
                <span>SetuScore prediction</span>
                <span>Top local drivers</span>
                <span>Counterfactual re-scoring</span>
              </div>
              <div>
                <strong>Transparent rules</strong>
                <span>Risk appetite</span>
                <span>Financial capacity</span>
                <span>Allocation guardrails</span>
              </div>
            </div>
          </article>

          <article className="transparency-card privacy-card">
            <div className="transparency-card-head">
              <ShieldCheck />
              <div>
                <span>DATA CONTROL</span>
                <h2>Account-specific persistence</h2>
              </div>
            </div>
            <p>
              Authenticated questionnaire state is scoped to the Neon user ID.
              A new account starts blank, and only that account's saved result is
              restored after login.
            </p>
          </article>
        </section>

        <SystemStatusCard />
      </main>
    </div>
  );
}
