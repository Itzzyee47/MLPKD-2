"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  Activity,
  BarChart3,
  CalendarDays,
  ClipboardPlus,
  HeartPulse,
  Home,
  LineChart,
  LogOut,
  Search,
  Settings,
  ShieldPlus,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { PredictionForm } from "@/components/forms/prediction-form";
import { RiskBar, RiskPie, Trend } from "@/components/charts/risk-charts";
import { VitalsForm } from "@/components/forms/vitals-form";
import DoctorUserManagement from "@/components/portal/doctor-user-management";
import { DoctorRegisterForm } from "@/app/doctor/register/page";



type Profile = {
  full_name: string | null;
  sex: "male" | "female" | "other" | null;
  address: string | null;
  email: string;
};

type Patient = {
  id: string;
  email?: string | null;
  full_name: string | null;
  username: string;
  sex?: "male" | "female" | "other" | null;
  address?: string | null;
  created_at?: string | null;
};
type PredictionRow = {
  id: string;
  created_at: string;
  risk_score: number;
  diagnosis: string;
  recommendation?: string;
  patient?: { full_name?: string; username?: string };
};

function PortalFrame({
  role,
  profile,
  tabs,
  activeTab,
  onTab,
  children,
  rightRail,
}: {
  role: "Doctor" | "Nurse" | "Patient" | "Lab Technician";
  profile: Profile;
  tabs: { id: string; label: string; icon: ReactNode }[];
  activeTab: string;
  onTab: (id: string) => void;
  children: ReactNode;
  rightRail: ReactNode;
}) {
  return (
    <section className="health-shell">
      <aside className="health-rail">
        <div className="health-logo">M</div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`rail-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTab(tab.id)}
            aria-label={tab.label}
            title={tab.label}
          >
            {tab.icon}
          </button>
        ))}
        <div className="rail-spacer" />
        <Link href="/signout" className="rail-button danger" aria-label="Sign out" title="Sign out">
          <LogOut size={18} />
        </Link>
      </aside>

      <main className="health-main">
        <header className="health-header">
          <div>
            <p className="health-kicker">Hi {profile.full_name ?? role},</p>
            <h1>Welcome Back!</h1>
            <p className="health-subtitle">{role} workspace</p>
          </div>
          <div className="health-actions">
            <button className="circle-action" aria-label="Settings">
              <Settings size={17} />
            </button>
            <button className="circle-action primary" aria-label="Search">
              <Search size={17} />
            </button>
          </div>
        </header>

        {children}
      </main>

      <aside className="health-side">{rightRail}</aside>
    </section>
  );
}

function HeroPanel({ title, subtitle, action }: { title: string; subtitle: string; action: string }) {
  return (
    <div className="health-hero">
      <div>
        <p>Reminder</p>
        <h2>{title}</h2>
        <span>{subtitle}</span>
        <button>{action}</button>
      </div>
      <div className="hero-figure">
        <HeartPulse size={72} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <article className="health-stat">
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function RightRail({ profile, items }: { profile: Profile; items: { title: string; meta: string }[] }) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <>
      <div className="side-card">
        <div className="side-card-title">
          <h3>Upcoming Check Up</h3>
          <CalendarDays size={17} />
        </div>
        <div className="mini-calendar">
          {days.map((day) => (
            <span key={day} className={day === 18 ? "selected" : ""}>
              {day}
            </span>
          ))}
        </div>
      </div>

      <div className="side-card">
        <div className="side-card-title">
          <h3>Recent Activity</h3>
          <Activity size={17} />
        </div>
        <div className="activity-list">
          {items.map((item) => (
            <div key={item.title}>
              <span />
              <div>
                <strong>{item.title}</strong>
                <p>{item.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="side-card balance-card">
        <span>Profile</span>
        <strong>{profile.full_name ?? "User"}</strong>
        <p>{profile.email}</p>
      </div>
    </>
  );
}



function MedicalPersonnelPanel() {
  const [tab, setTab] = useState<"registration" | "user_management">("registration");

  return (
    <div className="workspace-stack">
      <div className="inline-flex rounded-xl bg-[--color-bg] p-1">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "registration" ? "bg-white shadow" : "text-[--color-muted]"}`}
          onClick={() => setTab("registration")}
          type="button"
        >
          Registration Form
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "user_management" ? "bg-white shadow" : "text-[--color-muted]"}`}
          onClick={() => setTab("user_management")}
          type="button"
        >
          Users Management
        </button>
      </div>

      {tab === "registration" ? <DoctorRegisterForm /> : <DoctorUserManagement />}
    </div>
  );
}

function ProfilePanel({ profile }: { profile: Profile }) {
  const [full_name, setName] = useState(profile.full_name ?? "");
  const [sex, setSex] = useState<"male" | "female" | "other">(profile.sex ?? "other");
  const [address, setAddress] = useState(profile.address ?? "");
  const [msg, setMsg] = useState("");

  async function save() {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ full_name, sex, address }),
    });
    setMsg(res.ok ? "Profile updated." : "Update failed.");
  }

  return (
    <section className="health-panel">
      <div className="panel-heading">
        <div>
          <p>Account</p>
          <h2>Profile Management</h2>
        </div>
        <UserRound size={22} />
      </div>
      <div className="profile-grid">
        <label>
          Full name
          <input className="input" value={full_name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Sex
          <select className="input" value={sex} onChange={(e) => setSex(e.target.value as typeof sex)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="wide">
          Address
          <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
      </div>
      <button className="btn-primary" onClick={save}>
        Save Profile
      </button>
      {msg && <p className="form-message">{msg}</p>}
    </section>
  );
}

export function DoctorWorkspace({
  patients,
  predictions,
  profile,
}: {
  patients: Patient[];
  predictions: PredictionRow[];
  profile: Profile;
}) {
  const [tab, setTab] = useState("overview");
  const ckd = predictions.filter((p) => p.diagnosis === "CKD").length;
  const avgRisk = predictions.length
    ? Math.round(predictions.reduce((a, c) => a + c.risk_score, 0) / predictions.length)
    : 42;
  const bar = predictions.length
    ? predictions.slice(0, 8).map((p) => ({
        name: p.patient?.full_name ?? p.patient?.username ?? "Patient",
        risk: p.risk_score,
      }))
    : [
        { name: "Template A", risk: 36 },
        { name: "Template B", risk: 48 },
        { name: "Template C", risk: 62 },
        { name: "Template D", risk: 28 },
      ];
  const totalPatients = patients.length || 24;
  const totalPredictions = predictions.length || 86;
  const ckdDisplay = predictions.length ? ckd : 11;
  return (
    <PortalFrame
      role="Doctor"
      profile={profile}
      activeTab={tab}
      onTab={setTab}
      tabs={[
        { id: "overview", label: "Overview", icon: <BarChart3 size={17} /> },
        { id: "prediction", label: "Prediction", icon: <ClipboardPlus size={17} /> },
        { id: "register_personnel", label: "Medical Personnel", icon: <UsersRound size={17} /> },
        { id: "profile", label: "Profile", icon: <UserRound size={17} /> },
      ]}
      rightRail={<RightRail profile={profile} items={[
        { title: "CKD reviews", meta: `${ckdDisplay} positive cases` },
        { title: "Average risk", meta: `${avgRisk}% across records` },
        { title: "Patients", meta: `${totalPatients} registered` },
      ]} />}
    >
      {tab === "overview" && (
        <div className="workspace-stack">
          <HeroPanel
            title="Review patient kidney risk this week"
            subtitle="Track predictions, follow patient history, and prioritize high-risk cases."
            action="Open Reports"
          />

          <div className="stat-row">
            <StatCard icon={<UsersRound size={18} />} label="Patients" value={totalPatients} />
            <StatCard icon={<ShieldPlus size={18} />} label="CKD Cases" value={ckdDisplay} />
            <StatCard icon={<LineChart size={18} />} label="Avg Risk" value={`${avgRisk}%`} />
            <StatCard icon={<BarChart3 size={18} />} label="Predictions" value={totalPredictions} />
          </div>
          <div className="chart-grid">
            <RiskPie ckd={ckdDisplay} notCkd={Math.max(0, totalPredictions - ckdDisplay)} />
            <RiskBar rows={bar} />
          </div>
        </div>
      )}
      {tab === "prediction" && <PredictionForm />}
      {tab === "profile" && <ProfilePanel profile={profile} />}
      {tab === "register_personnel" && <MedicalPersonnelPanel />}
    </PortalFrame>
  );
}



type QueueVitals = {
  id: string;
  created_at: string;
  notes?: string | null;
  patient?: { full_name?: string | null; username?: string | null; email?: string | null };
};

function LabValidationPanel() {
  const [queue, setQueue] = useState<QueueVitals[]>([]);
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");

  async function loadQueue() {
    const res = await fetch('/api/labs/queue', { cache: 'no-store' });
    const json = await res.json();
    if (res.ok) {
      setQueue(json.queue ?? []);
      if ((json.queue ?? []).length && !selected) setSelected(json.queue[0].id);
    }
  }

  async function markReady() {
    if (!selected) return;
    const res = await fetch('/api/labs/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vitals_id: selected }),
    });
    const json = await res.json();
    setMessage(res.ok ? 'Marked as lab-validated and ready for doctor prediction.' : (json.error ?? 'Validation failed'));
    if (res.ok) {
      setSelected('');
      await loadQueue();
    }
  }

  useEffect(() => {
    void loadQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="health-panel">
      <div className="panel-heading"><div><p>Lab workflow</p><h2>Validate & Mark Ready</h2></div><ClipboardPlus size={22} /></div>
      <p className="health-subtitle">Review nurse-submitted records and mark them ready for doctor prediction.</p>
      {queue.length === 0 ? <p className="form-message">No nurse records pending validation.</p> : (
        <>
          <label className="clinical-field wide"><span>Nurse submissions queue</span><select value={selected} onChange={(e) => setSelected(e.target.value)}>
            {queue.map((v) => <option key={v.id} value={v.id}>{v.patient?.full_name ?? v.patient?.username ?? 'Patient'} · {new Date(v.created_at).toLocaleString()}</option>)}
          </select></label>
          <button className="btn-primary" type="button" onClick={() => void markReady()}>Mark Ready for Prediction</button>
        </>
      )}
      {message && <p className="form-message">{message}</p>}
    </section>
  );
}

export function LabWorkspace({ profile }: { profile: Profile }) {
  const [tab, setTab] = useState('overview');
  return (
    <PortalFrame
      role="Lab Technician"
      profile={profile}
      activeTab={tab}
      onTab={setTab}
      tabs={[
        { id: 'overview', label: 'Overview', icon: <BarChart3 size={17} /> },
        { id: 'validate', label: 'Validate', icon: <ClipboardPlus size={17} /> },
        { id: 'profile', label: 'Profile', icon: <UserRound size={17} /> },
      ]}
      rightRail={<RightRail profile={profile} items={[
        { title: 'Workflow', meta: 'Nurse → Lab → Doctor' },
        { title: 'Validation', meta: 'Mark records ready for prediction' },
        { title: 'Role', meta: 'Lab technician station' },
      ]} />}
    >
      {tab === 'overview' && <HeroPanel title="Validate incoming clinical data" subtitle="Review nurse submissions and release lab-validated records for doctor prediction." action="Open Validation" />}
      {tab === 'validate' && <LabValidationPanel />}
      {tab === 'profile' && <ProfilePanel profile={profile} />}
    </PortalFrame>
  );
}
export function NurseWorkspace({
  patients,
  profile,
  predictionCount,
}: {
  patients: Patient[];
  profile: Profile;
  predictionCount: number;
}) {
  const [tab, setTab] = useState("overview");
  const [message, setMessage] = useState("");

  async function registerPatient(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/patients/register", { method: "POST", body: JSON.stringify(payload) });
    const json = await res.json();
    setMessage(res.ok ? "Patient registered successfully." : json.error ?? "Failed to register patient.");
  }

  return (
    <PortalFrame
      role="Nurse"
      profile={profile}
      activeTab={tab}
      onTab={setTab}
      tabs={[
        { id: "overview", label: "Overview", icon: <BarChart3 size={17} /> },
        { id: "vitals", label: "Vitals", icon: <HeartPulse size={17} /> },
        { id: "register", label: "Register", icon: <UserRound size={17} /> },
        { id: "profile", label: "Profile", icon: <Settings size={17} /> },
      ]}
      rightRail={<RightRail profile={profile} items={[
        { title: "Registered patients", meta: `${patients.length} active records` },
        { title: "Prediction records", meta: `${predictionCount} saved assessments` },
        { title: "Care queue", meta: "Vitals capture pending" },
      ]} />}
    >
      {tab === "overview" && (
        <div className="workspace-stack">
          <HeroPanel title="Keep patient intake current" subtitle="Register patients, record clinical vitals, and support the care team with clean data." action="Open Queue" />
          <div className="stat-row">
            <StatCard icon={<UsersRound size={18} />} label="Patients" value={patients.length} />
            <StatCard icon={<ClipboardPlus size={18} />} label="Predictions" value={predictionCount} />
            <StatCard icon={<Activity size={18} />} label="Today" value="Ready" />
          </div>
          <div className="health-panel compact-list">
            <div className="panel-heading">
              <div>
                <p>Patient roster</p>
                <h2>Recent patients</h2>
              </div>
              <UsersRound size={22} />
            </div>
            {patients.length === 0 && (
              <div className="empty-state">
                <strong>No patients found</strong>
                <p>Registered patient profiles from Supabase will appear here.</p>
              </div>
            )}
            {patients.slice(0, 8).map((patient) => (
              <div key={patient.id} className="patient-row">
                <span>{(patient.full_name ?? patient.username).slice(0, 1).toUpperCase()}</span>
                <div>
                  <strong>{patient.full_name ?? patient.username}</strong>
                  <small>{patient.email ?? patient.username}</small>
                </div>
                <em>{patient.sex ?? "patient"}</em>
                <small>{patient.created_at ? new Date(patient.created_at).toLocaleDateString() : "No date"}</small>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "vitals" && <VitalsForm patients={patients} />}
      {tab === "register" && (
        <section className="health-panel">
          <div className="panel-heading">
            <div>
              <p>Intake</p>
              <h2>Register New Patient</h2>
            </div>
            <UserRound size={22} />
          </div>
          <form action={registerPatient} className="profile-grid">
            <label>
              Full name
              <input className="input" name="full_name" required />
            </label>
            <label>
              Username
              <input className="input" name="username" required />
            </label>
            <label>
              Email
              <input className="input" name="email" type="email" required />
            </label>
            <label>
              Password
              <input className="input" type="password" name="password" required />
            </label>
            <label>
              Sex
              <select className="input" name="sex" defaultValue="female">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              Address
              <input className="input" name="address" required />
            </label>
            <button className="btn-primary wide" type="submit">Create Patient Account</button>
          </form>
          {message && <p className="form-message">{message}</p>}
        </section>
      )}
      {tab === "profile" && <ProfilePanel profile={profile} />}
    </PortalFrame>
  );
}

export function PatientWorkspace({
  profile,
  predictions,
}: {
  profile: Profile;
  predictions: PredictionRow[];
}) {
  const [tab, setTab] = useState("overview");
  const latest = predictions[0];
  const positives = predictions.filter((r) => r.diagnosis === "CKD").length;
  const trend = useMemo(
    () => predictions.slice(0, 12).reverse().map((r) => ({
      date: new Date(r.created_at).toLocaleDateString(),
      risk: r.risk_score,
    })),
    [predictions],
  );

  return (
    <PortalFrame
      role="Patient"
      profile={profile}
      activeTab={tab}
      onTab={setTab}
      tabs={[
        { id: "overview", label: "Overview", icon: <BarChart3 size={17} /> },
        { id: "analytics", label: "Analytics", icon: <LineChart size={17} /> },
        { id: "profile", label: "Profile", icon: <UserRound size={17} /> },
      ]}
      rightRail={<RightRail profile={profile} items={[
        { title: "Latest diagnosis", meta: latest?.diagnosis ?? "No record yet" },
        { title: "Risk trend", meta: latest ? `${latest.risk_score}% latest risk` : "Waiting for assessment" },
        { title: "History", meta: `${predictions.length} assessments` },
      ]} />}
    >
      {tab === "overview" && (
        <div className="workspace-stack">
          <HeroPanel title="Your kidney health summary" subtitle="See your latest diagnosis, risk level, and care recommendations." action="View Report" />
          <div className="stat-row">
            <StatCard icon={<ClipboardPlus size={18} />} label="Assessments" value={predictions.length} />
            <StatCard icon={<ShieldPlus size={18} />} label="CKD Positive" value={positives} />
            <StatCard icon={<HeartPulse size={18} />} label="Latest Risk" value={latest ? `${latest.risk_score}%` : "N/A"} />
          </div>
          <section className="health-panel">
            <div className="panel-heading">
              <div>
                <p>Latest result</p>
                <h2>{latest ? latest.diagnosis : "No diagnosis yet"}</h2>
              </div>
              <Activity size={22} />
            </div>
            <p className="panel-copy">{latest?.recommendation ?? "Your care team has not submitted an assessment yet."}</p>
          </section>
        </div>
      )}
      {tab === "analytics" && (
        <div className="workspace-stack">
          <Trend rows={trend} />
        </div>
      )}
      {tab === "profile" && <ProfilePanel profile={profile} />}
    </PortalFrame>
  );
}
