// backend/routes/auth.js
const express = require('express');
const router = express.Router();

/**
 * @route POST /api/auth/kakao
 * @desc 인가 코드로 토큰을 발급받고, 사용자 프로필 정보를 조회하는 API
 */
router.post('/kakao', async (req, res) => {
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
                client_id: process.env.VITE_KAKAO_REST_API_KEY,
                redirect_uri: process.env.VITE_KAKAO_REDIRECT_URI,
                code: code
            })
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token; // 인증 마스터키 추출

        // 발급받은 액세스 토큰을 사용하여 카카오 사용자 정보 API 호출 (HTTP GET)
        const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // 헤더에 Bearer 토큰 주입
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        });

        const userData = await userResponse.json();
        
        // 백엔드 콘솔에 수신된 사용자 프로필 출력 (디버깅)
        console.log("=====================================");
        console.log("카카오 사용자 프로필 수신 성공");
        console.log("회원 고유 ID:", userData.id);
        console.log("사용자 닉네임:", userData.properties?.nickname);
        console.log("=====================================");

        // 프론트엔드로 사용자 정보 및 성공 메시지 반환
        res.json({ 
            message: `${userData.properties?.nickname}님, 로그인이 완료되었습니다.`, 
            user: {
                id: userData.id,
                nickname: userData.properties?.nickname,
                profileImage: userData.properties?.profile_image
            }
        });

    } catch (error) {
        console.error("카카오 인증 및 프로필 조회 중 에러 발생:", error);
        res.status(500).json({ message: "서버 내부 인증 에러가 발생했습니다." });
    }
});

module.exports = router;