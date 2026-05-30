import { useNavigate } from "react-router";

export function Login() {
  const navigate = useNavigate();

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans">
      <div className="px-6 flex-1 flex flex-col justify-center">
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-4xl font-black italic tracking-tighter">MyRoute</h1>
        </div>
        <div className="pb-20">
          <button
            onClick={() => navigate("/signup")}
            className="w-full h-16 border-2 border-black bg-white rounded-2xl text-xl font-bold transition-all active:scale-[0.98]"
          >
            SNS 로그인
          </button>
        </div>
      </div>
    </div>
  );
}