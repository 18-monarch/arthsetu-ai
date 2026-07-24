"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Database,
  RefreshCw,
  ShieldCheck,
  Wifi,
} from "lucide-react";

type Health = {
  status: string;
  auth: string;
  database: string;
  ml: string;
};

const items = [
  { key: "auth", label: "Neon Auth", icon: ShieldCheck },
  { key: "database", label: "Neon database", icon: Database },
  { key: "ml", label: "ML API", icon: BrainCircuit },
] as const;

export function SystemStatusCard({ compact = false }: { compact?: boolean }) {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);

  async function check() {
    setLoading(true);
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      if (!response.ok) throw new Error("Health check failed");
      setHealth((await response.json()) as Health);
    } catch {
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    check();
  }, []);

  return (
    <section className={`system-proof-card ${compact ? "compact" : ""}`}>
      <div className="system-proof-head">
        <div>
          <span>LIVE SYSTEM PROOF</span>
          <h3>Real infrastructure, not a mock screen.</h3>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={check}
          aria-label="Refresh system status"
        >
          <RefreshCw size={15} className={loading ? "status-spin" : ""} />
        </button>
      </div>

      <div className="system-proof-grid">
        {items.map(({ key, label, icon: Icon }) => {
          const value = health?.[key] || (loading ? "checking" : "unavailable");
          const online =
            value.toLowerCase().includes("connected") ||
            value.toLowerCase().includes("configured");

          return (
            <article key={key} className={online ? "online" : "offline"}>
              <Icon size={17} />
              <div>
                <strong>{label}</strong>
                <span>{value}</span>
              </div>
              <i />
            </article>
          );
        })}
      </div>

      <p className="system-proof-note">
        <Wifi size={13} /> Health checks validate the deployed web, database and
        model connection without exposing any secret.
      </p>
    </section>
  );
}
