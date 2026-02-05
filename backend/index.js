const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "app_user",
  password: process.env.DB_PASSWORD || "app_password",
  database: process.env.DB_NAME || "demodb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection once (non-fatal)
pool.query("SELECT 1", err => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL");
  }
});


// DB connection (will be used later with Docker)
// const db = mysql.createConnection({
//   host: process.env.DB_HOST || "db",
//   user: process.env.DB_USER || "app_user",
//   password: process.env.DB_PASSWORD || "app_password",
//   database: process.env.DB_NAME || "demodb"
// });

// setInterval(() => {
//   const start = Date.now();
//   while (Date.now() - start < 1000) {} // busy loop

//   console.log("CPU spike simulated");
// }, 100);

// setTimeout(() => {
//   console.error("CPU overload - exiting");
//   process.exit(1);
// }, 10000);

// let arr = [];
// setInterval(() => {
//   arr.push(Buffer.alloc(10 * 1024 * 1024)); // 10MB
//   console.log("Allocating memory");
// }, 500);


app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Backend service running, let's go!");
});

app.get("/users", (req, res) => {
  pool.query("SELECT NOW() as time", (err, result) => {
    if (err) {
      console.error("Query failed:", err.message);
      return res.status(500).send("DB query failed");
    }
    res.json(result);
  });
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on port ${PORT}`);
});
