const postgres = require('postgres');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, {
    prepare: false,
    ssl: 'require'
});

async function check() {
    try {
        const result = await sql`SELECT * FROM users`;
        console.log('Users:', result);
    } catch (err) {
        console.error('Check failed:', err);
    } finally {
        await sql.end();
    }
}

check();
