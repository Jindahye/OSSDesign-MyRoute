// backend/server.js
const express = require('express');
const app = express();
const PORT = 3000; 

app.use(express.json());

// auth 라우터를 가져와서 /api/auth 경로에 연결하기
const authRoutes = require('./routes/auth'); 
app.use('/api/auth', authRoutes); // 

// test 
app.get('/api/test', (req, res) => {
    res.json({ message: "백엔드 서버가 정상적으로 구동 중입니둥" });
});

app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`▶ MyRoute 서버가 http://localhost:${PORT} 에서 달리는 중!`);
    console.log(`==================================================`);
});