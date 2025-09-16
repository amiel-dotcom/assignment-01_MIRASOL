import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());  

let storedUsers = [];

async function loadUsers(count = 1000) {
  const response = await fetch(`https://randomuser.me/api/?results=${count}`);
  const data = await response.json();
  storedUsers = data.results;
}

app.get("/api", (req, res) => {
  let results = parseInt(req.query.results) || 1;
  if (results <= 0) results = 1;
  if (results > storedUsers.length) results = storedUsers.length;
  res.json({ results: storedUsers.slice(0, results) });
});

app.listen(PORT, async () => {
  await loadUsers(1000);
  console.log(`🚀 API running at http://localhost:${PORT}/api`);
});
