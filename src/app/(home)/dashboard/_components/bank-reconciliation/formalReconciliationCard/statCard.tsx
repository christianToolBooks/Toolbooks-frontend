export function StatCard({
  icon,
  label,
  value,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
}>) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-chart-1/20">
      <div className="flex items-center gap-2 mb-2 h-6">
        {icon}
        <p className="text-xs font-medium text-gray-600">{label}</p>
      </div>
      <p className="text-2xl font-bold text-chart-1">{value}</p>
    </div>
  );
}
