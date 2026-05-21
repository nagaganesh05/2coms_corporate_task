function PollWidget() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold">Quick Poll</h2>

      <p className="mt-3 text-slate-600">
        Which initiative should be prioritized next quarter?
      </p>

      <div className="mt-5 space-y-3">
        <button className="w-full border rounded-xl p-3 text-left hover:bg-slate-50">
          AI Transformation
        </button>

        <button className="w-full border rounded-xl p-3 text-left hover:bg-slate-50">
          Employee Wellness
        </button>

        <button className="w-full border rounded-xl p-3 text-left hover:bg-slate-50">
          Hybrid Work Expansion
        </button>
      </div>
    </div>
  );
}

export default PollWidget;
