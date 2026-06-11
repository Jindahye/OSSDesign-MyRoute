import { useNavigate } from "react-router";
import { useState } from "react";

export function SignUp() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    const trimmed = nickname.trim();

    if (!trimmed) {
      setError("닉네임을 입력해 주세요.");
      return;
    }

    if (!/^[가-힣a-zA-Z0-9]{2,12}$/.test(trimmed)) {
      setError("닉네임은 2~12자의 한글, 영문, 숫자만 사용할 수 있습니다.");
      return;
    }

    const tempUser = localStorage.getItem("temp_user");
    if (!tempUser) {
      alert("인증 정보가 만료되었습니다. 다시 로그인해 주세요.");
      navigate("/");
      return;
    }

    const parsed = JSON.parse(tempUser);
    parsed.nickname = trimmed;
    localStorage.setItem("temp_user", JSON.stringify(parsed));
    navigate("/preferences");
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans">
      <div className="px-6 flex flex-col h-full">
        <div className="pt-24 pb-12">
          <h1 className="text-3xl font-bold leading-tight">환영합니다!<br />닉네임을 설정하세요.</h1>
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setError("");
            }}
            className="w-full h-16 border-2 border-gray-100 rounded-2xl px-5 bg-gray-50 outline-none focus:border-black transition-all"
          />
          {error && <p className="text-red-500 text-sm font-bold mt-2 px-1">{error}</p>}
        </div>
        <div className="pb-12 space-y-6">
          <p className="text-center text-xs text-gray-400">
            '시작하기'를 누르면 MyRoute의 <span className="underline">이용약관</span> 및 <span className="underline">개인정보 처리방침</span>에 동의하는 것으로 간주합니다.
          </p>
          <button
            onClick={handleNext}
            className="w-full h-16 bg-black text-white rounded-2xl text-xl font-bold transition-all active:scale-[0.98]"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
