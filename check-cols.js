const postgres = require('postgres');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, {
    prepare: false,
    ssl: 'require'
});

async function checkCols() {
    try {
        const res = await sql`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `;
        console.log(res);
    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}

checkCols();
