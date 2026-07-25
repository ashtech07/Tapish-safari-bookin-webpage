import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Admin auth token now lives in an httpOnly cookie set by the backend;
// the browser attaches it automatically as long as requests are sent
// with credentials.
export const api = axios.create({ baseURL: API, withCredentials: true });

// A 401 on an /admin/* call means the session cookie is missing or expired.
// Redirect to the login screen instead of letting the rejection bubble up
// unhandled (which crashes the page with a runtime-error overlay in dev).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAdminCall = error.config && error.config.url && error.config.url.startsWith("/admin");
    const onLoginScreen = window.location.pathname === "/admin";
    if (isAdminCall && error.response && error.response.status === 401 && !onLoginScreen) {
      window.location.href = "/admin";
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export const WHATSAPP_NUMBER = "917014404093";
export const WHATSAPP_DISPLAY = "+91 70144 04093";
export const CALL_NUMBER = "+91 70144 04093";
export const EMAIL_ADDRESS = "theranthambhorecurator@gmail.com";
export const OFFICE_ADDRESS = "Flat No - 403, B Block, Riddhi Siddhi Appartment, Ranthambore, Sawai Madhopur, 322001";

export const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
