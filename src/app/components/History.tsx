import { useNavigate } from "react-router";
import { Search, History as HistoryIcon, User, Calendar, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

// 산책 기록 데이터 인터페이스 정의
interface WalkRecord {
  date: string;
  distance: number;
  time: number;
  path?: any[]; 
}

export function History() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<WalkRecord[]>([]);

  // 로컬 스토리지에서 실제 산책 기록 데이터 로드 및 정렬
  useEffect(() => {
    const savedHistory = localStorage.getItem("walkHistory");
    if (savedHistory) {
      const parsedData: WalkRecord[] = JSON.parse(savedHistory);
      // 최신 기록이 상단에 노출되도록 배열 역순 정렬
      setLogs(parsedData.reverse());
    }
  }, []);

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="px-6 flex flex-col h-full relative">
        
        {/* 헤더 타이틀 영역 */}
        <h1 className="pt-16 pb-8 text-3xl font-black italic tracking-tighter">History</h1>

        {/* 기록 리스트 렌더링 영역 */}
        <div className="flex-1 space-y-4 overflow-y-auto pb-28">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Recent Walks</p>
          
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <p className="font-bold">아직 완료된 산책 기록이 없습니다.</p>
            </div>
          ) : (
            logs.map((log, i) => {
              // 데이터 포맷팅
              const distanceStr = log.distance ? log.distance.toFixed(2) : "0.00";
              const minutes = log.time ? Math.floor(log.time / 60) : 0;
              const seconds = log.time ? log.time % 60 : 0;
              const timeStr = minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;

              return (
                <div 
                  key={i} 
                  // 클릭 시 Summary 컴포넌트로 데이터 전달 및 열람 모드로 라우팅
                  onClick={() => navigate("/summary", { state: { ...log, isViewMode: true } })}
                  className="p-6 bg-gray-50 rounded-[32px] border-2 border-gray-50 flex justify-between items-center group hover:border-black transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Calendar className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-black text-lg">{log.date.split(" ")[0]}</p>
                      <p className="text-xs font-bold text-gray-400">MyRoute 산책</p>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-black text-xl">{distanceStr}km</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{timeStr}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 글로벌 내비게이션 바 (GNB) */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-white border-t border-gray-50 flex items-center justify-around pb-6 px-6">
          <button 
            onClick={() => navigate("/home")} 
            className="flex flex-col items-center gap-1 text-gray-300 hover:text-black transition-colors"
          >
            <Search className="w-6 h-6" />
            <span className="text-[10px] font-bold">홈</span>
          </button>

          <button 
            onClick={() => navigate("/history")} 
            className="flex flex-col items-center gap-1 text-black"
          >
            <HistoryIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold">기록</span>
          </button>

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