import { useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";
import { MapPin, ArrowRight, Navigation } from "lucide-react";

declare global { interface Window { kakao: any; } }

export function RouteSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [destCoords, setDestCoords] = useState<{lat: number, lng: number} | null>(null);

  // 이전 컴포넌트에서 전달된 목적지 식별자 수신
  const destinationName = location.state?.destination || "목적지 미설정";

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      const container = mapContainerRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(35.8906, 128.8525),
        level: 3
      };
      const map = new window.kakao.maps.Map(container, options);
      mapRef.current = map;

      // 목적지 키워드 기반 Geocoding 수행
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(destinationName, (data: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const firstResult = data[0];
          const pos = new window.kakao.maps.LatLng(firstResult.y, firstResult.x);
          
          setDestCoords({ lat: parseFloat(firstResult.y), lng: parseFloat(firstResult.x) });

          // 검색 좌표 기준 마커 인스턴스 렌더링
          new window.kakao.maps.Marker({
            position: pos,
            map: map,
          });

          // 지도 중심 좌표를 검색된 좌표로 이동
          map.panTo(pos);
        }
      });
    });
  }, [destinationName]);

  const handleStartWalk = () => {
    if (!destCoords) {
      alert("목적지 좌표를 불러오는 중입니다. 잠시만 기다려주세요.");
      return;
    }
    // Navigation 컴포넌트로 목적지 명칭 및 위경도 데이터 전달
    navigate("/navigation", { 
      state: { 
        destination: destinationName,
        destCoords: destCoords 
      } 
    });
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100 relative">
      <div className="flex-1 flex flex-col">
        <div ref={mapContainerRef} className="w-full h-[400px] bg-gray-100" />

        <div className="px-6 py-8 flex-1 bg-white rounded-t-[40px] -mt-10 relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Navigation className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Recommended Route</span>
          </div>
          
          <h1 className="text-3xl font-black mb-6">{destinationName}</h1>

          <div className="space-y-4">
            <div className="p-6 bg-black text-white rounded-[32px] flex justify-between items-center shadow-xl">
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-1">Safety First</p>
                <h2 className="text-xl font-bold">가장 안전한 경로</h2>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#deff9a]">15분</p>
                <p className="text-[10px] text-gray-400">1.2km</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleStartWalk}
          className="w-[345px] mx-auto h-18 bg-black text-white rounded-2xl text-xl font-black mb-12 flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          산책 시작하기 <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}