import { useEffect, useState } from "react";
import CitySidebar from "../components/CitySidebar";
import MapView from "../components/MapView";
import AddCityForm from "../components/AddCityForm";
import { addCity, deleteCity, getCities } from "../lib/storage";
import { geocodeCity, reverseGeocodeCity } from "../lib/geocoding";
import type { CityEntry } from "../types/city";

export default function HomePage() {
  const [cities, setCities] = useState<CityEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setCities(getCities());
  }, []);

  function refreshCities() {
    setCities(getCities());
  }

  async function handleSaveCity(name: string) {
    try {
      setIsSaving(true);
      setFormError("");

      const result = await geocodeCity(name);

      const newCity: CityEntry = {
        id: crypto.randomUUID(),
        name: result.name,
        lat: result.lat,
        lng: result.lng,
        notes: "",
        images: [],
        createdAt: new Date().toISOString(),
      };

      addCity(newCity);
      refreshCities();
      setShowForm(false);
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Something went wrong.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMapAddCity(lat: number, lng: number) {
    try {
      const result = await reverseGeocodeCity(lat, lng);

      const alreadyExists = cities.some(
        (city) => city.name.toLowerCase() === result.name.toLowerCase()
      );

      if (alreadyExists) {
        return;
      }

      const newCity: CityEntry = {
        id: crypto.randomUUID(),
        name: result.name,
        lat: result.lat,
        lng: result.lng,
        notes: "",
        images: [],
        createdAt: new Date().toISOString(),
      };

      addCity(newCity);
      refreshCities();
    } catch (error) {
      console.error(error);
    }
  }

  function handleDeleteCity(id: string) {
    deleteCity(id);
    refreshCities();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Roadnotes</h1>
        <p className="mt-2 text-gray-600">
          Your interactive road trip journal
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <div className="h-[600px]">
            <CitySidebar
              cities={cities}
              onAddCity={() => {
                setShowForm((prev) => !prev);
                setFormError("");
              }}
              onDeleteCity={handleDeleteCity}
            />
          </div>

          {showForm && (
            <AddCityForm
              onSave={handleSaveCity}
              onCancel={() => {
                setShowForm(false);
                setFormError("");
              }}
              isSaving={isSaving}
              error={formError}
            />
          )}
        </div>

        <div className="h-[600px]">
          <MapView cities={cities} onMapClick={handleMapAddCity} />
        </div>
      </div>
    </div>
  );
}