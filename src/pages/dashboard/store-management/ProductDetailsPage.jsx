// src/pages/dashboard/store-management/ProductDetailsPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Tag,
  DollarSign,
  Layers,
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

import { useGetProductQuery } from "../../../features/product/productApiSlice";

// ---- Helpers ----

const normalizeProduct = (p) => {
  if (!p) return null;

  const stockQty = p.stock_quantity ?? p.stock ?? 0;

  const normalizedImages = Array.isArray(p.images)
    ? p.images.map((img, index) =>
        typeof img === "string"
          ? { url: img, alt: p.name_en || p.name || `Product image ${index + 1}` }
          : { url: img.url, alt: img.alt || p.name_en || p.name || `Product image ${index + 1}` }
      )
    : [];

  return {
    id: p.id,
    name: p.name ?? "",
    name_en: p.name_en ?? "",
    name_ar: p.name_ar ?? "",
    description: p.description ?? "",
    price: p.price ?? "",
    // ✅ backend uses stock_quantity
    stock_quantity: Number(stockQty) || 0,
    is_active: !!p.is_active,
    category: p.category ?? null,
    images: normalizedImages,
  };
};

const DetailRow = ({ label, value, icon }) => (
  <div className="flex items-start justify-between gap-3 py-1.5">
    <div className="flex items-center gap-1.5 text-slate-500">
      {icon}
      <span className="text-[11px] uppercase tracking-wide">{label}</span>
    </div>
    <div className="text-right text-slate-800 text-sm max-w-[60%]">{value || "-"}</div>
  </div>
);

// ---- Component ----

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = Number(id);

  const { data: productResponse, isLoading, isError } = useGetProductQuery(productId, {
    skip: !productId,
  });

  const product = useMemo(() => {
    if (!productResponse) return null;
    // show ممكن يرجع {data: product} أو product مباشرة
    const raw = productResponse.data ?? productResponse;
    return normalizeProduct(raw);
  }, [productResponse]);

  const isInStock = product && Number(product.stock_quantity) > 0;
  const isLowStock = product && Number(product.stock_quantity) > 0 && Number(product.stock_quantity) <= 10;
  const hasImages = product && product.images && product.images.length > 0;

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Card className="shadow-sm border border-slate-100">
          <CardContent className="py-10">
            <p className="text-center text-gray-500">Loading product details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Card className="shadow-sm border border-slate-100">
          <CardContent className="py-10 space-y-4 text-center">
            <p className="text-red-500 font-medium">Failed to load product details.</p>
            <Button variant="outline" onClick={() => navigate("/dashboard/store-management/products")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Card className="shadow-sm border border-slate-100">
          <CardContent className="py-10 space-y-4 text-center">
            <p className="text-lg font-semibold text-slate-900">Product not found</p>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              The product you are trying to view does not exist or may have been removed.
            </p>
            <Button variant="outline" onClick={() => navigate("/dashboard/store-management/products")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50"
          onClick={() => navigate("/dashboard/store-management/products")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Button>
      </div>

      {/* Product info */}
      <Card className="shadow-sm border border-slate-100 bg-white/90">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-indigo-500/15 via-indigo-500/5 to-indigo-500/25 flex items-center justify-center border border-indigo-100 shadow-sm">
              <Package className="w-7 h-7 text-indigo-600" />
            </div>

            <div className="space-y-1.5">
              <CardTitle className="text-2xl font-semibold text-slate-900">
                {product.name_en || product.name}
              </CardTitle>

              {product.name_ar && (
                <p className="text-sm text-slate-500" dir="rtl">
                  {product.name_ar}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-1">
                {product.category && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 border-slate-200 text-slate-700 bg-slate-50 text-[11px]"
                  >
                    <Tag className="w-3 h-3" />
                    <span>
                      {product.category.name_en} / {product.category.name_ar}
                    </span>
                  </Badge>
                )}

                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-emerald-200 text-emerald-700 bg-emerald-50 text-[11px]"
                >
                  <DollarSign className="w-3 h-3" />
                  {product.price} $
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex flex-wrap gap-2 justify-end">
              <Badge
                variant="outline"
                className={`flex items-center gap-1 text-[11px] ${
                  product.is_active
                    ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                    : "border-slate-200 text-slate-600 bg-slate-50"
                }`}
              >
                {product.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {product.is_active ? "Active" : "Inactive"}
              </Badge>

              <Badge
                variant="outline"
                className={`flex items-center gap-1 text-[11px] ${
                  !isInStock
                    ? "border-red-200 text-red-700 bg-red-50"
                    : isLowStock
                    ? "border-amber-200 text-amber-700 bg-amber-50"
                    : "border-blue-200 text-blue-700 bg-blue-50"
                }`}
              >
                {isInStock ? (isLowStock ? <AlertTriangle className="w-3 h-3" /> : <Layers className="w-3 h-3" />) : <XCircle className="w-3 h-3" />}
                {isInStock
                  ? isLowStock
                    ? `Low stock (${product.stock_quantity})`
                    : `In stock (${product.stock_quantity})`
                  : "Out of stock"}
              </Badge>
            </div>

            <div className="text-xs text-slate-500">
              ID: <span className="font-mono text-slate-700">#{product.id}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 border-t border-slate-100">
          <div className="pt-4 space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-indigo-600" />
              <p className="text-sm font-semibold text-slate-900">Product Information</p>
            </div>

            <DetailRow label="Name (EN)" value={product.name_en} />
            <DetailRow label="Name (AR)" value={product.name_ar} />
            <DetailRow
              label="Category"
              value={
                product.category ? `${product.category.name_en} / ${product.category.name_ar}` : "-"
              }
              icon={<Tag className="w-3 h-3 text-slate-400" />}
            />
            <DetailRow label="Price" value={`${product.price} $`} icon={<DollarSign className="w-3 h-3 text-slate-400" />} />
            <DetailRow
              label="Stock"
              value={`${product.stock_quantity} pcs`}
              icon={<Layers className="w-3 h-3 text-slate-400" />}
            />
            <DetailRow label="Status" value={product.is_active ? "Active" : "Inactive"} />
          </div>
        </CardContent>
      </Card>

      {hasImages && (
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-600" />
              <CardTitle className="text-base font-semibold text-slate-900">Product Images</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                >
                  <img
                    src={img.url}
                    alt={img.alt || product.name_en || product.name}
                    className="w-full h-32 md:h-40 object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-semibold text-slate-900">Description</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {product.description ? (
            <p className="text-sm text-slate-700 leading-relaxed">{product.description}</p>
          ) : (
            <p className="text-sm text-slate-400 italic">No description has been provided for this product yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;
