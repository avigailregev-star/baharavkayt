import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Utensils, Users, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: Utensils,
      title: "חומרי גלם איכותיים",
      description: "רק המרכיבים הטריים והטובים ביותר"
    },
    {
      icon: Users,
      title: "התאמה אישית",
      description: "מגשים מותאמים לכל סוג אירוע"
    },
    {
      icon: Star,
      title: "שירות מקצועי",
      description: "ליווי צמוד מההזמנה ועד הגשה"
    },
    {
      icon: Clock,
      title: "אמינות מוחלטת",
      description: "משלוחים בזמן, תמיד"
    }
  ];

  const buttons = [
    { label: "מגשי פירות", page: "FruitTrays" },
    { label: "מארזי פיקניק זוגיים", page: "PicnicPairs" },
    { label: "מגשי אירוח", page: "CateringTrays" },
    { label: "יין עם הקדשה ותמונה", page: "WineWithDedication" },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/966e62d99_.jpg"
            alt="מגשי אוכל"
            className="w-full h-full object-cover object-left"
          />
          {/* Dark dramatic overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />
        </div>

        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/bc9336e73_image.png"
              alt="ליבא"
              className="h-36 sm:h-44 lg:h-52 w-auto object-contain mb-8 drop-shadow-2xl"
            />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="geveret-liyon text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 drop-shadow-lg"
            >
              טעים להכיר❤️
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="geveret-liyon text-xl sm:text-2xl text-white/85 mb-12 max-w-2xl font-medium tracking-wide"
            >
              ברוכים הבאים לאתר הבית של "ליבא"
            </motion.p>

            {/* Glass buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl"
            >
              {buttons.map((btn, i) => (
                <Link key={btn.page} to={createPageUrl(btn.page)}>
                  <button className="w-full px-6 py-4 rounded-2xl text-white text-base font-semibold border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/25 hover:border-white/60 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl tracking-wide">
                    {btn.label}
                  </button>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-700 mb-4">
              למה לבחור בליבא?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              כי אני מכינה כל מגש באהבה ובתשומת לב 💛
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 group border border-teal-100 hover:-translate-y-1 hover:border-teal-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-teal-400 to-orange-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              מתכננים אירוע? בואו נדבר 💬
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              אשמח להכיר, לשמוע מה אתם מחפשים ולבנות יחד את התפריט המושלם
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={createPageUrl("OrderRequest")}>
                <Button
                  size="lg"
                  className="bg-white text-teal-600 hover:bg-amber-50 px-10 py-6 rounded-3xl text-lg font-bold shadow-xl"
                >
                  בואו נזמין 💛
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}