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
  address: string[];
  distance: number;
  cuisine: string;
  phone: string;
  price: 1 | 2 | 3 | 4;
  rating: number;
  rating_count: number;
}

interface CuisineCategory {
  alias: string;
  title: string;
}

const formatPriceRange = (priceRange: number) => {
  const newPriceRange = [...Array(priceRange + 1).keys()].slice(1);
  return newPriceRange.join();
};

const getCuisineTypes = (types: CuisineCategory[]) => {
  const cuisines = types.map((type: CuisineCategory) => {
    return type.title;
  });

  return cuisines.join(" - ");
};

const searchRestaurant = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { location, radius, priceRange } = request.body;
    const priceRangeString = formatPriceRange(parseInt(priceRange));
    console.log("priceRange", priceRange);
    console.log("priceRangeString", priceRangeString);
    const rawList: Response = await fetch(
      `https://api.yelp.com/v3/businesses/search?location=${location}&radius=${radius}&price=${priceRangeString}&categories=restaurants`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.YELP_API_KEY}`,
        },
      }
    );

    const responseJSON = await rawList.json();
    // console.log("responseJSON", responseJSON);
    const YelpResults: YelpItem[] = responseJSON.businesses;
    // console.log("YelpResults", YelpResults);

    const restaurants: Restaurant[] = YelpResults.map((place: YelpItem) => {
      return {
        id: place.id,
        image: place.image_url,
        name: place.name,
        address: [
          place.location.address1,
          `${place.location.zip_code} - ${place.location.city}`,
        ],
        distance: place.distance,
        cuisine: getCuisineTypes(place.categories),
        phone: place.display_phone,
        price: place.price,
        rating: place.rating,
        rating_count: place.review_count,
      };
    });
    response.send(restaurants);
  } catch (error) {
    console.error(error);
    alert("Error occured during search");
  }
};

module.exports = { searchRestaurant };
