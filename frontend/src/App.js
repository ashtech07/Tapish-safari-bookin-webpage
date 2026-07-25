import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SiteImagesProvider } from "@/lib/siteImages";

import Home from "@/pages/Home";
import SafariBooking from "@/pages/SafariBooking";
import Hotels from "@/pages/Hotels";
import Packages from "@/pages/Packages";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminInquiries from "@/pages/admin/AdminInquiries";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminImageManager from "@/pages/admin/AdminImageManager";
import AdminHotels from "@/pages/admin/AdminHotels";
import AdminLiveFeed from "@/pages/admin/AdminLiveFeed";

function App() {
  return (
    <div className="App">
      <SiteImagesProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/safari-booking" element={<SafariBooking />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/overview" element={<AdminOverview />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/inquiries" element={<AdminInquiries />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/image-manager" element={<AdminImageManager />} />
            <Route path="/admin/hotels" element={<AdminHotels />} />
            <Route path="/admin/live-feed" element={<AdminLiveFeed />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </SiteImagesProvider>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
