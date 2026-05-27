import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-12">
      <section className="max-w-4xl mx-auto card">
        <h1 className="text-4xl font-bold text-[--color-primary]">MLPKD CKD Platform</h1>
        <p className="mt-3 text-[--color-muted]">Role-based CKD prediction, vitals, labs, and patient insights.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/signin" className="btn-primary">Sign In</Link>
          <Link href="/register" className="px-4 py-2 rounded-xl border">Register</Link>
        </div>
      </section>
    </main>
  );
}
