import express from "express";
require("./dbconnect");

const app = express();
const port = 8000;

app.get("/", (request, response) => response.send("Home"));

app.listen(port, () => {
  console.log(`⚡️ [app]: Server is running at http://localhost:${port}`);
});
