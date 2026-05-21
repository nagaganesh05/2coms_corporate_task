function Profile() {
  return (
    <div>
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-slate-200"></div>

          <div>
            <h1 className="text-4xl font-bold">Rahul Sharma</h1>
            <p className="text-slate-500 mt-2">Frontend Engineer</p>
            <p className="mt-2">Engineering Department</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold">About</h2>
          <p className="mt-3 text-slate-600">
            Passionate frontend engineer working on enterprise applications.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
