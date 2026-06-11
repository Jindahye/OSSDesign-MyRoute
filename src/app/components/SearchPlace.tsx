import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, ArrowLeft, BadgeInfo, Accessibility } from "lucide-react";

declare global { interface Window { kakao: any; } }

export function SearchPlace() {
  const navigate = useNavigate();
  
  // 상태 관리 (State Management)
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [publicFacilities, setPublicFacilities] = useState<any[]>([]);

  // 생명주기 관리 (Lifecycle Hook): Component Mount Phase
  useEffect(() => {
    // 1. Geolocation API를 활용한 Client Position Initialize
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (window.kakao && window.kakao.maps) {
            setCurrentLocation(new window.kakao.maps.LatLng(latitude, longitude));
          }
        },
        (err) => console.error("Geolocation Fetch Error", err),
        { enableHighAccuracy: true }
      );
    }

    // 2. HTTP GET Request: Open API 연동 (교통약자 무장애 인프라 데이터 셋)
    const fetchPublicData = async () => {
      try {
        const API_KEY = "발급받으신_실제_인증키를_여기에_넣으세요"; 
        const Endpoint_URL = `https://apis.data.go.kr/3450000/SeoGuDisabledPersonService/getSeoGuDisabledPersonList?serviceKey=${API_KEY}&numOfRows=100&pageNo=1&type=json`;

        const response = await fetch(Endpoint_URL);
        const json = await response.json();
        
        // JSON Payload Parsing 및 Array Type Guard
        if (json && json.body && json.body.items && json.body.items.item) {
          const itemData = json.body.items.item;
          const itemsArray = Array.isArray(itemData) ? itemData : [itemData];
          setPublicFacilities(itemsArray);
        }
      } catch (error) {
        console.error("Open API Network Exception:", error);
      }
    };

    fetchPublicData();
  }, []);

  // Event Handler: POI(Point of Interest) Query 및 Data Integration
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim()) {
      alert("목적지를 입력해주세요.");
      return;
    }

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      alert("지도 SDK가 로드되지 않았습니다.");
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    
    // Spatial Query Option: 현재 좌표 기준 반경 정렬 옵션 주입
    const searchOptions = currentLocation ? {
      location: currentLocation,
      sort: window.kakao.maps.services.SortBy.DISTANCE
    } : {};

    ps.keywordSearch(keyword, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        
        // Client LocalStorage에서 User Preference 파싱
        const savedPref = localStorage.getItem("userPreferences");
        const prefs = savedPref ? JSON.parse(savedPref) : {};

        // Data Integration: 서드파티 지도 API 결과와 공공데이터 병합 (Mapping)
        const enrichedData = data.map((place: any) => {
          
          // String Matching Algorithm: 장소명 부분 일치 검사
          const matchedFacility = publicFacilities.find(facility => 
            facility.b_store_name && (
              place.place_name.includes(facility.b_store_name) || 
              facility.b_store_name.includes(place.place_name)
            )
          );

          let weightScore = 0;
          let isPublicTarget = false;
          let hasWheelchairAccess = false;
          let hasRamp = false;
          let hasDisabledToilet = false;
          let doorWidth = 0;

          // 공공데이터 속성(Attribute) 바인딩 및 Heuristic Weighting (가중치 연산)
          if (matchedFacility) {
            isPublicTarget = true;
            hasWheelchairAccess = matchedFacility.dw_wheelchair_YN === 'Y';
            hasRamp = matchedFacility.dw_ramp_YN === 'Y';
            hasDisabledToilet = matchedFacility.to_disabled_YN === 'Y';
            doorWidth = Number(matchedFacility.dw_width) || 0;

            // Preference-based Scoring
            if (prefs.wheeled) {
              if (hasWheelchairAccess) weightScore += 100;
              if (hasRamp) weightScore += 50;
            }
            if (prefs.slope && hasRamp) {
              weightScore += 30; 
            }
          }

          return {
            ...place,
            isPublicTarget,
            hasWheelchairAccess,
            hasRamp,
            hasDisabledToilet,
            doorWidth,
            weightScore
          };
        });

        // Multi-criteria Sort Algorithm: 1차 기준(가중치 점수, Descending), 2차 기준(거리, Ascending)
        enrichedData.sort((a: any, b: any) => {
          if (b.weightScore !== a.weightScore) {
            return b.weightScore - a.weightScore;
          }
          return (parseInt(a.distance) || 0) - (parseInt(b.distance) || 0);
        });

        setResults(enrichedData);

      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
        setResults([]);
      } else {
        alert("검색 중 오류가 발생했습니다.");
      }
    }, searchOptions); 
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="pt-12 px-6 pb-4 flex items-center gap-4 border-b border-gray-50">
        <ArrowLeft className="cursor-pointer hover:text-gray-600 transition-colors" onClick={() => navigate(-1)} />
        
        <form onSubmit={handleSearch} className="flex-1">
          <div className="w-full h-12 bg-gray-50 rounded-xl px-4 flex items-center gap-3 border-2 border-transparent focus-within:border-black transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              autoFocus
              className="flex-1 bg-transparent outline-none text-base" 
              placeholder="장소를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="hidden">검색</button>
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        {results.map((place, i) => (
          <div 
            key={i} 
            className="py-5 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors active:scale-[0.98]"
            // Router Context State: 타겟 컴포넌트로 좌표계(Coordinate System) 데이터 페이로드 전달
            onClick={() => navigate("/routes", { 
              state: { 
                destination: place.place_name,
                destCoords: {
                  lat: parseFloat(place.y),
                  lng: parseFloat(place.x)
                }
              } 
            })}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${place.weightScore > 0 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <MapPin className={`w-5 h-5 ${place.weightScore > 0 ? 'text-blue-500' : 'text-gray-500'}`} />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-lg truncate">{place.place_name}</p>
                  {place.weightScore > 0 && (
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shrink-0">
                      <Accessibility className="w-3 h-3" />
                      맞춤 경로 추천
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{place.address_name}</p>
                
                <div className="flex flex-col gap-1 mt-1">
                  {place.distance && (
                    <p className="text-[11px] font-bold text-gray-400">{place.distance}m 거리</p>
                  )}
                  
                  {place.isPublicTarget && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {place.hasWheelchairAccess && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-blue-100">
                          <BadgeInfo className="w-3 h-3" />
                          휠체어 통행가능
                        </span>
                      )}
                      {place.hasRamp && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          진입 경사로 보유
                        </span>
                      )}
                      {place.hasDisabledToilet && (
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          장애인 화장실
                        </span>
                      )}
                      {place.doorWidth > 0 && (
                        <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                          출입구 폭: {place.doorWidth}cm
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}