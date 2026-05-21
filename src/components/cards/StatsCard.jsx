function StatsCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-slate-500">{title}</h3>
      <p className="text-4xl font-bold mt-3">{value}</p>
    </div>
  );
}

export default StatsCard;
