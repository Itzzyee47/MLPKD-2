export function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm p-4">
      <p className="text-sm text-[--color-muted]">{label}</p>
      <p className="text-2xl font-semibold text-[--color-primary]">{value}</p>
    </div>
  );
}
