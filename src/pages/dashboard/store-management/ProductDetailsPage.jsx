import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Tag,
  DollarSign,
  Layers,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

import { useGetProductQuery } from "../../../features/product/productApiSlice";

const normalizeProduct = (p) => {
  if (!p) return null;

  const stockQty = p.stock_quantity ?? p.stock ?? 0;

  let normalizedImages = Array.isArray(p.images)
    ? p.images
        .map((img, index) =>
          typeof img === "string"
            ? { url: img, alt: p.name_en || p.name || `Product image ${index + 1}` }
            : img?.url
              ? { url: img.url, alt: p.name_en || p.name || `Product image ${index + 1}` }
              : null
        )
        .filter(Boolean)
    : [];

  if (normalizedImages.length === 0 && p.cover_image) {
    normalizedImages = [{ url: p.cover_image, alt: p.name_en || p.name || "Cover" }];
  }

  return {
    id: p.id,
    name: p.name ?? "",
    name_en: p.name_en ?? "",
    name_ar: p.name_ar ?? "",
    description: p.description ?? null,
    price: p.price ?? "",
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

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = Number(id);

  const { data: productResponse, isLoading, isError } = useGetProductQuery(productId, {
    skip: !productId,
  });

  const product = useMemo(() => {
    const raw = productResponse?.data ?? productResponse;
    return normalizeProduct(raw);
  }, [productResponse]);

  const hasImages = product?.images?.length > 0;

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

      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-slate-700" />
              <CardTitle className="text-lg font-semibold text-slate-900">
                {product.name_en || product.name || "Product"}
              </CardTitle>
            </div>

            {product.is_active ? (
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="text-slate-500">
                Inactive
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="space-y-2">
            <DetailRow
              label="Category"
              value={
                product.category ? `${product.category.name_en || product.category.name || ""}` : "-"
              }
              icon={<Tag className="w-3 h-3 text-slate-400" />}
            />
            <DetailRow
              label="Price"
              value={`${product.price} $`}
              icon={<DollarSign className="w-3 h-3 text-slate-400" />}
            />
            <DetailRow
              label="Stock"
              value={`${product.stock_quantity} pcs`}
              icon={<Layers className="w-3 h-3 text-slate-400" />}
            />
          </div>
        </CardContent>
      </Card>

      {hasImages && (
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-600" />
              <CardTitle className="text-base font-semibold text-slate-900">
                Product Images
              </CardTitle>
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
          <CardTitle className="text-base font-semibold text-slate-900">
            Description
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {product.description ? (
            <p className="text-sm text-slate-700 leading-relaxed">{product.description}</p>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <AlertTriangle className="w-4 h-4" />
              <p className="text-sm italic">No description has been provided for this product yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;
