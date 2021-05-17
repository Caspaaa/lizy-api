import express from "express";
import fetch from "node-fetch";
import {
  getCurrentPreferences,
  getCuisineTypes,
} from "../functions/preferences";
import { formatPriceRange } from "../functions/price";

export const searchRestaurant = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { location, radius, priceRange, participants } = request.body;
    const priceRangeString = formatPriceRange(parseInt(priceRange));

    const orderByParticipantsPreferences = (restaurants: Restaurant[]) => {
      const prefsTotal = getCurrentPreferences(participants);

      restaurants.map((restaurant) => {
        Object.keys(prefsTotal).forEach((cuisine) => {
          if (restaurant.cuisine.includes(cuisine)) {
            restaurant.score = prefsTotal[cuisine];
          }
        });
      });

      return restaurants.sort((a, b) => {
        if (a.score === b.score) {
          return a.distance - b.distance;
        }
        return b.score - a.score;
      });
    };

    const rawList = await fetch(
      `https://api.yelp.com/v3/businesses/search?location=${location}&radius=${radius}&price=${priceRangeString}&categories=restaurants`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.YELP_API_KEY}`,
        },
      }
    );

    const responseJSON = await rawList.json();
    const YelpResults: YelpItem[] = responseJSON.businesses;

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
        score: 0,
      };
    });
    orderByParticipantsPreferences(restaurants);
    response.send(restaurants);
  } catch (error) {
    console.error(error);
    alert("Error occured during search");
  }
};
