
const express = require('express');
const router = express.Router();

/**
 * @route GET /api/routes/search
 * @desc 취향 맞춤형 보행 경로 탐색 (1차: 카카오 기반 스텁 + 취향 메타)
 */
router.get('/search', async (req, res) => {
    const db = req.app.get('db');
    const { kakaoId, destLat, destLng, destName } = req.query;

    if (!kakaoId || !destLat || !destLng) {
        return res.status(400).json({ message: '필수 파라미터가 누락되었습니다.' });
    }

    try {
        const user = await db.get('SELECT * FROM users WHERE kakao_id = ?', [kakaoId]);
        if (!user) {
            return res.status(401).json({ message: '인증된 사용자를 찾을 수 없습니다.' });
        }

        const tags = [];
        if (user.slope) tags.push('경사로 회피');
        if (user.wheeled) tags.push('바퀴 기구 친화');
        if (user.walking) tags.push('여유로운 걷기');
        if (user.running) tags.push('러닝 페이스');

        res.json({
            routes: [
                {
                    id: 1,
                    name: '가장 안전한 경로',
                    description: tags.length > 0 ? tags.join(' · ') : '기본 안전 경로',
                    durationMin: 15,
                    distanceKm: 1.2,
                    safetyScore: 92,
                    destName: destName || '목적지',
                    destLat: parseFloat(destLat),
                    destLng: parseFloat(destLng),
                },
            ],
            safetyFilterActive: true,
        });
    } catch (error) {
        console.error('경로 검색 중 에러:', error);
        res.status(500).json({ message: '경로 검색 중 서버 오류가 발생했습니다.' });
    }
});

/**
 * @route POST /api/routes/history
 * @desc 산책 완료 후 주행 로그 저장
 */
router.post('/history', async (req, res) => {
    const db = req.app.get('db');
    const { kakaoId, distance, time, path, walkType } = req.body;

    if (!kakaoId || distance == null || time == null) {
        return res.status(400).json({ message: '필수 파라미터가 누락되었습니다.' });
    }

    try {
        const user = await db.get('SELECT kakao_id FROM users WHERE kakao_id = ?', [kakaoId]);
        if (!user) {
            return res.status(401).json({ message: '인증된 사용자를 찾을 수 없습니다.' });
        }

        const pathJson = JSON.stringify(path || []);
        const result = await db.run(
            `INSERT INTO walk_histories (kakao_id, distance, time, path, walk_type)
             VALUES (?, ?, ?, ?, ?)`,
            [kakaoId, distance, time, pathJson, walkType || 'guided']
        );

        const saved = await db.get('SELECT * FROM walk_histories WHERE id = ?', [result.lastID]);
        res.status(201).json({
            message: '산책 기록이 저장되었습니다.',
            log: {
                id: saved.id,
                date: saved.created_at,
                distance: saved.distance,
                time: saved.time,
                path: JSON.parse(saved.path || '[]'),
                walkType: saved.walk_type,
            },
        });
    } catch (error) {
        console.error('산책 기록 저장 중 에러:', error);
        res.status(500).json({ message: '산책 기록 저장 중 서버 오류가 발생했습니다.' });
    }
});

/**
 * @route GET /api/routes/history
 * @desc 사용자의 과거 산책 이력 조회
 */
router.get('/history', async (req, res) => {
    const db = req.app.get('db');
    const { kakaoId } = req.query;

    if (!kakaoId) {
        return res.status(400).json({ message: 'kakaoId가 필요합니다.' });
    }

    try {
        const rows = await db.all(
            `SELECT id, distance, time, path, walk_type, created_at
             FROM walk_histories
             WHERE kakao_id = ?
             ORDER BY created_at DESC`,
            [kakaoId]
        );

        const logs = rows.map((row) => ({
            id: row.id,
            date: row.created_at,
            distance: row.distance,
            time: row.time,
            path: JSON.parse(row.path || '[]'),
            walkType: row.walk_type,
        }));

        res.json({ logs });
    } catch (error) {
        console.error('산책 이력 조회 중 에러:', error);
        res.status(500).json({ message: '산책 이력 조회 중 서버 오류가 발생했습니다.' });
    }
});

/**
 * @route POST /api/reports/submit
 * @desc 도로 위험 요소 제보 저장
 */
router.post('/submit', async (req, res) => {
    const db = req.app.get('db');
    const { kakaoId, issueType, description, latitude, longitude } = req.body;

    if (!kakaoId || !issueType) {
        return res.status(400).json({ message: '필수 파라미터가 누락되었습니다.' });
    }

    if (latitude == null || longitude == null) {
        return res.status(400).json({ message: '제보 위치 좌표가 필요합니다.' });
    }

    try {
        const user = await db.get('SELECT kakao_id FROM users WHERE kakao_id = ?', [kakaoId]);
        if (!user) {
            return res.status(401).json({ message: '인증된 사용자를 찾을 수 없습니다.' });
        }

        await db.run(
            `INSERT INTO issue_reports (kakao_id, issue_type, description, latitude, longitude)
             VALUES (?, ?, ?, ?, ?)`,
            [kakaoId, issueType, description || '', latitude, longitude]
        );

        res.status(201).json({ message: '제보가 성공적으로 접수되었습니다.' });
    } catch (error) {
        console.error('제보 저장 중 에러:', error);
        res.status(500).json({ message: '제보 저장 중 서버 오류가 발생했습니다.' });
    }
});

module.exports = router;
