export interface LoggedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  approved?: number;
  pending?: number;
  rejected?: number;
  saved?: string[];
  visited?: string[];
  reviewed?: string[];
  joinDate: Date;
  profile_pic: string;
  role: string;
  twoFA: {
    enabled: boolean;
    secret?: string;
  }
}

export interface ExplorerProfile {
  firstName: string;
  lastName: string;
  profile_pic: string;
}

export interface Place {
  _id: string; // MongoDB ObjectId as string on frontend
  sub_id: string;
  user_id: string;
  title: string;
  description: string;
  category_id: string; // ID reference to category
  country: string;
  location: string;
  coords: [number, number]; // [longitude, latitude]
  images: string[]; // Array of image URLs
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string;
  phone?: [string, string]; // Optional: [phone_code, phone_number]
  email?: string;
  website?: [string, string];
  facebook?: [string, string];
  instagram?: [string, string];
  tiktok?: [string, string];
  createdAt: string; // Timestamps as ISO strings
  updatedAt: string;
}

export interface Submission {
  _id: string;
  user_id: string;
  sub_id: string;
  title: string;
  description: string;
  category_id: string;
  country: string;
  location: string;
  coords: [number, number];
  images: string[];
  status: "pending" | "approved" | "rejected";
  rejection_reason: string;
  phone: [string, string];
  email: string;
  website: [string, string];
  facebook: [string, string];
  instagram: [string, string];
  tiktok: [string, string];
  createdAt: string;
}

export interface Rating {
  _id: string;
  user_id: string;
  placeId: string;
  rating: number; // Rating value (e.g., 1-5)
  createdAt: string;
}

export interface WhishlistItem {
  _id: string;
  userId: string;
  placeId: string;
  createdAt: string;
}

export interface VisitedItem {
  _id: string;
  userId: string;
  placeId: string;
  createdAt: string;
}