import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Menu, X, Phone, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartProvider, useCart } from "@/components/cart/CartContext";

const adminPages = ["AdminOrders", "AdminProducts"];

function LayoutContent({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  const isAdminPage = adminPages.includes(currentPageName);

  // גלילה אוטומטית לראש העמוד בכל מעבר דף
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPageName]);

  const navLinks = [
  { name: "בית", page: "Home" },
  { name: "מוצרים", page: "Products" },
  { name: "מגשי פירות", page: "FruitTrays" },
  { name: "גלריה", page: "Gallery" },
  { name: "מי אני", page: "About" },
  { name: "בואו נזמין 💛", page: "OrderRequest" }];


  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-amber-50" dir="rtl">
        <header className="bg-white border-b border-teal-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/bc9336e73_image.png"
                  alt="ליבא"
                  className="h-12 w-auto object-contain" />

                <span className="text-lg font-bold text-slate-700">ניהול הזמנות</span>
              </div>
              <Link to={createPageUrl("Home")}>
                <Button variant="outline" size="sm">חזרה לאתר</Button>
              </Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>);

  }

  return (
    <div className="min-h-screen bg-amber-50" dir="rtl" style={{ fontFamily: 'Playpen Sans Hebrew, Assistant, -apple-system, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playpen+Sans+Hebrew:wght@300;400;500;600;700&display=swap');
        
        @font-face {
          font-family: 'Gveret Levin';
          src: url('https://dl.dropboxusercontent.com/scl/fi/3anthgquz3s8jzeia2vrb/GveretLevinAlefAlefAlef-Regular.woff2?rlkey=x4onjf4ma2t4ccoqcb9f2ugke&st=vc6ep13s') format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        :root {
          --color-primary: #14b8a6;
          --color-primary-light: #5eead4;
          --color-secondary: #475569;
          --color-accent: #fdba74;
        }

        * {
          font-family: 'Playpen Sans Hebrew', 'Assistant', -apple-system, sans-serif;
        }

        .geveret-liyon {
          font-family: 'Gveret Levin', 'Assistant', sans-serif;
          font-weight: normal;
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-teal-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/bc9336e73_image.png"
                alt="ליבא"
                className="h-16 w-auto object-contain" />

            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                currentPageName === link.page ?
                "bg-teal-50 text-teal-700" :
                "text-slate-600 hover:text-slate-700 hover:bg-teal-50/50"}`
                }>

                  {link.name}
                </Link>
              )}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link to={createPageUrl("Cart")}>
                <Button
                  variant="outline"
                  size="icon"
                  className={`relative rounded-full w-11 h-11 ${
                  currentPageName === "Cart" ? "bg-teal-50 border-teal-500" : ""}`
                  }>

                  <ShoppingCart className="w-5 h-5" />
                  {getTotalItems() > 0 &&
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-orange-500 text-white text-xs">
                      {getTotalItems()}
                    </Badge>
                  }
                </Button>
              </Link>
              <a
                href="https://wa.me/972586612727"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded-2xl font-medium text-sm shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all duration-300 hover:-translate-y-0.5">

                <Phone className="w-4 h-4" />
                <span>וואטסאפ</span>
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">

                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen &&
        <div className="lg:hidden border-t border-slate-100 bg-white">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) =>
            <Link
              key={link.page}
              to={createPageUrl(link.page)}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
              currentPageName === link.page ?
              "bg-teal-50 text-teal-700" :
              "text-slate-600 hover:bg-teal-50/50"}`
              }>

                  {link.name}
                </Link>
            )}
                </div>
          </div>
        }
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-slate-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/bc9336e73_image.png"
                  alt="ליבא"
                  className="h-14 w-auto object-contain bg-white rounded-2xl p-2" />

              </div>
              <p className="text-slate-400 leading-relaxed">
                מגשי אוכל טריים ואיכותיים לכל אירוע. אנחנו כאן כדי להפוך כל רגע לחוויה קולינרית בלתי נשכחת.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">ניווט מהיר</h4>
              <ul className="space-y-3">
                {navLinks.map((link) =>
                <li key={link.page}>
                    <Link
                    to={createPageUrl(link.page)}
                    className="text-slate-300 hover:text-teal-300 transition-colors">

                      {link.name}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">צור קשר</h4>
              <div className="space-y-3 text-slate-400">
                <a href="tel:0586612727" className="block hover:text-teal-300 transition-colors">
                  טלפון: 058-661-2727
                </a>
                <a href="mailto:avigailregev@gmail.com" className="block hover:text-teal-300 transition-colors">
                  אימייל: avigailregev@gmail.com
                </a>
                <a
                  href="https://wa.me/972586612727"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-green-500 text-white rounded-2xl font-medium hover:bg-green-600 transition-colors">

                  <Phone className="w-4 h-4" />
                  <span>וואטסאפ</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-600 mt-12 pt-8 text-center text-slate-400">
            <p>© {new Date().getFullYear()} ליבא - קייטרינג בוטיק. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>);

}

export default function Layout({ children, currentPageName }) {
  return (
    <CartProvider>
      <LayoutContent children={children} currentPageName={currentPageName} />
    </CartProvider>);

}