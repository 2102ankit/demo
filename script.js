const { Client } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const connectionString = process.env.DBURL;
console.log(process.env);

const client = new Client({
  connectionString: connectionString,
});

// Connect to the database when the server starts
client
  .connect()
  .catch((err) => console.error("Error connecting to the database:", err));

app.post("/query", async (req, res) => {
  const { query } = req.body;

  try {
    const result = await client.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query:", err);
    res
      .status(500)
      .json({ error: "An error occurred while executing the query" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Gracefully close the database connection when the server shuts down
process.on("SIGINT", async () => {
  await client.end();
  process.exit();
});
