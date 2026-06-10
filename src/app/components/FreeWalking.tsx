import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Square, Locate, Coffee, Store } from "lucide-react";

declare global {
  interface Window {
    kakao: any;
  }
}

export function FreeWalking() {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  
  // 카테고리별로 마커를 관리하는 객체 (예: { CS2: [marker1, marker2], CE7: [...] })
  const facilityMarkers = useRef<{ [key: string]: any[] }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
      setDistance((prev) => prev + 0.0012);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            if (!mapContainerRef.current) return;
            const currentPosition = new window.kakao.maps.LatLng(latitude, longitude);
            const map = new window.kakao.maps.Map(mapContainerRef.current, { center: currentPosition, level: 3 });
            mapRef.current = map;
            userMarkerRef.current = new window.kakao.maps.Marker({ position: currentPosition, map });
          });
        }
      },
      null,
      { enableHighAccuracy: true }
    );
  }, []);

  // 마커 토글 함수
  const toggleFacilities = (categoryCode: string) => {
    if (!mapRef.current || !window.kakao.maps.services) return;

    // 1. 이미 해당 카테고리 마커가 있으면 제거 (OFF)
    if (facilityMarkers.current[categoryCode]) {
      facilityMarkers.current[categoryCode].forEach((marker) => marker.setMap(null));
      delete facilityMarkers.current[categoryCode];
      return;
    }

    // 2. 마커가 없으면 검색 후 추가 (ON)
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
              content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`
            });
            infowindow.open(mapRef.current, marker);
          });
          newMarkers.push(marker);
        });
        facilityMarkers.current[categoryCode] = newMarkers;
      }
    }, { location: mapRef.current.getCenter(), radius: 500 });
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans overflow-hidden border-x border-gray-100 relative">
      
      {/* 카테고리 토글 버튼 영역 */}
      <div className="absolute top-14 left-6 z-30 flex gap-2">
        <button onClick={() => toggleFacilities('CS2')} className="bg-white p-2 rounded-full shadow-lg border-2 border-black hover:bg-gray-100"><Store size={20}/></button>
        <button onClick={() => toggleFacilities('CE7')} className="bg-white p-2 rounded-full shadow-lg border-2 border-black hover:bg-gray-100"><Coffee size={20}/></button>
      </div>

      <div className="flex-1 bg-gray-50 relative z-0">
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} className="absolute inset-0" />
        
        <button onClick={() => mapRef.current.panTo(userMarkerRef.current.getPosition())} className="absolute bottom-28 right-6 w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-xl z-30">
          <Locate className="w-6 h-6 text-black" />
        </button>
      </div>

      <div className="bg-white px-8 pt-10 pb-12 z-20 rounded-t-[40px] border-t border-gray-100 relative">
        <button onClick={() => navigate("/summary")} className="w-full h-18 py-5 bg-black text-white rounded-2xl text-xl font-black flex items-center justify-center gap-3">
          <Square className="w-4 h-4" /> 산책 종료
        </button>
      </div>
    </div>
  );
}