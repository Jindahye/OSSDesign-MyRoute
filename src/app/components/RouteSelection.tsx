import { useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Navigation, ShieldCheck, AlertCircle } from "lucide-react";

declare global { interface Window { kakao: any; } }

interface RouteOption {
  id: number;
  name: string;
  description: string;
  durationMin: number;
  distanceKm: number;
  safetyScore: number;
}

export function RouteSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  const [destCoords, setDestCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [permissionError, setPermissionError] = useState(false); // 권한 거부 상태 관리

  const destinationName = location.state?.destination || "목적지 미설정";
  const preLoadedCoords = location.state?.destCoords;

  useEffect(() => {
    if (!window.kakao?.maps) return;

    window.kakao.maps.load(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const startLatLng = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            setupMap(startLatLng);
          },
          () => {
            // 위치 권한 거부 시 예외 처리 및 UI 상태 업데이트
            setPermissionError(true);
            setLoading(false);
            setupMap(new window.kakao.maps.LatLng(35.8906, 128.8525));
          }
        );
      } else {
        setupMap(new window.kakao.maps.LatLng(35.8906, 128.8525));
      }

      function setupMap(startLatLng: any) {
        const map = new window.kakao.maps.Map(mapContainerRef.current, {
          center: startLatLng,
          level: 4,
        });

        new window.kakao.maps.Marker({ position: startLatLng, map, title: "출발지" });

        const processDestination = (destPos: any) => {
          setDestCoords({ lat: destPos.getLat(), lng: destPos.getLng() });
          new window.kakao.maps.Marker({ position: destPos, map });
          
          const bounds = new window.kakao.maps.LatLngBounds();
          bounds.extend(startLatLng);
          bounds.extend(destPos);
          map.setBounds(bounds);

          const line = new window.kakao.maps.Polyline({ path: [startLatLng, destPos] });
          const straightMeter = line.getLength(); 
          
          calculateSimulation(straightMeter);
        };

        if (preLoadedCoords) {
          processDestination(new window.kakao.maps.LatLng(preLoadedCoords.lat, preLoadedCoords.lng));
        } else {
          const ps = new window.kakao.maps.services.Places();
          ps.keywordSearch(destinationName, (data: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              processDestination(new window.kakao.maps.LatLng(data[0].y, data[0].x));
            } else {
              setLoading(false);
            }
          });
        }
      }
    });
  }, [destinationName, preLoadedCoords]);

// 시뮬레이션: 경로 분석 및 안전 점수 계산 
  const calculateSimulation = (straightMeter: number) => {
    setTimeout(() => {
      const savedPref = localStorage.getItem("userPreferences");
      const prefs = savedPref ? JSON.parse(savedPref) : {};
      const active = prefs.wheeled || prefs.slope;
      setIsFilterActive(active);

      const estimatedMeter = straightMeter * 1.3;
      const calcDistanceKm = Number((estimatedMeter / 1000).toFixed(2));
      const calcDurationMin = Math.max(1, active ? Math.ceil(estimatedMeter / 50) : Math.ceil(estimatedMeter / 67));

      setRoutes([{
        id: 1, 
        name: active ? '맞춤형 안전 경로' : '최단 시간 보행 경로', 
        description: active ? '교통약자 안전 필터 적용 완료' : '일반 최단거리 최적화',
        durationMin: calcDurationMin, 
        distanceKm: calcDistanceKm, 
        safetyScore: active ? 95 : 75,
      }]);
      setLoading(false);
    }, 100);
  };

  const handleStartWalk = () => {
    if (!destCoords) return;
    navigate("/navigation", {
      state: { destination: destinationName, destCoords, route: routes[selected] },
    });
  };

  const route = routes[selected];

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100 relative">
      <div className="flex-1 flex flex-col">
        <div ref={mapContainerRef} className="w-full h-[400px] bg-gray-100" />
        <div className="px-6 py-8 flex-1 bg-white rounded-t-[40px] -mt-10 relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Navigation className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Recommended Route</span>
          </div>
          <h1 className="text-3xl font-black mb-4">{destinationName}</h1>
          
          {/* 위치 권한 오류 UI */}
          {permissionError && (
            <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-[32px] text-center shadow-sm">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <h3 className="font-black text-red-800 text-lg">위치 권한이 필요합니다</h3>
              <p className="text-xs text-red-600 mt-1 mb-4">현재 위치를 불러올 수 없습니다. 권한 허용 후 새로고침해주세요.</p>
              <button onClick={() => window.location.reload()} className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm">새로고침</button>
            </div>
          )}

          {!loading && !permissionError && (
            <div className={`mb-4 px-4 py-2 border text-xs font-bold rounded-xl flex items-center gap-2 ${isFilterActive ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
              {isFilterActive ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {isFilterActive ? "교통약자 안전 필터 적용 완료" : "안전 필터 미작동 (설정 확인 필요)"}
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="p-6 bg-gray-50 rounded-[32px] text-center text-gray-400 font-bold animate-pulse">분석 중...</div>
            ) : route ? (
              <div onClick={() => setSelected(0)} className={`p-6 rounded-[32px] flex justify-between items-center shadow-xl cursor-pointer border-2 ${isFilterActive ? 'bg-black text-white' : 'bg-white'}`}>
                <div>
                  <p className="text-[10px] font-bold mb-1">Safety Score: {route.safetyScore}점</p>
                  <h2 className="text-xl font-bold">{route.name}</h2>
                  <p className="text-xs opacity-70 mt-1">{route.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">{route.durationMin}분</p>
                  <p className="text-[10px] opacity-70">{route.distanceKm}km</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <button onClick={handleStartWalk} className="w-[345px] mx-auto h-18 bg-black text-white rounded-2xl text-xl font-black mb-12 flex items-center justify-center gap-3 active:scale-95 transition-transform">
          산책 시작하기 <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}