import Link from "next/link";
import {
  BarChart3,
  Brain,
  History,
  LayoutDashboard,
  Microscope,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { SignOutButton } from "@/components/app/sign-out-button";
import { Brand } from "@/components/brand";

const links = [
  { href: "/app/dashboard", label: "Command centre", icon: LayoutDashboard },
  { href: "/app/improve", label: "Improve", icon: Microscope },
  { href: "/app/invest", label: "SetuInvest", icon: BarChart3 },
  { href: "/app/history", label: "History", icon: History },
  { href: "/app/profile", label: "Profile & consent", icon: UserRound },
];

export function AppShell({
  children,
  user,
  demo,
}: {
  children: React.ReactNode;
  user: { email?: string | null; name?: string | null } | null;
  demo: boolean;
}) {
  return (
    <div className="app-frame">
      <aside className="app-sidebar">
        <Brand />
        <div className="mode-pill">
          <i />
          <span>{demo ? "GUIDED DEMO" : "NEON SESSION"}</span>
        </div>
        <nav>
          {links.map(({ href, label, icon: Icon }) => (
            <Link className="shell-link" href={href} key={href}>
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-engine">
          <Brain size={18} />
          <span>ML ENGINE</span>
          <strong>Explainable model</strong>
          <small>FastAPI · scikit-learn</small>
        </div>
        <div className="sidebar-bottom">
          <Link className="shell-link" href="/model-transparency">
            <ShieldCheck size={16} />
            <span>Model transparency</span>
          </Link>
          <Link className="shell-link" href="/judge-demo">
            <Sparkles size={16} />
            <span>Judge demo</span>
          </Link>
          <SignOutButton demo={demo} />
        </div>
      </aside>
      <div className="app-workspace">
        <header className="app-topbar">
          <div>
            <span>ARTHSETU FINANCIAL INTELLIGENCE</span>
            <strong>
              {demo
                ? "Presentation environment"
                : user?.name || user?.email || "Secure workspace"}
            </strong>
          </div>
          <div className="system-state">
            <i />
            <span>Live ML + Neon</span>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
