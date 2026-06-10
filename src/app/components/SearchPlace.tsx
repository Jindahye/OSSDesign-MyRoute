import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, ArrowLeft } from "lucide-react";

declare global { interface Window { kakao: any; } }

export function SearchPlace() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  // 1. 컴포넌트 마운트 시 사용자 현재 위치 획득
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentLocation(new window.kakao.maps.LatLng(latitude, longitude));
        },
        (err) => console.error("위치 정보를 획득할 수 없습니다.", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // 2. 검색 시 위치 기반 거리순 정렬 옵션 추가
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) return;

    const ps = new window.kakao.maps.services.Places();
    
    // 현재 위치가 존재할 경우 옵션 객체 생성
    const searchOptions = currentLocation ? {
      location: currentLocation,
      sort: window.kakao.maps.services.SortBy.DISTANCE
    } : {};

    ps.keywordSearch(keyword, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setResults(data);
      } else {
        alert("검색 결과가 없습니다.");
      }
    }, searchOptions); // 옵션 객체 전달
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="pt-12 px-6 pb-4 flex items-center gap-4 border-b border-gray-50">
        <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
        <form onSubmit={handleSearch} className="flex-1">
          <div className="w-full h-12 bg-gray-50 rounded-xl px-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              autoFocus
              className="flex-1 bg-transparent outline-none" 
              placeholder="목적지를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        {results.map((place, i) => (
          <div 
            key={i} 
            className="py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50"
            onClick={() => navigate("/routes", { state: { destination: place.place_name } })}
          >
            <div className="flex items-center gap-3">
              <MapPin className="text-gray-400 w-5 h-5" />
              <div>
                <p className="font-bold">{place.place_name}</p>
                <p className="text-xs text-gray-400">{place.address_name}</p>
                {/* 거리 정보 출력 (미터 단위) */}
                {place.distance && (
                  <p className="text-[10px] text-blue-500 mt-1">{place.distance}m</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}