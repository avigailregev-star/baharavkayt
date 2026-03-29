import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartContext";
import { toast } from "sonner";
import ProductCard from "@/components/products/ProductCard";

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

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("כל הקטגוריות");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.filter({ active: true })
  });

  const handleClearFilters = () => {
    setSelectedCategory("כל הקטגוריות");
    setSearchTerm("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter((product) => {
    const categories = Array.isArray(product.category) ? product.category : [product.category];
    const matchesCategory = selectedCategory === "כל הקטגוריות" || categories.includes(selectedCategory);
    const matchesSearch = !searchTerm || (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // קיבוץ מוצרים לפי קטגוריות
  const productsByCategory = React.useMemo(() => {
    if (selectedCategory !== "כל הקטגוריות" || searchTerm) {
      return null; // אם יש פילטר, לא מקבצים
    }

    const grouped = {};
    products.forEach(product => {
      const categories = Array.isArray(product.category) ? product.category : [product.category];
      
      if (categories.length === 0 || !categories[0] || categories.includes("ללא קטגוריה")) {
        // מוצרים ללא קטגוריה
        if (!grouped["שונות"]) {
          grouped["שונות"] = [];
        }
        if (!grouped["שונות"].find(p => p.id === product.id)) {
          grouped["שונות"].push(product);
        }
      } else {
        categories.forEach(cat => {
          if (cat) {
            if (!grouped[cat]) {
              grouped[cat] = [];
            }
            if (!grouped[cat].find(p => p.id === product.id)) {
              grouped[cat].push(product);
            }
          }
        });
      }
    });
    
    // סדר הצגה מותאם אישית
    const categoryOrder = [
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
      "יין עם תמונה והקדשה אישית",
      "שונות"
    ];
    
    const ordered = {};
    categoryOrder.forEach(cat => {
      if (grouped[cat]) {
        ordered[cat] = grouped[cat].sort((a, b) => (a.price || 0) - (b.price || 0));
      }
    });
    
    // הוסף קטגוריות שלא בסדר המותאם
    Object.keys(grouped).forEach(cat => {
      if (!ordered[cat]) {
        ordered[cat] = grouped[cat].sort((a, b) => (a.price || 0) - (b.price || 0));
      }
    });
    
    return ordered;
  }, [products, selectedCategory, searchTerm]);

  const handleAddToCart = async (product) => {
    await addToCart(product);
    toast.success(`${product.name} נוסף לסל`);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://res.cloudinary.com/dqktv5ywj/video/upload/v1770141925/%D7%A1%D7%A8%D7%98%D7%95%D7%9F_%D7%9E%D7%90%D7%A8%D7%96%D7%99_%D7%91%D7%95%D7%A7%D7%A8_w30nwl.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/dqktv5ywj/video/upload/v1770141925/%D7%A1%D7%A8%D7%98%D7%95%D7%9F_%D7%9E%D7%90%D7%A8%D7%96%D7%99_%D7%91%D7%95%D7%A7%D7%A8_w30nwl.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/30 to-slate-900/40" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              המוצרים שלנו
            </h1>
            <p className="text-xl text-teal-50 max-w-2xl mx-auto">
              בחרו מה שמדבר אליכם ומתאים לאירוע 💛
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-auto min-h-12 rounded-xl bg-white text-right py-3">
                  <SelectValue placeholder="בחר קטגוריה" className="block w-full whitespace-normal" />
                </SelectTrigger>
                <SelectContent className="max-w-[90vw] sm:max-w-md">
                  <SelectItem value="כל הקטגוריות">כל הקטגוריות</SelectItem>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category} 
                      className="whitespace-normal text-right py-3 leading-relaxed"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="חיפוש לפי שם מוצר..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 rounded-xl"
              />
            </div>

            {/* Clear Filters */}
            {(selectedCategory !== "כל הקטגוריות" || searchTerm) && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="h-12 rounded-xl px-6"
              >
                <X className="w-4 h-4 ml-2" />
                נקה פילטר
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            productsByCategory ? (
              <div className="space-y-16">
                {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                  <div key={category}>
                    <h2 className="text-3xl font-bold text-slate-800 mb-8 pb-3 border-b-2 border-teal-400">
                      {category}
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryProducts.map((product, index) => (
                        <ProductCard 
                          key={product.id}
                          product={product}
                          onAddToCart={handleAddToCart}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    index={index}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">אין מוצרים תואמים</h3>
              <p className="text-slate-600 mb-6">נסו לשנות את הפילטרים או את החיפוש</p>
              <Button
                onClick={handleClearFilters}
                className="bg-teal-500 hover:bg-teal-600"
              >
                נקה פילטר
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}