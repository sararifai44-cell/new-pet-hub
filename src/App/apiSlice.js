// src/app/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/", // عدّل حسب سيرفرك
    prepareHeaders: (headers) => {
      const token = Cookies.get("token"); // غيّر الاسم إذا كوكي غير

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),
  tagTypes: ["PetType", "Pet", "User", "PetBreed", "Product"],
  endpoints: () => ({}), // مهم تكون فاضية، الباقي بالـ injectEndpoints
});
