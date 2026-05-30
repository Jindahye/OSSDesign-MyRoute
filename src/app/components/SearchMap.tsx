import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Search, Square, Plus } from "lucide-react";

export function SearchMap() {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);

  // 실시간 시간/거리 측정 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
      setDistance((prev) => prev + 0.0012);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans overflow-hidden border-x border-gray-100 relative">
      
      {/* 상단 검색바 */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 pt-14">
        <div className="w-full h-14 bg-white border-2 border-black rounded-2xl px-5 flex items-center gap-3 shadow-lg">
          <Search className="w-5 h-5 text-black" />
          <input 
            type="text" 
            placeholder="주변 장소 검색" 
            className="flex-1 bg-transparent outline-none font-bold text-black placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center relative">
        <div className="flex flex-col items-center gap-2 select-none">
          <h2 className="text-4xl font-black text-gray-200 tracking-tighter opacity-50 uppercase">
            Free Walking
          </h2>
          <p className="text-gray-300 font-bold text-sm">(지도 표시 영역)</p>
        </div>

        {/* 현재 위치 마커 */}
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-5 h-5 bg-black rounded-full border-4 border-white shadow-md" />
        </div>

        {/* 이슈 리포트 (+) 버튼 - 위치 고정 */}
        <button 
          onClick={() => navigate("/report")}
          className="absolute bottom-10 right-6 w-14 h-14 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform z-30"
        >
          <Plus className="w-8 h-8 text-black" />
        </button>
      </div>

      {/* 하단 대시보드 */}
      <div className="bg-white px-8 pt-10 pb-12 z-20 rounded-t-[40px] border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center mb-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Distance</span>
            <div className="text-3xl font-black">{distance.toFixed(2)} <span className="text-sm font-bold text-gray-400">km</span></div>
          </div>
          <div className="w-[1px] h-10 bg-gray-100" />
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Time</span>
            <div className="text-3xl font-black">
              {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/summary")}
          className="w-full h-18 py-5 bg-black text-white rounded-2xl text-xl font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
        >
          <Square className="w-4 h-4 fill-white" />
          산책 종료
        </button>
      </div>
    </div>
  );
}
