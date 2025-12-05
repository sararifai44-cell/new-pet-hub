// المسار: src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Login from "./pages/Login.jsx";

import PetListPage from "./pages/dashboard/pet-management/PetListPage.jsx";
import AddPetPage from "./pages/dashboard/pet-management/AddPetPage.jsx";
import EditPetPage from "./pages/dashboard/pet-management/EditPetPage.jsx";
import PetTypesBreedsPage from "./pages/dashboard/pet-management/PetTypesBreedsPage.jsx";
import PetDetailsPage from "./pages/dashboard/pet-management/PetDetailsPage";

import ProductsPage from "./pages/dashboard/store-management/ProductsPage";
import EditProductPage from "./pages/dashboard/store-management/EditProductPage";
import ProductDetailsPage from "./pages/dashboard/store-management/ProductDetailsPage";
import AddProductPage from "./pages/dashboard/store-management/AddProductPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* صفحة تسجيل الدخول */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* لوحة التحكم */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* الصفحة الرئيسية للداشبورد */}
          <Route index element={<Dashboard />} />

          {/* إدارة الحيوانات */}
          <Route
            path="pet-management/catalog"
            element={<PetTypesBreedsPage />}
          />
          <Route path="pet-management" element={<PetListPage />} />
          <Route path="pet-management/add" element={<AddPetPage />} />
          <Route path="pet-management/edit/:id" element={<EditPetPage />} />
          <Route path="pet-management/:id" element={<PetDetailsPage />} />

          {/* إدارة المتجر / المنتجات */}
          <Route path="store-management" element={<ProductsPage />} />
          <Route path="store-management/add" element={<AddProductPage />} />
          <Route path="store-management/edit/:id" element={<EditProductPage />} />
          <Route path="store-management/:id" element={<ProductDetailsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
