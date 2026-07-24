"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { authClient } from "@/lib/auth/client";
import { releaseActiveAccount } from "@/lib/questionnaire-store";

export function AuthForm({
  mode,
}: {
  mode: "login" | "signup";
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    // Disconnect the previous browser cache before changing identity.
    releaseActiveAccount();

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const name = String(data.get("name") || "").trim();

    try {
      if (mode === "login") {
        const result = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/app/dashboard",
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        // The product gate now checks this account's Neon state. New
        // accounts go to the questionnaire; returning accounts restore
        // only their own saved profile.
        router.replace("/app/dashboard");
        router.refresh();
      } else {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: "/questionnaire",
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        router.replace("/questionnaire");
        router.refresh();
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Authentication failed. Check the Neon Auth configuration.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {mode === "signup" && (
        <label>
          <span>Your name</span>
          <div>
            <UserRound size={16} />
            <input
              name="name"
              placeholder="Your name"
              required
              minLength={2}
            />
          </div>
        </label>
      )}

      <label>
        <span>Email address</span>
        <div>
          <Mail size={16} />
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
      </label>

      <label>
        <span>Password</span>
        <div>
          <LockKeyhole size={16} />
          <input
            name="password"
            type="password"
            placeholder="Minimum 8 characters"
            required
            minLength={8}
          />
        </div>
      </label>

      {error && <p className="form-error">{error}</p>}

      <button
        className="button-primary auth-submit"
        disabled={busy}
      >
        {busy
          ? "Please wait…"
          : mode === "login"
            ? "Sign in and continue"
            : "Create account and begin"}
        <ArrowRight size={14} />
      </button>

      <div className="auth-separator">
        <span />
        OR
        <span />
      </div>

      <Link
        className="demo-access"
        href="/api/demo-session?next=/questionnaire"
      >
        Explore without an account <ArrowRight size={14} />
      </Link>
    </form>
  );
}
