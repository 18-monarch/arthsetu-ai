"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Loading } from "@/components/ui/loading";
import {
  hasQuestionnaireData,
  syncAccountState,
} from "@/lib/questionnaire-store";

export function OnboardingGate({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");

  useEffect(() => {
    let active = true;

    async function initialise() {
      try {
        await syncAccountState();

        if (!active) return;

        if (!hasQuestionnaireData()) {
          const returnTo = pathname || "/app/dashboard";
          router.replace(
            `/questionnaire?returnTo=${encodeURIComponent(returnTo)}`,
          );
          return;
        }

        setStatus("ready");
      } catch {
        if (active) setStatus("error");
      }
    }

    initialise();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "error") {
    return (
      <main className="product-main">
        <div className="fatal-card">
          <AlertCircle size={24} />
          <h1>Unable to load your account data</h1>
          <p>
            ArthSetu stopped before showing cached information from
            another session. Refresh to retry the secure Neon lookup.
          </p>
          <button
            className="button-primary"
            onClick={() => location.reload()}
            style={{ marginTop: 16 }}
          >
            Retry securely
          </button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
