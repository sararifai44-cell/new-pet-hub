import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
    credentials: "omit", // ✅ بدل include
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");

      const lang = (navigator.language || "en").toLowerCase();
      headers.set("Accept-Language", lang.startsWith("ar") ? "ar" : "en");

      const token = document.cookie
        .split("; ")
        .find((x) => x.startsWith("token="))
        ?.split("=")[1];

      if (token) headers.set("Authorization", `Bearer ${token}`);

      return headers;
    },
  }),

  tagTypes: ["Pet", "Pets", "PetType", "PetBreed", "AdoptionApplication"],
  endpoints: () => ({}),
});
