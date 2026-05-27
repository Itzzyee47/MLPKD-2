import Link from "next/link";

const team = [
  { role: "Clinical Team", desc: "Doctors, nurses, and lab technicians collaborate seamlessly to track kidney health." },
  { role: "Data Science", desc: "Machine learning models evaluate 24 clinical markers for accurate CKD risk prediction." },
  { role: "Engineering", desc: "Built with Next.js, Supabase, and modern web technologies for reliability and speed." },
];

const markers = [
  "Age", "Blood Pressure", "Specific Gravity", "Albumin", "Sugar",
  "Red Blood Cells", "Pus Cell", "Pus Cell Clumps", "Bacteria",
  "Blood Glucose", "Blood Urea", "Serum Creatinine", "Sodium", "Potassium",
  "Hemoglobin", "Packed Cell Volume", "White Blood Cells", "Red Blood Cell Count",
  "Hypertension", "Diabetes Mellitus", "Coronary Artery Disease", "Appetite",
  "Pedal Edema", "Anemia",
];

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      {/* Nav */}
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[--color-secondary] to-[--color-accent] text-white font-bold text-lg shadow-lg">
              M
            </div>
            <span className="text-xl font-bold text-[--color-primary]">MLPKD</span>
          </Link>
          <div className="flex gap-2">
            <Link href="/signin" className="btn-ghost text-sm">Sign In</Link>
            <Link href="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 text-center animate-rise">
          <div className="badge mb-4">About MLPKD</div>
          <h1 className="hero-title text-3xl sm:text-4xl lg:text-5xl max-w-3xl mx-auto">
            Machine Learning Prediction of{" "}
            <span className="gradient-text">Kidney Disease</span>
          </h1>
          <p className="mt-4 text-[--color-muted] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            MLPKD is a role-based clinical platform that helps healthcare professionals detect and track
            Chronic Kidney Disease using machine learning. From data capture to risk assessment,
            every workflow is designed for clarity and speed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {team.map((t, i) => (
            <div key={t.role} className="card card-hover animate-rise" style={{ animationDelay: `${i * 100}ms` }}>
              <h3 className="text-lg font-semibold text-[--color-primary] mb-2">{t.role}</h3>
              <p className="text-sm text-[--color-muted] leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Clinical Markers */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 sm:p-10">
          <h2 className="section-title text-center mb-6">24 Clinical Markers Analyzed</h2>
          <p className="text-center text-[--color-muted] max-w-xl mx-auto mb-8">
            Each CKD risk assessment evaluates the following clinical features to generate a comprehensive risk score.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {markers.map((m) => (
              <span key={m} className="badge">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[--color-primary] to-[--color-secondary] p-8 sm:p-12 text-center text-white animate-rise">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-6">
            Create an account and start using the platform today — whether you&apos;re a clinician or a patient.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register" className="inline-flex items-center px-7 py-3 rounded-xl bg-white text-[--color-primary] font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Create Account →
            </Link>
            <Link href="/" className="inline-flex items-center px-7 py-3 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="divider-gradient mb-6" />
        <p className="text-center text-sm text-[--color-muted]">© 2026 MLPKD — Machine Learning Prediction of Kidney Disease</p>
      </footer>
    </main>
  );
}
