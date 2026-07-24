"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  Database,
  Sparkles,
  Trash2,
} from "lucide-react";

import type { HistoryItem } from "@/lib/types";
import {
  clearAll,
  loadLocalHistory,
  syncAccountState,
} from "@/lib/questionnaire-store";

export function HistoryClient() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const account = await syncAccountState();

        if (!active) return;

        setAuthenticated(account.authenticated);

        if (account.authenticated) {
          const response = await fetch("/api/history", {
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error("Unable to load Neon history.");
          }

          const rows = (await response.json()) as HistoryItem[];
          if (active) setItems(rows);
        } else {
          setItems(loadLocalHistory() as HistoryItem[]);
        }
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function clear() {
    if (authenticated) {
      await fetch("/api/history", {
        method: "DELETE",
      });
    }

    clearAll();
    setItems([]);
    router.replace("/questionnaire");
    router.refresh();
  }

  return (
    <main className="product-main">
      <section className="product-heading">
        <div>
          <span>ASSESSMENT HISTORY</span>
          <h1>Keep the financial journey reviewable.</h1>
          <p>
            {authenticated
              ? "Your assessments belong only to this Neon-authenticated account."
              : "Demo assessments are stored only in this browser."}
          </p>
        </div>

        <div className="heading-badge">
          <Database size={17} />
          <span>
            {authenticated ? "Neon account storage" : "Demo storage"}
          </span>
        </div>
      </section>

      <section className="product-card history-card">
        <div className="card-heading">
          <div>
            <span>HISTORY</span>
            <h3>Recent assessments</h3>
            <p>Only concise result metadata is displayed.</p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/questionnaire" className="button-ghost">
              <Sparkles size={14} /> Retake
            </Link>

            {items.length > 0 && (
              <button className="button-ghost" onClick={clear}>
                <Trash2 size={14} /> Delete my data
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="empty-copy">Loading your history…</p>
        ) : items.length ? (
          <div className="history-table">
            {items.map((item) => (
              <article key={item.id}>
                <div className="history-icon">
                  <Clock3 size={15} />
                </div>

                <div>
                  <strong>
                    {String(item.summary.plan || "Assessment")} · You
                  </strong>
                  <span>
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>

                <div>
                  <b>{String(item.summary.score || "—")}</b>
                  <small>
                    {String(item.summary.risk_bucket || "")}
                    {item.summary.monthly_amount
                      ? ` · ₹${Number(
                          item.summary.monthly_amount,
                        ).toLocaleString("en-IN")}/mo`
                      : ""}
                  </small>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="history-empty">
            <div>
              <Clock3 size={32} />
            </div>
            <h3>No assessments yet</h3>
            <p>
              Complete the questionnaire to create this account's first
              SetuScore.
            </p>
            <Link
              href="/questionnaire"
              className="button-primary"
              style={{ marginTop: 16 }}
            >
              Start Questionnaire <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
