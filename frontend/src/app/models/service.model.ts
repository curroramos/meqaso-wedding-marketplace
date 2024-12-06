export interface Service {
  id?: string; // MongoDB ObjectId
  provider: string; // Reference to the provider's ID
  title: string;
  description: string;
  category: string;
  price: number;
  location: {
    type: 'Point'; // Fixed to 'Point' for geospatial data
    coordinates: [number, number]; // Longitude, Latitude
  };
  radius?: number; // Availability radius in kilometers
  rating?: number; // Average rating
  reviewCount?: number; // Number of reviews
  photoUrl?: string | null; // URL for service photo
  createdAt?: string; // Timestamps for creation
  updatedAt?: string; // Timestamps for last update
}
