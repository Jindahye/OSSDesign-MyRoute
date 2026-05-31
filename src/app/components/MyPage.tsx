import { useNavigate } from "react-router";
import { User, Settings, Bell, ChevronRight, LogOut, Heart } from "lucide-react";
import { useState, useEffect } from "react"; 

export function MyPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("사용자"); 

  // 컴포넌트가 마운트될 때 로컬스토리지에서 사용자 정보 가져오기
  useEffect(() => {
    const localData = localStorage.getItem("user");
    if (localData) {
      const user = JSON.parse(localData);
      if (user.nickname) {
        setNickname(user.nickname); // 닉네임이 존재하면 상태 업데이트
      }
    }
  }, []);

  const menuItems = [
    { 
      id: "pref", 
      label: "산책 취향 수정", 
      icon: <Heart className="w-5 h-5" />, 
      path: "/preferences" 
    },
    { 
      id: "noti", 
      label: "알림 설정", 
      icon: <Bell className="w-5 h-5" />, 
      path: "/mypage" 
    },
    { 
      id: "settings", 
      label: "서비스 설정", 
      icon: <Settings className="w-5 h-5" />, 
      path: "/mypage" 
    },
  ];

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="px-6 flex flex-col h-full">
        
        {/* 타이틀 */}
        <h1 className="pt-16 pb-8 text-3xl font-black italic tracking-tighter">My Page</h1>

        {/* 프로필 & 로그아웃 영역 */}
        <div className="bg-gray-50 rounded-[32px] p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
              <User className="text-white w-8 h-8" />
            </div>
            <div>
              <p className="text-xl font-black">{nickname}님</p>
              <p className="text-xs font-bold text-gray-400">일반 사용자</p>
            </div>
          </div>
          
          {/* 로그아웃 버튼 */}
          <button 
            onClick={() => {
              localStorage.removeItem("user"); // 로그아웃 시 로컬스토리지에서 유저 정보 삭제
            }}
            className="flex items-center gap-1 px-3 py-2 bg-white border-2 border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 hover:border-black hover:text-black transition-all"
          >
            <LogOut className="w-3 h-3" />
            LOGOUT
          </button>
        </div>

        {/* 메뉴 리스트 */}
        <div className="flex-1 space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-4">Account Settings</p>
          
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between p-5 bg-white border-2 border-gray-50 rounded-2xl hover:border-black transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="text-gray-400 group-hover:text-black transition-colors">
                  {item.icon}
                </div>
                <span className="font-bold text-lg">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black" />
            </button>
          ))}
        </div>

        {/* 하단 탭바 */}
        <div className="h-24 bg-white border-t border-gray-50 flex items-center justify-around pb-6 -mx-6 px-6">
          <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-1 text-gray-300">
            <User className="w-6 h-6 rotate-180" /> 
            <span className="text-[10px] font-bold">홈</span>
          </button>
          <button onClick={() => navigate("/history")} className="flex flex-col items-center gap-1 text-gray-300">
            <Heart className="w-6 h-6" />
            <span className="text-[10px] font-bold">기록</span>
          </button>
          <button onClick={() => navigate("/mypage")} className="flex flex-col items-center gap-1 text-black">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">마이</span>
          </button>
        </div>
      </div>
    </div>
  );
}
