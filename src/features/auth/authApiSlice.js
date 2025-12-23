// src/features/auth/authApiSlice.js
import { apiSlice } from "../../App/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/login
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data, // { email, password }
      }),
    }),

    // POST /api/register
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),

    // POST /api/verify-email
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/verify-email",
        method: "POST",
        body: data, // { code }
      }),
    }),

    // POST /api/email/resend-verification
    resendVerification: builder.mutation({
      query: () => ({
        url: "/email/resend-verification",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = authApiSlice;
