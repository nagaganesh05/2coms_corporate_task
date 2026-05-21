function Teams() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Teams & Departments</h1>

      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Engineering</h2>
          <p className="mt-3 text-slate-500">145 Members</p>
          <button className="mt-5 bg-primary text-white px-4 py-2 rounded-lg">
            Explore Team
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Human Resources</h2>
          <p className="mt-3 text-slate-500">42 Members</p>
          <button className="mt-5 bg-primary text-white px-4 py-2 rounded-lg">
            Explore Team
          </button>
        </div>
      </div>
    </div>
  );
}

export default Teams;
