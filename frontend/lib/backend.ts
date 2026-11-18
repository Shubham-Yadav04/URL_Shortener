const configuredBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const BACKEND_URL = configuredBackendUrl.replace(/\/+$/, "");
