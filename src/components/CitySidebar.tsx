import type { CityEntry } from "../types/city";

type CitySidebarProps = {
  cities: CityEntry[];
};

export default function CitySidebar({ cities }: CitySidebarProps) {
  return (
    <aside className="h-full rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">My Cities</h2>
        <p className="mt-1 text-sm text-gray-500">
          Cities you’ve added to your road trip journal
        </p>
      </div>

      {cities.length === 0 ? (
        <div className="rounded-xl border border-dashed p-4 text-sm text-gray-500">
          No cities yet. Your added cities will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {cities.map((city) => (
            <button
              key={city.id}
              className="w-full rounded-xl border px-4 py-3 text-left transition hover:bg-gray-50"
            >
              <p className="font-medium">{city.name}</p>
              <p className="mt-1 text-sm text-gray-500">
                {city.lat.toFixed(2)}, {city.lng.toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}