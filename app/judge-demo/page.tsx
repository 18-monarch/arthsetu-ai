import type { Metadata } from "next";

import { JudgeDemoClient } from "@/components/judge-demo/judge-demo-client";

export const metadata: Metadata = {
  title: "Judge Demo",
  description: "Instant comparison of three ArthSetu financial journeys.",
};

export default function JudgeDemoPage() {
  return <JudgeDemoClient />;
}
