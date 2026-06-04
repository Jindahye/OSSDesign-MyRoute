import { useNavigate } from "react-router";
import { useState } from "react"; 

export function SignUp() {
  const navigate = useNavigate();
  // 사용자가 입력한 닉네임 문자열을 관리하는 컴포넌트 로컬 상태
  const [nickname, setNickname] = useState(""); 

  const handleNext = () => {
    // 입력값 유효성 검사 (공백 문자 제거 후 검증)
    if (!nickname.trim()) {
      alert("닉네임을 입력해 주세요!");
      return;
    }

    // localStorage에 저장된 임시 사용자 데이터를 읽어와서 입력된 닉네임 필드를 병합
    const tempUser = localStorage.getItem("temp_user");
    if (tempUser) {
      const parsed = JSON.parse(tempUser);
      parsed.nickname = nickname; // 닉네임 업데이트
      localStorage.setItem("temp_user", JSON.stringify(parsed)); // 세션 상태 최신화
    }

    // 다음 온보딩 단계인 취향 설정 페이지로 라우팅
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
            value={nickname} // 입력 필드의 값은 컴포넌트 상태(nickname)와 양방향 바인딩
            onChange={(e) => setNickname(e.target.value)} // 사용자가 입력할 때마다 상태 업데이트
            className="w-full h-16 border-2 border-gray-100 rounded-2xl px-5 bg-gray-50 outline-none focus:border-black transition-all"
          />
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