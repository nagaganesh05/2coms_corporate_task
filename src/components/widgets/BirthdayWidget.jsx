function BirthdayWidget() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-5">Birthdays</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between border rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-200"></div>
            <div>
              <h3 className="font-semibold">Rohit</h3>
              <p className="text-sm text-slate-500">Engineering</p>
            </div>
          </div>

          <span>🎂</span>
        </div>
      </div>
    </div>
  );
}

export default BirthdayWidget;
