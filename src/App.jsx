// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Login from "./pages/Login.jsx";

// Pet management
import PetListPage from "./pages/dashboard/pet-management/PetListPage.jsx";
import AddPetPage from "./pages/dashboard/pet-management/AddPetPage.jsx";
import EditPetPage from "./pages/dashboard/pet-management/EditPetPage.jsx";
import PetTypesBreedsPage from "./pages/dashboard/pet-management/PetTypesBreedsPage.jsx";
import PetDetailsPage from "./pages/dashboard/pet-management/PetDetailsPage.jsx";
import PetAdoptionApplicationsPage from "./pages/dashboard/pet-management/PetAdoptionApplicationsPage.jsx";

// ✅ Boarding Management pages
import TemporaryBookingsPage from "./pages/dashboard/boarding-management/TemporaryBookingsPage.jsx";
import BoardingServicesPage from "./pages/dashboard/boarding-management/BoardingServicesPage.jsx";
import BoardingReservationDetailsPage from "./pages/dashboard/boarding-management/BoardingReservationDetailsPage.jsx";

// Store management
import ProductCategoriesPage from "./pages/dashboard/store-management/ProductCategoriesPage.jsx";
import ProductListPage from "./pages/dashboard/store-management/ProductListPage.jsx";
import AddProductPage from "./pages/dashboard/store-management/AddProductPage.jsx";
import EditProductPage from "./pages/dashboard/store-management/EditProductPage.jsx";
import ProductDetailsPage from "./pages/dashboard/store-management/ProductDetailsPage.jsx";

// Orders
import OrdersListPage from "./pages/dashboard/store-management/OrdersListPage.jsx";
import OrderDetailsPage from "./pages/dashboard/store-management/OrderDetailsPage.jsx";

// Adoption Center
import AdoptionApplicationsListPage from "./pages/dashboard/adoption-center/AdoptionApplicationsListPage.jsx";
import AdoptionApplicationDetailsPage from "./pages/dashboard/adoption-center/AdoptionApplicationDetailsPage.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />

            {/* Pet Management */}
            <Route path="pet-management" element={<PetListPage />} />
            <Route path="pet-management/add" element={<AddPetPage />} />
            <Route path="pet-management/edit/:id" element={<EditPetPage />} />
            <Route path="pet-management/catalog" element={<PetTypesBreedsPage />} />
            <Route
              path="pet-management/:id/applications"
              element={<PetAdoptionApplicationsPage />}
            />
            <Route path="pet-management/:id" element={<PetDetailsPage />} />

            {/*  Boarding Management */}
            <Route
              path="boarding-management"
              element={<Navigate to="bookings" replace />}
            />
            <Route path="boarding-management/bookings" element={<TemporaryBookingsPage />} />

            {/*  تفاصيل الحجز */}
            <Route
              path="boarding-management/bookings/:id"
              element={<BoardingReservationDetailsPage />}
            />

            <Route path="boarding-management/services" element={<BoardingServicesPage />} />

            {/* Store Management */}
            <Route path="store-management/categories" element={<ProductCategoriesPage />} />
            <Route path="store-management/products" element={<ProductListPage />} />
            <Route path="store-management/products/add" element={<AddProductPage />} />
            <Route path="store-management/products/edit/:id" element={<EditProductPage />} />
            <Route path="store-management/products/:id" element={<ProductDetailsPage />} />

            {/* Orders */}
            <Route path="store-management/orders" element={<OrdersListPage />} />
            <Route path="store-management/orders/:id" element={<OrderDetailsPage />} />

            {/* Adoption Center */}
            <Route path="adoption-center" element={<AdoptionApplicationsListPage />} />
            <Route path="adoption-center/:id" element={<AdoptionApplicationDetailsPage />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>

      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
