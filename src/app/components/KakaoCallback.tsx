import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export function KakaoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // URL Query String에서 'code' 파라미터(인가 코드) 추출
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      // 지정된 백엔드 API 엔드포인트로 HTTP 비동기 통신(Fetch) 요청
      fetch('/api/auth/kakao', {
        method: 'POST', // HTTP 요청 메서드 설정
        headers: {
          'Content-Type': 'application/json', // 전송할 데이터의 MIME 타입 명시
        },
        body: JSON.stringify({ code: code }), // JavaScript 객체를 JSON 문자열로 변환하여 Request Body에 적재
      })
      .then((res) => {
        // HTTP Response 객체로부터 JSON 데이터 파싱
        return res.json();
      })
      .then((data) => {
        // 서버 측에서 전송한 Response 응답 메시지 출력
        alert(data.message); 
        
        // 클라이언트 사이드 라우팅을 통해 홈 컴포넌트로 이동
        navigate("/home"); 
      })
      .catch((error) => {
        // 네트워크 에러 또는 통신 실패 시 예외 처리
        console.error("HTTP 통신 에러 발생:", error);
        alert("백엔드 서버와의 HTTP 통신에 실패했습니다.");
      });
    }
  }, [code, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <h1 className="text-2xl font-bold">카카오 로그인 처리 중입니다.</h1>
    </div>
  );
}