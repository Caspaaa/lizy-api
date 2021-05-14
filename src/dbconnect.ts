const mongoose = require("mongoose");

const mongodbURI =
  process.env.DATABASE_HOST === "localhost"
    ? `mongodb://localhost/${process.env.DATABASE_NAME}`
    : `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;

mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log(
    mongoose.connection.readyState === 1
      ? "✔️  connected to lizy db"
      : "❌  failed to connect to lizy db"
  );
});
