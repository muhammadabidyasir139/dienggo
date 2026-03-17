import postgres from 'postgres';

const queryClient = postgres('postgresql://postgres:-%3C%7D0%3Fzr5%7CgvzFxR_@104.197.224.119:5432/dienggo?sslmode=require');

async function main() {
    try {
        console.log('--- Database Verification ---');
        const dbName = await queryClient`SELECT current_database();`;
        console.log('Database Name:', dbName[0].current_database);

        const tables = await queryClient`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';`;
        console.log('Tables in public schema:', tables.map(t => t.tablename));

        if (tables.some(t => t.tablename === 'users')) {
            const adminUser = await queryClient`SELECT email, role FROM users LIMIT 1;`;
            console.log('Found user in "users" table:', adminUser[0]);
        } else {
            console.log('CRITICAL: "users" table not found!');
        }

    } catch (e) {
        console.error('Connection Error:', e);
    } finally {
        await queryClient.end();
    }
}
main();
