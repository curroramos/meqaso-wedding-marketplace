// User interface for the frontend
export interface User {
    id?: string; // MongoDB ObjectId
    name: string;
    email: string;
    password?: string; // Optional because Google users may not have it
    userType: 'client' | 'provider';
    profilePicture?: string | null;
    googleId?: string | null; // Optional for non-Google users
  
    // Provider-specific fields
    bio?: string | null;
    categories?: string[]; // Example: ['DJ', 'Band', 'Catering']
    website?: string | null; // Optional personal site link
    socialLinks?: {
      facebook?: string | null;
      instagram?: string | null;
      twitter?: string | null;
    };
    location?: string | null; // City or region
    hourlyRate?: number | null; // Example: $50/hour
  
    // Gallery or portfolio
    gallery?: string[]; // URLs to images or videos showcasing work
  
    // Timestamps
    createdAt?: string;
    updatedAt?: string;
  }
  