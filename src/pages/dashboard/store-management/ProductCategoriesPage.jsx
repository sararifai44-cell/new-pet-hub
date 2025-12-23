// src/pages/dashboard/store-management/ProductCategoriesPage.jsx

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Tag,
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";

import ConfirmDeleteDialog from "../../../components/ui/confirm-delete-dialog";

import {
  useGetProductCategoriesQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} from "../../../features/productCategory/productCategoryApiSlice";

// نحول الريسبونس تبع الـ API لشكل مرتب نستخدمه بالواجهة
const mapCategories = (response) => {
  if (!response) return [];
  const raw = response.data ?? response;
  return raw.map((c) => ({
    id: c.id,
    name: c.name ?? "",
    name_en: c.name_en ?? "",
    name_ar: c.name_ar ?? "",
  }));
};

const ProductCategoriesPage = () => {
  const navigate = useNavigate();

  // calls
  const {
    data: categoriesResponse,
    isLoading,
    isError,
  } = useGetProductCategoriesQuery();

  const [createCategory, { isLoading: isCreating }] =
    useCreateProductCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateProductCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteProductCategoryMutation();

  const categories = useMemo(
    () => mapCategories(categoriesResponse),
    [categoriesResponse]
  );

  // هل واجهة المتصفح عربية؟
  const isArabicUI =
    typeof navigator !== "undefined" &&
    (navigator.language || navigator.userLanguage || "")
      .toLowerCase()
      .startsWith("ar");

  // اسم العرض حسب لغة المتصفح
  const getDisplayName = (cat) => {
    if (!cat) return "";
    if (isArabicUI) {
      return cat.name_ar || cat.name_en || cat.name || "";
    }
    return cat.name_en || cat.name_ar || cat.name || "";
  };

  // فلترة بسيطة
  const [filters, setFilters] = useState({ search: "" });

  const filteredCategories = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    if (!search) return categories;

    return categories.filter((cat) => {
      return (
        (cat.name || "").toLowerCase().includes(search) ||
        (cat.name_en || "").toLowerCase().includes(search) ||
        (cat.name_ar || "").toLowerCase().includes(search)
      );
    });
  }, [categories, filters]);

  // Dialog الإضافة/التعديل
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formValues, setFormValues] = useState({
    name_en: "",
    name_ar: "",
  });

  // Dialog الحذف
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const totalCategories = categories.length;

  // ========= Helpers ==========

  const resetForm = () => {
    setFormValues({
      name_en: "",
      name_ar: "",
    });
    setEditingCategory(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setFormValues({
      name_en: category.name_en || "",
      name_ar: category.name_ar || "",
    });
    setIsFormOpen(true);
  };

  const closeFormDialog = () => {
    if (isCreating || isUpdating) return;
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const trimmedEn = formValues.name_en.trim();
    const trimmedAr = formValues.name_ar.trim();

    if (!trimmedEn && !trimmedAr) {
      alert("يجب ادخال الحقلين");
      return;
    }

    const basePayload = {
      name_en: trimmedEn || null,
      name_ar: trimmedAr || null,
      name: trimmedEn || trimmedAr || "",
    };

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          body: basePayload,
        }).unwrap();
      } else {
        await createCategory(basePayload).unwrap();
      }

      closeFormDialog();
    } catch (error) {
      console.error("Failed to save category:", error);
      if (error?.data?.errors) {
        const firstKey = Object.keys(error.data.errors)[0];
        alert(error.data.errors[firstKey][0]);
      } else {
        alert("Failed to save category. Please try again.");
      }
    }
  };

  const openDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setCategoryToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      closeDeleteDialog();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  const handleFilterChange = (value) => {
    setFilters({ search: value });
  };

  const isSaving = isCreating || isUpdating;

  // ========== حالات التحميل / الخطأ ==========

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardContent className="py-6">
            <p className="text-sm text-slate-500">
              Loading categories...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardContent className="py-6 space-y-3">
            <p className="text-sm text-red-500">
              Failed to load product categories.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Reload page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ========== JSX الرئيسي ==========

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl mx-auto">
      {/* Back button & count */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50"
          onClick={() => navigate("/dashboard/store-management")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500">
          <Tag className="w-4 h-4 text-indigo-500" />
          <span className="font-medium text-slate-800">
            {totalCategories} categories
          </span>
        </div>
      </div>

      {/* Main card */}
      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <Tag className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg font-semibold text-slate-900">
                Product Categories
              </CardTitle>
             
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-4 space-y-4">
          {/* Search + Add */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:gap-3 sm:justify-between">
            <div className="w-full sm:flex-1 sm:min-w-[220px] space-y-1.5">
              <Label className="text-xs font-medium text-slate-500">
                Search
              </Label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="pl-9 h-9 text-xs md:text-sm"
                />
              </div>
            </div>

            <div className="mt-3 sm:mt-0">
              <Button
                onClick={openCreateDialog}
                size="sm"
                className="w-full sm:w-auto flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                {isArabicUI ? "إضافة فئة" : "Add category"}
              </Button>
            </div>
          </div>

          {/* Table */}
          {filteredCategories.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-lg">
              No categories found.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 max-h-[320px] overflow-y-auto">
              <table className="w-full text-xs md:text-sm">
                <colgroup>
                  <col className="w-24" />
                  <col />
                  <col className="w-32 md:w-36" />
                </colgroup>

                <thead className="bg-slate-50/80 text-[11px] md:text-xs uppercase text-slate-500 sticky top-0 z-10">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold whitespace-nowrap">
                      ID
                    </th>
                    {/* الهيدر بالنص */}
                    <th className="text-center px-4 py-2 font-semibold whitespace-nowrap">
                      {isArabicUI ? "الاسم" : "Name"}
                    </th>
                    <th className="text-right px-4 py-2 font-semibold whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-2.5 align-middle text-[11px] md:text-xs text-slate-500 whitespace-nowrap">
                        #{cat.id}
                      </td>

                      {/* حقل الاسم بالنص */}
                      <td className="px-4 py-2.5 align-middle text-center">
                        <span
                          className="font-medium text-slate-900 truncate inline-block max-w-[180px]"
                          dir={isArabicUI ? "rtl" : "ltr"}
                          title={getDisplayName(cat)}
                        >
                          {getDisplayName(cat)}
                        </span>
                      </td>

                      <td className="px-4 py-2.5 align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-indigo-600 hover:bg-indigo-50"
                            onClick={() => openEditDialog(cat)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-600 hover:bg-red-50"
                            onClick={() => openDeleteDialog(cat)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog إضافة / تعديل */}
      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) closeFormDialog();
          else setIsFormOpen(true);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                <Tag className="w-4 h-4 text-indigo-600" />
              </div>
              {editingCategory ? "Edit category" : "Add new category"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmitForm}
            className="space-y-4 mt-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="name_en">Name (English)</Label>
              <Input
                id="name_en"
                name="name_en"
                value={formValues.name_en}
                onChange={handleFormChange}
                placeholder="e.g. Food"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name_ar">الاسم (عربي)</Label>
              <Input
                id="name_ar"
                name="name_ar"
                value={formValues.name_ar}
                onChange={handleFormChange}
                placeholder="مثال: طعام"
                dir="rtl"
                className="h-9 text-sm"
              />
            </div>

            <p className="text-[11px] text-slate-400">
              (يجب ادخال الحقلين)
            </p>

            <DialogFooter className="mt-1">
              <Button
                type="button"
                variant="outline"
                onClick={closeFormDialog}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? editingCategory
                    ? "Saving..."
                    : "Creating..."
                  : editingCategory
                  ? "Save changes"
                  : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog الحذف */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDeleteDialog();
          else setIsDeleteDialogOpen(open);
        }}
        entityLabel="category"
        name={
          categoryToDelete
            ? categoryToDelete.name_en || categoryToDelete.name_ar
            : ""
        }
        isLoading={isDeleting}
        onConfirm={confirmDeleteCategory}
      />
    </div>
  );
};

export default ProductCategoriesPage;
