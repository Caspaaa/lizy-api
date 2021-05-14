require("dotenv").config();
import express from "express";
require("./dbconnect");
const cors = require("cors");

const loginController = require("./controllers/loginController");
const searchController = require("./controllers/searchController");
const auth = require("./middlewares/auth");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

app.get("/", (request, response) => response.send("Home"));

app.post("/api/register", loginController.createUser);

app.post("/api/getToken", loginController.getToken);

app.get("/api/authenticate", auth, function (request, response) {
  response.sendStatus(200);
});

app.post("/api/search", searchController.searchRestaurant);

app.listen(port, () => {
  console.log(`⚡️ [app]: Server is running at http://localhost:${port}`);
});
