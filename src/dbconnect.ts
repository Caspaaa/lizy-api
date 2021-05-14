const mongoose = require("mongoose");

mongoose.connect(
  `mongodb://${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log(
    mongoose.connection.readyState === 1
      ? "✔️  connected to lizy db"
      : "❌  failed to connect to lizy db"
  );
});
