import { Home, Bell, Trophy, Users, Settings } from "lucide-react";

function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-around md:hidden z-50">
      <button>
        <Home />
      </button>
      <button>
        <Bell />
      </button>
      <button>
        <Trophy />
      </button>
      <button>
        <Users />
      </button>
      <button>
        <Settings />
      </button>
    </div>
  );
}

export default MobileBottomNav;
