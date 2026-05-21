function CalendarWidget() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-5">Upcoming Events</h2>

      <div className="space-y-4">
        <div className="border rounded-xl p-4">
          <h3 className="font-semibold">Leadership Meet</h3>
          <p className="text-sm text-slate-500 mt-1">May 28, 2026</p>
        </div>

        <div className="border rounded-xl p-4">
          <h3 className="font-semibold">Hackathon</h3>
          <p className="text-sm text-slate-500 mt-1">June 2, 2026</p>
        </div>
      </div>
    </div>
  );
}

export default CalendarWidget;
