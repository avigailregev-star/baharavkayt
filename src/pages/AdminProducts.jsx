import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Search, Plus, Trash2, Pencil } from "lucide-react";

const categories = [
  "סלטים",
  "לחמים",
  "פחמימות (פסטה / מוקפץ / מוקרם / קישים)",
  "במילוי (כריכים / טורטיות / פריקסה / קרואסונים מלוח)",
  "ליד הלחם (שקשוקה / מטבלים)",
  "תוספות בסטייל (גלילות חציל / אנטיפסטי / דג סלמון / פלטת ירקות / פלטת גבינות)",
  "מרקים",
  "קינוחים (קינוחי כוסות / מגוון)",
  "עוגיות",
  "פינוקים (פנקייק / בלינצ'ס)",
  "מגשי פירות",
  "ארוחה זוגית",
  "חגים",
  "יין עם תמונה והקדשה אישית"
];

export default function AdminProducts() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await base44.auth.me();
      if (!currentUser) {
        window.location.href = "/admin-login";
        return;
      }
      setUser(currentUser);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list(),
    enabled: !!user
  });

  const createProductMutation = useMutation({
    mutationFn: (data) => base44.entities.Product.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsCreating(false);
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Product.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedProduct(null);
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  const uncategorizedProducts = products.filter(p => {
    const categories = Array.isArray(p.category) ? p.category : (p.category ? [p.category] : []);
    return categories.includes("ללא קטגוריה") || categories.length === 0;
  });
  
  const categorizedProducts = products.filter(p => {
    const categories = Array.isArray(p.category) ? p.category : (p.category ? [p.category] : []);
    return !categories.includes("ללא קטגוריה") && categories.length > 0;
  });

  const filteredProducts = searchTerm
    ? categorizedProducts.filter(p => {
        const categories = Array.isArray(p.category) ? p.category : (p.category ? [p.category] : []);
        return p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               categories.some(cat => cat && cat.toLowerCase().includes(searchTerm.toLowerCase()));
      })
    : categorizedProducts;

  const handleSaveProduct = (data) => {
    if (selectedProduct) {
      updateProductMutation.mutate({ id: selectedProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">ניהול מוצרים</h1>
          <p className="text-slate-600">ערוך וניהל את רשימת המוצרים</p>
        </div>

        {/* Uncategorized Warning */}
        {uncategorizedProducts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex gap-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">
                {uncategorizedProducts.length} מוצר ללא קטגוריה
              </h3>
              <p className="text-sm text-red-800">
                המוצרים הבאים צריכים תיקון קטגוריה:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {uncategorizedProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="bg-white text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-50 transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="חיפוש לפי שם או קטגוריה..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 rounded-xl"
              />
            </div>
            <Button
              onClick={() => {
                setSelectedProduct(null);
                setIsCreating(true);
              }}
              className="bg-amber-500 hover:bg-amber-600 rounded-xl h-12"
            >
              <Plus className="w-4 h-4 ml-2" />
              מוצר חדש
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {productsLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500">לא נמצאו מוצרים</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-right font-semibold">שם המוצר</TableHead>
                  <TableHead className="text-right font-semibold">קטגוריה</TableHead>
                  <TableHead className="text-right font-semibold">מחיר</TableHead>
                  <TableHead className="text-right font-semibold">סטטוס</TableHead>
                  <TableHead className="text-right font-semibold">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-sm">
                      {Array.isArray(product.category) 
                        ? product.category.join(", ") 
                        : (product.category || "ללא קטגוריה")}
                    </TableCell>
                    <TableCell>₪{product.price}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={product.active ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-700 border-slate-200"}
                      >
                        {product.active ? "פעיל" : "לא פעיל"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProductMutation.mutate(product.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Product Sheet */}
      <Sheet open={!!selectedProduct || isCreating} onOpenChange={() => {
        setSelectedProduct(null);
        setIsCreating(false);
      }}>
        <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto">
          {(selectedProduct || isCreating) && (
            <ProductForm
              key={selectedProduct?.id || 'new'}
              product={selectedProduct}
              onSave={handleSaveProduct}
              isLoading={createProductMutation.isPending || updateProductMutation.isPending}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ProductForm({ product, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: [],
    category: ["סלטים"],
    active: true
  });

  useEffect(() => {
    if (product) {
      const category = Array.isArray(product.category) 
        ? product.category 
        : product.category 
          ? [product.category] 
          : [];
      
      setFormData({
        ...product,
        category,
        image: Array.isArray(product.image) ? product.image : product.image ? [product.image] : []
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        image: [],
        category: ["סלטים"],
        active: true
      });
    }
  }, [product]);

  return (
    <>
      <SheetHeader className="mb-6">
        <SheetTitle className="text-2xl">
          {product ? "עריכת מוצר" : "מוצר חדש"}
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <Label className="text-slate-700 font-medium mb-2 block">
            שם המוצר *
          </Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="שם המוצר"
            className="h-12 rounded-xl"
          />
        </div>

        {/* Description */}
        <div>
          <Label className="text-slate-700 font-medium mb-2 block">
            תיאור
          </Label>
          <Textarea
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="תיאור קצר של המוצר"
            rows={3}
            className="rounded-xl resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <Label className="text-slate-700 font-medium mb-2 block">
            מחיר *
          </Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            placeholder="0"
            className="h-12 rounded-xl"
          />
        </div>

        {/* Category */}
        <div>
          <Label className="text-slate-700 font-medium mb-2 block">
            קטגוריות *
          </Label>
          <div className="space-y-2 border border-slate-200 rounded-xl p-4 max-h-64 overflow-y-auto">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={Array.isArray(formData.category) && formData.category.includes(cat)}
                  onChange={(e) => {
                    const currentCategories = Array.isArray(formData.category) ? formData.category : [formData.category];
                    if (e.target.checked) {
                      setFormData({ ...formData, category: [...currentCategories, cat] });
                    } else {
                      setFormData({ ...formData, category: currentCategories.filter(c => c !== cat) });
                    }
                  }}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                />
                <span className="text-sm text-slate-700">{cat}</span>
              </label>
            ))}
            <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg">
              <input
                type="checkbox"
                checked={Array.isArray(formData.category) && formData.category.includes("ללא קטגוריה")}
                onChange={(e) => {
                  const currentCategories = Array.isArray(formData.category) ? formData.category : [formData.category];
                  if (e.target.checked) {
                    setFormData({ ...formData, category: [...currentCategories, "ללא קטגוריה"] });
                  } else {
                    setFormData({ ...formData, category: currentCategories.filter(c => c !== "ללא קטגוריה") });
                  }
                }}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
              />
              <span className="text-sm text-slate-700">ללא קטגוריה</span>
            </label>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <Label className="text-slate-700 font-medium mb-2 block">
            קישורים לתמונות (אחד בכל שורה)
          </Label>
          <Textarea
            value={Array.isArray(formData.image) ? formData.image.join("\n") : formData.image || ""}
            onChange={(e) => {
              const urls = e.target.value.split("\n").map(url => url.trim()).filter(url => url);
              setFormData({ ...formData, image: urls });
            }}
            placeholder="https://..."
            rows={3}
            className="rounded-xl resize-none"
          />
        </div>

        {/* Active */}
        <div>
          <Label className="text-slate-700 font-medium mb-2 block">
            סטטוס
          </Label>
          <Select
            value={formData.active ? "active" : "inactive"}
            onValueChange={(value) => setFormData({ ...formData, active: value === "active" })}
          >
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">פעיל</SelectItem>
              <SelectItem value="inactive">לא פעיל</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        <Button
          onClick={() => onSave(formData)}
          disabled={isLoading || !formData.name || !formData.price || !Array.isArray(formData.category) || formData.category.length === 0}
          className="w-full h-12 bg-amber-500 hover:bg-amber-600 rounded-xl"
        >
          {isLoading ? "שומר..." : "שמור"}
        </Button>
      </div>
    </>
  );
}