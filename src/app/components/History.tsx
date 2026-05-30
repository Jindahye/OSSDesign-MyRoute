import { useNavigate } from "react-router";
import { Search, History as HistoryIcon, User, Calendar, ChevronRight } from "lucide-react";

export function History() {
  const navigate = useNavigate();

  // 샘플 데이터
  const logs = [
    { date: "2026.05.07", dist: "2.35km", time: "45분", status: "안전" },
    { date: "2026.05.05", dist: "1.52km", time: "20분", status: "주의" },
    { date: "2026.05.03", dist: "4.81km", time: "65분", status: "안전" },
    { date: "2026.05.01", dist: "0.92km", time: "12분", status: "안전" },
  ];

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="px-6 flex flex-col h-full">
        
        {/* 타이틀 */}
        <h1 className="pt-16 pb-8 text-3xl font-black italic tracking-tighter">History</h1>

        {/* 기록 리스트 영역 */}
        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Recent Walks</p>
          
          {logs.map((log, i) => (
            <div 
              key={i} 
              className="p-6 bg-gray-50 rounded-[32px] border-2 border-gray-50 flex justify-between items-center group hover:border-black transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="font-black text-lg">{log.date}</p>
                  <p className="text-xs font-bold text-gray-400">{log.status} 경로 이용</p>
                </div>
              </div>
              
              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="font-black text-xl">{log.dist}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{log.time}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </div>
          ))}
        </div>

        {/* 하단 탭바 - 이제 여기서 홈이나 마이페이지로 이동 가능! */}
        <div className="h-24 bg-white border-t border-gray-50 flex items-center justify-around pb-6 -mx-6 px-6">
          {/* 홈 버튼 */}
          <button 
            onClick={() => navigate("/home")} 
            className="flex flex-col items-center gap-1 text-gray-300 hover:text-black transition-colors"
          >
            <Search className="w-6 h-6" />
            <span className="text-[10px] font-bold">홈</span>
          </button>

          {/* 기록 버튼 (현재 위치: Black 강조) */}
          <button 
            onClick={() => navigate("/history")} 
            className="flex flex-col items-center gap-1 text-black"
          >
            <HistoryIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold">기록</span>
          </button>

          {/* 마이페이지 버튼 */}
          <button 
            onClick={() => navigate("/mypage")} 
            className="flex flex-col items-center gap-1 text-gray-300 hover:text-black transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">마이</span>
          </button>
        </div>
      </div>
    </div>
  );
}