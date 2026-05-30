import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Square } from "lucide-react"; // 종료 버튼용 최소한의 아이콘만 유지

export function Navigation() {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed] = useState(4.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
      setDistance((prev) => prev + 0.001);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans overflow-hidden border-x border-gray-100">
      
      {/* 상단 안내바 - 텍스트 강조 */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-12">
        <div className="bg-white border-4 border-black rounded-2xl p-5 shadow-lg">
          <p className="text-xs font-bold text-gray-400 mb-1">현재 안내 경로</p>
          <p className="font-black text-xl">중앙도서관 방향으로 직진</p>
          <div className="w-full bg-gray-100 h-2 mt-3 rounded-full overflow-hidden">
            <div className="bg-black h-full w-1/3" /> {/* 진행률 표시 느낌 */}
          </div>
        </div>
      </div>

      {/* 지도 영역 (아이콘 제거, 글자만 유지) */}
      <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center relative border-b-2 border-gray-100">
        <div className="flex flex-col items-center gap-2">
          
          <p className="text-gray-300 font-medium">(지도 화면 출력 예정 구역)</p>
        </div>
        
        {/* 현재 위치 표시 - 단순한 원으로 변경 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-black rounded-full border-4 border-white shadow-md" />
        </div>
      </div>

      {/* 하단 대시보드 - 더 담백하게 수정 */}
      <div className="bg-white px-6 pt-8 pb-12">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">속도</div>
            <div className="text-xl font-black">{speed} <span className="text-xs">km/h</span></div>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">거리</div>
            <div className="text-xl font-black">{distance.toFixed(2)} <span className="text-xs">km</span></div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">시간</div>
            <div className="text-xl font-black">
              {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* 산책 종료 버튼 - 일관성 있는 블랙 버튼 */}
        <button
          onClick={() => navigate("/summary")}
          className="w-full h-16 bg-black text-white rounded-2xl text-xl font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
        >
          산책 종료하기
        </button>
      </div>
    </div>
  );
}