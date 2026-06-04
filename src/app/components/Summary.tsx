import { useNavigate } from "react-router";

export function Summary() {
  const navigate = useNavigate();

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="px-6 flex flex-col h-full">
        
        {/* 헤더 */}
        <div className="pt-16 pb-8">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Walk Finished</p>
          <h1 className="text-3xl font-black italic tracking-tighter">오늘의 산책 요약</h1>
        </div>

        {/* 경로 지도 프리뷰 */}
        <div className="w-full h-56 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] mb-10 flex flex-col items-center justify-center">
          <p className="text-gray-200 text-xs">(실제 이동 경로가 표시될 영역)</p>
        </div>

        {/* 통계 정보 */}
        <div className="flex-1 space-y-4">
          {[
            { label: '총 거리', value: '2.35', unit: 'km' },
            { label: '소요 시간', value: '32', unit: '분' },
            { label: '소모 칼로리', value: '145', unit: 'kcal' },
          ].map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border-2 border-gray-50"
            >
              <span className="text-gray-500 font-bold">{item.label}</span>
              <div className="text-2xl font-black">
                {item.value} <span className="text-sm font-bold text-gray-400">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 확인 버튼 */}
        <div className="pb-12">
          <button
            onClick={() => navigate("/home")}
            className="w-full h-18 py-5 bg-black text-white rounded-2xl text-xl font-black transition-transform active:scale-[0.98] shadow-lg shadow-black/10"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}