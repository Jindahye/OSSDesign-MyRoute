import { useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Square } from "lucide-react"; 

declare global {
  interface Window {
    kakao: any;
  }
}

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const destinationName = location.state?.destination || "목적지";

  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed] = useState(4.5);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
      setDistance((prev) => prev + 0.001);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        if (!mapContainerRef.current) return;

        const centerPosition = new window.kakao.maps.LatLng(35.8906, 128.8525);
        const options = {
          center: centerPosition,
          level: 3,
        };

        mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, options);
      });
    }
  }, []);

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans overflow-hidden border-x border-gray-100 relative">
      
      {/* 상단 안내바 */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 pt-12 pointer-events-none">
        <div className="bg-white border-4 border-black rounded-2xl p-5 shadow-lg pointer-events-auto">
          <p className="text-xs font-bold text-gray-400 mb-1">현재 안내 경로</p>
          <p className="font-black text-xl">{destinationName} 방향으로 이동 중</p>
          <div className="w-full bg-gray-100 h-2 mt-3 rounded-full overflow-hidden">
            <div className="bg-black h-full w-1/3 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 bg-gray-50 relative border-b-2 border-gray-100 z-0">
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} className="absolute inset-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="w-6 h-6 bg-black rounded-full border-4 border-white shadow-md animate-bounce" />
        </div>
      </div>

      {/* 하단 대시보드 */}
      <div className="bg-white px-6 pt-8 pb-12 z-20 relative">
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