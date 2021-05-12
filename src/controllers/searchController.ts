import express from "express";
import { REPL_MODE_STRICT } from "repl";
const fetch = require("node-fetch");

const API_KEY = "AIzaSyCMkBPD84IDhGeDvEyXY4OumcwHROvGJ58";

const searchRestaurant = (
  request: express.Request,
  response: express.Response
) => {
  const { location, radius, priceRange } = request.body;

  const rawList: Request = fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&minprice=${priceRange.min}&maxprice=${priceRange.max}&type=restaurant&key=${API_KEY}`
  )
    .then((response: Response) => response.json())
    .then((data: any) => {
      response.send(data);

      return data;
    })
    .catch(function (error: Error) {
      console.log(error);
    });

  console.log("this is rawList : ", rawList);
};

module.exports = { searchRestaurant };
