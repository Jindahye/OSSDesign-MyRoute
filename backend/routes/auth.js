// backend/routes/auth.js
const express = require('express');
const router = express.Router();

/**
 * @route POST /api/auth/kakao
 * @desc 프론트엔드로부터 카카오 인가 코드를 수신하는 API 엔드포인트
 */
router.post('/kakao', (req, res) => {
    // 1. HTTP Request Body로부터 인가 코드(code) 파싱
    const code = req.body.code; 
    
    // 2. 백엔드 터미널(콘솔)에 수신 데이터 출력 (디버깅용)
    console.log("=====================================");
    console.log("수신된 카카오 인가 코드 (Authorization Code):", code);
    console.log("=====================================");

    // 3. Client(프론트엔드)로 HTTP 200 OK 응답(JSON) 전송
    res.json({ 
        message: "백엔드: 카카오 인가 코드가 정상적으로 수신되었습니다.", 
        receivedCode: code 
    });
});

module.exports = router;