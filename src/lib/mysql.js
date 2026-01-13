import 'server-only';
import mysql from 'mysql2/promise';

const connectionString = process.env.MYSQL_URL;

if (!connectionString) {
  throw new Error('MYSQL_URL is not set');
}

const globalForMySQL = globalThis;

if (!globalForMySQL._mysqlPool) {
  globalForMySQL._mysqlPool = mysql.createPool(connectionString);
}

const pool = globalForMySQL._mysqlPool;

export async function execute(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
