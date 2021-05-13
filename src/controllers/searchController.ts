import express from "express";
const fetch = require("node-fetch");
interface YelpItemCategory {
  alias: string;
  title: string;
}

interface YelpItemLocation {
  address1: string;
  address2: string;
  address3: string;
  city: string;
  zip_code: string;
  country: string;
  state: string;
  display_address: string[];
}

interface YelpItem {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  is_closed: boolean;
  url: string;
  review_count: number;
  categories: YelpItemCategory[];
  rating: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  transactions: number[];
  price: 1 | 2 | 3 | 4;
  location: YelpItemLocation;
  phone: string;
  display_phone: string;
  distance: number;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  price: 1 | 2 | 3 | 4;
  rating: number;
}

const API_KEY =
  "97b5akL3lvThOYmARof1rgblT34LgYN0rrVe3Gea-MOWieZCzHmR8xfQ33-Jk4-usDC1LshPiiGCckpOrOXc2Urdd2stOxDXRzKqxuaNyZ1CBkn4o9H6nYyU6gWdYHYx";

const formatPriceRange = (priceRange: number[]) => {
  if (priceRange.length === 0) {
    return "1,2,3,4";
  }
  return priceRange.sort().toString();
};

const searchRestaurant = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { location, radius, priceRange } = request.body;
    const priceRangeString = formatPriceRange(priceRange);

    const rawList: Response = await fetch(
      `https://api.yelp.com/v3/businesses/search?location=${location}&radius=${radius}&price=${priceRangeString}&categories=restaurants`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const responseJSON = await rawList.json();
    console.log("responseJSON", responseJSON);
    const YelpResults: YelpItem[] = responseJSON.businesses;
    console.log("YelpResults", YelpResults);

    const restaurants: Restaurant[] = YelpResults.map((place: YelpItem) => {
      return {
        id: place.id,
        name: place.name,
        address: place.location.display_address[0],
        cuisine: place.categories[0].alias,
        price: place.price,
        rating: place.rating,
      };
    });

    response.send(restaurants);
  } catch (error) {
    console.error(error);
    alert("Error occured during search");
  }
};

module.exports = { searchRestaurant };
