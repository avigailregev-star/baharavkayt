import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Gallery() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list()
  });

  const images = products
    .filter(product => product.image && product.active)
    .flatMap(product => {
      const imageArray = Array.isArray(product.image) ? product.image : [product.image];
      return imageArray.map(url => ({ 
        url, 
        title: product.name 
      }));
    });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-teal-500 to-teal-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              גלריה
            </h1>
            <p className="text-xl text-teal-50 max-w-2xl mx-auto">
              הצצה לעולם הקולינרי שלנו
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                    index === 0 || index === 4 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <div className="aspect-square">
                    <img
                      src={image.url}
                      alt={image.title || "תמונה מהגלריה"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white font-medium text-lg">
                        {image.title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}