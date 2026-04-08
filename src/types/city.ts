export type CityEntry = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  notes: string;
  images: string[];
  createdAt: string;

  tripTitle?: string;
  visitDate?: string;
  mood?: string;
  tags?: string[];
  highlight?: string;
};