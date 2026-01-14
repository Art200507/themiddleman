import 'server-only';
import mysql from 'mysql2/promise';

const connectionString = process.env.MYSQL_URL;

const globalForMySQL = globalThis;

// Only create pool if MySQL URL is provided
if (connectionString && !globalForMySQL._mysqlPool) {
  try {
    globalForMySQL._mysqlPool = mysql.createPool(connectionString);
  } catch (error) {
    console.error('Failed to create MySQL pool:', error);
    globalForMySQL._mysqlPool = null;
  }
}

const pool = globalForMySQL._mysqlPool;

export async function execute(sql, params = []) {
  if (!pool) {
    console.warn('MySQL not configured - operation skipped');
    return { affectedRows: 0 };
  }
  const [result] = await pool.execute(sql, params);
  return result;
}

export async function query(sql, params = []) {
  if (!pool) {
    console.warn('MySQL not configured - returning empty results');
    return [];
  }
  const [rows] = await pool.execute(sql, params);
  return rows;
}
