import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Square, Locate, Coffee, Store, Plus } from "lucide-react";
import { calcPathDistance, toLatLngPoint } from "../utils/geo";

declare global {
  interface Window {
    kakao: any;
  }
}

export function FreeWalking() {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [path, setPath] = useState<any[]>([]);
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsWeak, setGpsWeak] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const facilityMarkers = useRef<{ [key: string]: any[] }>({});

  useEffect(() => {
    const timer = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation || !window.kakao?.maps) return;

    let lastValidPos: any = null;
    let weakSignalTimer: ReturnType<typeof setTimeout> | null = null;

    window.kakao.maps.load(() => {
      if (!mapContainerRef.current) return;

      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center: new window.kakao.maps.LatLng(35.8906, 128.8525),
        level: 3,
      });
      mapRef.current = map;

      const polyline = new window.kakao.maps.Polyline({
        path: [],
        strokeWeight: 5,
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeStyle: 'solid',
      });
      polyline.setMap(map);
      polylineRef.current = polyline;

      const marker = new window.kakao.maps.Marker({ position: map.getCenter(), map });
      userMarkerRef.current = marker;

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const pos = new window.kakao.maps.LatLng(latitude, longitude);
          lastValidPos = pos;
          setGpsWeak(false);
          setCurrentPos({ lat: latitude, lng: longitude });

          if (weakSignalTimer) clearTimeout(weakSignalTimer);
          weakSignalTimer = setTimeout(() => setGpsWeak(true), 10000);

          marker.setPosition(pos);
          map.panTo(pos);

          setPath(prev => {
            const newPath = [...prev, pos];
            polyline.setPath(newPath);
            setDistance(calcPathDistance(newPath));
            return newPath;
          });
        },
        () => {
          if (lastValidPos) {
            setGpsWeak(true);
            marker.setPosition(lastValidPos);
          } else {
            alert("위치 권한이 필요합니다. 브라우저 설정에서 위치 접근을 허용해 주세요.");
          }
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
        if (weakSignalTimer) clearTimeout(weakSignalTimer);
      };
    });
  }, []);

  const toggleFacilities = (categoryCode: string) => {
    if (!mapRef.current || !window.kakao.maps.services) return;

    if (facilityMarkers.current[categoryCode]) {
      facilityMarkers.current[categoryCode].forEach((m) => m.setMap(null));
      delete facilityMarkers.current[categoryCode];
      return;
    }

    const places = new window.kakao.maps.services.Places();
    places.categorySearch(categoryCode, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const newMarkers: any[] = [];
        data.forEach((place: any) => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(place.y, place.x),
            map: mapRef.current,
          });
          window.kakao.maps.event.addListener(marker, 'click', () => {
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
            });
            infowindow.open(mapRef.current, marker);
          });
          newMarkers.push(marker);
        });
        facilityMarkers.current[categoryCode] = newMarkers;
      }
    }, { location: mapRef.current.getCenter(), radius: 500 });
  };

  const handleReport = () => {
    if (!currentPos) {
      alert("현재 위치를 확인할 수 없습니다. GPS 신호를 확인해 주세요.");
      return;
    }
    navigate("/report", { state: { latitude: currentPos.lat, longitude: currentPos.lng } });
  };

  const handleEndWalk = () => {
    const serializedPath = path
      .map(toLatLngPoint)
      .filter((p): p is NonNullable<typeof p> => p !== null);

    navigate("/summary", {
      state: {
        path: serializedPath,
        distance,
        time,
        walkType: 'free',
      },
    });
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans overflow-hidden border-x border-gray-100 relative">
      <div className="absolute top-14 left-6 z-30 flex gap-2">
        <button onClick={() => toggleFacilities('CS2')} className="bg-white p-2 rounded-full shadow-lg border-2 border-black hover:bg-gray-100"><Store size={20}/></button>
        <button onClick={() => toggleFacilities('CE7')} className="bg-white p-2 rounded-full shadow-lg border-2 border-black hover:bg-gray-100"><Coffee size={20}/></button>
      </div>

      {gpsWeak && (
        <div className="absolute top-28 left-6 right-6 z-30">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 text-xs font-bold px-4 py-2 rounded-xl text-center">
            GPS 신호가 약합니다.
          </div>
        </div>
      )}

      <div className="flex-1 bg-gray-50 relative z-0">
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} className="absolute inset-0" />

        <button
          onClick={handleReport}
          className="absolute bottom-28 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-xl z-30 active:scale-95 transition-transform"
        >
          <Plus className="w-7 h-7" />
        </button>

        <button
          onClick={() => userMarkerRef.current && mapRef.current?.panTo(userMarkerRef.current.getPosition())}
          className="absolute bottom-28 left-6 w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-xl z-30"
        >
          <Locate className="w-6 h-6 text-black" />
        </button>
      </div>

      <div className="bg-white px-8 pt-6 pb-12 z-20 rounded-t-[40px] border-t border-gray-100 relative">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Distance</span>
            <div className="text-2xl font-black">{distance.toFixed(2)} <span className="text-sm font-bold text-gray-400">km</span></div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</span>
            <div className="text-2xl font-black">
              {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
            </div>
          </div>
        </div>

        <button onClick={handleEndWalk} className="w-full h-18 py-5 bg-black text-white rounded-2xl text-xl font-black flex items-center justify-center gap-3">
          <Square className="w-4 h-4" /> 산책 종료
        </button>
      </div>
    </div>
  );
}
