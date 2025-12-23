import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/",
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");

      // language: من المتصفح أو لو بدك من localStorage
      const lang =
        localStorage.getItem("lang") ||
        (navigator.language?.toLowerCase().startsWith("ar") ? "ar" : "en");

      headers.set("Accept", "application/json");
      headers.set("Accept-Language", lang);

      if (token) headers.set("Authorization", `Bearer ${token}`);

      // ملاحظة: خليها بس لطلبات JSON (إذا عندك upload لاحقاً بنشيلها هناك)
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),
  tagTypes: ["PetType", "Pet", "User", "PetBreed", "Product"],
  endpoints: () => ({}),
});
