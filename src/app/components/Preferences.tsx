import { useNavigate } from "react-router";
import { useState } from "react";

export function Preferences() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({ slope: false, wheeled: false, walking: false, running: false });

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans">
      <div className="px-6 flex flex-col h-full">
        <div className="h-20 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-2xl">←</button>
          <h1 className="text-xl font-bold">산책 취향 설정</h1>
        </div>
        <div className="flex-1 py-6 space-y-3">
          {[
            { id: 'slope', label: '경사로 피하기' },
            { id: 'wheeled', label: '바퀴 기구 사용 (유아차/휠체어)' },
            { id: 'walking', label: '여유로운 걷기 선호' },
            { id: 'running', label: '활동적인 러닝 선호' },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setPreferences(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof preferences] }))}
              className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${preferences[item.id as keyof typeof preferences] ? 'border-black bg-white' : 'border-gray-50 bg-gray-50'}`}
            >
              <span className={`text-lg ${preferences[item.id as keyof typeof preferences] ? 'font-bold' : 'text-gray-500'}`}>{item.label}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${preferences[item.id as keyof typeof preferences] ? 'bg-black border-black' : 'border-gray-300'}`}>
                {preferences[item.id as keyof typeof preferences] && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
          ))}
        </div>
        <div className="pb-12">
          <button onClick={() => navigate("/home")} className="w-full h-16 bg-black text-white rounded-2xl text-xl font-bold shadow-lg">설정 완료</button>
        </div>
      </div>
    </div>
  );
}
