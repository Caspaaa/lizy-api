import express from "express";
import fetch from "node-fetch";
import { totalmem } from "os";

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
  cuisine: string[];
  phone: string;
  price: 1 | 2 | 3 | 4;
  rating: number;
  rating_count: number;
  score: number;
}

interface CuisineCategory {
  alias: string;
  title: string;
}

interface Participant {
  name: string;
  isChecked: boolean;
}

const formatPriceRange = (priceRange: number) => {
  const newPriceRange = [...Array(priceRange + 1).keys()].slice(1);
  return newPriceRange.join();
};

const getCuisineTypes = (types: CuisineCategory[]) => {
  return types.map((type: CuisineCategory) => type.title);
};

interface Preference {
  [name: string]: string[];
}

const preferences: Preference = {
  Gilles: ["Italian", "Lebanese", "Japanese", "Belgian"],
  Vince: ["Italian", "Japanese", "Lebanese"],
  Sam: ["Belgian"],
  Klaas: ["Japanese", "Belgian"],
  Gaelle: ["Japanese", "Lebanese"],
};

export const currentPreferences = (participants: Participant[]): string[][] => {
  return participants
    .filter((item) => item.isChecked)
    .map((user) => {
      return preferences[user.name];
    });
};

interface PreferenceRatio {
  [cuisine: string]: number;
}

export const currentPreferencesWithRatio = (
  currentPreferences: string[][]
): PreferenceRatio[] => {
  return currentPreferences.map((arrayOfPreferences) => {
    return arrayOfPreferences
      .reverse()
      .reduce((languageSet: PreferenceRatio, language: string) => {
        languageSet[language] =
          (arrayOfPreferences.indexOf(language) + 1) /
          arrayOfPreferences.length;
        return languageSet;
      }, {});
  });
};

export const currentPreferencesWithRatioTotal = (
  currentPreferencesWithRatio: PreferenceRatio[]
): PreferenceRatio => {
  const preferencesWithRatioTotal: PreferenceRatio = {};
  currentPreferencesWithRatio.forEach((arrayOfPrefs) => {
    Object.keys(arrayOfPrefs).forEach((language) => {
      preferencesWithRatioTotal[language] =
        (preferencesWithRatioTotal[language] || 0) + arrayOfPrefs[language];
    });
  });
  return preferencesWithRatioTotal;
};

const getCurrentPreferences = (participants: Participant[]) => {
  const preferences = currentPreferences(participants);
  const preferencesWithRatio = currentPreferencesWithRatio(preferences);

  return currentPreferencesWithRatioTotal(preferencesWithRatio);
};

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
