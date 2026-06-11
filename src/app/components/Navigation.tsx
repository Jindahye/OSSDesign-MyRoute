import { useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Square, MapPin, Info } from "lucide-react";
import { calcPathDistance, toLatLngPoint } from "../utils/geo";

export function Navigation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);

  const [path, setPath] = useState<any[]>([]);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gpsWeak, setGpsWeak] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  // Time Interval 설정 (Side Effect Management)
  useEffect(() => {
    const timer = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(timer); // Memory Leak 방지
  }, []);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      // Default Coordinate 할당 로직
      const defaultCenter = state?.destCoords 
        ? new window.kakao.maps.LatLng(state.destCoords.lat, state.destCoords.lng)
        : new window.kakao.maps.LatLng(35.8906, 128.8525);

      // Map Instance 초기화
      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center: defaultCenter,
        level: 4,
      });
      mapRef.current = map;

      // Polyline (벡터 그래픽) 인스턴스 생성 및 옵션 적용
      const polyline = new window.kakao.maps.Polyline({
        path: [],
        strokeWeight: 6,
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeStyle: 'solid',
      });
      polyline.setMap(map);
      polylineRef.current = polyline;

      // Marker Instance (Client Position)
      const marker = new window.kakao.maps.Marker({ position: map.getCenter(), map });
      userMarkerRef.current = marker;

      // Destination Marker Rendering 및 Bounding Box 최적화
      if (state?.destCoords) {
        const destPos = new window.kakao.maps.LatLng(state.destCoords.lat, state.destCoords.lng);
        destMarkerRef.current = new window.kakao.maps.Marker({
          position: destPos,
          map,
        });

        // 출발지와 목적지를 모두 포괄하도록 Viewport 자동 스케일링 (Bounds Extend)
        const bounds = new window.kakao.maps.LatLngBounds();
        bounds.extend(map.getCenter());
        bounds.extend(destPos);
        map.setBounds(bounds);
      }

      // Event Listener: Fallback Mechanism (GPS 음영 지역 시 수동 좌표 매핑)
      window.kakao.maps.event.addListener(map, 'click', function(mouseEvent: any) {
        const clickedPos = mouseEvent.latLng;
        
        marker.setPosition(clickedPos);
        
        if (state?.destCoords) {
          const destPos = new window.kakao.maps.LatLng(state.destCoords.lat, state.destCoords.lng);
          const mockPath = [clickedPos, destPos]; // 가상 노드 기반 경로 생성
          
          polyline.setPath(mockPath);
          setPath(mockPath);
          setDistance(calcPathDistance(mockPath)); 
        }
      });

      let lastValidPos: any = null;
      let weakSignalTimer: ReturnType<typeof setTimeout> | null = null;

      // GPS 위치 추적 및 실시간 업데이트
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const currentPos = new window.kakao.maps.LatLng(latitude, longitude);
          lastValidPos = currentPos;
          setGpsWeak(false);
          setManualMode(false);

          if (weakSignalTimer) clearTimeout(weakSignalTimer);
          weakSignalTimer = setTimeout(() => setGpsWeak(true), 10000);

          marker.setPosition(currentPos);
          map.panTo(currentPos);

          // 실시간 경로 업데이트: 기존 경로에 현재 위치 추가 및 거리 재계산
          setPath(prevPath => {
            const newPath = [...prevPath, currentPos];
            polyline.setPath(newPath);
            setDistance(calcPathDistance(newPath));
            return newPath;
          });
        },
        (err) => {
          console.error("GPS Signal Timeout / Permission Denied", err);
          setGpsWeak(true);
          setManualMode(true); 
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
        if (weakSignalTimer) clearTimeout(weakSignalTimer);
      };
    });
  }, [state?.destCoords]);


  const handleEndWalk = () => {
    const serializedPath = path
      .map(toLatLngPoint)
      .filter((p): p is NonNullable<typeof p> => p !== null);

    navigate("/summary", {
      state: {
        path: serializedPath,
        distance,
        time,
        walkType: 'guided',
        destination: state?.destination,
      },
    });
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans overflow-hidden border-x border-gray-100 relative">
      <div className="flex-1 bg-gray-100 relative z-0">
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

        <div className="absolute top-12 left-6 right-6 z-20">
          <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Navigating to</p>
              <p className="font-black text-lg leading-tight">{state?.destination || "목적지 미지정"}</p>
            </div>
          </div>
        </div>

        {/* Fallback UI: GPS 권한 거부 시 사용자 행동 유도 */}
        {manualMode && (
          <div className="absolute top-32 left-6 right-6 z-20 animate-bounce">
            <div className="bg-blue-600 border border-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl text-center shadow-lg flex items-center justify-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              지도를 클릭하여 가상 출발지를 지정하세요!
            </div>
          </div>
        )}

        {gpsWeak && !manualMode && (
          <div className="absolute top-32 left-6 right-6 z-20">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 text-xs font-bold px-4 py-2 rounded-xl text-center">
              GPS 신호가 약합니다. 마지막 유효 위치를 사용 중입니다.
            </div>
          </div>
        )}
      </div>

      <div className="bg-white px-8 pt-8 pb-12 z-20 rounded-t-[40px] border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Distance</span>
            <div className="text-3xl font-black">{distance.toFixed(2)} <span className="text-sm font-bold text-gray-400">km</span></div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</span>
            <div className="text-3xl font-black">
              {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
            </div>
          </div>
        </div>

        <button
          onClick={handleEndWalk}
          className="w-full h-18 bg-black text-white rounded-2xl text-xl font-black flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <Square className="w-4 h-4 fill-white" /> 산책 종료
        </button>
      </div>
    </div>
  );
}