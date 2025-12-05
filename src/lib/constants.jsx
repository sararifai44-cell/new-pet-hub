// src/lib/constants.jsx
import React from "react";

// من HeroIcons (عامة)
import {
  HiOutlineViewGrid,
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineClipboardList,
  HiOutlineUserGroup,
} from "react-icons/hi";

// أيقونات حيوانات/بصمات
import { PiPawPrintLight } from "react-icons/pi";
import { GiSittingDog, GiCat } from "react-icons/gi";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: <HiOutlineViewGrid />,
  },

  // 🐾 مجموعة إدارة الحيوانات
  {
    key: "pet-management",
    label: "Pet Management",
    icon: <PiPawPrintLight />, // بصمة حيوان كأيقونة رئيسية
    children: [
      {
        key: "pets-list",
        label: "All Pets",
        path: "/dashboard/pet-management",
        icon: <GiSittingDog />, // كلب لطيف لقائمة الحيوانات
      },
      {
        key: "pet-catalog",
        label: "Types & Breeds",
        path: "/dashboard/pet-management/catalog",
        icon: <GiCat />, // قطة لأنواع/سلالات
      },
    ],
  },

  // 💛 مركز التبني – قلب (يمشي مع الفكرة)
  {
    key: "adoption-center",
    label: "Adoption Center",
    path: "/dashboard/adoption-center",
    icon: <HiOutlineHeart />,
  },

  // 🏠 إقامة / Boarding
  {
    key: "boarding-management",
    label: "Boarding Management",
    path: "/dashboard/boarding-management",
    icon: <HiOutlineHome />,
  },

  // 📅 مواعيد
  {
    key: "appointments-management",
    label: "Appointments Management",
    path: "/dashboard/appointments-management",
    icon: <HiOutlineBookOpen />,
  },

  // 🩺 السجلات الطبية
  {
    key: "medical-records",
    label: "Medical Records",
    path: "/dashboard/medical-records",
    icon: <HiOutlineClipboardList />,
  },

  // 🛒 المتجر
  {
    key: "store-management",
    label: "Store Management",
    path: "/dashboard/store-management",
    icon: <HiOutlineShoppingCart />,
  },

  // 👤 إدارة المستخدمين
  {
    key: "user-management",
    label: "User Management",
    path: "/dashboard/user-management",
    icon: <HiOutlineUserGroup />,
  },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: "settings",
    label: "Settings",
    path: "/dashboard/settings",
    icon: <HiOutlineCog />,
  },
  {
    key: "support",
    label: "Help & Support",
    path: "/dashboard/support",
    icon: <HiOutlineQuestionMarkCircle />,
  },
];
