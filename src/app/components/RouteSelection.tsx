import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { Clock, ArrowRight, MapPin } from "lucide-react";

export function RouteSelection() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [selected, setSelected] = useState(0);

  const destinationName = location.state?.destination || "목적지 미설정";

  const routes = [
    { id: 0, title: "가장 안전한 경로", time: "15", desc: "단차가 적고 조명이 밝은 길", tag: "추천" },
    { id: 1, title: "최단 시간 경로", time: "10", desc: "조금 가파르지만 가장 빠른 길", tag: "빠름" },
    { id: 2, title: "완만한 평지 경로", time: "18", desc: "계단이 없는 휠체어/유아차 맞춤", tag: "편안" },
  ];

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="px-6 flex flex-col h-full">
        {/* 헤더 */}
        <div className="h-20 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-2xl">←</button>
          <h1 className="text-xl font-bold">추천 경로 선택</h1>
        </div>

        {/* 현재 목적지 정보 */}
        <div className="bg-gray-50 p-5 rounded-[24px] flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-md">
            <MapPin className="text-white w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Destination</p>
            <p className="font-black text-lg">{destinationName}</p>
          </div>
        </div>

        {/* 경로 리스트 */}
        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          {routes.map((route) => (
            <div
              key={route.id}
              onClick={() => setSelected(route.id)}
              className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer ${
                selected === route.id 
                  ? 'border-black bg-white shadow-xl shadow-black/5' 
                  : 'border-gray-50 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  selected === route.id ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {route.tag}
                </span>
              </div>
              
              <h2 className={`text-xl font-black mb-2 ${selected === route.id ? 'text-black' : 'text-gray-400'}`}>
                {route.title}
              </h2>
              
              <div className="flex items-center gap-4 font-bold text-sm">
                <div className="flex items-center gap-1.5 text-black">
                  <Clock className="w-4 h-4" />
                  <span>{route.time}분</span>
                </div>
                <p className="text-xs text-gray-400">{route.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 버튼 */}
        <div className="pb-12">
          <button
            onClick={() => navigate("/navigation")}
            className="w-full h-18 bg-black text-white rounded-2xl text-xl font-black flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
          >
            산책 시작하기
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}