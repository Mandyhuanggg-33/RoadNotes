import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCityById, updateCity, deleteCity } from "../lib/storage";
import type { CityEntry } from "../types/city";

export default function CityPage() {
  const { id } = useParams();
  const [city, setCity] = useState<CityEntry | null>(null);
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const foundCity = getCityById(id);
    if (foundCity) {
      setCity(foundCity);
      setNotes(foundCity.notes || "");
      setImages(foundCity.images || []);
    }
  }, [id]);

  function handleSaveJournal() {
    if (!city) return;

    const updatedCity: CityEntry = {
      ...city,
      notes,
      images,
    };

    updateCity(updatedCity);
    setCity(updatedCity);
    setSavedMessage("Saved!");

    setTimeout(() => {
      setSavedMessage("");
    }, 2000);
  }

  function handleDeleteImage(indexToDelete: number) {
    setImages((prev) => prev.filter((_, index) => index !== indexToDelete));
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileReaders = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    Promise.all(fileReaders)
      .then((newImages) => {
        setImages((prev) => [...prev, ...newImages]);
      })
      .catch((error) => {
        console.error("Error reading images:", error);
      });

    event.target.value = "";
  }

  function handleDeleteCity() {
    if (!city) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${city.name}?`
    );

    if (!confirmed) return;

    deleteCity(city.id);
    window.location.href = "/";
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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{city.name}</h1>
            <p className="mt-2 text-gray-500">
              {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
            </p>
          </div>

          <button
            onClick={handleDeleteCity}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete City
          </button>
        </div>

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

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Travel Photos
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-600"
          />

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="rounded-2xl border bg-white p-2 shadow-sm"
                >
                  <img
                    src={image}
                    alt={`Travel upload ${index + 1}`}
                    className="h-40 w-full rounded-xl object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSaveJournal}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Save Journal
          </button>

          {savedMessage && (
            <p className="text-sm text-green-600">{savedMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}