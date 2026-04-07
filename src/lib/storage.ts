import type { CityEntry } from "../types/city";

const STORAGE_KEY = "roadnotes-cities";

export function getCities(): CityEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCities(cities: CityEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

export function addCity(city: CityEntry) {
  const cities = getCities();
  saveCities([...cities, city]);
}

export function updateCity(updatedCity: CityEntry) {
  const cities = getCities().map((city) =>
    city.id === updatedCity.id ? updatedCity : city
  );
  saveCities(cities);
}

export function deleteCity(id: string) {
  const cities = getCities().filter((city) => city.id !== id);
  saveCities(cities);
}

export function getCityById(id: string) {
  return getCities().find((city) => city.id === id) || null;
}