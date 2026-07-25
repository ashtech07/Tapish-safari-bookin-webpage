import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SEED_HOTELS } from "@/lib/seedDefaults";

const EVENT = "rtc:hotels-updated";

export function useHotels() {
  const [hotels, setHotels] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/hotels");
      // Fall back to the seeded snapshot only when the database has no
      // hotels at all (e.g. a fresh deploy before the Admin Panel has been
      // used). Once at least one hotel exists in the database, it always
      // wins over the hardcoded defaults.
      setHotels(data && data.length > 0 ? data : SEED_HOTELS);
    } catch {
      setHotels(SEED_HOTELS);
    }
    // api and SEED_HOTELS are stable module imports; setHotels is a stable setter
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, [refresh]);

  const addHotel = useCallback(async (h) => {
    const { data } = await api.post("/admin/hotels", h);
    setHotels((prev) => [data, ...prev]);
    window.dispatchEvent(new Event(EVENT));
    return data;
  }, []);

  const updateHotel = useCallback(async (id, patch) => {
    await api.patch(`/admin/hotels/${id}`, patch);
    setHotels((prev) => prev.map((x) => x.id === id ? { ...x, ...patch } : x));
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const removeHotel = useCallback(async (id) => {
    await api.delete(`/admin/hotels/${id}`);
    setHotels((prev) => prev.filter((x) => x.id !== id));
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { hotels, addHotel, updateHotel, removeHotel, refresh };
}
