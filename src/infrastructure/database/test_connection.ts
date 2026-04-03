// src/infrastructure/database/test-connection.ts
import { pool } from "./pg-pool.js";

async function testConnection(): Promise<void> {
    try {
        const result = await pool.query("SELECT NOW() as current_time");
        console.log("✅ Conexión exitosa:", result.rows[0].current_time);
    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await pool.end();
    }
}

testConnection();