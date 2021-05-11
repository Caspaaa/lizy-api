import express from "express";
import { NextFunction } from "express";

const jwt = require("jsonwebtoken");

const secret = "supersecretsignature";

const auth = function (
  request: express.Request,
  response: express.Response,
  next: NextFunction
) {
  console.log("auth.ts");
  console.log("request.headers : ", request.headers);

  // let token = "";
  // if (request.headers.authorization) {
  //   token = request.headers.authorization.substring(7);
  // }

  let token;
  if (request.headers.token) {
    token = request.headers.token;
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
