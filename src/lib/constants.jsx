// src/lib/constants.jsx
import React from "react";

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

import { PiPawPrintLight } from "react-icons/pi";
import { GiSittingDog, GiCat } from "react-icons/gi";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: <HiOutlineViewGrid />,
  },

  {
    key: "pet-management",
    label: "Pet Management",
    icon: <PiPawPrintLight />,
    children: [
      {
        key: "pets-list",
        label: "All Pets",
        path: "/dashboard/pet-management",
        icon: <GiSittingDog />,
      },
      {
        key: "pet-catalog",
        label: "Types & Breeds",
        path: "/dashboard/pet-management/catalog",
        icon: <GiCat />,
      },
    ],
  },

  {
    key: "adoption-center",
    label: "Adoption Center",
    path: "/dashboard/adoption-center",
    icon: <HiOutlineHeart />,
  },

  {
    key: "boarding-management",
    label: "Boarding Management",
    icon: <HiOutlineHome />,
    children: [
      {
        key: "temporary-bookings",
        label: "Temporary Bookings",
        path: "/dashboard/boarding-management/bookings",
      },
      {
        key: "boarding-services",
        label: "Services",
        path: "/dashboard/boarding-management/services",
      },
    ],
  },

  {
    key: "appointments-management",
    label: "Appointments Management",
    path: "/dashboard/appointments-management",
    icon: <HiOutlineBookOpen />,
  },

  {
    key: "medical-records",
    label: "Medical Records",
    path: "/dashboard/medical-records",
    icon: <HiOutlineClipboardList />,
  },

  {
    key: "store-management",
    label: "Store Management",
    icon: <HiOutlineShoppingCart />,
    children: [
      {
        key: "store-products",
        label: "Products",
        path: "/dashboard/store-management/products",
      },
      {
        key: "store-categories",
        label: "Categories",
        path: "/dashboard/store-management/categories",
      },
      {
        key: "orders",
        label: "Orders",
        path: "/dashboard/store-management/orders",
      },
    ],
  },

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
