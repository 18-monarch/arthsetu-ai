"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Loading } from "@/components/ui/loading";
import { hasQuestionnaireData } from "@/lib/questionnaire-store";

export function OnboardingGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasQuestionnaireData()) {
      const returnTo = pathname || "/app/dashboard";
      router.replace(
        `/questionnaire?returnTo=${encodeURIComponent(returnTo)}`,
      );
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return <Loading />;
  }

  return <>{children}</>;
}
