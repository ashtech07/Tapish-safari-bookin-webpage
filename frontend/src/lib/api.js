import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

// Admin auth: read PIN token from sessionStorage and inject as header
api.interceptors.request.use((cfg) => {
  const token = sessionStorage.getItem("rtc_admin_token");
  if (token && cfg.url && cfg.url.startsWith("/admin")) {
    cfg.headers = cfg.headers || {};
    cfg.headers["X-Admin-Pin"] = token;
  }
  return cfg;
});

export const WHATSAPP_NUMBER = "917014404093";
export const WHATSAPP_DISPLAY = "+91 70144 04093";
export const CALL_NUMBER = "+91 70144 04093";
export const EMAIL_ADDRESS = "theranthambhorecurator@gmail.com";
export const OFFICE_ADDRESS = "Flat No - 403, B Block, Riddhi Siddhi Appartment, Ranthambore, Sawai Madhopur, 322001";

export const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
