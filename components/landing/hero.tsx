"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Play, Sparkles } from "lucide-react";

const signals = [
  { label: "Recharge", note: "Regularity", className: "signal-one" },
  { label: "Utilities", note: "Punctuality", className: "signal-two" },
  { label: "Transactions", note: "Stability", className: "signal-three" },
  { label: "Savings", note: "Consistency", className: "signal-four" },
];

export function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <i /> CONSENTED SIGNALS · EXPLAINABLE OUTCOMES
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08 }}
        >
          Make financial responsibility <em>visible.</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.18 }}
        >
          ArthSetu turns everyday financial behaviour into an understandable
          SetuScore, practical improvement missions and capacity-aware
          investment education.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
        >
          <Link className="button-primary" href="/questionnaire">
            <Play size={15} fill="currentColor" /> Get Your SetuScore
          </Link>
          <Link className="button-ghost" href="/judge-demo">
            <Sparkles size={14} /> Open Judge Demo
          </Link>
          <Link className="button-text" href="/model-transparency">
            See model evidence <ArrowUpRight size={14} />
          </Link>
        </motion.div>
        <motion.div
          className="hero-proof"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.42 }}
        >
          <div><strong>20</strong><span>Quick questions</span></div>
          <div><strong>Top 3</strong><span>Visible score drivers</span></div>
          <div><strong>Live</strong><span>ML re-scoring lab</span></div>
        </motion.div>
      </div>
      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.93, rotateY: 8 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.05, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="orbit orbit-a" />
        <div className="orbit orbit-b" />
        <div className="score-core">
          <span>SETUSCORE</span>
          <strong>746</strong>
          <small>LOW RISK · 86% CONFIDENCE</small>
          <i />
        </div>
        {signals.map((signal, index) => (
          <motion.div
            key={signal.label}
            className={`signal-chip ${signal.className}`}
            animate={{ y: [0, index % 2 ? 7 : -7, 0] }}
            transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
          >
            <b />
            <div>
              <strong>{signal.label}</strong>
              <span>{signal.note}</span>
            </div>
          </motion.div>
        ))}
        <div className="visual-caption">
          <i /> SIGNALS BECOME AN EXPLAINABLE PATH
        </div>
      </motion.div>
    </section>
  );
}
