const postgres = require('postgres');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, {
    prepare: false,
    ssl: 'require'
});

async function seed() {
    try {
        const email = "admin@dienggo.com";
        const password = "admin123";
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log("Inserting user...");
        await sql`
            INSERT INTO users (email, password, name, role)
            VALUES (${email}, ${hashedPassword}, 'Administrator', 'admin')
            ON CONFLICT (email) DO NOTHING
        `;
        
        console.log("-----------------------------------");
        console.log("Admin user created successfully!");
        console.log("Email: " + email);
        console.log("Password: " + password);
        console.log("-----------------------------------");
    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        await sql.end();
    }
}

seed();
