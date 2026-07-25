import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Admin auth token now lives in an httpOnly cookie set by the backend;
// the browser attaches it automatically as long as requests are sent
// with credentials.
export const api = axios.create({ baseURL: API, withCredentials: true });

export const WHATSAPP_NUMBER = "917014404093";
export const WHATSAPP_DISPLAY = "+91 70144 04093";
export const CALL_NUMBER = "+91 70144 04093";
export const EMAIL_ADDRESS = "theranthambhorecurator@gmail.com";
export const OFFICE_ADDRESS = "Flat No - 403, B Block, Riddhi Siddhi Appartment, Ranthambore, Sawai Madhopur, 322001";

export const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
