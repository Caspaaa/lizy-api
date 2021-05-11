import express from "express";
require("./dbconnect");
const loginController = require("./controllers/loginController");

const app = express();
const port = 8000;

app.use(express.urlencoded());
app.use(express.json());

app.get("/", (request, response) => response.send("Home"));

app.post("/api/register", loginController.createUser);

app.listen(port, () => {
  console.log(`⚡️ [app]: Server is running at http://localhost:${port}`);
});
