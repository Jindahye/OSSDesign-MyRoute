import { useNavigate } from "react-router";

export function SignUp() {
  const navigate = useNavigate();

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
            className="w-full h-16 border-2 border-gray-100 rounded-2xl px-5 bg-gray-50 outline-none focus:border-black transition-all"
          />
        </div>
        <div className="pb-12 space-y-6">
          <p className="text-center text-xs text-gray-400">
            '시작하기'를 누르면 MyRoute의 <span className="underline">이용약관</span> 및 <span className="underline">개인정보 처리방침</span>에 동의하는 것으로 간주합니다.
          </p>
          <button
            onClick={() => navigate("/preferences")}
            className="w-full h-16 bg-black text-white rounded-2xl text-xl font-bold transition-all active:scale-[0.98]"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}