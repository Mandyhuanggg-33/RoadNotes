import type { CityEntry } from "../types/city";

type CitySidebarProps = {
  cities: CityEntry[];
  onAddCity: () => void;
};

export default function CitySidebar({
  cities,
  onAddCity,
}: CitySidebarProps) {
  return (
    <aside className="h-full rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">My Cities</h2>
          <p className="mt-1 text-sm text-gray-500">
            Cities you’ve added to your road trip journal
          </p>
        </div>

        <button
          onClick={onAddCity}
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          Add City
        </button>
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
          </button>
          ))}
        </div>
      )}
    </aside>
  );
}