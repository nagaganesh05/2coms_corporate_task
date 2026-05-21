function NotificationBell() {
  return (
    <button className="relative">
      🔔
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        3
      </span>
    </button>
  );
}

export default NotificationBell;
