function Notifications() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold">New Recognition Received</h2>
          <p className="text-slate-500 mt-2">
            Ananya appreciated your support.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold">Leadership Meeting Scheduled</h2>
          <p className="text-slate-500 mt-2">May 28, 2026 at 10:00 AM.</p>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
