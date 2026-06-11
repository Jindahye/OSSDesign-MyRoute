import { useNavigate } from "react-router";
import { User, ChevronRight, LogOut, Heart, Search, History as HistoryIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { clearSession, syncPreferencesFromUser } from "../utils/auth";

export function MyPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("사용자");
  const [prefTitle, setPrefTitle] = useState("설정된 취향 없음");

  useEffect(() => {
    const localData = localStorage.getItem("user");
    if (localData) {
      const user = JSON.parse(localData);
      if (user.nickname) {
        setNickname(user.nickname);
      }
      syncPreferencesFromUser(user);
    }

    const savedPref = localStorage.getItem("userPreferences");
    if (savedPref) {
      const prefs = JSON.parse(savedPref);
      const activePrefs: string[] = [];

      if (prefs.slope) activePrefs.push("경사로 회피");
      if (prefs.wheeled) activePrefs.push("바퀴 기구");
      if (prefs.walking) activePrefs.push("걷기 선호");
      if (prefs.running) activePrefs.push("러닝 선호");

      setPrefTitle(activePrefs.length > 0 ? activePrefs.join(", ") : "설정된 취향 없음");
    }
  }, []);

  const menuItems = [
    {
      id: "pref",
      label: "산책 취향 설정",
      icon: <Heart className="w-5 h-5" />,
      path: "/preferences",
      value: prefTitle,
    },
  ];

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100 relative">
      <div className="px-6 flex flex-col h-full overflow-y-auto pb-24">
        <h1 className="pt-16 pb-8 text-3xl font-black italic tracking-tighter">My Page</h1>

        <div className="bg-gray-50 rounded-[32px] p-6 mb-8 flex items-center justify-between border-2 border-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
              <User className="text-white w-8 h-8" />
            </div>
            <div>
              <p className="text-xl font-black">{nickname}님</p>
              <p className="text-xs font-bold text-gray-400">카카오 계정 연동됨</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-2 bg-white border-2 border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 hover:border-black hover:text-black transition-all active:scale-95"
          >
            <LogOut className="w-3 h-3" />
            LOGOUT
          </button>
        </div>

        <div className="flex-1 space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-4">Account Settings</p>

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between p-5 bg-white border-2 border-gray-50 rounded-2xl hover:border-black transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="text-gray-400 group-hover:text-black transition-colors">
                  {item.icon}
                </div>
                <span className="font-bold text-lg">{item.label}</span>
              </div>

              <div className="flex items-center gap-2">
                {item.value && (
                  <span className="text-sm font-bold text-blue-500">{item.value}</span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-24 bg-white border-t border-gray-50 flex items-center justify-around pb-6 px-6 z-50">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-1 text-gray-300 hover:text-black transition-colors">
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold">홈</span>
        </button>
        <button onClick={() => navigate("/history")} className="flex flex-col items-center gap-1 text-gray-300 hover:text-black transition-colors">
          <HistoryIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold">기록</span>
        </button>
        <button onClick={() => navigate("/mypage")} className="flex flex-col items-center gap-1 text-black">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold">마이</span>
        </button>
      </div>
    </div>
  );
}
