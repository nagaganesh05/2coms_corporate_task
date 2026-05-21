function Directory() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Employee Directory</h1>

      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-slate-200"></div>

          <h2 className="text-xl font-bold mt-4">Rahul Sharma</h2>
          <p className="text-slate-500">Frontend Engineer</p>
          <p className="mt-2 text-sm">Engineering</p>
        </div>
      </div>
    </div>
  );
}

export default Directory;
