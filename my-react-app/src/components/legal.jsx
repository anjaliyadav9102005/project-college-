import React, { useState, useRef, useEffect } from "react";
import {
  Scale, Sun, Moon, ArrowRight, MessageSquare, FileText, Search,
  LayoutDashboard, ScanLine, Settings, LogOut, ChevronRight, ChevronLeft,
  Check, Upload, Send, Paperclip, ShieldCheck, BookOpen, Clock,
  AlertCircle, CheckCircle2, FileUp, Sparkles, X, Menu, User,
  MapPin, Calendar, Gavel, FileSearch, Plus, Trash2, Download,
  BadgeCheck, ChevronDown, Eye, EyeOff
} from "lucide-react";

/* ============================================================
   LeagleEase — AI Legal Access Platform (India)
   Design tokens:
   bg #0A0A0F · surface #12121A · surface-2 #17171F · border #22222E
   accent #5B6BFF (periwinkle) · accent-2 #8B98FF
   text #F2F2F5 · muted #9395A6 · faint #5C5E6E
   success #34D399 · warn #F5B84E · danger #F26D6D
   display: 'Space Grotesk' · serif accent: 'Fraunces' italic · body: 'Inter'
   mono (citations/statute IDs): 'IBM Plex Mono'
   Signature element: statute "citation chips" — small mono tags that
   cite a BNS/BNSS section — appear anywhere the AI asserts something,
   reinforcing the product's core promise ("cited sources").
   ============================================================ */

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Fraunces:ital,wght@1,500;1,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
`;

const CSS = `
${FONT_IMPORT}
:root{
  --bg:#0A0A0F; --surface:#12121A; --surface-2:#17171F; --surface-3:#1D1D28;
  --border:#22222E; --border-light:#2B2B39;
  --accent:#5B6BFF; --accent-2:#8B98FF; --accent-dim:#2A2E63;
  --text:#F2F2F5; --muted:#9395A6; --faint:#5C5E6E;
  --success:#34D399; --warn:#F5B84E; --danger:#F26D6D;
}
.le-root{
  background:var(--bg); color:var(--text);
  font-family:'Inter',ui-sans-serif,system-ui,sans-serif;
  min-height:100vh; width:100%;
}
.le-display{ font-family:'Space Grotesk',sans-serif; letter-spacing:-0.02em; }
.le-serif{ font-family:'Fraunces',serif; font-style:italic; }
.le-mono{ font-family:'IBM Plex Mono',monospace; }
.le-surface{ background:var(--surface); }
.le-surface2{ background:var(--surface-2); }
.le-border{ border:1px solid var(--border); }
.le-border-light{ border:1px solid var(--border-light); }
.le-text{ color:var(--text); }
.le-muted{ color:var(--muted); }
.le-faint{ color:var(--faint); }
.le-accent{ color:var(--accent); }
.le-bg-accent{ background:var(--accent); }
.le-grad-text{
  background:linear-gradient(135deg,#8B98FF 0%,#5B6BFF 55%,#4552D6 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.le-btn-primary{
  background:var(--accent); color:#fff; font-weight:600;
  transition:all .18s ease; border:1px solid var(--accent);
}
.le-btn-primary:hover{ background:#4A5AF0; transform:translateY(-1px); box-shadow:0 8px 24px -8px rgba(91,107,255,.55); }
.le-btn-ghost{
  background:transparent; color:var(--text); border:1px solid var(--border-light);
  transition:all .18s ease;
}
.le-btn-ghost:hover{ background:var(--surface-2); border-color:var(--accent); }
.le-card{
  background:var(--surface); border:1px solid var(--border); border-radius:14px;
  transition:border-color .18s ease, transform .18s ease;
}
.le-card:hover{ border-color:var(--border-light); }
.le-chip{
  display:inline-flex; align-items:center; gap:5px;
  font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:500;
  color:var(--accent-2); background:var(--accent-dim);
  border:1px solid rgba(91,107,255,.35); border-radius:6px;
  padding:2px 8px; line-height:1.6; letter-spacing:0.01em;
}
.le-input{
  background:var(--surface-2); border:1px solid var(--border-light); color:var(--text);
  border-radius:10px; transition:border-color .15s ease, box-shadow .15s ease;
}
.le-input:focus{ outline:none; border-color:var(--accent); box-shadow:0 0 0 3px rgba(91,107,255,.18); }
.le-input::placeholder{ color:var(--faint); }
.le-scrollbar::-webkit-scrollbar{ width:8px; height:8px; }
.le-scrollbar::-webkit-scrollbar-thumb{ background:var(--border-light); border-radius:8px; }
.le-scrollbar::-webkit-scrollbar-track{ background:transparent; }
.le-fade-in{ animation:leFadeIn .5s ease both; }
@keyframes leFadeIn{ from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:translateY(0);} }
.le-pulse-dot{ animation:lePulse 1.6s ease-in-out infinite; }
@keyframes lePulse{ 0%,100%{opacity:.3;} 50%{opacity:1;} }
.le-glow{
  background:radial-gradient(600px 300px at 50% 0%, rgba(91,107,255,.18), transparent 70%);
}
.le-focus:focus-visible{ outline:2px solid var(--accent); outline-offset:2px; }
@media (prefers-reduced-motion:reduce){ .le-fade-in,.le-pulse-dot{ animation:none; } }
`;
/* ---------------- Shared bits ---------------- */

function Logo({ size = 22 }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center rounded-lg le-bg-accent"
        style={{ width: size + 14, height: size + 14 }}
      >
        <Scale size={size} color="#fff" strokeWidth={2.25} />
      </div>
      <span className="le-display text-lg font-bold le-text">LeagleEase</span>
    </div>
  );
}

function CitationChip({ code }) {
  return (
    <span className="le-chip">
      <BookOpen size={11} />
      {code}
    </span>
  );
}

function ThemeToggle() {
  const [light, setLight] = useState(false);
  return (
    <button
      onClick={() => setLight((v) => !v)}
      aria-label="Toggle theme"
      className="le-focus flex items-center justify-center rounded-lg le-border-light le-border"
      style={{ width: 36, height: 36, background: "var(--surface-2)" }}
    >
      {light ? <Sun size={16} className="le-muted" /> : <Moon size={16} className="le-muted" />}
    </button>
  );
}
/* ---------------- Landing Page ---------------- */

function LandingNav({ onSignIn, onGetStarted }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40" style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm le-muted hover:le-text transition-colors">Features</a>
          <a href="#workflow" className="text-sm le-muted hover:le-text transition-colors">Workflow</a>
          <a href="#faq" className="text-sm le-muted hover:le-text transition-colors">FAQ</a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <button onClick={onSignIn} className="le-focus text-sm font-medium le-text px-3 py-2">Sign In</button>
          <button onClick={onGetStarted} className="le-focus le-btn-primary text-sm px-4 py-2 rounded-lg">Get Started</button>
        </div>
        <button className="md:hidden le-text" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 le-border" style={{ borderTop: "1px solid var(--border)" }}>
          <a href="#features" className="text-sm le-muted pt-3">Features</a>
          <a href="#workflow" className="text-sm le-muted">Workflow</a>
          <a href="#faq" className="text-sm le-muted">FAQ</a>
          <button onClick={onSignIn} className="text-sm font-medium le-text text-left">Sign In</button>
          <button onClick={onGetStarted} className="le-btn-primary text-sm px-4 py-2 rounded-lg w-full">Get Started</button>
        </div>
      )}
    </header>
  );
}

function Hero({ onGetStarted, onDemo }) {
  return (
    <section className="le-glow relative px-6 pt-24 pb-28 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto le-fade-in">
        <div className="inline-flex items-center gap-2 le-chip mb-8" style={{ fontSize: 12, padding: "6px 14px" }}>
          <ShieldCheck size={13} />
          AI-Powered Legal Access for India
        </div>
        <h1 className="le-display font-bold le-text" style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)", lineHeight: 1.08 }}>
          Simplifying Law &amp; Justice through
          <br />
          <span className="le-serif le-grad-text" style={{ fontWeight: 600 }}>AI Copilots</span>
        </h1>
        <p className="le-muted mx-auto mt-7" style={{ maxWidth: 560, fontSize: 17, lineHeight: 1.65 }}>
          LeagleEase is a legal assistant that automates police complaints, analyzes
          evidence via OCR, and indexes BNS 2023 legal codes with cited sources.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <button onClick={onGetStarted} className="le-focus le-btn-primary rounded-lg px-6 py-3 text-sm flex items-center gap-2">
            Get Started For Free <ArrowRight size={16} />
          </button>
          <button onClick={onDemo} className="le-focus le-btn-ghost rounded-lg px-6 py-3 text-sm">
            See Live Demo
          </button>
        </div>
        <div className="flex items-center justify-center gap-6 mt-14">
          <CitationChip code="BNS §63" />
          <CitationChip code="BNSS §173" />
          <CitationChip code="BSA §61" />
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: FileText,
    title: "Automated Complaint Drafting",
    desc: "Describe an incident in plain language; LeagleEase structures it into a formal FIR-ready complaint mapped to the correct BNS sections.",
  },
  {
    icon: ScanLine,
    title: "Evidence OCR & Analysis",
    desc: "Upload photos, scans, or PDFs. The copilot extracts text, timestamps, and flags details relevant to your case automatically.",
  },
  {
    icon: BookOpen,
    title: "Cited Legal Search",
    desc: "Search Bharatiya Nyaya Sanhita 2023 and allied codes in plain English, with every answer traced to a specific, citable section.",
  },
  {
    icon: MessageSquare,
    title: "24/7 AI Legal Chat",
    desc: "Ask procedural questions — bail process, jurisdiction, documentation needed — and get grounded, source-linked answers instantly.",
  },
  {
    icon: Gavel,
    title: "Case Timeline Tracking",
    desc: "Keep every filing, hearing date, and follow-up organized in one place, with reminders before deadlines slip.",
  },
  {
    icon: ShieldCheck,
    title: "Private by Design",
    desc: "Sensitive case details and documents stay encrypted and are never used to train shared models.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-14">
          <span className="le-chip mb-4 inline-flex">Features</span>
          <h2 className="le-display font-bold le-text" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)" }}>
            Everything a first filing needs
          </h2>
          <p className="le-muted mt-3" style={{ fontSize: 15.5 }}>
            Built around the three moments people get stuck: writing the complaint, organizing evidence, and understanding the law itself.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="le-card p-6">
              <div
                className="flex items-center justify-center rounded-lg mb-5"
                style={{ width: 40, height: 40, background: "var(--accent-dim)" }}
              >
                <f.icon size={19} className="le-accent" />
              </div>
              <h3 className="le-display font-semibold le-text mb-2" style={{ fontSize: 16 }}>{f.title}</h3>
              <p className="le-muted" style={{ fontSize: 13.5, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
const WORKFLOW_STEPS = [
  { title: "Describe what happened", desc: "Tell the copilot the facts in your own words, in text or voice.", icon: MessageSquare },
  { title: "Attach your evidence", desc: "Upload photos, receipts, or documents — OCR extracts and organizes them.", icon: FileUp },
  { title: "Review the cited draft", desc: "Get a structured complaint with every claim linked to a BNS section.", icon: FileSearch },
  { title: "File with confidence", desc: "Download the final document or take it directly to the station.", icon: BadgeCheck },
];

function WorkflowSection() {
  return (
    <section id="workflow" className="px-6 py-24" style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-16">
          <span className="le-chip mb-4 inline-flex">Workflow</span>
          <h2 className="le-display font-bold le-text" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)" }}>
            From incident to filing, in order
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {WORKFLOW_STEPS.map((s, i) => (
            <div key={i} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="le-mono le-accent" style={{ fontSize: 13 }}>{String(i + 1).padStart(2, "0")}</span>
                <div className="h-px flex-1" style={{ background: "var(--border-light)" }} />
              </div>
              <s.icon size={20} className="le-accent mb-4" />
              <h3 className="le-display font-semibold le-text mb-2" style={{ fontSize: 15.5 }}>{s.title}</h3>
              <p className="le-muted" style={{ fontSize: 13.5, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
const FAQS = [
  { q: "Is LeagleEase a substitute for a lawyer?", a: "No. LeagleEase helps you prepare, organize, and understand documentation. For representation or case strategy, it will point you to when consulting a licensed advocate is recommended." },
  { q: "Which legal codes are indexed?", a: "The Bharatiya Nyaya Sanhita (BNS) 2023, Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023, and Bharatiya Sakshya Adhiniyam (BSA) 2023, kept current as amendments are notified." },
  { q: "What happens to uploaded evidence?", a: "Files are encrypted at rest, processed for OCR/analysis, and never used to train shared models. You can delete any file permanently at any time." },
  { q: "Does it work in regional languages?", a: "Chat and complaint drafting support Hindi and English today, with more Indian languages on the way." },
];

function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section id="faq" className="px-6 py-24" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-3xl mx-auto">
        <span className="le-chip mb-4 inline-flex">FAQ</span>
        <h2 className="le-display font-bold le-text mb-10" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)" }}>
          Questions, answered
        </h2>
        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <div key={i} className="le-card overflow-hidden">
              <button
                className="le-focus w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              >
                <span className="le-text font-medium" style={{ fontSize: 14.5 }}>{f.q}</span>
                <ChevronDown size={17} className="le-muted" style={{ transform: openIdx === i ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
              </button>
              {openIdx === i && (
                <div className="px-5 pb-5 le-muted le-fade-in" style={{ fontSize: 13.5, lineHeight: 1.65 }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ onGetStarted }) {
  return (
    <footer className="px-6 py-16" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <Logo size={18} />
          <p className="le-faint mt-3" style={{ fontSize: 12.5, maxWidth: 320 }}>
            AI-powered legal access for India. Not a law firm; not a substitute for licensed legal counsel.
          </p>
        </div>
        <button onClick={onGetStarted} className="le-focus le-btn-primary rounded-lg px-5 py-2.5 text-sm flex items-center gap-2">
          Start free <ArrowRight size={15} />
        </button>
      </div>
      <div className="max-w-6xl mx-auto le-faint mt-10 pt-6" style={{ fontSize: 11.5, borderTop: "1px solid var(--border)" }}>
        © 2026 LeagleEase. All rights reserved.
      </div>
    </footer>
  );
}
function LandingPage({ onSignIn, onGetStarted, onDemo }) {
  return (
    <div>
      <LandingNav onSignIn={onSignIn} onGetStarted={onGetStarted} />
      <Hero onGetStarted={onGetStarted} onDemo={onDemo} />
      <FeaturesSection />
      <WorkflowSection />
      <FAQSection />
      <Footer onGetStarted={onGetStarted} />
    </div>
  );
}

/* ---------------- Auth ---------------- */

function AuthPage({ mode, setMode, onAuthed, onBack }) {
  const [showPw, setShowPw] = useState(false);
  const isSignUp = mode === "signup";
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 le-glow">
      <div className="w-full le-fade-in" style={{ maxWidth: 400 }}>
        <button onClick={onBack} className="le-focus flex items-center gap-1.5 le-muted text-sm mb-8 hover:le-text">
          <ChevronLeft size={15} /> Back
        </button>
        <div className="mb-8">
          <Logo />
        </div>
        <h1 className="le-display font-bold le-text" style={{ fontSize: 26 }}>
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="le-muted mt-2 mb-8" style={{ fontSize: 14 }}>
          {isSignUp ? "Start filing and researching with your AI copilot." : "Sign in to continue to your dashboard."}
        </p>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => { e.preventDefault(); onAuthed(); }}
        >
          {isSignUp && (
            <div>
              <label className="le-muted block mb-1.5" style={{ fontSize: 12.5 }}>Full name</label>
              <input className="le-input le-focus w-full px-3.5 py-2.5" style={{ fontSize: 14 }} placeholder="Ananya Sharma" required />
            </div>
          )}
          <div>
            <label className="le-muted block mb-1.5" style={{ fontSize: 12.5 }}>Email</label>
            <input type="email" className="le-input le-focus w-full px-3.5 py-2.5" style={{ fontSize: 14 }} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="le-muted block mb-1.5" style={{ fontSize: 12.5 }}>Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} className="le-input le-focus w-full px-3.5 py-2.5 pr-10" style={{ fontSize: 14 }} placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="le-focus absolute right-3 top-1/2 -translate-y-1/2 le-faint">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {!isSignUp && (
            <div className="flex justify-end -mt-1">
              <button type="button" className="le-focus le-accent" style={{ fontSize: 12.5 }}>Forgot password?</button>
            </div>
          )}
          <button type="submit" className="le-focus le-btn-primary rounded-lg py-2.5 mt-2" style={{ fontSize: 14 }}>
            {isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="le-muted text-center mt-6" style={{ fontSize: 13 }}>
          {isSignUp ? "Already have an account?" : "New to LeagleEase?"}{" "}
          <button
            className="le-focus le-accent font-medium"
            onClick={() => setMode(isSignUp ? "signin" : "signup")}
          >
            {isSignUp ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}

/* ---------------- Dashboard shell ---------------- */

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "chat", label: "AI Chat", icon: MessageSquare },
  { key: "wizard", label: "Complaint Wizard", icon: FileText },
  { key: "docs", label: "Document OCR", icon: ScanLine },
  { key: "search", label: "Legal Search", icon: Search },
];

function Sidebar({ view, setView, onLogout, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: "rgba(0,0,0,.6)" }} onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className="fixed lg:sticky top-0 left-0 z-50 lg:z-0 h-screen flex flex-col justify-between le-surface"
        style={{
          width: 240, borderRight: "1px solid var(--border)",
          transform: mobileOpen ? "translateX(0)" : undefined,
          display: undefined,
        }}
      >
        <div>
          <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
            <Logo size={18} />
            <button className="lg:hidden le-muted" onClick={() => setMobileOpen(false)}><X size={18} /></button>
          </div>
          <nav className="flex flex-col gap-1 px-3 py-4">
            {NAV_ITEMS.map((item) => {
              const active = view === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { setView(item.key); setMobileOpen(false); }}
                  className="le-focus flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors"
                  style={{
                    background: active ? "var(--accent-dim)" : "transparent",
                    color: active ? "var(--accent-2)" : "var(--muted)",
                    fontSize: 13.5, fontWeight: active ? 600 : 500,
                  }}
                >
                  <item.icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="px-3 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <button className="le-focus flex items-center gap-3 px-3 py-2.5 rounded-lg le-muted w-full text-left" style={{ fontSize: 13.5 }}>
            <Settings size={17} /> Settings
          </button>
          <button onClick={onLogout} className="le-focus flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left" style={{ fontSize: 13.5, color: "var(--danger)" }}>
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ title, subtitle, setMobileOpen }) {
  return (
    <div className="flex items-center justify-between px-6 lg:px-8 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center gap-3">
        <button className="lg:hidden le-muted" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
        <div>
          <h1 className="le-display font-bold le-text" style={{ fontSize: 19 }}>{title}</h1>
          {subtitle && <p className="le-muted" style={{ fontSize: 12.5 }}>{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center justify-center rounded-full le-bg-accent" style={{ width: 34, height: 34 }}>
             <span className="le-display font-semibold" style={{ fontSize: 13, color: "#fff" }}>AS</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Dashboard Home ---------------- */

const STATS = [
  { label: "Active cases", value: "3", icon: Gavel, tone: "accent" },
  { label: "Documents processed", value: "18", icon: ScanLine, tone: "success" },
  { label: "Chat sessions", value: "27", icon: MessageSquare, tone: "accent" },
  { label: "Pending deadlines", value: "1", icon: AlertCircle, tone: "warn" },
];

const RECENT_ACTIVITY = [
  { title: "Complaint draft generated — Theft of two-wheeler", time: "2 hours ago", icon: FileText, code: "BNS §303" },
  { title: "OCR completed — 3 receipts, 1 FIR copy", time: "Yesterday, 6:40 PM", icon: ScanLine, code: null },
  { title: "Legal search — bail process for bailable offences", time: "2 days ago", icon: Search, code: "BNSS §478" },
  { title: "Chat session — jurisdiction question", time: "3 days ago", icon: MessageSquare, code: "BNSS §197" },
];

function DashboardHome({ setView }) {
  return (
    <div className="px-6 lg:px-8 py-8 le-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s, i) => (
          <div key={i} className="le-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: 34, height: 34,
                  background: s.tone === "success" ? "rgba(52,211,153,.12)" : s.tone === "warn" ? "rgba(245,184,78,.12)" : "var(--accent-dim)",
                }}
              >
                <s.icon size={16} style={{ color: s.tone === "success" ? "var(--success)" : s.tone === "warn" ? "var(--warn)" : "var(--accent-2)" }} />
              </div>
            </div>
            <div className="le-display font-bold le-text" style={{ fontSize: 24 }}>{s.value}</div>
            <div className="le-muted mt-1" style={{ fontSize: 12.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 le-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="le-display font-semibold le-text" style={{ fontSize: 15.5 }}>Recent activity</h2>
          </div>
          <div className="flex flex-col gap-4">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3.5 pb-4" style={{ borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div className="flex items-center justify-center rounded-lg le-surface2" style={{ width: 34, height: 34, flexShrink: 0 }}>
                  <a.icon size={15} className="le-muted" />
                </div>
                <div className="flex-1">
                  <p className="le-text" style={{ fontSize: 13.5 }}>{a.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="le-faint" style={{ fontSize: 11.5 }}>{a.time}</span>
                    {a.code && <CitationChip code={a.code} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="le-card p-6">
            <h2 className="le-display font-semibold le-text mb-4" style={{ fontSize: 15.5 }}>Quick actions</h2>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => setView("wizard")} className="le-focus le-btn-primary rounded-lg py-2.5 flex items-center justify-center gap-2" style={{ fontSize: 13.5 }}>
                <Plus size={15} /> New complaint
              </button>
              <button onClick={() => setView("docs")} className="le-focus le-btn-ghost rounded-lg py-2.5 flex items-center justify-center gap-2" style={{ fontSize: 13.5 }}>
                <Upload size={15} /> Upload evidence
              </button>
              <button onClick={() => setView("search")} className="le-focus le-btn-ghost rounded-lg py-2.5 flex items-center justify-center gap-2" style={{ fontSize: 13.5 }}>
                <Search size={15} /> Search legal codes
              </button>
            </div>
          </div>
          <div className="le-card p-6" style={{ background: "var(--accent-dim)", borderColor: "rgba(91,107,255,.35)" }}>
            <ShieldCheck size={20} className="le-accent mb-3" />
            <p className="le-text font-medium" style={{ fontSize: 13.5 }}>All responses are cited</p>
            <p className="le-muted mt-1.5" style={{ fontSize: 12, lineHeight: 1.55 }}>
              Every legal claim LeagleEase makes links back to a specific BNS, BNSS, or BSA section for you to verify.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Chat ---------------- */

const SEED_MESSAGES = [
  { role: "assistant", text: "Namaste! I'm your LeagleEase copilot. Tell me what happened, or ask a procedural question — I'll cite the relevant section as I go.", code: null },
  { role: "user", text: "My neighbor has been blasting loud music past midnight for a week. What can I do?", code: null },
  { role: "assistant", text: "This falls under public nuisance provisions. You can file a complaint at your local police station, or approach the SDM under the noise pollution rules. Persistent nuisance affecting public health or convenience is actionable.", code: "BNS §274" },
];

function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} le-fade-in`}>
      <div className="flex items-start gap-3 max-w-[80%]" style={{ flexDirection: isUser ? "row-reverse" : "row" }}>
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{ width: 30, height: 30, background: isUser ? "var(--surface-3)" : "var(--accent)" }}
        >
          {isUser ? <User size={14} className="le-muted" /> : <Sparkles size={14} color="#fff" />}
        </div>
        <div>
          <div
            className="px-4 py-3 rounded-2xl"
            style={{
              background: isUser ? "var(--surface-2)" : "var(--surface)",
              border: "1px solid var(--border)",
              borderTopRightRadius: isUser ? 4 : undefined,
              borderTopLeftRadius: !isUser ? 4 : undefined,
              fontSize: 13.75, lineHeight: 1.6,
            }}
            className2=""
          >
            <span className="le-text">{msg.text}</span>
          </div>
          {msg.code && (
            <div className="mt-2 ml-1">
              <CitationChip code={msg.code} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatView() {
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input.trim(), code: null };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Based on what you've described, here's the relevant procedure and the section it falls under. Would you like me to draft a formal complaint from this?",
          code: "BNSS §173",
        },
      ]);
    }, 1400);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto le-scrollbar px-6 lg:px-8 py-6 flex flex-col gap-6" style={{ minHeight: 0 }}>
        {messages.map((m, i) => <ChatMessage key={i} msg={m} />)}
        {thinking && (
          <div className="flex items-center gap-2 ml-11">
            <span className="le-pulse-dot le-faint" style={{ fontSize: 12 }}>●</span>
            <span className="le-pulse-dot le-faint" style={{ fontSize: 12, animationDelay: ".2s" }}>●</span>
            <span className="le-pulse-dot le-faint" style={{ fontSize: 12, animationDelay: ".4s" }}>●</span>
          </div>
        )}
         <div ref={endRef} />
      </div>
      <div className="px-6 lg:px-8 py-5" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 le-input px-3 py-2 rounded-xl">
          <button className="le-focus le-faint p-1.5"><Paperclip size={17} /></button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about a procedure, or describe what happened..."
            className="flex-1 bg-transparent outline-none le-text"
            style={{ fontSize: 13.75 }}
          />
          <button onClick={send} className="le-focus le-btn-primary p-2 rounded-lg" aria-label="Send">
            <Send size={15} />
          </button>
        </div>
        <p className="le-faint mt-2" style={{ fontSize: 11 }}>
          LeagleEase provides informational guidance, not legal representation.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Complaint Wizard ---------------- */

const WIZARD_STEPS = ["Incident details", "Parties involved", "Evidence", "Review & generate"];

function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-2 mb-8 flex-wrap">
      {WIZARD_STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  width: 26, height: 26, fontSize: 11.5,
                  background: done ? "var(--success)" : active ? "var(--accent)" : "var(--surface-2)",
                  color: done || active ? "#fff" : "var(--faint)",
                  border: !done && !active ? "1px solid var(--border-light)" : "none",
                }}
              >
                {done ? <Check size={13} /> : i + 1}
              </div>
              <span style={{ fontSize: 12.5, color: active ? "var(--text)" : "var(--faint)", fontWeight: active ? 600 : 500 }}>{s}</span>
            </div>
            {i < WIZARD_STEPS.length - 1 && <div className="h-px" style={{ width: 24, background: "var(--border-light)" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="le-muted block mb-1.5" style={{ fontSize: 12.5 }}>{label}</label>
      {children}
    </div>
  );
}

function ComplaintWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    incidentType: "Theft", date: "", location: "", description: "",
    party: "", relationship: "", files: [],
  });
  const [generated, setGenerated] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const addFile = () => {
    setForm((f) => ({ ...f, files: [...f.files, `evidence_${f.files.length + 1}.jpg`] }));
  };
  const removeFile = (idx) => {
    setForm((f) => ({ ...f, files: f.files.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="px-6 lg:px-8 py-8 le-fade-in" style={{ maxWidth: 720 }}>
      <StepIndicator step={step} />

      {step === 0 && (
        <div className="le-card p-6">
          <h2 className="le-display font-semibold le-text mb-5" style={{ fontSize: 16 }}>What happened?</h2>
          <Field label="Type of incident">
            <select
              className="le-input le-focus w-full px-3.5 py-2.5"
              style={{ fontSize: 13.75 }}
              value={form.incidentType}
              onChange={(e) => setForm({ ...form, incidentType: e.target.value })}
            >
              <option>Theft</option>
              <option>Assault</option>
              <option>Fraud / cheating</option>
              <option>Harassment</option>
              <option>Property dispute</option>
              <option>Other</option>
            </select>
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date of incident">
              <div className="relative">
                <input type="date" className="le-input le-focus w-full px-3.5 py-2.5" style={{ fontSize: 13.75 }}
                  value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </Field>
            <Field label="Location">
              <input placeholder="e.g. Sector 21, Noida" className="le-input le-focus w-full px-3.5 py-2.5" style={{ fontSize: 13.75 }}
                value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>
          </div>
          <Field label="Describe what happened">
            <textarea
              rows={5}
              placeholder="Walk through the events in order — what you saw, heard, or experienced..."
              className="le-input le-focus w-full px-3.5 py-2.5 resize-none"
              style={{ fontSize: 13.75 }}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
        </div>
      )}
       {step === 1 && (
        <div className="le-card p-6">
          <h2 className="le-display font-semibold le-text mb-5" style={{ fontSize: 16 }}>Who's involved?</h2>
          <Field label="Other party's name (if known)">
            <input placeholder="Full name, or 'unknown'" className="le-input le-focus w-full px-3.5 py-2.5" style={{ fontSize: 13.75 }}
              value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })} />
          </Field>
          <Field label="Your relationship to them">
            <select className="le-input le-focus w-full px-3.5 py-2.5" style={{ fontSize: 13.75 }}
              value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })}>
              <option value="">Select one</option>
              <option>Stranger</option>
              <option>Neighbor</option>
              <option>Colleague</option>
              <option>Family member</option>
              <option>Business associate</option>
            </select>
          </Field>
          <div className="flex items-start gap-2.5 le-card p-3.5 mt-2" style={{ background: "var(--surface-2)" }}>
            <AlertCircle size={15} className="le-accent flex-shrink-0 mt-0.5" />
            <p className="le-muted" style={{ fontSize: 12.5, lineHeight: 1.55 }}>
              If you don't know the other party's identity, that's fine — the complaint can be filed against "unknown persons."
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="le-card p-6">
          <h2 className="le-display font-semibold le-text mb-5" style={{ fontSize: 16 }}>Attach evidence</h2>
          <button
            onClick={addFile}
            className="le-focus w-full flex flex-col items-center justify-center gap-2 rounded-xl py-10"
            style={{ border: "1.5px dashed var(--border-light)", background: "var(--surface-2)" }}
          >
            <Upload size={22} className="le-accent" />
            <span className="le-text font-medium" style={{ fontSize: 13.5 }}>Click to add a file</span>
            <span className="le-faint" style={{ fontSize: 11.5 }}>Photos, PDFs, or scans — processed via OCR</span>
          </button>
          {form.files.length > 0 && (
            <div className="flex flex-col gap-2 mt-4">
              {form.files.map((f, i) => (
                <div key={i} className="flex items-center justify-between px-3.5 py-2.5 rounded-lg le-surface2">
                  <div className="flex items-center gap-2.5">
                    <FileText size={15} className="le-muted" />
                    <span className="le-text" style={{ fontSize: 13 }}>{f}</span>
                  </div>
                  <button onClick={() => removeFile(i)} className="le-focus" style={{ color: "var(--danger)" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="le-card p-6">
          <h2 className="le-display font-semibold le-text mb-5" style={{ fontSize: 16 }}>Review &amp; generate</h2>
          {!generated ? (
            <>
              <div className="flex flex-col gap-3 mb-6">
                <ReviewRow label="Incident type" value={form.incidentType} />
                <ReviewRow label="Date" value={form.date || "Not specified"} />
                <ReviewRow label="Location" value={form.location || "Not specified"} />
                <ReviewRow label="Other party" value={form.party || "Unknown"} />
                <ReviewRow label="Evidence files" value={`${form.files.length} attached`} />
              </div>
              <button
                onClick={() => setGenerated(true)}
                className="le-focus le-btn-primary rounded-lg py-3 w-full flex items-center justify-center gap-2"
                style={{ fontSize: 13.75 }}
              >
                <Sparkles size={15} /> Generate cited complaint
              </button>
            </>
          ) : (
            <div className="le-fade-in">
              <div className="flex items-center gap-2 mb-4" style={{ color: "var(--success)" }}>
                <CheckCircle2 size={17} />
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>Complaint drafted</span>
              </div>
              <div className="le-card p-5" style={{ background: "var(--surface-2)" }}>
                <p className="le-mono le-faint mb-2" style={{ fontSize: 11 }}>DRAFT — FOR REVIEW</p>
                <p className="le-text" style={{ fontSize: 13.5, lineHeight: 1.7 }}>
                  I wish to report an incident of <strong>{form.incidentType.toLowerCase()}</strong> that occurred
                  {form.location ? ` at ${form.location}` : ""}{form.date ? ` on ${form.date}` : ""}.
                  {form.description ? ` ${form.description}` : ""} The matter is submitted for registration
                  and appropriate action under the applicable provisions.
                </p>
                <div className="flex gap-2 mt-4">
                  <CitationChip code={form.incidentType === "Theft" ? "BNS §303" : form.incidentType === "Assault" ? "BNS §115" : "BNS §316"} />
                  <CitationChip code="BNSS §173" />
                </div>
              </div>
               <div className="flex gap-3 mt-5">
                <button className="le-focus le-btn-primary rounded-lg py-2.5 px-5 flex items-center gap-2" style={{ fontSize: 13.5 }}>
                  <Download size={14} /> Download PDF
                </button>
                <button onClick={() => setGenerated(false)} className="le-focus le-btn-ghost rounded-lg py-2.5 px-5" style={{ fontSize: 13.5 }}>
                  Edit details
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!(step === 3 && generated) && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={back}
            disabled={step === 0}
            className="le-focus le-btn-ghost rounded-lg px-4 py-2.5 flex items-center gap-1.5"
            style={{ fontSize: 13.5, opacity: step === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft size={15} /> Back
          </button>
          {step < 3 && (
            <button onClick={next} className="le-focus le-btn-primary rounded-lg px-5 py-2.5 flex items-center gap-1.5" style={{ fontSize: 13.5 }}>
              Continue <ChevronRight size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
function ReviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border)" }}>
      <span className="le-muted" style={{ fontSize: 12.5 }}>{label}</span>
      <span className="le-text font-medium" style={{ fontSize: 13 }}>{value}</span>
    </div>
  );
}

/* ---------------- Document OCR ---------------- */

const SEED_DOCS = [
  { name: "FIR_copy_scan.pdf", status: "done", type: "PDF", extracted: "FIR No. 0234/2026 registered at PS Sector 20 under BNS §303. Complainant: Rohan Verma. Date: 12/07/2026...", code: "BNS §303" },
  { name: "receipt_shop_A.jpg", status: "done", type: "Image", extracted: "Invoice #A-1123, dated 09/07/2026, Rainbow Electronics — Samsung Galaxy handset, ₹18,499, paid via UPI...", code: null },
  { name: "medical_report.pdf", status: "processing", type: "PDF", extracted: null, code: null },
];

function DocCard({ doc }) {
  return (
    <div className="le-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg le-surface2" style={{ width: 36, height: 36 }}>
            <FileText size={16} className="le-muted" />
          </div>
          <div>
            <p className="le-text font-medium" style={{ fontSize: 13.5 }}>{doc.name}</p>
            <p className="le-faint" style={{ fontSize: 11.5 }}>{doc.type}</p>
          </div>
        </div>
        {doc.status === "done" ? (
          <span className="flex items-center gap-1.5" style={{ color: "var(--success)", fontSize: 11.5 }}>
            <CheckCircle2 size={13} /> Processed
          </span>
        ) : (
          <span className="flex items-center gap-1.5 le-pulse-dot" style={{ color: "var(--warn)", fontSize: 11.5 }}>
            <Clock size={13} /> Processing
          </span>
        )}
      </div>
      {doc.extracted ? (
        <div className="le-surface2 rounded-lg p-3.5 mt-3">
          <p className="le-faint le-mono mb-1.5" style={{ fontSize: 10.5 }}>EXTRACTED TEXT</p>
          <p className="le-muted" style={{ fontSize: 12.5, lineHeight: 1.6 }}>{doc.extracted}</p>
          {doc.code && <div className="mt-2.5"><CitationChip code={doc.code} /></div>}
        </div>
      ) : (
        <div className="le-surface2 rounded-lg p-3.5 mt-3 flex items-center gap-2">
          <span className="le-pulse-dot le-faint" style={{ fontSize: 11 }}>●</span>
          <span className="le-faint" style={{ fontSize: 12 }}>Running OCR extraction...</span>
        </div>
      )}
    </div>
  );
}

function DocsOCRView() {
  const [docs, setDocs] = useState(SEED_DOCS);
  const [dragOver, setDragOver] = useState(false);

  const addDoc = () => {
    const n = docs.length + 1;
    setDocs((d) => [{ name: `document_${n}.pdf`, status: "processing", type: "PDF", extracted: null, code: null }, ...d]);
    setTimeout(() => {
      setDocs((d) => d.map((doc, i) => i === 0 && doc.status === "processing"
        ? { ...doc, status: "done", extracted: "Text extracted successfully. Key entities and dates have been indexed for reference in your case file.", code: "BSA §61" }
        : doc));
    }, 2200);
  };

  return (
    <div className="px-6 lg:px-8 py-8 le-fade-in">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addDoc(); }}
        className="le-focus w-full flex flex-col items-center justify-center gap-2 rounded-xl py-12 mb-8 cursor-pointer"
        style={{
          border: `1.5px dashed ${dragOver ? "var(--accent)" : "var(--border-light)"}`,
          background: dragOver ? "var(--accent-dim)" : "var(--surface-2)",
          transition: "all .15s ease",
        }}
        onClick={addDoc}
        role="button"
        tabIndex={0}
      >
        <ScanLine size={26} className="le-accent" />
        <span className="le-text font-medium" style={{ fontSize: 14 }}>Drag files here, or click to upload</span>
        <span className="le-faint" style={{ fontSize: 12 }}>Supports PDF, JPG, PNG — text is extracted automatically</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="le-display font-semibold le-text" style={{ fontSize: 15 }}>Your documents</h2>
        <span className="le-faint" style={{ fontSize: 12 }}>{docs.length} files</span>
      </div>
      <div className="flex flex-col gap-4">
        {docs.map((d, i) => <DocCard key={i} doc={d} />)}
      </div>
    </div>
  );
}

/* ---------------- Legal Search ---------------- */

const LEGAL_INDEX = [
  { code: "BNS §63", title: "Rape", act: "Bharatiya Nyaya Sanhita, 2023", snippet: "Defines the offence and circumstances constituting the crime, replacing IPC §375." },
  { code: "BNS §101", title: "Murder", act: "Bharatiya Nyaya Sanhita, 2023", snippet: "Culpable homicide amounting to murder and its punishment provisions, replacing IPC §302." },
  { code: "BNS §303", title: "Theft", act: "Bharatiya Nyaya Sanhita, 2023", snippet: "Dishonestly taking movable property out of another's possession without consent." },
  { code: "BNS §115", title: "Voluntarily causing hurt", act: "Bharatiya Nyaya Sanhita, 2023", snippet: "Punishment for causing bodily pain, disease, or infirmity to another person." },
  { code: "BNSS §173", title: "Registration of FIR", act: "Bharatiya Nagarik Suraksha Sanhita, 2023", snippet: "Procedure for recording information on a cognizable offence, replacing CrPC §154." },
  { code: "BNSS §478", title: "Bail in bailable offences", act: "Bharatiya Nagarik Suraksha Sanhita, 2023", snippet: "Right to bail as a matter of course for bailable offences, replacing CrPC §436." },
  { code: "BNSS §197", title: "Jurisdiction of criminal courts", act: "Bharatiya Nagarik Suraksha Sanhita, 2023", snippet: "Determines where an inquiry or trial should ordinarily be held." },
  { code: "BSA §61", title: "Admissibility of electronic records", act: "Bharatiya Sakshya Adhiniyam, 2023", snippet: "Conditions under which electronic and digital evidence is admissible in court." },
];

function LegalSearchView() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(LEGAL_INDEX);
  const [searching, setSearching] = useState(false);

  const runSearch = (q) => {
    setQuery(q);
    setSearching(true);
    setTimeout(() => {
      const filtered = q.trim()
        ? LEGAL_INDEX.filter((r) =>
            (r.title + r.snippet + r.code + r.act).toLowerCase().includes(q.toLowerCase())
          )
        : LEGAL_INDEX;
      setResults(filtered);
      setSearching(false);
    }, 350);
  };

  return (
    <div className="px-6 lg:px-8 py-8 le-fade-in">
      <div className="relative mb-3">
        <Search size={17} className="le-faint absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => runSearch(e.target.value)}
          placeholder="Search by topic, keyword, or section — e.g. 'FIR', 'bail', 'theft'"
          className="le-input le-focus w-full pl-11 pr-4 py-3.5"
          style={{ fontSize: 14 }}
        />
      </div>
      <p className="le-faint mb-6" style={{ fontSize: 12 }}>
        Indexed across BNS, BNSS, and BSA 2023 — {LEGAL_INDEX.length} sections available in this demo.
      </p>

      {searching ? (
        <div className="flex items-center gap-2 py-8 justify-center le-faint" style={{ fontSize: 13 }}>
          <span className="le-pulse-dot">●</span> Searching statutes...
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <FileSearch size={28} className="le-faint mx-auto mb-3" />
          <p className="le-muted" style={{ fontSize: 13.5 }}>No sections match "{query}"</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((r, i) => (
            <div key={i} className="le-card p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-shrink-0">
                <CitationChip code={r.code} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="le-display font-semibold le-text" style={{ fontSize: 14.5 }}>{r.title}</h3>
                </div>
                <p className="le-faint mt-0.5" style={{ fontSize: 11.5 }}>{r.act}</p>
                <p className="le-muted mt-2.5" style={{ fontSize: 13, lineHeight: 1.6 }}>{r.snippet}</p>
              </div>
              <button className="le-focus le-btn-ghost rounded-lg px-3.5 py-2 flex-shrink-0 flex items-center gap-1.5" style={{ fontSize: 12 }}>
                <Eye size={13} /> View full text
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Dashboard Shell ---------------- */

const VIEW_META = {
  dashboard: { title: "Dashboard", subtitle: "Welcome back, here's what's happening across your cases." },
  chat: { title: "AI Chat", subtitle: "Ask a question — every answer comes with its source." },
  wizard: { title: "Complaint Wizard", subtitle: "Turn what happened into a filing-ready draft." },
  docs: { title: "Document OCR", subtitle: "Upload evidence and let the copilot extract the details." },
  search: { title: "Legal Search", subtitle: "Browse BNS, BNSS, and BSA 2023 with plain-English context." },
};

function DashboardShell({ onLogout }) {
  const [view, setView] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = VIEW_META[view];

  return (
     <div className="flex" style={{ minHeight: "100vh" }}>
      <Sidebar view={view} setView={setView} onLogout={onLogout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
        <TopBar title={meta.title} subtitle={meta.subtitle} setMobileOpen={setMobileOpen} />
        <div className="flex-1" style={{ minHeight: 0, display: "flex", flexDirection: "column" }}>
          {view === "dashboard" && <DashboardHome setView={setView} />}
          {view === "chat" && <ChatView />}
          {view === "wizard" && <ComplaintWizard />}
          {view === "docs" && <DocsOCRView />}
          {view === "search" && <LegalSearchView />}
        </div>
      </div>
    </div>
  );
}
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | auth | app
  const [authMode, setAuthMode] = useState("signin");

  return (
    <div className="le-root">
      <style>{CSS}</style>
      {screen === "landing" && (
        <LandingPage
          onSignIn={() => { setAuthMode("signin"); setScreen("auth"); }}
          onGetStarted={() => { setAuthMode("signup"); setScreen("auth"); }}
          onDemo={() => setScreen("app")}
        />
      )}
      {screen === "auth" && (
        <AuthPage
          mode={authMode}
          setMode={setAuthMode}
          onAuthed={() => setScreen("app")}
          onBack={() => setScreen("landing")}
        />
      )}
      {screen === "app" && <DashboardShell onLogout={() => setScreen("landing")} />}
    </div>
  );
}
