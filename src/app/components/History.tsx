import { useNavigate } from "react-router";
import { Search, History as HistoryIcon, User, Calendar, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getKakaoId } from "../utils/auth";

interface WalkRecord {
  id?: number;
  date: string;
  distance: number;
  time: number;
  path?: { lat: number; lng: number }[];
  walkType?: string;
}

export function History() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<WalkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      const kakaoId = getKakaoId();

      if (kakaoId) {
        try {
          const res = await fetch(`/api/routes/history?kakaoId=${kakaoId}`);
          const data = await res.json();

          if (res.ok && data.logs?.length > 0) {
            setLogs(data.logs);
            setLoading(false);
            return;
          }
        } catch {
          setError("서버에서 기록을 불러오지 못했습니다.");
        }
      }

      const savedHistory = localStorage.getItem("walkHistory");
      if (savedHistory) {
        try {
          const parsed: WalkRecord[] = JSON.parse(savedHistory);
          setLogs([...parsed].reverse());
        } catch {
          setError("저장된 기록을 읽을 수 없습니다.");
        }
      }

      setLoading(false);
    };

    loadHistory();
  }, []);

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="px-6 flex flex-col h-full relative">
        <h1 className="pt-16 pb-8 text-3xl font-black italic tracking-tighter">History</h1>

        <div className="flex-1 space-y-4 overflow-y-auto pb-28">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Recent Walks</p>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <p className="font-bold">기록을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-40 text-red-400">
              <p className="font-bold">{error}</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-center px-4">
              <p className="font-bold">아직 산책 기록이 없습니다.</p>
              <p className="text-sm mt-2">첫 산책을 시작해 보세요!</p>
            </div>
          ) : (
            logs.map((log, i) => {
              const distanceStr = log.distance ? log.distance.toFixed(2) : "0.00";
              const minutes = log.time ? Math.floor(log.time / 60) : 0;
              const seconds = log.time ? log.time % 60 : 0;
              const timeStr = minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;
              const dateLabel = log.date ? String(log.date).split(" ")[0] : "기록";

              return (
                <div
                  key={log.id ?? i}
                  onClick={() => navigate("/summary", { state: { ...log, isViewMode: true } })}
                  className="p-6 bg-gray-50 rounded-[32px] border-2 border-gray-50 flex justify-between items-center group hover:border-black transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Calendar className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-black text-lg">{dateLabel}</p>
                      <p className="text-xs font-bold text-gray-400">
                        {log.walkType === 'free' ? '자유 산책' : '추천 경로 산책'}
                      </p>
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

        <div className="absolute bottom-0 left-0 w-full h-24 bg-white border-t border-gray-50 flex items-center justify-around pb-6 px-6">
          <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-1 text-gray-300 hover:text-black transition-colors">
            <Search className="w-6 h-6" />
            <span className="text-[10px] font-bold">홈</span>
          </button>
          <button onClick={() => navigate("/history")} className="flex flex-col items-center gap-1 text-black">
            <HistoryIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold">기록</span>
          </button>
          <button onClick={() => navigate("/mypage")} className="flex flex-col items-center gap-1 text-gray-300 hover:text-black transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">마이</span>
          </button>
        </div>
      </div>
    </div>
  );
}
