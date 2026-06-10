import { useNavigate, useLocation } from "react-router";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export function Summary() {
  const navigate = useNavigate();
  const location = useLocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // 산책 화면에서 전달받은 데이터
  const { path, distance, time } = location.state || { path: [], distance: 0, time: 0 };

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        if (!mapContainerRef.current || path.length === 0) return;

        const map = new window.kakao.maps.Map(mapContainerRef.current, {
          center: path[0],
          level: 3,
        });

        // 이동 경로 선(Polyline) 설정
        const polyline = new window.kakao.maps.Polyline({
          path: path,
          strokeWeight: 5,
          strokeColor: "#000000",
          strokeOpacity: 1,
          strokeStyle: "solid",
        });

        polyline.setMap(map);

        // 경로의 시작점과 끝점 마커 표시
        new window.kakao.maps.Marker({ position: path[0], map });
        new window.kakao.maps.Marker({ position: path[path.length - 1], map });
      });
    }
  }, [path]);

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="px-6 flex flex-col h-full">
        <div className="pt-16 pb-8">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Walk Finished</p>
          <h1 className="text-3xl font-black italic tracking-tighter">오늘의 산책 요약</h1>
        </div>

        {/* 경로 지도 프리뷰 영역 */}
        <div className="w-full h-56 bg-gray-50 border-2 border-black rounded-[32px] mb-10 overflow-hidden relative">
          <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
        </div>

        {/* 통계 정보 */}
        <div className="flex-1 space-y-4">
          {[
            { label: '총 거리', value: distance.toFixed(2), unit: 'km' },
            { label: '소요 시간', value: Math.floor(time / 60).toString(), unit: '분' },
            { label: '소모 칼로리', value: Math.floor(distance * 60).toString(), unit: 'kcal' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border-2 border-gray-50">
              <span className="text-gray-500 font-bold">{item.label}</span>
              <div className="text-2xl font-black">
                {item.value} <span className="text-sm font-bold text-gray-400">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pb-12">
          <button
            onClick={() => navigate("/home")}
            className="w-full h-18 py-5 bg-black text-white rounded-2xl text-xl font-black transition-transform active:scale-[0.98]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}