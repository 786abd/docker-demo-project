const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// DB connection (will be used later with Docker)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rootpassword",
  database: process.env.DB_NAME || "demodb"
});

const connectWithRetry = () => {
db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err.message);
    setTimeout(connectWithRetry, 5000);
  } else {
    console.log("Connected to MySQL");
  }
});
};

connectWithRetry();

app.get("/", (req, res) => {
  res.send("Backend service running, let's go!");
});

app.get("/users", (req, res) => {
  db.query("SELECT NOW() as time", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on port ${PORT}`);
});
