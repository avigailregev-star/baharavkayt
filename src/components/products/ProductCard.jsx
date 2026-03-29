import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

export default function ProductCard({ product, onAddToCart, index }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: 'rtl' });

  // תמונות של עוגיות
  const cookieImages = [
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/ce27521c8_2002.jpeg",
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/659dd0a03_2001.jpeg",
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/90af003d0_200.jpeg",
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/fcd031adb_2003.jpeg"
  ];

  // תמונות של קינוחים
  const dessertImages = [
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/0a2982d02_2503.jpeg",
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/181d4ddeb_2502.jpeg",
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/ccd9d30ca_2501.jpeg",
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/16a369f12_250.jpeg",
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/66e29d37d_242504.jpeg"
  ];

  const isCookieProduct = product.category === "עוגיות";
  const isDessertProduct = product.category === "קינוחים (קינוחי כוסות / מגוון)";
  
  // טיפול במקרה שהמוצר עם מערך תמונות או מחרוזת בודדת
  const productImages = Array.isArray(product.image) ? product.image : 
                       product.image ? [product.image] : 
                       ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"];
  
  const images = isCookieProduct ? cookieImages : 
                 isDessertProduct ? dessertImages : 
                 productImages;
  const hasMultipleImages = images.length > 1;

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setCurrentImageIndex((emblaApi.selectedScrollSnap()));
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setCurrentImageIndex((emblaApi.selectedScrollSnap()));
    }
  }, [emblaApi]);

  React.useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setCurrentImageIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden group">
        {hasMultipleImages ? (
          <>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {images.map((img, idx) => (
                  <div key={idx} className="flex-[0_0_100%] min-w-0">
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "w-6 bg-white"
                      : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <img
            src={images[0]}
            alt={product.name}
            className={`w-full h-full ${product.name.includes("עוגת פירות") ? "object-contain bg-white" : "object-cover"}`}
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-slate-600 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          {!product.name.includes("בר פירות") && !product.name.includes("סדנאות עיצוב") && (
            <div className="text-2xl font-bold text-teal-600">
              ₪{product.price}
            </div>
          )}
          <Button
            onClick={() => onAddToCart(product)}
            className={`bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 rounded-2xl gap-2 ${(product.name.includes("בר פירות") || product.name.includes("סדנאות עיצוב")) ? "w-full" : ""}`}
          >
            <Plus className="w-4 h-4" />
            להוסיף לסל 🛒
          </Button>
        </div>
      </div>
    </motion.div>
  );
}