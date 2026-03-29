import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
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
import { Users, ShoppingCart, ArrowLeft, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartContext";
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

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("כל הקטגוריות");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["menuItems"],
    queryFn: () => base44.entities.MenuItem.list()
  });

  const handleAddToCart = async (item) => {
    await addToCart({
      id: item.id,
      name: item.name,
      price: 0,
      image: item.image_url
    });
    toast.success("נוסף לסל בהצלחה");
  };

  const handleClearFilters = () => {
    setSelectedCategory("כל הקטגוריות");
    setSearchTerm("");
  };

  const filteredItems = menuItems
    .filter((item) => item.is_available !== false)
    .filter((item) => {
      const matchesCategory = selectedCategory === "כל הקטגוריות" || item.category === selectedCategory;
      const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/dqktv5ywj/video/upload/v1770140600/WhatsApp_Video_2026-02-03_at_19.21.35_qvl8rm.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/30 to-slate-900/40" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              תפריט המגשים שלנו
            </h1>
            <p className="text-xl text-teal-50 max-w-2xl mx-auto">
              מגשים טעימים שמוכנים באהבה במיוחד בשבילכם ✨
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-slate-50 border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

      {/* Menu Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ?
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) =>
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm">
                  <Skeleton className="h-56 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
            )}
            </div> :
          filteredItems.length > 0 ?
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) =>
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">

                  <div className="relative h-56 overflow-hidden">
                    <img
                  src={item.image_url || categoryImages[item.category]}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/95 text-slate-700 px-3 py-1 rounded-full">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {item.name}
                    </h3>
                    {item.description &&
                <p className="text-slate-600 mb-4 line-clamp-2">
                        {item.description}
                      </p>
                }
                    <div className="flex items-center justify-between">
                      {item.serves &&
                  <div className="flex items-center gap-2 text-slate-500">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">מתאים ל-{item.serves} אנשים</span>
                        </div>
                  }
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        className="bg-amber-500 hover:bg-amber-600 rounded-full">
                        להוסיף לסל 🛒
                        <ShoppingCart className="w-4 h-4 mr-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
            )}
            </div> :

          <div className="text-center py-20">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">אין פריטים תואמים</h3>
              <p className="text-slate-600 mb-6">נסו לשנות את הפילטרים או את החיפוש</p>
              <Button
              onClick={handleClearFilters}
              className="bg-amber-500 hover:bg-amber-600">

                נקה פילטר
              </Button>
            </div>
          }
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            לא מצאתם את מה שחיפשתם? 🤔
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            אשמח להכין עבורכם מגש מותאם במיוחד. בואו נדבר ונבנה יחד משהו מושלם 💛
          </p>
          <Link to={createPageUrl("OrderRequest")}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-10 py-6 rounded-2xl text-lg font-medium shadow-xl shadow-orange-500/25">

              בואו נזמין 💛
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>);

}