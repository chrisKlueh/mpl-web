export const API_URL =
  process.env.NODE_ENV === "production"
    ? `${window.location.origin}/api/`
    : "http://192.168.2.115:8000/api/";
