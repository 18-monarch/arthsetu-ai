import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Database,
  Fingerprint,
  Gauge,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Brand } from "@/components/brand";
import { Hero } from "@/components/landing/hero";
import { JourneyDemo } from "@/components/landing/journey-demo";

const loop = ["Consent", "Signals", "SetuScore", "Explain", "Improve", "SetuInvest"];

export default function Home() {
  return (
    <div className="marketing-page">
      <header className="marketing-nav">
        <Brand />
        <nav>
          <a href="#journey">Journey</a>
          <a href="#engines">Engines</a>
          <Link href="/model-transparency">Model</Link>
          <Link href="/judge-demo">Judge demo</Link>
        </nav>
        <div className="nav-actions">
          <Link className="button-ghost" href="/login">Sign in</Link>
          <Link className="button-primary small" href="/questionnaire">
            Get Your Score <ArrowRight size={14} />
          </Link>
        </div>
      </header>
      <main>
        <Hero />
        <section className="belief-strip">
          <span>01</span>
          <p>
            People should not remain financially invisible simply because
            conventional systems have too little history.
          </p>
        </section>

        <section className="content-section" id="journey">
          <div className="section-heading split">
            <div>
              <span>02 · ONE TRANSPARENT JOURNEY</span>
              <h2>Every signal should lead to an outcome the user can understand.</h2>
            </div>
            <p>
              ArthSetu keeps each decision visible and reviewable—from consent
              through the final educational plan.
            </p>
          </div>
          <div className="loop-line">
            {loop.map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                {index < loop.length - 1 && <i>→</i>}
              </div>
            ))}
          </div>
          <div className="journey-cards">
            <article>
              <Fingerprint />
              <span>USER CONTROL</span>
              <h3>Consent before intelligence.</h3>
              <p>Every input is purposeful, visible and removable.</p>
            </article>
            <article>
              <Gauge />
              <span>VISIBLE REASONING</span>
              <h3>No hidden score verdict.</h3>
              <p>SetuScore shows confidence, top drivers and realistic next actions.</p>
            </article>
            <article>
              <Wallet />
              <span>SEPARATE CAPACITY</span>
              <h3>Credit does not decide risk appetite.</h3>
              <p>SetuInvest separately evaluates horizon, reserves and monthly capacity.</p>
            </article>
          </div>
        </section>

        <section className="engine-section" id="engines">
          <div className="content-section">
            <div className="section-heading light">
              <span>03 · CONNECTED INTELLIGENCE</span>
              <h2>One experience. Three specialised engines.</h2>
            </div>
            <div className="engine-grid">
              <article className="engine-card blue">
                <div className="engine-icon"><Brain /></div>
                <b>01</b>
                <h3>SetuScore</h3>
                <p>A trained model converts 13 self-reported signals into a transparent 300–900 prototype score.</p>
                <ul><li>Low / Medium / High risk</li><li>Top-three local drivers</li><li>Interactive re-scoring</li></ul>
              </article>
              <article className="engine-card mint">
                <div className="engine-icon"><ShieldCheck /></div>
                <b>02</b>
                <h3>Capacity Guard</h3>
                <p>Risk appetite and actual financial capacity are evaluated separately.</p>
                <ul><li>Emergency-fund checks</li><li>Visible guardrails</li><li>Safer final decision</li></ul>
              </article>
              <article className="engine-card orange">
                <div className="engine-icon"><TrendingUp /></div>
                <b>03</b>
                <h3>SetuInvest</h3>
                <p>Broad allocation categories and scenarios teach trade-offs without selecting products.</p>
                <ul><li>₹500–₹5,000 monthly</li><li>Three scenario paths</li><li>Educational purpose only</li></ul>
              </article>
            </div>
          </div>
        </section>

        <section className="content-section trust-section" id="trust">
          <div className="section-heading split">
            <div>
              <span>04 · TRUST BY DESIGN</span>
              <h2>Premium outside. Clear and responsible inside.</h2>
            </div>
            <p>Impressive presentation should never hide product boundaries.</p>
          </div>
          <div className="trust-grid">
            <article>
              <Database />
              <h3>Account-specific Neon data</h3>
              <p>Neon Auth and PostgreSQL scope questionnaire state and history to the signed-in user ID.</p>
            </article>
            <article>
              <Sparkles />
              <h3>Bounded AI</h3>
              <p>The ML service predicts and explains; it never claims to be a bureau or lending decision.</p>
            </article>
            <article>
              <ShieldCheck />
              <h3>Visible limitations</h3>
              <p>Model metrics, synthetic-data limits and educational disclaimers remain accessible.</p>
            </article>
          </div>
        </section>

        <JourneyDemo />
        <section className="final-cta">
          <div>
            <span>ARTHSETU AI · LIVE FULL-STACK PRODUCT</span>
            <h2>Do not only score the user. Show a path forward.</h2>
            <p>Explore account-specific Neon persistence, explainable ML and an interactive improvement lab.</p>
          </div>
          <div className="final-cta-actions">
            <Link className="button-ghost" href="/judge-demo">Judge Demo</Link>
            <Link className="button-primary" href="/questionnaire">
              Get Your SetuScore <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <footer className="marketing-footer">
        <Brand />
        <p>Explainable financial-readiness scoring and responsible investment education.</p>
        <span>Educational prototype · not a bureau score or financial advice</span>
      </footer>
    </div>
  );
}
