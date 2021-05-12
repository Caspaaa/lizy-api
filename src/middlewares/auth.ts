import express from "express";
import { NextFunction } from "express";

const jwt = require("jsonwebtoken");

const secret = "supersecretsignature";

const auth = function (
  request: express.Request,
  response: express.Response,
  next: NextFunction
) {
  let token = "";
  console.log(request.headers.authorization);
  if (request.headers.authorization) {
    token = request.headers.authorization.substring(7);
  }

  if (!token) {
    response.status(401).send("Unauthorized: No token provided");

    return;
  }

  jwt.verify(token, secret, function (error: Error, payload: any) {
    if (error) {
      console.log("error", error);

      response.status(401).send("Unauthorized: Invalid token");

      return;
    }

    next();
  });
};

module.exports = auth;
