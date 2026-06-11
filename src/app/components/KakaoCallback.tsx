import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { syncPreferencesFromUser } from "../utils/auth";

export function KakaoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      alert("인증 서버와의 통신이 원활하지 않습니다.");
      navigate("/", { replace: true });
      return;
    }

    if (!code) {
      alert("인증 코드를 받지 못했습니다. 다시 로그인해 주세요.");
      navigate("/", { replace: true });
      return;
    }

    fetch('/api/auth/kakao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || '인증 실패');
        }
        return data;
      })
      .then((data) => {
        if (data.isNewUser) {
          localStorage.setItem("temp_user", JSON.stringify(data.user));
          alert(data.message);
          navigate("/signup");
        } else {
          localStorage.setItem("user", JSON.stringify(data.user));
          syncPreferencesFromUser(data.user);
          alert(data.message);
          navigate("/home");
        }
      })
      .catch((err) => {
        console.error("HTTP 통신 중 예외 발생:", err);
        alert("인증 서버와의 통신이 원활하지 않습니다.");
        navigate("/", { replace: true });
      });
  }, [code, error, navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">MyRoute 로그인 진행 중</h1>
      <p className="text-sm text-gray-500">사용자 인증을 처리하고 있습니다.</p>
    </div>
  );
}
