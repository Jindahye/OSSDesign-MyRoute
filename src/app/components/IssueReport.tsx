import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { getKakaoId } from "../utils/auth";

export function IssueReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedIssue, setSelectedIssue] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { latitude, longitude } = location.state || {};

  const issues = [
    { id: "construction", label: "공사 중" },
    { id: "obstacle", label: "장애물" },
    { id: "damage", label: "파손" },
  ];

  const handleSubmit = async () => {
    if (!selectedIssue) {
      alert("위험 요소 종류를 선택해 주세요.");
      return;
    }

    if (latitude == null || longitude == null) {
      alert("제보 위치를 확인할 수 없습니다. 자유 산책 화면에서 다시 시도해 주세요.");
      return;
    }

    const kakaoId = getKakaoId();
    if (!kakaoId) {
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reports/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kakaoId,
          issueType: selectedIssue,
          description,
          latitude,
          longitude,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || '제보 제출에 실패했습니다.');
        return;
      }

      alert(data.message);
      navigate(-1);
    } catch {
      alert("서버와 연결할 수 없습니다. 입력 내용은 유지됩니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="px-6 flex flex-col h-full">
        <div className="h-20 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <h1 className="text-2xl font-black tracking-tight">상황 제보</h1>
        </div>

        <div className="flex-1 py-6 flex flex-col">
          <p className="text-gray-500 font-bold mb-4 leading-tight">
            다른 사용자들을 위해<br />현장의 위험 요소를 알려주세요.
          </p>

          {latitude != null && longitude != null ? (
            <p className="text-xs text-blue-500 font-bold mb-6">
              제보 위치: {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </p>
          ) : (
            <p className="text-xs text-red-400 font-bold mb-6">
              GPS 좌표를 가져오지 못했습니다.
            </p>
          )}

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

          <div className="flex-1 flex flex-col">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Description</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상세 내용을 입력해주세요 (예: 계단 파손으로 휠체어 통행 불가)"
              className="w-full flex-1 border-2 border-gray-50 bg-gray-50 rounded-[32px] p-6 outline-none focus:border-black transition-all resize-none font-medium placeholder:text-gray-300"
            />
          </div>
        </div>

        <div className="pb-12">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-18 bg-black text-white rounded-2xl text-xl font-black shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {submitting ? '제출 중...' : '제보 제출하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
