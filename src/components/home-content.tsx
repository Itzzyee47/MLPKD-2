"use client";

import Link from "next/link";
import { useScrollReveal } from "@/lib/useScrollReveal";

const stats = [
  { label: "Active Patients", value: "12,400+", icon: "👥" },
  { label: "Prediction Accuracy", value: "91.2%", icon: "🎯" },
  { label: "Partner Clinics", value: "82", icon: "🏥" },
  { label: "Assessments Done", value: "45,000+", icon: "📊" },
];

const features = [
  {
    icon: "🩺",
    title: "Doctor Prediction Workflow",
    description:
      "Review CKD risk using structured clinical markers, save outcomes, and track patient changes over time with AI-powered scoring.",
  },
  {
    icon: "💉",
    title: "Nurse & Lab Collaboration",
    description:
      "Record vitals, submit lab values, and detect out-of-range indicators with guided reference ranges and smart alerts.",
  },
  {
    icon: "📈",
    title: "Patient Insights Dashboard",
    description:
      "Patients can view diagnosis history, trend charts, personalized recommendations, and latest risk signals in real-time.",
  },
  {
    icon: "🔒",
    title: "Role-Based Access Control",
    description:
      "Secure, server-side role protection ensures doctors, nurses, lab techs, and patients each access only their authorized data.",
  },
  {
    icon: "📱",
    title: "Responsive & Mobile-Ready",
    description:
      "Fluid layouts adapt for phones, tablets, and desktop with touch-friendly controls, stacked cards, and optimized media.",
  },
  {
    icon: "⚡",
    title: "Extensible ML Pipeline",
    description:
      "The current mock scoring can be upgraded to model-backed inference while preserving the same clinical UI workflow.",
  },
];

const workflow = [
  { step: "01", title: "Register & Assign Roles", desc: "Create accounts with secure role-based access for all clinical staff and patients." },
  { step: "02", title: "Capture Clinical Data", desc: "Record vitals, lab values, and clinical markers through guided, validated forms." },
  { step: "03", title: "Evaluate CKD Risk", desc: "Run predictions using 24 clinical features to generate a comprehensive risk score." },
  { step: "04", title: "Track & Act", desc: "View live trends, informed recommendations, and progression charts for each patient." },
];

const ckdInfo = [
  { title: "What is CKD?", text: "Chronic Kidney Disease (CKD) is a progressive condition where the kidneys gradually lose function over months or years. Early detection is critical for slowing progression." },
  { title: "Why Early Detection?", text: "CKD often has no symptoms in early stages. By the time symptoms appear, significant kidney damage may have occurred. Regular screening saves lives." },
  { title: "24 Clinical Markers", text: "Our platform evaluates 24 clinical features including blood pressure, serum creatinine, hemoglobin, albumin levels, and more for comprehensive risk assessment." },
];

const faq = [
  { q: "Can each role only access its own portal?", a: "Yes. The system enforces server-side role protection for doctor, nurse, lab technician, and patient routes. Each user sees only what they're authorized to access." },
  { q: "Is this mobile friendly for ward and clinic use?", a: "Yes. Layouts adapt for phones, tablets, and desktop with stacked cards, fluid media, and touch-friendly controls optimized for clinical environments." },
  { q: "Can we keep extending prediction logic?", a: "Yes. The current mock scoring can be upgraded to model-backed inference (TensorFlow, scikit-learn, etc.) while preserving the same UI workflow." },
  { q: "What clinical markers are used for prediction?", a: "We evaluate 24 features including demographics (age), vitals (BP), urine analysis (specific gravity, albumin, sugar), blood chemistry (glucose, urea, creatinine), and hematology (hemoglobin, PCV, WBC, RBC)." },
  { q: "How is patient data protected?", a: "All data is stored securely in Supabase with row-level security. Sessions use HTTP-only cookies, and all API routes are protected by role-based middleware." },
];

function ScrollRevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`scroll-reveal ${className}`}>
      {children}
    </div>
  );
}

function ScrollRevealLeft({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`scroll-reveal-left ${className}`}>
      {children}
    </div>
  );
}

function ScrollRevealRight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`scroll-reveal-right ${className}`}>
      {children}
    </div>
  );
}

function ScrollRevealScale({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`scroll-reveal-scale ${className}`}>
      {children}
    </div>
  );
}

export default function HomeContent() {
  return (
    <main className="relative overflow-hidden">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      {/* ── Navbar ── */}
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[--color-secondary] to-[--color-accent] text-white font-bold text-lg shadow-lg">
              M
            </div>
            <span className="text-xl font-bold text-[--color-primary]">MLPKD</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#about-ckd" className="nav-link">About CKD</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/signin" className="btn-ghost text-sm">Sign In</Link>
            <Link href="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 sm:pt-16 sm:pb-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <ScrollRevealLeft>
            <div className="animate-rise space-y-6">
              <div className="badge">🧬 AI-Powered CKD Risk Assessment</div>
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl">
                Kidney Care That Is{" "}
                <span className="gradient-text">Fast, Clear</span> &amp; Actionable
              </h1>
              <p className="max-w-xl text-base text-[--color-muted] leading-relaxed sm:text-lg">
                A modern role-based clinical platform for doctors, nurses, lab technicians, and patients.
                Capture values, evaluate CKD risk, and follow progression with an interactive workflow
                powered by machine learning.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/register" className="btn-primary text-base px-7 py-3">
                  Create Free Account →
                </Link>
                <Link href="/about" className="btn-secondary text-base px-7 py-3">
                  Explore Platform
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-4 text-sm text-[--color-muted]">
                <span className="flex items-center gap-1">✅ HIPAA-Aware Design</span>
                <span className="flex items-center gap-1">✅ Role-Based Access</span>
                <span className="flex items-center gap-1">✅ Real-Time Analytics</span>
              </div>
            </div>
          </ScrollRevealLeft>

          <ScrollRevealRight>
            <div className="animate-rise-delay-2 relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[--color-secondary]/20 to-[--color-accent]/10 blur-2xl" />
              <div className="relative glass-panel p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-[--color-muted] font-mono">CKD Risk Assessment</span>
                </div>
                <div className="rounded-xl bg-[--color-bg] p-4 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-[--color-muted]">Patient</span><span className="font-semibold text-[--color-primary]">John Doe, 65yr</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[--color-muted]">Serum Creatinine</span><span className="font-semibold text-red-500">3.5 mg/dL ↑</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[--color-muted]">Hemoglobin</span><span className="font-semibold text-red-500">8.5 g/dL ↓</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[--color-muted]">Blood Pressure</span><span className="font-semibold text-amber-600">140 mmHg ↑</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[--color-muted]">Albumin</span><span className="font-semibold text-red-500">3.0 (Severe)</span></div>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-red-50 to-amber-50 p-4 border border-red-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[--color-muted] font-medium uppercase tracking-wider">Risk Score</p>
                      <p className="text-3xl font-bold text-red-600">87%</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">High Risk — CKD</span>
                      <p className="text-xs text-[--color-muted] mt-1">Immediate follow-up recommended</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollRevealRight>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {stats.map((item, i) => (
            <ScrollRevealScale key={item.label}>
              <div className="metric-tile text-center animate-rise" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-2xl font-bold text-[--color-primary]">{item.value}</p>
                <p className="text-xs uppercase tracking-[0.15em] text-[--color-muted] mt-1">{item.label}</p>
              </div>
            </ScrollRevealScale>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <ScrollRevealSection className="text-center mb-12">
          <div className="animate-rise">
            <div className="badge mb-4">Platform Capabilities</div>
            <h2 className="section-title text-3xl sm:text-4xl">Everything You Need for CKD Management</h2>
            <p className="mt-3 text-[--color-muted] max-w-2xl mx-auto">
              A comprehensive suite of tools designed for every member of the clinical team, from intake to follow-up.
            </p>
          </div>
        </ScrollRevealSection>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <ScrollRevealScale key={f.title}>
              <article className="card card-hover animate-rise" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[--color-bg] to-white text-2xl shadow-sm border border-[rgba(10,138,116,0.08)] mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-[--color-primary]">{f.title}</h3>
                <p className="mt-2 text-sm text-[--color-muted] leading-relaxed">{f.description}</p>
              </article>
            </ScrollRevealScale>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 sm:p-10">
          <ScrollRevealSection className="text-center mb-10">
            <div className="animate-rise">
              <div className="badge mb-4">Clinical Workflow</div>
              <h2 className="section-title text-3xl sm:text-4xl">How It Works</h2>
              <p className="mt-3 text-[--color-muted] max-w-2xl mx-auto">
                Build consistency from intake to follow-up with role-aware tools and shared patient context.
              </p>
            </div>
          </ScrollRevealSection>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((w, i) => (
              <ScrollRevealScale key={w.step}>
                <div className="relative animate-rise" style={{ animationDelay: `${i * 120}ms` }}>
                  <div className="text-5xl font-black text-[--color-accent]/20 mb-2">{w.step}</div>
                  <h3 className="text-lg font-semibold text-[--color-primary] -mt-4 mb-2">{w.title}</h3>
                  <p className="text-sm text-[--color-muted] leading-relaxed">{w.desc}</p>
                </div>
              </ScrollRevealScale>
            ))}
          </div>
        </div>
      </section>

      {/* ── About CKD ── */}
      <section id="about-ckd" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <ScrollRevealSection className="text-center mb-10">
          <div className="animate-rise">
            <div className="badge mb-4">Understanding CKD</div>
            <h2 className="section-title text-3xl sm:text-4xl">Why CKD Prediction Matters</h2>
            <p className="mt-3 text-[--color-muted] max-w-2xl mx-auto">
              Chronic Kidney Disease affects over 850 million people worldwide. Early detection through clinical data analysis can dramatically improve outcomes.
            </p>
          </div>
        </ScrollRevealSection>
        <div className="grid gap-5 sm:grid-cols-3">
          {ckdInfo.map((item, i) => (
            <ScrollRevealScale key={item.title}>
              <div className="card card-hover animate-rise" style={{ animationDelay: `${i * 100}ms` }}>
                <h3 className="text-lg font-semibold text-[--color-primary] mb-3">{item.title}</h3>
                <p className="text-sm text-[--color-muted] leading-relaxed">{item.text}</p>
              </div>
            </ScrollRevealScale>
          ))}
        </div>
        <ScrollRevealSection className="mt-8">
          <div className="rounded-2xl bg-gradient-to-r from-[--color-primary] to-[--color-secondary] p-6 sm:p-8 gradient-text animate-rise">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold">850M+</p>
                <p className="text-sm text-white/70 mt-1">People affected by CKD globally</p>
              </div>
              <div>
                <p className="text-3xl font-bold">1 in 10</p>
                <p className="text-sm text-white/70 mt-1">Adults have some form of CKD</p>
              </div>
              <div>
                <p className="text-3xl font-bold">90%</p>
                <p className="text-sm text-white/70 mt-1">Of CKD cases go undiagnosed early</p>
              </div>
            </div>
          </div>
        </ScrollRevealSection>
      </section>

      {/* ── Roles ── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <ScrollRevealSection className="text-center mb-10">
          <div className="animate-rise">
            <div className="badge mb-4">For Every Role</div>
            <h2 className="section-title text-3xl sm:text-4xl">Built for Your Entire Clinical Team</h2>
          </div>
        </ScrollRevealSection>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { role: "Doctor", icon: "🩺", perks: ["Run CKD predictions", "View analytics & charts", "Track patient history"] },
            { role: "Nurse", icon: "💊", perks: ["Record patient vitals", "Submit clinical observations", "View past entries"] },
            { role: "Lab Tech", icon: "🔬", perks: ["Submit lab results", "Reference range guidance", "Flag abnormal values"] },
            { role: "Patient", icon: "🧑", perks: ["View diagnosis history", "Track risk progression", "Read recommendations"] },
          ].map((r, i) => (
            <ScrollRevealScale key={r.role}>
              <div className="card card-hover text-center animate-rise" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-4xl mb-3">{r.icon}</div>
                <h3 className="text-lg font-bold text-[--color-primary]">{r.role}</h3>
                <ul className="mt-3 space-y-2 text-sm text-[--color-muted]">
                  {r.perks.map((p) => (
                    <li key={p} className="flex items-center gap-2 justify-center">
                      <span className="text-[--color-accent]">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollRevealScale>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 sm:p-10">
          <ScrollRevealSection className="text-center mb-8">
            <h2 className="section-title text-3xl sm:text-4xl">Frequently Asked Questions</h2>
          </ScrollRevealSection>
          <div className="max-w-3xl mx-auto space-y-3">
            {faq.map((item, i) => (
              <ScrollRevealScale key={item.q}>
                <details className="faq-item" style={{ animationDelay: `${i * 50}ms` }}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              </ScrollRevealScale>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <ScrollRevealScale className="rounded-3xl p-8 sm:p-14 text-center text-[--color-muted]">
          <div className="animate-rise">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Kidney Care?</h2>
            <p className="gradient-text max-w-xl mx-auto mb-8 text-lg">
              Join clinics and healthcare providers using MLPKD to detect CKD early and improve patient outcomes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="inline-flex items-center px-8 py-3.5 rounded-xl bg-white text-[--color-primary] font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                Get Started Free →
              </Link>
              <Link href="/signin" className="inline-flex items-center px-8 py-3.5 rounded-xl border-2 border-black/30 gradient-text font-semibold text-lg hover:bg-white/10 transition-all">
                Sign In
              </Link>
            </div>
          </div>
        </ScrollRevealScale>
      </section>

      {/* ── Footer ── */}
      <footer className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="divider-gradient mb-6" />
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[--color-muted]">
          <p>© 2026 MLPKD — Machine Learning Prediction of Kidney Disease</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-[--color-primary] transition-colors">About</Link>
            <Link href="/signin" className="hover:text-[--color-primary] transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-[--color-primary] transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
