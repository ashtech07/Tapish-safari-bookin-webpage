import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CropModal, { pickImageFile } from "@/components/CropModal";
import HotelForm from "@/components/admin/HotelForm";
import HotelTable from "@/components/admin/HotelTable";
import { useHotels } from "@/lib/hotelsStore";

const EMPTY = {
  name: "",
  stars: 5,
  distance: "",
  description: "",
  amenities: [],
  image1: null,
  image2: null,
};

export default function AdminHotels() {
  const { hotels, addHotel, updateHotel, removeHotel } = useHotels();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [cropTarget, setCropTarget] = useState(null);

  function startNew() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }

  function startEdit(h) {
    setEditing(h);
    setForm({ ...EMPTY, ...h, amenities: h.amenities || [] });
    setOpen(true);
  }

  async function pickAndCrop(target) {
    const dataUrl = await pickImageFile();
    if (!dataUrl) return;
    setCropTarget(target);
    setCropSrc(dataUrl);
  }

  function handleCropConfirm(dataUrl) {
    setForm((f) => ({ ...f, [cropTarget]: dataUrl }));
    setCropSrc(null);
    setCropTarget(null);
  }

  async function save() {
    if (!form.name.trim() || !form.distance.trim() || !form.description.trim()) {
      toast.error("Name, distance and description are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        stars: Number(form.stars) || 5,
        distance: form.distance,
        description: form.description,
        amenities: form.amenities,
        image1: form.image1 || null,
        image2: form.image2 || null,
      };
      if (editing) {
        await updateHotel(editing.id, payload);
        toast.success("Hotel updated.");
      } else {
        await addHotel(payload);
        toast.success("Hotel published.");
      }
      setOpen(false);
    } catch {
      toast.error("Could not save hotel.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(h) {
    if (!window.confirm(`Delete ${h.name}?`)) return;
    try {
      await removeHotel(h.id);
      toast.success("Hotel deleted.");
    } catch {
      toast.error("Could not delete hotel.");
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-1 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl">Hotel Manager</h1>
          <p className="text-sm text-stone-500">
            Add and manage hotels shown on the Hotels page of your website
          </p>
        </div>
        <button
          data-testid="add-hotel-btn"
          onClick={startNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Add New Hotel
        </button>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <HotelTable hotels={hotels} onEdit={startEdit} onDelete={remove} />
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && setOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editing ? "Edit Hotel" : "Add New Hotel"}
            </DialogTitle>
          </DialogHeader>
          <HotelForm
            form={form}
            setForm={setForm}
            editing={editing}
            saving={saving}
            onSave={save}
            onCancel={() => setOpen(false)}
            onPickImage={pickAndCrop}
          />
        </DialogContent>
      </Dialog>

      <CropModal
        open={!!cropSrc}
        src={cropSrc}
        aspect={4 / 3}
        onCancel={() => {
          setCropSrc(null);
          setCropTarget(null);
        }}
        onConfirm={handleCropConfirm}
      />
    </div>
  );
}
