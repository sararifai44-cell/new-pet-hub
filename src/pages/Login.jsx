// src/pages/Login.jsx
import React, { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Schema الفاليديشن
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  remember: z.boolean().optional(),
});

const Login = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState(""); // خطأ عام من السيرفر مثلاً

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data) => {
    setFormError("");

    // لو عندك API حقيقي، حطي النداء هون
    console.log("Submitting login data:", data);

    // مبدئياً نعتبره ناجح ونروح عالداشبورد
    // لاحقاً تستبدلي هالكود بنداء Laravel + تخزين توكن
    try {
      // await axios.post("/api/login", data);
      navigate("/dashboard");
    } catch (err) {
      // مثال لخطأ من السيرفر
      setFormError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10 md:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back! <span className="text-4xl">🐾</span>
          </h2>
          <p className="text-gray-500 mt-2">Admin Sign In</p>
        </div>

        {/* خطأ عام (من السيرفر مثلاً) */}
        {formError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="mb-6">
            <label
              className="block text-md font-medium text-gray-700 mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="email"
                id="email"
                {...register("email")}
                className={`w-full border rounded-lg py-4 px-12 text-md bg-gray-50 focus:outline-none focus:ring-2 transition ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-cyan-500"
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              className="block text-md font-medium text-gray-700 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="password"
                id="password"
                {...register("password")}
                className={`w-full border rounded-lg py-4 px-12 text-md bg-gray-50 focus:outline-none focus:ring-2 transition ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-cyan-500"
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                {...register("remember")}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-md text-gray-700"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-md font-semibold text-cyan-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-600 text-white font-bold py-4 text-lg rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      <div className="text-center text-gray-500 mt-8">
        Don&apos;t have an account?
        <button
          type="button"
          className="font-semibold text-cyan-600 hover:underline ml-1"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default Login;
