import express from "express";
import { SchemaDefinition } from "mongoose";

const User = require("../models/User");

const createUser = (request: express.Request, response: express.Response) => {
  const { login, password } = request.body;
  const user = new User({ login, password });

  user.save((error: Error, newUser: SchemaDefinition) => {
    if (error) {
      console.error(error);
      response
        .status(500)
        .send("Error adding the user. (Might already exists.)");
    } else {
      response.status(201).send(newUser);
    }
  });
};

module.exports = { createUser };
