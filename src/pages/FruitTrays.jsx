import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartContext";
import { toast } from "sonner";
import ProductCard from "@/components/products/ProductCard";

export default function FruitTrays() {
  const { addToCart } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", "מגשי פירות"],
    queryFn: async () => {
      const allProducts = await base44.entities.Product.filter({ active: true });
      const filtered = allProducts.filter(p => {
        const categories = Array.isArray(p.category) ? p.category : [p.category];
        return categories.includes("מגשי פירות");
      });
      return filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    }
  });

  const handleAddToCart = async (product) => {
    await addToCart(product);
    toast.success(`${product.name} נוסף לסל`);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <section className="relative py-28">
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/dqktv5ywj/image/upload/v1772711624/%D7%9E%D7%97%D7%96%D7%99%D7%A7%D7%94_%D7%9E%D7%92%D7%A9_%D7%A4%D7%99%D7%A8%D7%95%D7%AA_qhwoiz.jpg"
            alt="מגשי פירות"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 20%' }}
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("Home")}>
            <Button variant="outline" className="mb-6 bg-white/90 hover:bg-white">
              <ArrowRight className="w-4 h-4 ml-2" />
              חזרה לדף הבית
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              מגשי פירות
            </h1>
            <p className="text-xl text-white/90">
              מגשי פירות טריים ומעוצבים בקפידה 🍇🍓🍊
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">אין מוצרים זמינים כרגע</h3>
              <p className="text-slate-600 mb-6">נשמח לעדכן אותך בהמשך</p>
              <Link to={createPageUrl("Home")}>
                <Button className="bg-teal-500 hover:bg-teal-600">
                  חזרה לדף הבית
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}