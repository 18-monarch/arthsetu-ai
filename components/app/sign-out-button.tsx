"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/client";
import {
  clearAll,
  releaseActiveAccount,
} from "@/lib/questionnaire-store";

export function SignOutButton({
  demo,
}: {
  demo: boolean;
}) {
  const router = useRouter();

  async function exit() {
    // Remove the currently visible account's browser cache for privacy.
    // Returning users restore their own state from Neon after signing in.
    clearAll();
    releaseActiveAccount();

    if (demo) {
      await fetch("/api/demo-session", {
        method: "DELETE",
      });
    } else {
      try {
        await authClient.signOut();
      } catch {
        // Navigation still clears the visible workspace.
      }
    }

    router.push("/");
    router.refresh();
  }

  return (
    <button className="shell-link signout" onClick={exit}>
      <LogOut size={16} />
      <span>{demo ? "Exit demo" : "Sign out"}</span>
    </button>
  );
}
