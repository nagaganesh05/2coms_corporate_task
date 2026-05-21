function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">HR/Admin Command Center</h1>

      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2>Total Posts</h2>
          <p className="text-4xl font-bold mt-3">2451</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2>Pending Approvals</h2>
          <p className="text-4xl font-bold mt-3">23</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2>Flagged Content</h2>
          <p className="text-4xl font-bold mt-3">5</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2>Engagement Rate</h2>
          <p className="text-4xl font-bold mt-3">91%</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
