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
