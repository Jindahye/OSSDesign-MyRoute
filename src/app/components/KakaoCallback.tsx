import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export function KakaoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      fetch('/api/auth/kakao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
      })
      .then((res) => res.json())
      .then((data) => {
        // 백엔드에서 전달한 닉네임 기반의 환영 메시지 출력
        alert(data.message); 
        
        // 메인 홈 화면으로 라우팅 권한 이동
        navigate("/home"); 
      })
      .catch((error) => {
        console.error("HTTP 통신 에러 발생:", error);
        alert("서버와의 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.");
        navigate("/"); 
      });
    }
  }, [code, navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">MyRoute 로그인 진행 중</h1>
      <p className="text-sm text-gray-500">사용자 인증을 처리하고 있습니다. 잠시만 기다려주세요.</p>
    </div>
  );
}