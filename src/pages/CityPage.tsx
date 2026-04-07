import { useParams } from "react-router-dom";

export default function CityPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">City Journal</h1>
      <p className="mt-2 text-gray-600">City ID: {id}</p>

      <div className="mt-8 rounded-2xl border p-6">
        <p className="text-lg font-medium">City Detail Page</p>
        <p className="mt-2 text-gray-500">
          Later this page will let users write notes and upload images.
        </p>
      </div>
    </div>
  );
}