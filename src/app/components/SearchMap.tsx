import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Square, Plus, Locate } from "lucide-react";

declare global {
  interface Window {
    kakao: any;
  }
}

export function SearchMap() {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
      setDistance((prev) => prev + 0.0012);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation API가 지원되지 않는 환경입니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            if (!mapContainerRef.current) return;

            const currentPosition = new window.kakao.maps.LatLng(lat, lng);
            const options = {
              center: currentPosition,
              level: 3,
            };

            const map = new window.kakao.maps.Map(mapContainerRef.current, options);
            mapRef.current = map;

            const marker = new window.kakao.maps.Marker({
              position: currentPosition,
              map: map,
            });
            userMarkerRef.current = marker;
          });
        }
      },
      (error) => console.error("위치 정보 호출 실패:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  const handlePanToMyLocation = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const currentPosition = new window.kakao.maps.LatLng(lat, lng);

        mapRef.current.panTo(currentPosition);
        if (userMarkerRef.current) {
          userMarkerRef.current.setPosition(currentPosition);
        }
      },
      null,
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans overflow-hidden border-x border-gray-100 relative">
      
      {/* 맵 컨테이너 영역: 상단 뱃지 제거 및 전체 영역 활용 */}
      <div className="flex-1 bg-gray-50 relative z-0">
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} className="absolute inset-0" />

        {/* 현재 위치 이동 버튼 */}
        <button 
          onClick={handlePanToMyLocation}
          className="absolute bottom-28 right-6 w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform z-30"
          title="현재 위치로 이동"
        >
          <Locate className="w-6 h-6 text-black" />
        </button>

        {/* 신고 기능 이동 버튼 */}
        <button 
          onClick={() => navigate("/report")}
          className="absolute bottom-10 right-6 w-14 h-14 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform z-30"
        >
          <Plus className="w-8 h-8 text-black" />
        </button>
      </div>

      {/* 하단 상태 대시보드 영역 */}
      <div className="bg-white px-8 pt-10 pb-12 z-20 rounded-t-[40px] border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] relative">
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

        {/* 종료 이벤트 버튼 */}
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