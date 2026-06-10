const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),

  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,

  connectTimeout: 30000,

  ssl: {
    rejectUnauthorized: false,
  },
});


const initDB = async () => {
  let conn;

  try {
    // wait for Railway MySQL to be ready
    await new Promise(resolve => setTimeout(resolve, 5000));

    conn = await pool.getConnection();

    console.log("✅ Database connected");


    // Create admins table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);


    // Create leads table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        source ENUM('Website','LinkedIn','Referral','Email','Other') DEFAULT 'Website',
        status ENUM('New','Contacted','Converted','Lost') DEFAULT 'New',
        notes TEXT,
        follow_up_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP
      )
    `);



    // Create default admin
    const bcrypt = require("bcryptjs");

    const [existing] = await conn.query(
      "SELECT id FROM admins WHERE email = ?",
      [process.env.ADMIN_EMAIL]
    );


    if (existing.length === 0) {

      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
      );


      await conn.query(
        "INSERT INTO admins (name,email,password) VALUES (?,?,?)",
        [
          "Sasi Kumar",
          process.env.ADMIN_EMAIL,
          hashedPassword
        ]
      );


      console.log("✅ Default admin created");
    }


    console.log("✅ Database initialized successfully");


  } catch (err) {

    console.error(
      "❌ Database init error:",
      err.message
    );

    // Don't stop Render deployment
    // Server continues running

  } finally {

    if (conn) {
      conn.release();
    }

  }
};


module.exports = {
  pool,
  initDB
};