// المسار: src/pages/dashboard/store-management/ProductDetailsPage.jsx

import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Tag,
  Layers,
  DollarSign,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";

import { useProducts } from "../../../features/product/hooks/useProducts";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();

  const productId = Number(id);

  const product = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId]
  );

  // لو المنتج مش موجود
  if (!product) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50"
          onClick={() => navigate("/dashboard/store-management")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </Button>

        <Card className="shadow-sm border border-red-100 bg-red-50/60">
          <CardContent className="py-8 text-center space-y-2">
            <p className="text-red-700 font-semibold text-lg">
              Product not found
            </p>
            <p className="text-sm text-red-600">
              The product you are looking for does not exist or has been
              removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stock = product.stock_quantity ?? 0;
  const price = product.price ?? 0;
  const isActive = product.is_active !== false; // لو undefined اعتبره Active

  // حالة المخزون
  let stockLabel = "In stock";
  let stockBadgeClass = "bg-emerald-100 text-emerald-800";

  if (stock === 0) {
    stockLabel = "Out of stock";
    stockBadgeClass = "bg-red-100 text-red-800";
  } else if (stock <= 10) {
    stockLabel = "Low stock";
    stockBadgeClass = "bg-amber-100 text-amber-800";
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const primaryImage =
    images[0] ||
    product.image_url ||
    "/images/products/default-product.png";

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* زر الرجوع */}
      <div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50"
          onClick={() => navigate("/dashboard/store-management")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </Button>
      </div>

      {/* كرت الهيدر / الملخص */}
      <Card className="shadow-sm border border-slate-100 bg-white/90">
        <CardHeader className="py-5">
          <div className="flex flex-col md:flex-row gap-5 md:items-center">
            {/* صورة المنتج */}
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/images/products/default-product.png";
                  }}
                />
              </div>
            </div>

            {/* معلومات أساسية */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  {product.name}
                </CardTitle>

                {product.category && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    <span className="text-xs uppercase tracking-wide">
                      {product.category}
                    </span>
                  </Badge>
                )}

                <Badge
                  className={
                    "flex items-center gap-1 " +
                    (isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-slate-100 text-slate-700 border border-slate-200")
                  }
                >
                  {isActive ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  <span className="text-xs">
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </Badge>
              </div>

              <p className="text-sm text-slate-500 max-w-xl">
                {product.description ||
                  "No description provided for this product."}
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                {/* السعر */}
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1">
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                  <span className="text-sm font-medium text-emerald-800">
                    {price.toFixed(2)}$
                  </span>
                </div>

                {/* المخزون */}
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-3 py-1">
                  <Layers className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">
                    Stock: {stock}
                  </span>
                </div>

                {/* حالة المخزون */}
                <div
                  className={
                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium " +
                    stockBadgeClass
                  }
                >
                  <Package className="w-4 h-4" />
                  <span>{stockLabel}</span>
                </div>
              </div>
            </div>

            {/* زر تعديل سريع */}
            <div className="flex flex-col items-start md:items-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/dashboard/store-management/edit/${product.id}`)
                }
              >
                Edit product
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* كرت تفاصيل المنتج (عرض فقط، بدون فورم) */}
      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <Package className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Product details
              </CardTitle>
              <p className="text-sm text-slate-500">
                Overview of the product information
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* معلومات أساسية */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Basic information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase text-slate-400">Name</p>
                <p className="text-sm font-medium text-slate-900">
                  {product.name}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase text-slate-400">
                  Category
                </p>
                <p className="text-sm text-slate-900">
                  {product.category || "-"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase text-slate-400">
                  Status
                </p>
                <p className="text-sm text-slate-900">
                  {isActive ? "Active" : "Inactive"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase text-slate-400">
                  Stock status
                </p>
                <p className="text-sm text-slate-900">{stockLabel}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs uppercase text-slate-400">
                Description
              </p>
              <p className="text-sm text-slate-900 whitespace-pre-line">
                {product.description || "No description provided."}
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* السعر والمخزون */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Pricing & stock
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase text-slate-400">
                  Price
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {price.toFixed(2)}$
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase text-slate-400">
                  Stock quantity
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {stock}
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* الصور */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Product images
              </h3>
            </div>

            {images.length === 0 ? (
              <p className="text-sm text-slate-500">
                No images uploaded for this product.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((src, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`Product ${index + 1}`}
                      className="w-full h-28 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;
