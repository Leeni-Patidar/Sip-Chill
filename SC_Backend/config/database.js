// const mysql = require('mysql2/promise');

// const dbConfig = {
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '2004',
//   database: process.env.DB_NAME || 'sip_chill_db',
//   port: process.env.DB_PORT || 3307 || 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   connectTimeout: 60000 // ✅ replaces acquireTimeout
// };

// let pool;

// const connectDB = async () => {
//   try {
//     // Create connection pool
//     pool = mysql.createPool(dbConfig);
    
//     // Test the connection
//     const connection = await pool.getConnection();
//     console.log('✅ MySQL database connected successfully');
//     connection.release();
    
//     return pool;
//   } catch (error) {
//     console.error('❌ Database connection failed:', error.message);
//     process.exit(1);
//   }
// };

// const getConnection = () => {
//   if (!pool) {
//     throw new Error('Database not connected. Call connectDB() first.');
//   }
//   return pool;
// };

// const query = async (sql, params = []) => {
//   try {
//     const connection = await getConnection();
//     const [rows] = await connection.execute(sql, params);
//     return rows;
//   } catch (error) {
//     console.error('Database query error:', error);
//     throw error;
//   }
// };

// const transaction = async (callback) => {
//   const connection = await getConnection();
//   try {
//     await connection.beginTransaction();
//     const result = await callback(connection);
//     await connection.commit();
//     return result;
//   } catch (error) {
//     await connection.rollback();
//     throw error;
//   }
// };

// module.exports = {
//   connectDB,
//   getConnection,
//   query,
//   transaction
// };


const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '2004',
  database: process.env.DB_NAME || 'sip_chill_db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // default 3307
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000
};

let pool;

// Initialize pool
const connectDB = async () => {
  try {
    pool = mysql.createPool(dbConfig);

    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    connection.release();

    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Get pool (for simple queries)
const getPool = () => {
  if (!pool) throw new Error('Database not connected. Call connectDB() first.');
  return pool;
};

// Simple query helper
const query = async (sql, params = []) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Transaction helper
const transaction = async (callback) => {
  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection); // Pass connection for execute
    await connection.commit();
    connection.release();
    return result;
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
};

module.exports = {
  connectDB,
  getPool,
  query,
  transaction
};
