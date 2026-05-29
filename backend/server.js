// backend/server.js
const express = require('express');
const app = express();
const PORT = 3000; // 백엔드가 사용할 포트 번호

app.use(express.json());

// 서버 작동 확인용 기본 주소
app.get('/api/test', (req, res) => {
    res.json({ message: "마이루트 찐 백엔드 서버가 정상적으로 구동 중입니다! 🚀" });
});

app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`▶ MyRoute 서버가 http://localhost:${PORT} 에서 달리는 중!`);
    console.log(`==================================================`);
});