
export const Category = {
  CAR: 'Car',
  BIKE: 'Bike',
  BICYCLE: 'Bicycle',
  SCOOTER: 'Scooter',
  SKATEBOARD: 'Skateboard'
} as const;

export type Category = typeof Category[keyof typeof Category];

export interface Vehicle {
  id: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  year: number;
  mileage: number;
  engine: string;
  transmission: string;
  color: string;
  condition: 'New' | 'Used';
  location: string;
  description: string;
  images: string[];
  featured: boolean;
}

export interface FilterOptions {
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
}
