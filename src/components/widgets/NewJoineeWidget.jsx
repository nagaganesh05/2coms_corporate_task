function NewJoineeWidget() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-5">New Joinees</h2>

      <div className="grid grid-cols-4 gap-5">
        <div className="border rounded-xl p-4 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-200 mx-auto"></div>

          <h3 className="font-semibold mt-3">Priya</h3>
          <p className="text-sm text-slate-500">UI Designer</p>
        </div>

        <div className="border rounded-xl p-4 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-200 mx-auto"></div>

          <h3 className="font-semibold mt-3">Arjun</h3>
          <p className="text-sm text-slate-500">Backend Engineer</p>
        </div>
      </div>
    </div>
  );
}

export default NewJoineeWidget;
