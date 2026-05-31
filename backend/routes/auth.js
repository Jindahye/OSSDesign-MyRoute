// backend/routes/auth.js
const express = require('express');
const router = express.Router();

router.post('/kakao', async (req, res) => {
    // 프론트엔드에서 전송한 인가 코드 수신
    const code = req.body.code; 
    
    try {
        // 카카오 인증 서버로 액세스 토큰 요청 (HTTP POST)
        const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.VITE_KAKAO_REST_API_KEY, // .env 파일의 API 키
                redirect_uri: process.env.VITE_KAKAO_REDIRECT_URI, // .env 파일의 리다이렉트 주소
                code: code // 프론트에서 받은 인가 코드
            })
        });

        // 카카오 서버의 응답을 JSON으로 파싱
        const tokenData = await tokenResponse.json();
        
        // 백엔드 콘솔에 발급된 액세스 토큰 출력 (디버깅용)
        console.log("=====================================");
        console.log("카카오 액세스 토큰 발급 성공:", tokenData.access_token);
        console.log("=====================================");

        // 프론트엔드로 성공 응답 전송
        res.json({ 
            message: "백엔드: 카카오 토큰 발급 통신 완료!", 
            token: tokenData.access_token 
        });

    } catch (error) {
        console.error("카카오 토큰 발급 중 서버 에러 발생:", error);
        res.status(500).json({ message: "서버 내부 통신 에러" });
    }
});

module.exports = router;