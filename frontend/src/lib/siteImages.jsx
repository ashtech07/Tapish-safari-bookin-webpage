import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const Ctx = createContext({ images: {}, setImage: async () => {}, removeImage: async () => {}, refresh: async () => {} });

export function SiteImagesProvider({ children }) {
  const [images, setImages] = useState({});

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/images");
      setImages(data || {});
    } catch {
      setImages({});
    }
    // api is a stable module import; setImages is a stable setter
  }, []);

  useEffect(() => {
    refresh();
    const onPing = () => refresh();
    window.addEventListener("rtc:images-updated", onPing);
    return () => window.removeEventListener("rtc:images-updated", onPing);
  }, [refresh]);

  const setImage = useCallback(async (key, dataUrl) => {
    await api.put(`/admin/images/${key}`, { data_url: dataUrl });
    setImages((prev) => ({ ...prev, [key]: dataUrl }));
    window.dispatchEvent(new Event("rtc:images-updated"));
    // api is a stable module import; setImages is a stable setter
  }, []);

  const removeImage = useCallback(async (key) => {
    await api.delete(`/admin/images/${key}`);
    setImages((prev) => { const c = { ...prev }; delete c[key]; return c; });
    window.dispatchEvent(new Event("rtc:images-updated"));
    // api is a stable module import; setImages is a stable setter
  }, []);

  return <Ctx.Provider value={{ images, setImage, removeImage, refresh }}>{children}</Ctx.Provider>;
}

export function useSiteImage(key, fallback = null) {
  const { images } = useContext(Ctx);
  return images[key] || fallback;
}

export function useSiteImages() {
  return useContext(Ctx);
}
