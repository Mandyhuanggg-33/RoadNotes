import { useState } from "react";

type AddCityFormProps = {
  onSave: (name: string) => void | Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
  error?: string;
};

export default function AddCityForm({
  onSave,
  onCancel,
  isSaving = false,
  error = "",
}: AddCityFormProps) {
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) return;

    await onSave(name.trim());
  }

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Add a City</h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter a city name to add it to your journal
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">City Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seattle"
            disabled={isSaving}
            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 disabled:bg-gray-100"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save City"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}