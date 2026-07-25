import { ImagePlus } from "lucide-react";

const AMENITY_OPTIONS = [
  "WiFi",
  "Pool",
  "Breakfast Included",
  "AC",
  "Parking",
  "Restaurant",
  "Spa",
  "Airport Transfer",
];

/**
 * Form used to add or edit a hotel record.
 * Kept as a pure component driven by the `form` prop and callbacks.
 */
export default function HotelForm({
  form,
  setForm,
  editing,
  saving,
  onSave,
  onCancel,
  onPickImage,
}) {
  function toggleAmenity(a) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  }

  return (
    <div className="space-y-4">
      <Field label="Hotel Name" required>
        <input
          data-testid="hotel-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm"
        />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Star Rating" required>
          <select
            data-testid="hotel-stars"
            value={form.stars}
            onChange={(e) => setForm({ ...form, stars: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm bg-white"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} Star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Distance from Park Gate" required>
          <input
            data-testid="hotel-distance"
            value={form.distance}
            onChange={(e) => setForm({ ...form, distance: e.target.value })}
            placeholder="e.g. 1.2 km from gate"
            className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm"
          />
        </Field>
      </div>
      <Field label="Description" required>
        <textarea
          data-testid="hotel-description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm min-h-[80px]"
        />
      </Field>
      <Field label="Amenities">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AMENITY_OPTIONS.map((a) => (
            <label key={a} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
                className="accent-[#C8860A]"
              />
              {a}
            </label>
          ))}
        </div>
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <ImageSlot
          label="Image 1"
          value={form.image1}
          onPick={() => onPickImage("image1")}
          onClear={() => setForm({ ...form, image1: null })}
          testId="hotel-image1"
        />
        <ImageSlot
          label="Image 2"
          value={form.image2}
          onPick={() => onPickImage("image2")}
          onClear={() => setForm({ ...form, image2: null })}
          testId="hotel-image2"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-full bg-white border border-stone-300 text-sm">
          Cancel
        </button>
        <button
          data-testid="hotel-publish"
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white text-sm font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : editing ? "Save Changes" : "Publish Hotel"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium mb-1 block">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

function ImageSlot({ label, value, onPick, onClear, testId }) {
  return (
    <div>
      <span className="text-sm font-medium mb-1 block">{label}</span>
      <div className="aspect-[4/3] bg-stone-100 rounded-lg overflow-hidden border border-stone-200 mb-2 flex items-center justify-center">
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <ImagePlus className="w-8 h-8 text-stone-400" />
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          data-testid={testId}
          onClick={onPick}
          className="px-3 py-1.5 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white text-xs font-semibold"
        >
          {value ? "Change Image" : "Upload Image"}
        </button>
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold"
          >
            Remove Image
          </button>
        )}
      </div>
    </div>
  );
}
