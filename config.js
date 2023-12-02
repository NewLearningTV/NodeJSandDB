// config.js
require('dotenv').config();

module.exports = {
    db: {
        user: '사용자 이름',
        password: '암호',
        host: '서버',
        port: '5432',
        database: '데이터베이스 이름 (사용자와 같을 수 있어요)'
    }
};