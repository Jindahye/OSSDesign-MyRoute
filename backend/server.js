// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sqlite3 = require('sqlite3'); 
const { open } = require('sqlite'); 
const authRoutes = require('./routes/auth');
const routeRoutes = require('./routes/routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// SQLite 데이터베이스 초기화 및 연결
let db;
(async () => {
    try {
        // 프로젝트 루트에 myroute.db 파일 개설 및 연결
        db = await open({
            filename: './myroute.db',
            driver: sqlite3.Database
        });
        
        console.log("sqlite3 데이터베이스 연결 성공 (myroute.db)");

        // 회원 정보 및 산책 취향을 저장할 테이블 자동 생성
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                kakao_id TEXT PRIMARY KEY,
                nickname TEXT NOT NULL,
                profile_image TEXT,
                slope INTEGER DEFAULT 0,
                wheeled INTEGER DEFAULT 0,
                walking INTEGER DEFAULT 0,
                running INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("users 회원 테이블 생성/검증 완료");

        await db.exec(`
            CREATE TABLE IF NOT EXISTS walk_histories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                kakao_id TEXT NOT NULL,
                distance REAL NOT NULL,
                time INTEGER NOT NULL,
                path TEXT,
                walk_type TEXT DEFAULT 'guided',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (kakao_id) REFERENCES users(kakao_id)
            )
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS issue_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                kakao_id TEXT NOT NULL,
                issue_type TEXT NOT NULL,
                description TEXT,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (kakao_id) REFERENCES users(kakao_id)
            )
        `);
        console.log("walk_histories, issue_reports 테이블 생성/검증 완료");
        
        app.set('db', db); 

    } catch (error) {
        console.error("데이터베이스 초기화 중 치명적 에러 발생:", error);
    }
})();

// 라우터 연결
app.use('/api/auth', authRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/reports', routeRoutes);

app.get('/', (req, res) => {
    res.send('MyRoute 백엔드 서버가 정상 작동 중입니다.');
});

app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});