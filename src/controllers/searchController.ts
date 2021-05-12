import express from "express";
const fetch = require("node-fetch");

const API_KEY = "AIzaSyCMkBPD84IDhGeDvEyXY4OumcwHROvGJ58";

const searchRestaurant = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { location, radius, priceRange } = request.body;
    const rawList: Request = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&minprice=${priceRange?.min}&maxprice=${priceRange?.max}&type=restaurant&key=${API_KEY}`
    );

    const responseJSON = await rawList.json();

    response.send(responseJSON);
  } catch (error) {
    console.error(error);
    alert("Error occured during search");
  }
};

module.exports = { searchRestaurant };
