function LeaderboardWidget() {
  const leaders = [
    { name: "Ananya", points: 120 },
    { name: "Rahul", points: 98 },
    { name: "Kiran", points: 90 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-5">Leaderboard</h2>

      <div className="space-y-4">
        {leaders.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center border rounded-xl p-3"
          >
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-slate-200"></div>

              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-slate-500">Top Contributor</p>
              </div>
            </div>

            <span className="font-bold">{item.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardWidget;
