import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCityById, updateCity } from "../lib/storage";
import type { CityEntry } from "../types/city";

export default function CityPage() {
  const { id } = useParams();
  const [city, setCity] = useState<CityEntry | null>(null);
  const [notes, setNotes] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const foundCity = getCityById(id);
    if (foundCity) {
      setCity(foundCity);
      setNotes(foundCity.notes || "");
    }
  }, [id]);

  function handleSaveNotes() {
    if (!city) return;

    const updatedCity: CityEntry = {
      ...city,
      notes,
    };

    updateCity(updatedCity);
    setCity(updatedCity);
    setSavedMessage("Saved!");

    setTimeout(() => {
      setSavedMessage("");
    }, 2000);
  }

  if (!city) {
    return (
      <div className="min-h-screen p-6">
        <h1 className="text-3xl font-bold">City not found</h1>
        <p className="mt-2 text-gray-600">
          We couldn’t find this city record.
        </p>
        <Link to="/" className="mt-4 inline-block text-blue-600 underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/" className="text-sm text-blue-600 underline">
        ← Back to map
      </Link>

      <div className="mt-4 rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">{city.name}</h1>
        <p className="mt-2 text-gray-500">
          {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
        </p>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Travel Notes
          </label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your travel story here..."
            className="min-h-[250px] w-full rounded-2xl border p-4 outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSaveNotes}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Save Notes
          </button>

          {savedMessage && (
            <p className="text-sm text-green-600">{savedMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}