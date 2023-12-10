const { Pool } = require('pg');
const config = require('./config').db;

const pool = new Pool({
    user: config.user,
    password: config.password,
    host: config.host,
    port: config.port,
    database: config.database
});

// 데이터베이스를 연결할 수 있는지 확인하는 테스트
const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW();');
        console.log('Connection successful! 연결이 성공적이었습니다!');
    } catch (err) {
        console.error('Error executing query', err.stack);
    }
};

//  '영화' 테이블이 있는지 확인하는 기능
const checkTableExists = async () => {
    try {
        const checkQuery = `SELECT EXISTS (
                                SELECT FROM 
                                    pg_tables 
                                WHERE 
                                    schemaname = 'public' 
                                    AND tablename  = 'movie'
                            );`;
    
        const res = await pool.query(checkQuery);
        const exists = res.rows[0].exists; // Extract the 'exists' value from the query result
        console.log('Table exists:', exists ? '테이블이 있습니다!' : '테이블이 없습니다.');
        return exists;
    } catch (err) {
        console.error('Error executing query', err.stack);
    }
};

const setupMovies = async () => {
	// 먼저 테이블 만드는 코드
	try {
		const res = await pool.query(`
            CREATE TABLE movie (
                title VARCHAR(255),
                director VARCHAR(255),
                year INT,
                running_time INT,
                box_office DECIMAL);
            `);
		console.log('Table created:', '테이블이 만들어졌습니다!');
	} catch (err) {
		console.log('Error executing query', err.stack);
	}

	// 여기는 영화들 데이터를 포함합니다
	try {
		const res = await pool.query(`
            INSERT INTO movie (title, director, year, running_time, box_office)
            VALUES 
            ('Parasite', 'Bong Joon-ho', 2019, 132, 262.7),
            ('Gladiator', 'Ridley Scott', 2000, 155, 503.1),
            ('The Sixth Sense', 'M. Night Shyamalan', 1999, 108, 672.8),
            ('The Matrix', 'The Wachowskis', 1999, 136, 467.2),
            ('Finding Nemo', 'Andrew Stanton', 2003, 100, 940.3);
        `);
        console.log('Table data added:', '테이블 데이터를 업데이트 했습니다');
	} catch (err) {
		console.log('Error executing query', err.stack);
	}
};

// 제일 영화가 많이 나온 년도
const yearWithMostMovies = async () => {
	try {
		const mostMoviesYear = await pool.query(`
        SELECT year, COUNT(*) 
        FROM movie 
        GROUP BY year 
        ORDER BY COUNT(*) DESC 
        LIMIT 1;
    `);
    console.log("Year with most movies:", mostMoviesYear.rows[0].year);
	}
	catch (err) {
		console.log('Error executing query', err.stack);
	}
};

// 박스오피스 순서로 영화들
const boxOfficeReordering = async () => {
	try {
		const moviesOrderedByBoxOffice = await pool.query(`
        SELECT * FROM movie 
        ORDER BY box_office ASC;
    `);
    console.log("Movies ordered by box office:", moviesOrderedByBoxOffice.rows);
	}
	catch (err) {
		console.log('Error executing query', err.stack);
	}
};


async function main() {
    try {
        await testConnection();
        const tableExists = await checkTableExists();
        console.log(tableExists);
        // tableExists가 true면 실행이 안 됩니다
        if (!tableExists) {
            await setupMovies();
        }
        // Additional function calls, if any
        await yearWithMostMovies();
        await boxOfficeReordering();
    } catch (err) {
        console.error('An error occurred:', err.message);
    } finally {
        pool.end();
    }
}

main();
