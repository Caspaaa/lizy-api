import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = 8000;

app.get("/", (req, res) => res.send("Home"));

app.listen(PORT, () => {
  console.log(`⚡️ [app]: Server is running at http://localhost:${PORT}`);
});
