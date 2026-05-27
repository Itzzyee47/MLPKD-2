export function MetricCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon?: string;
  trend?: string;
}) {
  return (
    <div className="stat-card animate-rise">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[--color-muted]">{label}</p>
          <p className="text-2xl font-bold text-[--color-primary] mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-[--color-accent] font-medium mt-1">{trend}</p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[--color-bg] text-xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
