import { useNavigate } from "react-router";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export function IssueReport() {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState("");

  const issues = [
    { id: "construction", label: "공사 중" },
    { id: "obstacle", label: "장애물" },
    { id: "damage", label: "파손" },
  ];

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="px-6 flex flex-col h-full">
        {/* 헤더 */}
        <div className="h-20 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <h1 className="text-2xl font-black tracking-tight">상황 제보</h1>
        </div>

        <div className="flex-1 py-6 flex flex-col">
          <p className="text-gray-500 font-bold mb-8 leading-tight">
            다른 사용자들을 위해<br />현장의 위험 요소를 알려주세요.
          </p>

          {/* 상태 선택 버튼 리스트 */}
          <div className="flex gap-3 mb-8">
            {issues.map((issue) => (
              <button
                key={issue.id}
                onClick={() => setSelectedIssue(issue.id)}
                className={`flex-1 h-16 rounded-2xl border-2 font-bold transition-all active:scale-95 ${
                  selectedIssue === issue.id 
                    ? "border-black bg-black text-white" 
                    : "border-gray-100 bg-gray-50 text-gray-400"
                }`}
              >
                {issue.label}
              </button>
            ))}
          </div>

          {/* 상세 내용 입력 */}
          <div className="flex-1 flex flex-col">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Description</p>
            <textarea
              placeholder="상세 내용을 입력해주세요 (예: 계단 파손으로 휠체어 통행 불가)"
              className="w-full flex-1 border-2 border-gray-50 bg-gray-50 rounded-[32px] p-6 outline-none focus:border-black transition-all resize-none font-medium placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="pb-12">
          <button
            onClick={() => navigate(-1)}
            className="w-full h-18 bg-black text-white rounded-2xl text-xl font-black shadow-lg active:scale-[0.98] transition-transform"
          >
            제보 제출하기
          </button>
        </div>
      </div>
    </div>
  );
}
