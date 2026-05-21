function Settings() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold">Dark Mode</h2>
            <p className="text-sm text-slate-500">Enable dark theme</p>
          </div>

          <button className="bg-primary text-white px-4 py-2 rounded-lg">
            Toggle
          </button>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold">Notifications</h2>
            <p className="text-sm text-slate-500">Manage alerts</p>
          </div>

          <button className="bg-primary text-white px-4 py-2 rounded-lg">
            Configure
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
