import { ErrorRequestHandler, NextFunction } from "express";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
});

UserSchema.pre("save", function (this: any, next: NextFunction) {
  if (this.isNew || this.isModified("password")) {
    const document = this;
    bcrypt.hash(
      document.password,
      saltRounds,
      (error: ErrorRequestHandler, hashedPassword: string) => {
        if (error) {
          next(error);
        } else {
          document.password = hashedPassword;
          next();
        }
      }
    );
  } else {
    next();
  }
});

module.exports = mongoose.model("User", UserSchema);
