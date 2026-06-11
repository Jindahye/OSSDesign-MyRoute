import { useNavigate, useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";
import { getKakaoId } from "../utils/auth";
import { toLatLngPoint, LatLngPoint } from "../utils/geo";

declare global {
  interface Window {
    kakao: any;
  }
}

export function Summary() {
  const navigate = useNavigate();
  const location = useLocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState(false);

  const {
    path = [],
    distance = 0,
    time = 0,
    walkType = 'guided',
    destination,
    isViewMode = false,
    date,
  } = location.state || {};

  const normalizedPath: LatLngPoint[] = (path as any[])
    .map(toLatLngPoint)
    .filter((p): p is LatLngPoint => p !== null);

  useEffect(() => {
    if (isViewMode || saved || normalizedPath.length === 0) return;

    const kakaoId = getKakaoId();
    const record = {
      date: new Date().toLocaleString('ko-KR'),
      distance,
      time,
      path: normalizedPath,
      walkType,
      destination: destination || null,
    };

    const existing = localStorage.getItem("walkHistory");
    const history = existing ? JSON.parse(existing) : [];
    history.push(record);
    localStorage.setItem("walkHistory", JSON.stringify(history));
    setSaved(true);

    if (kakaoId) {
      fetch('/api/routes/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kakaoId,
          distance,
          time,
          path: normalizedPath,
          walkType,
        }),
      }).catch((err) => console.error('서버 기록 저장 실패:', err));
    }
  }, [isViewMode, saved, distance, time, walkType, destination, path]);

  useEffect(() => {
    if (!window.kakao?.maps || normalizedPath.length === 0) return;

    window.kakao.maps.load(() => {
      if (!mapContainerRef.current) return;

      const kakaoPath = normalizedPath.map(
        (p) => new window.kakao.maps.LatLng(p.lat, p.lng)
      );

      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center: kakaoPath[0],
        level: 3,
      });

      const polyline = new window.kakao.maps.Polyline({
        path: kakaoPath,
        strokeWeight: 5,
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeStyle: "solid",
      });
      polyline.setMap(map);

      new window.kakao.maps.Marker({ position: kakaoPath[0], map });
      new window.kakao.maps.Marker({ position: kakaoPath[kakaoPath.length - 1], map });
    });
  }, [normalizedPath]);

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="px-6 flex flex-col h-full">
        <div className="pt-16 pb-8">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
            {isViewMode ? 'Walk Record' : 'Walk Finished'}
          </p>
          <h1 className="text-3xl font-black italic tracking-tighter">오늘의 산책 요약</h1>
          {date && <p className="text-sm text-gray-400 mt-2">{date}</p>}
          {destination && <p className="text-sm font-bold mt-1">목적지: {destination}</p>}
        </div>

        <div className="w-full h-56 bg-gray-50 border-2 border-black rounded-[32px] mb-10 overflow-hidden relative">
          {normalizedPath.length > 0 ? (
            <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
              이동 경로 데이터가 없습니다.
            </div>
          )}
        </div>

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
            onClick={() => navigate(isViewMode ? "/history" : "/home")}
            className="w-full h-18 py-5 bg-black text-white rounded-2xl text-xl font-black transition-transform active:scale-[0.98]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
