import { useNavigate } from "react-router";
import { User, ChevronRight, LogOut, Heart } from "lucide-react";
import { useState, useEffect } from "react"; 

export function MyPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("사용자"); 
  const [prefTitle, setPrefTitle] = useState("설정된 취향 없음");

  // 경로 탐색 취향 설정 데이터 획득 및 파싱 로직
  useEffect(() => {
    // 1. 카카오 계정 연동 정보 획득
    const localData = localStorage.getItem("user");
    if (localData) {
      const user = JSON.parse(localData);
      if (user.nickname) {
        setNickname(user.nickname); 
      }
    }

    // 2. Boolean 객체 형태의 취향 데이터를 텍스트로 변환
    const savedPref = localStorage.getItem("userPreferences");
    if (savedPref) {
      const prefs = JSON.parse(savedPref);
      const activePrefs = [];
      
      if (prefs.slope) activePrefs.push("경사로 회피");
      if (prefs.wheeled) activePrefs.push("바퀴 기구");
      if (prefs.walking) activePrefs.push("걷기 선호");
      if (prefs.running) activePrefs.push("러닝 선호");
      
      // 선택된 항목이 있을 경우 쉼표로 연결, 없을 경우 기본값 출력
      setPrefTitle(activePrefs.length > 0 ? activePrefs.join(", ") : "설정된 취향 없음");
    }
  }, []);

  const menuItems = [
    { 
      id: "pref", 
      label: "산책 취향 설정", 
      icon: <Heart className="w-5 h-5" />, 
      path: "/preferences",
      value: prefTitle // 현재 설정된 취향 데이터 바인딩
    }
  ];

  // 세션 종료(로그아웃) 핸들러
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // 세션 종료 후 로그인 뷰로 리다이렉트
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100 relative">
      <div className="px-6 flex flex-col h-full overflow-y-auto pb-24">
        
        {/* 헤더 타이틀 영역 */}
        <h1 className="pt-16 pb-8 text-3xl font-black italic tracking-tighter">My Page</h1>

        {/* 사용자 식별 정보 및 세션 제어 컴포넌트 */}
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

        {/* 시스템 설정 및 환경변수 제어 리스트 */}
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
                {/* 설정값 시각화 컨테이너 */}
                {item.value && (
                  <span className="text-sm font-bold text-blue-500">{item.value}</span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 글로벌 내비게이션 바 (GNB) */}
      <div className="absolute bottom-0 w-full h-24 bg-white border-t border-gray-50 flex items-center justify-around pb-6 px-6 z-50">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-1 text-gray-300 hover:text-black transition-colors">
          <User className="w-6 h-6 rotate-180" /> 
          <span className="text-[10px] font-bold">홈</span>
        </button>
        <button onClick={() => navigate("/history")} className="flex flex-col items-center gap-1 text-gray-300 hover:text-black transition-colors">
          <Heart className="w-6 h-6" />
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