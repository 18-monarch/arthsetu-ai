import type { Metadata } from "next";

import { ImprovementLabClient } from "@/components/app/improvement-lab-client";

export const metadata: Metadata = {
  title: "Improvement Lab",
  description: "Interactive SetuScore what-if simulator.",
};

export default function ImprovePage() {
  return <ImprovementLabClient />;
}
