import { useNavigate } from "react-router";
import { Search, Map, Route, History, User } from "lucide-react";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="px-6 flex flex-col h-full">
        {/* 상단 헤더 영역 */}
        <div className="pt-12 pb-4 flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter">MyRoute</h1>
          <div 
            onClick={() => navigate("/mypage")} 
            className="w-10 h-10 bg-black rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            <User className="text-white w-5 h-5" />
          </div>
        </div>

        {/* 목적지 검색 진입 영역: /search-place로 연결 */}
        <div onClick={() => navigate("/search-place")} className="py-4 cursor-pointer">
          <div className="w-full h-14 bg-gray-50 border-2 border-gray-50 transition-colors rounded-2xl px-5 flex items-center gap-3 shadow-sm pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-400">목적지를 검색하세요.</span>
          </div>
        </div>

        {/* 기능 선택 영역 */}
        <div className="flex-1 flex flex-col gap-5 py-6">
          <button
            onClick={() => navigate("/search-place")}
            className="flex-[1.5] bg-black text-white rounded-[32px] p-8 flex flex-col justify-between items-start transition-transform active:scale-[0.98]"
          >
            <Route className="w-10 h-10" />
            <div className="text-left">
              <h2 className="text-2xl font-bold">추천 경로 찾기</h2>
              <p className="text-gray-400 text-sm mt-1">취향에 맞는 안전한 길 안내</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/search")}
            className="flex-1 bg-gray-50 border-2 border-gray-50 rounded-[32px] p-8 flex flex-col justify-between items-start transition-transform active:scale-[0.98]"
          >
            <Map className="w-10 h-10 text-black" />
            <div className="text-left">
              <h2 className="text-xl font-bold text-black">자유 산책 시작</h2>
              <p className="text-gray-500 text-sm mt-1">목적지 없이 가볍게 걷기</p>
            </div>
          </button>
        </div>

        {/* 하단 탭바 */}
        <div className="h-24 bg-white border-t border-gray-50 flex items-center justify-around pb-6">
          <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-1">
            <Search className="w-6 h-6 text-black" />
            <span className="text-[10px] font-bold text-black">홈</span>
          </button>
          <button onClick={() => navigate("/history")} className="flex flex-col items-center gap-1 text-gray-300 hover:text-black">
            <History className="w-6 h-6" />
            <span className="text-[10px] font-bold">기록</span>
          </button>
          <button onClick={() => navigate("/mypage")} className="flex flex-col items-center gap-1 text-gray-300 hover:text-black">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">마이</span>
          </button>
        </div>
      </div>
    </div>
  );
}