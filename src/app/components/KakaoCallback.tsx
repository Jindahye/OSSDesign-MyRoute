import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export function KakaoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      // 백엔드의 카카오 인증 엔드포인트로 인가 코드 전송 (HTTP POST)
      fetch('/api/auth/kakao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.isNewUser) {
          // [신규 사용자] 회원가입 완료 전까지 카카오 프로필 데이터를 localStorage의 임시 키(temp_user)에 저장
          localStorage.setItem("temp_user", JSON.stringify(data.user));
          alert(data.message);
          // 회원가입(닉네임 설정) 프리셋 페이지로 클라이언트 사이드 라우팅 수행
          navigate("/signup"); 
        } else {
          // [기존 사용자] 세션 유지를 위해 인증된 사용자 객체를 localStorage의 정식 키(user)에 저장
          localStorage.setItem("user", JSON.stringify(data.user));
          alert(data.message);
          // 메인 애플리케이션 홈 화면으로 라우팅 수행
          navigate("/home"); 
        }
      })
      .catch((error) => {
        console.error("HTTP 통신 중 예외 발생:", error);
        alert("서버와의 연결이 원활하지 않습니다.");
        navigate("/"); 
      });
    }
  }, [code, navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">MyRoute 로그인 진행 중</h1>
      <p className="text-sm text-gray-500">사용자 인증을 처리하고 있습니다.</p>
    </div>
  );
}