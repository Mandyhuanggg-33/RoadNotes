type CitySidebarProps = {
    cities?: string[];
  };
  
  export default function CitySidebar({
    cities = ["Seattle", "Portland", "San Francisco"],
  }: CitySidebarProps) {
    return (
      <aside className="h-full rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">My Cities</h2>
          <p className="mt-1 text-sm text-gray-500">
            Cities you’ve added to your road trip journal
          </p>
        </div>
  
        <div className="space-y-3">
          {cities.map((city) => (
            <button
              key={city}
              className="w-full rounded-xl border px-4 py-3 text-left transition hover:bg-gray-50"
            >
              <p className="font-medium">{city}</p>
            </button>
          ))}
        </div>
      </aside>
    );
  }