import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { supabase } from "@/api/supabaseClient";
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
import { AlertCircle, Search, Plus, Trash2, Pencil, Upload, X } from "lucide-react";
import { toast } from "sonner";

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
      toast.success("המוצר נוסף בהצלחה");
    },
    onError: (error) => toast.error(error.message || "לא הצלחנו להוסיף את המוצר")
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Product.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedProduct(null);
      toast.success("המוצר עודכן בהצלחה");
    },
    onError: (error) => toast.error(error.message || "לא הצלחנו לעדכן את המוצר")
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("המוצר נמחק");
    },
    onError: (error) => toast.error(error.message || "לא הצלחנו למחוק את המוצר")
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
                          onClick={() => {
                            if (window.confirm(`למחוק את "${product.name}"?`)) {
                              deleteProductMutation.mutate(product.id);
                            }
                          }}
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
              categoryOptions={Array.from(new Set([
                ...categories,
                ...products.flatMap((p) => Array.isArray(p.category) ? p.category : [p.category]).filter(Boolean)
              ]))}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ProductForm({ product, onSave, isLoading, categoryOptions }) {
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: [],
    category: "סלטים",
    active: true
  });

  useEffect(() => {
    if (product) {
      const category = Array.isArray(product.category)
        ? product.category[0] || ""
        : product.category || "";
      
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
        category: "סלטים",
        active: true
      });
    }
  }, [product]);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) throw new Error("ניתן להעלות קובצי תמונה בלבד");
        if (file.size > 8 * 1024 * 1024) throw new Error("גודל תמונה מרבי הוא 8MB");

        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${crypto.randomUUID()}.${extension}`;
        const { error } = await supabase.storage
          .from("product-images")
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (error) throw error;

        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        uploadedUrls.push(data.publicUrl);
      }
      setFormData((current) => ({
        ...current,
        image: [...(Array.isArray(current.image) ? current.image : []), ...uploadedUrls]
      }));
      toast.success(`נוספו ${uploadedUrls.length} תמונות`);
    } catch (error) {
      toast.error(error.message || "העלאת התמונה נכשלה");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

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
            קטגוריה *
          </Label>
          <Select
            value={categoryOptions.includes(formData.category) ? formData.category : "custom"}
            onValueChange={(value) => setFormData({
              ...formData,
              category: value === "custom" ? "" : value
            })}
          >
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="בחרי קטגוריה" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
              <SelectItem value="custom">+ קטגוריה חדשה</SelectItem>
            </SelectContent>
          </Select>
          {!categoryOptions.includes(formData.category) && (
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="שם הקטגוריה החדשה"
              className="h-12 rounded-xl mt-3"
            />
          )}
        </div>

        {/* Images */}
        <div>
          <Label className="text-slate-700 font-medium mb-2 block">
            תמונות
          </Label>
          <label className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 text-amber-700 cursor-pointer hover:bg-amber-100 transition-colors">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? "מעלה תמונות..." : "בחרי תמונות מהמחשב"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={isUploading}
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {formData.image.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {formData.image.map((url, index) => (
                <div key={`${url}-${index}`} className="relative rounded-xl overflow-hidden border bg-slate-50 aspect-square">
                  <img src={url} alt={`תמונת מוצר ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      image: formData.image.filter((_, imageIndex) => imageIndex !== index)
                    })}
                    className="absolute top-2 left-2 rounded-full bg-white/90 p-1.5 text-red-600 shadow hover:bg-white"
                    aria-label="הסרת תמונה"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
          disabled={isLoading || isUploading || !formData.name || !formData.price || !formData.category.trim()}
          className="w-full h-12 bg-amber-500 hover:bg-amber-600 rounded-xl"
        >
          {isLoading ? "שומר..." : "שמור"}
        </Button>
      </div>
    </>
  );
}
