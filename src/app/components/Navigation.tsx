import { useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Square, Locate, MapPin } from "lucide-react";

export function Navigation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  // 내비게이션 진행 상태 변수
  const [path, setPath] = useState<any[]>([]);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);

  // 소요 시간 카운터 로직
  useEffect(() => {
    const timer = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // 카카오맵 인스턴스 초기화 및 Geolocation API 기반 실시간 위치 추적 등록
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      // 지도 컨테이너 렌더링
      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center: new window.kakao.maps.LatLng(35.8906, 128.8525),
        level: 3
      });
      mapRef.current = map;

      // 이동 경로 시각화를 위한 Polyline 객체 생성 및 마운트
      const polyline = new window.kakao.maps.Polyline({
        path: [],
        strokeWeight: 6,
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeStyle: 'solid'
      });
      polyline.setMap(map);
      polylineRef.current = polyline;

      // 사용자 초기 위치 마커 생성
      const marker = new window.kakao.maps.Marker({ position: map.getCenter(), map });
      userMarkerRef.current = marker;

      // 실시간 위치 데이터 수신 리스너 등록
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const currentPos = new window.kakao.maps.LatLng(latitude, longitude);

          // 획득 좌표 기반 마커 및 지도 중심 위치 갱신
          marker.setPosition(currentPos);
          map.panTo(currentPos);

          // 좌표 배열 누적 및 Polyline 객체 경로 데이터 재할당
          setPath(prevPath => {
            const newPath = [...prevPath, currentPos];
            polyline.setPath(newPath);
            return newPath;
          });

          // 누적 이동 거리 산출
          setDistance(prev => prev + 0.0005); 
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    });
  }, []);

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
              <p className="font-black text-lg leading-tight">{state?.destination || "목적지"}</p>
            </div>
          </div>
        </div>
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
          onClick={() => navigate("/summary", { state: { path, distance, time } })}
          className="w-full h-18 bg-black text-white rounded-2xl text-xl font-black flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <Square className="w-4 h-4 fill-white" /> 산책 종료
        </button>
      </div>
    </div>
  );
}