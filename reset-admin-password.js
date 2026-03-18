const postgres = require('postgres');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, {
    prepare: false,
    ssl: 'require'
});

async function resetPassword() {
    try {
        const newPassword = 'admin123';
        const hashed = await bcrypt.hash(newPassword, 10);
        console.log('New hashed password:', hashed);

        await sql`UPDATE users SET password = ${hashed} WHERE email = 'admin@dienggo.com'`;
        console.log('Password updated successfully!');
        console.log('Email: admin@dienggo.com');
        console.log('Password: admin123');

        // Verify
        const result = await sql`SELECT email, role, password FROM users WHERE email = 'admin@dienggo.com'`;
        console.log('User in DB:', { email: result[0].email, role: result[0].role });

        // Test bcrypt comparison
        const match = await bcrypt.compare(newPassword, result[0].password);
        console.log('Password match test:', match);
    } catch (err) {
        console.error('Failed:', err);
    } finally {
        await sql.end();
    }
}

resetPassword();
