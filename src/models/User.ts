require("./dbconnect");

const UserSchema = new mongoose.Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
