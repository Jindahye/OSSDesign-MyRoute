import { useNavigate } from "react-router";

export function Login() {
  const navigate = useNavigate();

  // 카카오 로그인 주소 준비 
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY as string;
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI as string;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

  // 카카오 로그인 실행 
  const handleKakaoLogin = () => {
    window.location.href = kakaoURL; 
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans">
      <div className="px-6 flex-1 flex flex-col justify-center">
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-4xl font-black italic tracking-tighter">MyRoute</h1>
        </div>
        <div className="pb-20">
          {}
          <button
            onClick={handleKakaoLogin} 
            className="w-full h-16 border-2 border-black bg-white rounded-2xl text-xl font-bold transition-all active:scale-[0.98]"
          >
            카카오로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}