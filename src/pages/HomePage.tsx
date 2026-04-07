import CitySidebar from "../components/CitySidebar";
import MapView from "../components/MapView";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Roadnotes</h1>
        <p className="mt-2 text-gray-600">
          Your interactive road trip journal
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="h-[600px]">
          <CitySidebar />
        </div>

        <div className="h-[600px]">
          <MapView />
        </div>
      </div>
    </div>
  );
}