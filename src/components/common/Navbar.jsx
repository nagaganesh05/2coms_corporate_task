function Navbar() {
  return (
    <div className="bg-white border-b p-5 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Welcome Back 👋</h2>
      </div>

      <div className="flex gap-4 items-center">
        <input
          className="border rounded-xl px-4 py-2 w-72"
          placeholder="Search employees, posts, documents"
        />

        <div className="w-10 h-10 rounded-full bg-slate-300"></div>
      </div>
    </div>
  );
}

export default Navbar;
