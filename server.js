const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "Kavya@321", 
  database: "user_management", // Database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    process.exit(1);
  } else {
    console.log("Connected to MySQL database");
  }
});

app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).send("Error fetching users");
    } else {
      res.json(results);
    }
  });
});

// Create a new user
app.post("/users", (req, res) => {
  const { name, email, dob } = req.body;
  const query = "INSERT INTO users (name, email, dob) VALUES (?, ?, ?)";
  db.query(query, [name, email, dob], (err, result) => {
    if (err) {
      console.error("Error creating user:", err);
      res.status(500).send("Error creating user");
    } else {
      res.status(201).send("User created successfully");
    }
  });
});

// Update a user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, dob } = req.body;
  const query = "UPDATE users SET name = ?, email = ?, dob = ? WHERE id = ?";
  db.query(query, [name, email, dob, id], (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      res.status(500).send("Error updating user");
    } else if (result.affectedRows === 0) {
      res.status(404).send("User not found");
    } else {
      res.send("User updated successfully");
    }
  });
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(500).send("Error deleting user");
    } else if (result.affectedRows === 0) {
      res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully");
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
