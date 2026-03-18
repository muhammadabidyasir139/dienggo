const postgres = require('postgres');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
console.log('DB URL starts with:', connectionString?.substring(0, 50));

const sql = postgres(connectionString, {
    prepare: false,
    ssl: 'require'
});

async function testLogin() {
    const email = 'admin@dienggo.com';
    const password = 'admin123';

    try {
        // Simulate exactly what auth.ts does
        const result = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
        const user = result[0];

        if (!user) {
            console.log('ERROR: User not found!');
            return;
        }
        console.log('User found:', { id: user.id, email: user.email, role: user.role });
        console.log('Has password:', !!user.password);

        if (!user.password) {
            console.log('ERROR: No password stored!');
            return;
        }

        const match = await bcrypt.compare(password, user.password);
        console.log('Password match:', match);

        if (match) {
            console.log('✅ Login SHOULD succeed! Credentials are correct.');
        } else {
            console.log('❌ Password mismatch - need to reset again');
        }
    } catch (err) {
        console.error('DB Error:', err.message);
    } finally {
        await sql.end();
    }
}

testLogin();
