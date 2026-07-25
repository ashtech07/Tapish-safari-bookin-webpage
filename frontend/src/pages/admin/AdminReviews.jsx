import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Star, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";

function timeAgo(iso) {
  if (!iso) return "—";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)} hrs ago`;
  return `${Math.floor(diff/86400)} d ago`;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [link, setLink] = useState("");
  const [preview, setPreview] = useState(null);
  const [fetching, setFetching] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/reviews");
      setReviews(data || []);
    } catch {
      toast.error("Could not load reviews.");
    }
    // api is a stable module import; setReviews is a stable setter
  }, []);

  useEffect(() => { load(); }, [load]);

  function startPreview() {
    if (!link.trim()) {
      toast.error("Paste a Google review link first.");
      return;
    }
    setFetching(true);
    // No Places API key available — open an editable preview pre-filled
    // with the source URL. Admin completes name, rating, text and photo.
    setTimeout(() => {
      setPreview({
        name: "",
        rating: 5,
        text: "",
        photo: "",
        source_url: link.trim(),
      });
      setFetching(false);
    }, 400);
  }

  async function confirmPublish() {
    if (!preview.name.trim() || !preview.text.trim()) {
      toast.error("Reviewer name and review text are required.");
      return;
    }
    try {
      await api.post("/admin/reviews", {
        name: preview.name,
        rating: Number(preview.rating) || 5,
        text: preview.text,
        photo: preview.photo || null,
        source_url: preview.source_url || null,
      });
      toast.success("Review published.");
      setPreview(null);
      setLink("");
      load();
    } catch { toast.error("Could not publish review."); }
  }

  async function toggleHidden(r) {
    try {
      await api.patch(`/admin/reviews/${r.id}`, { hidden: !r.hidden });
      load();
    } catch { toast.error("Could not update."); }
  }

  async function remove(r) {
    if (!confirm(`Delete review by ${r.name}?`)) return;
    try {
      await api.delete(`/admin/reviews/${r.id}`);
      toast.success("Review deleted.");
      load();
    } catch { toast.error("Could not delete."); }
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-1 gap-4 flex-wrap">
        <h1 className="font-serif text-3xl">Guest Reviews</h1>
        <span className="text-xs px-3 py-1 rounded-full bg-white border border-stone-200">{reviews.length} reviews total</span>
      </div>
      <p className="text-sm text-stone-500 mb-6">Add Google review links to display in the What Our Guests Say section on the homepage</p>

      {/* Add Review Form */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-8" data-testid="review-add-form">
        <label className="text-sm font-medium block mb-2">Paste Google Review Link</label>
        <div className="flex gap-3 flex-wrap">
          <input
            data-testid="review-link-input"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://maps.google.com/..."
            className="flex-1 min-w-[260px] px-3 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8860A]/40"
          />
          <button
            data-testid="review-fetch-btn"
            onClick={startPreview}
            disabled={fetching}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white text-sm font-semibold disabled:opacity-60"
          >
            {fetching ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Fetch and Add Review
          </button>
        </div>

        {/* Preview card */}
        {preview && (
          <div className="mt-6 bg-stone-50 rounded-xl p-5 border border-stone-200" data-testid="review-preview">
            <p className="text-xs text-stone-500 mb-3">Google does not expose review data without an API key. Fill in the details from the linked review below, then publish.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input data-testid="preview-name" value={preview.name} onChange={(e)=>setPreview({...preview, name: e.target.value})} placeholder="Reviewer Name" className="px-3 py-2.5 rounded-lg border border-stone-300 text-sm" />
              <select data-testid="preview-rating" value={preview.rating} onChange={(e)=>setPreview({...preview, rating: e.target.value})} className="px-3 py-2.5 rounded-lg border border-stone-300 text-sm bg-white">
                {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} star{n>1?"s":""}</option>)}
              </select>
              <input data-testid="preview-photo" value={preview.photo} onChange={(e)=>setPreview({...preview, photo: e.target.value})} placeholder="Photo URL (optional)" className="sm:col-span-2 px-3 py-2.5 rounded-lg border border-stone-300 text-sm" />
              <textarea data-testid="preview-text" value={preview.text} onChange={(e)=>setPreview({...preview, text: e.target.value})} placeholder="Review text" className="sm:col-span-2 px-3 py-2.5 rounded-lg border border-stone-300 text-sm min-h-[100px]" />
            </div>
            {/* Mini preview card */}
            <div className="mt-4 bg-[#1A2B1F] text-white p-5 rounded-xl">
              <div className="flex items-center gap-1 mb-2 text-[#C8860A]">
                {[...Array(Math.max(0, Math.min(5, Number(preview.rating) || 0)))].map((_, j) => <Star key={`preview-star-${j}`} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-white/90 text-sm">“{preview.text || "Your review preview will appear here."}”</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#C8860A] flex items-center justify-center overflow-hidden">
                  {preview.photo ? <img src={preview.photo} alt="" className="w-full h-full object-cover" /> : (preview.name || "G")[0]}
                </div>
                <div className="text-sm font-semibold">{preview.name || "Reviewer Name"}</div>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button data-testid="preview-publish" onClick={confirmPublish} className="px-5 py-2.5 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white text-sm font-semibold">Confirm and Publish</button>
              <button data-testid="preview-cancel" onClick={() => setPreview(null)} className="px-5 py-2.5 rounded-full bg-white border border-stone-300 text-sm">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {reviews.length === 0 ? (
          <div className="py-16 text-center">
            <Star className="w-12 h-12 mx-auto text-stone-300 mb-3" />
            <p className="text-stone-500 text-sm">No reviews added yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-left text-xs text-stone-500 uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3">Reviewer Name</th>
                  <th className="px-4 py-3">Star Rating</th>
                  <th className="px-4 py-3">Review Preview</th>
                  <th className="px-4 py-3">Date Added</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id} className="border-t border-stone-100">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-[#C8860A]">{"★".repeat(Math.max(0, Math.min(5, Number(r.rating) || 0)))}</td>
                    <td className="px-4 py-3 max-w-md">{(r.text || "").slice(0, 50)}{(r.text || "").length > 50 ? "…" : ""}</td>
                    <td className="px-4 py-3 text-stone-500">{timeAgo(r.created_at)}</td>
                    <td className="px-4 py-3">
                      {r.hidden ? (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-stone-100 text-stone-700">Hidden</span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-green-100 text-green-800">Published</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button data-testid={`review-toggle-${r.id}`} onClick={() => toggleHidden(r)} className="p-1.5 rounded-md bg-stone-100 text-stone-700 hover:bg-stone-200" title={r.hidden ? "Show" : "Hide"}>
                          {r.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button data-testid={`review-delete-${r.id}`} onClick={() => remove(r)} className="p-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
