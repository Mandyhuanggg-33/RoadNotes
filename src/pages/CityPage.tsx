import { useParams, Link } from "react-router-dom";
import { getCityById } from "../lib/storage";

export default function CityPage() {
  const { id } = useParams();
  const city = id ? getCityById(id) : null;

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

        <div className="mt-6 rounded-xl border border-dashed p-6 text-gray-500">
          This is where your city journal will go.
        </div>
      </div>
    </div>
  );
}