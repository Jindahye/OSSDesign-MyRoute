import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
export function Preferences() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({ slope: false, wheeled: false, walking: false, running: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedPref = localStorage.getItem("userPreferences");
    if (savedPref) {
      setPreferences(JSON.parse(savedPref));
    }
  }, []);

  const handleComplete = async () => {
    const currentUser = localStorage.getItem("user");
    const tempUser = localStorage.getItem("temp_user");

    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);
      const kakaoId = parsedUser.kakao_id ?? parsedUser.id;

      setSaving(true);
      try {
        const res = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kakaoId, preferences }),
        });
        const data = await res.json();

        if (!res.ok) {
          alert(data.message || '취향 설정 변경에 실패했습니다.');
          return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userPreferences", JSON.stringify(preferences));
        alert(data.message);
        navigate("/mypage");
      } catch {
        alert("서버 오류로 인해 취향 설정 변경에 실패했습니다.");
      } finally {
        setSaving(false);
      }
      return;
    }

    if (tempUser) {
      const parsedUser = JSON.parse(tempUser);

      setSaving(true);
      fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kakaoId: parsedUser.id,
          nickname: parsedUser.nickname,
          profileImage: parsedUser.profileImage,
          preferences,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          return data;
        })
        .then((data) => {
          alert(data.message);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("userPreferences", JSON.stringify(preferences));
          localStorage.removeItem("temp_user");
          navigate("/home");
        })
        .catch((error) => {
          console.error("회원가입 요청 중 통신 에러 발생:", error);
          alert("서버 오류로 인해 회원 등록에 실패했습니다.");
        })
        .finally(() => setSaving(false));
      return;
    }

    alert("인증 정보가 만료되었습니다. 다시 로그인 해주세요.");
    navigate("/");
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
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
          <button
            onClick={handleComplete}
            disabled={saving}
            className="w-full h-16 bg-black text-white rounded-2xl text-xl font-bold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {saving ? '저장 중...' : '설정 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}
