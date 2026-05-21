function Analytics() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Organization Analytics</h1>

      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold">Most Active Department</h2>
          <p className="mt-3">Engineering</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold">Top Contributor</h2>
          <p className="mt-3">Ananya</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold">Monthly Reach</h2>
          <p className="mt-3">82%</p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
