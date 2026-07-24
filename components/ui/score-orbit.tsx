"use client";

import { motion } from "framer-motion";

export function ScoreOrbit({
  score,
  risk,
  confidence,
  compact = false,
}: {
  score: number;
  risk?: string | null;
  confidence: number;
  compact?: boolean;
}) {
  const safeScore = Number.isFinite(score) ? score : 300;
  const safeConfidence = Number.isFinite(confidence) ? confidence : 0;
  const safeRisk =
    typeof risk === "string" && risk.trim().length > 0
      ? risk.trim()
      : "Pending";
  const angle = Math.max(
    18,
    Math.min(342, ((safeScore - 300) / 600) * 342),
  );

  return (
    <div className={`score-orbit ${compact ? "compact" : ""}`}>
      <div
        className="score-orbit-ring"
        style={{ "--score-angle": `${angle}deg` } as React.CSSProperties}
      />
      <div className="score-orbit-copy">
        <span>SETUSCORE</span>
        <motion.strong
          key={safeScore}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {safeScore}
        </motion.strong>
        <small>
          {safeRisk.toUpperCase()} RISK · {safeConfidence}%
        </small>
      </div>
      <i className="score-pulse" />
    </div>
  );
}
