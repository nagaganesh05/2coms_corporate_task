function Events() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Events & Celebrations</h1>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-xl">Annual Tech Fest</h2>
          <p className="mt-3">May 28, 2026</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-xl">Wellness Week</h2>
          <p className="mt-3">June 10, 2026</p>
        </div>
      </div>
    </div>
  );
}

export default Events;
