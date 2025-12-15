
export interface Review {
  id: string;
  author: string;
  avatar: string; // Emoji or specific char
  content: string;
  rating: number;
  date: string;
  type: 'funny' | 'serious' | 'practical' | 'philosophical';
}

export interface Product {
  id: string;
  title: string;
  price?: number; // Price is now optional/internal only
  description: string;
  imageUrl: string; // Kept for backward compatibility (represents the main thumbnail)
  images: string[]; // Array of all product images
  tags: string[];
  // New fields for Sociological Concepts
  sociologyDescription?: string;
  sociologyTags?: string[];
  reviews?: Review[];
  isTreasure?: boolean; // New field for random badge assignment
}

export interface CartItem extends Product {
  quantity: number;
  price: number;
}

export enum ViewMode {
  SHOP = 'SHOP',
  SELLER = 'SELLER',
  COLLECTION = 'COLLECTION',
}