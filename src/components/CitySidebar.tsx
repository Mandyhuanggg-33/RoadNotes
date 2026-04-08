import type { CityEntry } from "../types/city";

type CitySidebarProps = {
  cities: CityEntry[];
  onAddCity: () => void;
  onDeleteCity: (id: string) => void;
  onFocusCity: (id: string) => void;
  onOpenCity: (id: string) => void;
};

export default function CitySidebar({
  cities,
  onAddCity,
  onDeleteCity,
  onFocusCity,
  onOpenCity,
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
            <div
              key={city.id}
              className="rounded-xl border px-4 py-3 transition hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => onFocusCity(city.id)}
                  className="flex-1 text-left"
                >
                  <p className="font-medium">{city.name}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                  </p>
                </button>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onOpenCity(city.id)}
                    className="rounded-lg border px-3 py-1 text-sm text-blue-600 transition hover:bg-blue-50"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => onDeleteCity(city.id)}
                    className="rounded-lg border px-3 py-1 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}