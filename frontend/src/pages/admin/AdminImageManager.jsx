import { useState } from "react";
import { toast } from "sonner";
import { Camera, Trash2 } from "lucide-react";
import CropModal, { pickImageFile } from "@/components/CropModal";
import { IMAGE_SLOTS } from "@/lib/imageSlots";
import { useSiteImages } from "@/lib/siteImages";

export default function AdminImageManager() {
  const { images, setImage, removeImage } = useSiteImages();
  const [cropSrc, setCropSrc] = useState(null);
  const [target, setTarget] = useState(null);

  async function startUpload(slot) {
    const dataUrl = await pickImageFile();
    if (!dataUrl) return;
    setTarget({ key: slot.key, aspect: slot.aspect });
    setCropSrc(dataUrl);
  }

  async function handleConfirm(dataUrl) {
    try {
      await setImage(target.key, dataUrl);
      toast.success("Image saved.");
    } catch {
      toast.error("Could not save image. It may be too large.");
    } finally {
      setCropSrc(null);
      setTarget(null);
    }
  }

  async function remove(slot) {
    if (!window.confirm(`Remove image for "${slot.label}"?`)) return;
    try {
      await removeImage(slot.key);
      toast.success("Image removed.");
    } catch { toast.error("Could not remove image."); }
  }

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl">Image Manager</h1>
      <p className="text-sm text-stone-500 mb-6">Upload and adjust images used across your website</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {IMAGE_SLOTS.map((slot) => {
          const current = images[slot.key];
          return (
            <div key={slot.key} data-testid={`slot-${slot.key}`} className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-stone-100">
                <h3 className="font-serif text-base leading-tight">{slot.label}</h3>
              </div>
              <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center overflow-hidden">
                {current ? (
                  <img src={current} alt={slot.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-stone-400 text-xs">
                    <Camera className="w-8 h-8 mx-auto mb-1" />
                    No image uploaded
                  </div>
                )}
              </div>
              <div className="p-3 flex items-center gap-2">
                <button
                  data-testid={`upload-${slot.key}`}
                  onClick={() => startUpload(slot)}
                  className="flex-1 px-3 py-2 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white text-xs font-semibold"
                >{current ? "Change Image" : "Upload Image"}</button>
                {current && (
                  <button
                    data-testid={`remove-${slot.key}`}
                    onClick={() => remove(slot)}
                    title="Remove image"
                    className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                  ><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CropModal
        open={!!cropSrc}
        src={cropSrc}
        aspect={target?.aspect || 1}
        onCancel={() => { setCropSrc(null); setTarget(null); }}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
