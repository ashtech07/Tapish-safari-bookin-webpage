import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Crops a source image (data URL) to the given pixel area and returns a JPEG data URL
async function getCroppedImg(src, pixelCrop, maxW = 1600) {
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
  const scale = pixelCrop.width > maxW ? maxW / pixelCrop.width : 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(pixelCrop.width * scale);
  canvas.height = Math.round(pixelCrop.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    img,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, canvas.width, canvas.height
  );
  return canvas.toDataURL("image/jpeg", 0.85);
}

export default function CropModal({ open, src, aspect = 1, onCancel, onConfirm, title = "Crop & Adjust" }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setPixels(croppedAreaPixels);
  }, []);

  async function confirm() {
    if (!pixels) return;
    setSaving(true);
    try {
      const dataUrl = await getCroppedImg(src, pixels);
      await onConfirm(dataUrl);
    } finally { setSaving(false); }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-[360px] bg-black rounded-lg overflow-hidden">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="rect"
              showGrid
            />
          )}
        </div>
        <div className="mt-4">
          <label className="text-xs text-stone-500 uppercase tracking-widest block mb-2">Zoom</label>
          <input
            data-testid="crop-zoom"
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-[#C8860A]"
          />
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button data-testid="crop-cancel" onClick={onCancel} className="px-5 py-2.5 rounded-full bg-white border border-stone-300 text-sm">Cancel</button>
          <button data-testid="crop-confirm" onClick={confirm} disabled={saving} className="px-5 py-2.5 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white text-sm font-semibold disabled:opacity-60">
            {saving ? "Saving..." : "Confirm"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper hook-less util: opens device file picker and returns data URL
export function pickImageFile() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    };
    input.click();
  });
}
