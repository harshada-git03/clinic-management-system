export default function StatCard({ label, value }) {
  return (
    <div className="bg-sand rounded-lg px-4.5 py-4">
      <div className="text-xs text-muted mb-1.5">{label}</div>
      <div className="text-2xl font-medium">{value}</div>
    </div>
  );
}