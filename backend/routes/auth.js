// backend/routes/auth.js
const express = require('express');
const router = express.Router();

/**
 * @route POST /api/auth/kakao
 * @desc 카카오 로그인 및 신규/기존 회원 분기 처리
 */
router.post('/kakao', async (req, res) => {
    const code = req.body.code; 
    const db = req.app.get('db'); // server.js에서 등록한 DB 객체 꺼내오기
    
    try {
        // 카카오 토큰 요청
        const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.VITE_KAKAO_REST_API_KEY,
                redirect_uri: process.env.VITE_KAKAO_REDIRECT_URI,
                code: code
            })
        });
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 카카오 사용자 정보 요청
        const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        });
        const userData = await userResponse.json();
        
        const kakaoId = String(userData.id);
        const defaultNickname = userData.properties?.nickname || "사용자";
        const profileImage = userData.properties?.profile_image || "";

        // DB에서 이미 가입된 사용자인지 조회하기
        const existingUser = await db.get('SELECT * FROM users WHERE kakao_id = ?', [kakaoId]);

        if (existingUser) {
            // [기존 회원] DB에 정보가 있으므로 바로 로그인 성공 처리
            console.log(`[로그인] 기존 회원 방문: ${existingUser.nickname}`);
            res.json({ 
                isNewUser: false,
                message: `${existingUser.nickname}님, 다시 만나서 반가워요!`, 
                user: existingUser
            });
        } else {
            // [신규 회원] DB에 정보가 없으므로 회원가입 페이지로 안내
            console.log(`[미가입] 신규 회원 감지 (ID: ${kakaoId})`);
            res.json({ 
                isNewUser: true,
                message: "신규 회원입니다. 회원가입 페이지로 이동합니다.",
                user: {
                    id: kakaoId,
                    nickname: defaultNickname,
                    profileImage: profileImage
                }
            });
        }

    } catch (error) {
        console.error("카카오 인증 및 DB 조회 중 에러 발생:", error);
        res.status(500).json({ message: "서버 내부 인증 에러" });
    }
});


/**
 * @route POST /api/auth/signup
 * @desc 신규 회원의 닉네임 및 산책 취향을 DB에 최종 저장 (회원가입)
 */
router.post('/signup', async (req, res) => {
    const db = req.app.get('db');
    const { kakaoId, nickname, profileImage, preferences } = req.body;

    try {
        // 프론트엔드에서 보낸 취향 object를 0 또는 1 숫자로 변환하여 저장
        const slope = preferences.slope ? 1 : 0;
        const wheeled = preferences.wheeled ? 1 : 0;
        const walking = preferences.walking ? 1 : 0;
        const running = preferences.running ? 1 : 0;

        // DB 장부에 새 회원 꽂아 넣기 (INSERT)
        await db.run(`
            INSERT INTO users (kakao_id, nickname, profile_image, slope, wheeled, walking, running)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [kakaoId, nickname, profileImage, slope, wheeled, walking, running]);

        // 저장된 유저 정보 다시 조회해서 가져오기
        const newUser = await db.get('SELECT * FROM users WHERE kakao_id = ?', [kakaoId]);
        
        console.log(`[회원가입 성공] 새로운 회원 등록 완료: ${nickname}`);
        res.status(201).json({
            message: `${nickname}님, MyRoute 회원가입을 축하합니다!`,
            user: newUser
        });

    } catch (error) {
        console.error("회원가입 DB 저장 중 에러 발생:", error);
        res.status(500).json({ message: "회원가입 처리 중 서버 에러가 발생했습니다." });
    }
});

module.exports = router;