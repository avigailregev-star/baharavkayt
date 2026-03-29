import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartContext";
import { toast } from "sonner";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function OrderRequest() {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitOrder = async (formData) => {
    if (cartItems.length === 0) {
      toast.error("הסל ריק - אנא הוסיפי מוצרים לפני שליחת הזמנה");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await base44.entities.Order.create({
        ...formData,
        guests_count: parseInt(formData.guests_count) || 0,
      });

      await Promise.all(
        cartItems.map(item =>
          base44.entities.OrderItem.create({
            order: order.id,
            product: item.product,
            quantity: item.quantity,
            price: item.price_at_time,
            notes: item.notes || ""
          })
        )
      );

      await clearCart();
      setIsSubmitted(true);
    } catch (error) {
      toast.error("שגיאה בשליחת ההזמנה");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) {
      toast.error("הסל ריק - אנא הוסיפי מוצרים לפני שליחת הזמנה");
      return;
    }

    const cartItemsText = cartItems
      .map(item => `• ${item.product_name} × ${item.quantity} – ₪${item.price_at_time * item.quantity}`)
      .join("\n");

    const message = `היי ליבא 💛
אשמח להזמין:

מוצרים:
${cartItemsText}

סה״כ: ₪${getTotalPrice()}

אשמח לקבל הצעה מותאמת`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/972586612727?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-700 mb-4">
            תודה רבה! 💛
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            קיבלתי את ההזמנה שלכם ואחזור אליכם בהקדם ✨
          </p>
          <Link to={createPageUrl("Products")}>
            <Button className="bg-teal-500 hover:bg-teal-600 rounded-2xl px-8">
              חזרה למוצרים
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-teal-500 to-teal-600 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              בואו נזמין 💛
            </h1>
            <p className="text-lg md:text-xl text-teal-50 max-w-2xl mx-auto">
              ספרו לי מה אתם מחפשים ואחזור אליכם עם הצעה מותאמת
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cart Items Section */}
      {cartItems.length > 0 && (
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">פריטים בסל</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-4 md:p-6 shadow-sm"
                >
                  <div className="flex gap-4">
                    <img
                      src={Array.isArray(item.product_image) ? item.product_image[0] : item.product_image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"}
                      alt={item.product_name}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-800 mb-2">
                        {item.product_name}
                      </h3>
                      <p className="text-lg md:text-xl font-bold text-teal-600 mb-4">
                        ₪{item.price_at_time}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1">
                          <button
                            type="button"
                            onClick={() => {
                              updateQuantity(item.id, item.quantity - 1);
                              if (item.quantity - 1 === 0) {
                                toast.success("מוצר הוסר בהצלחה");
                              }
                            }}
                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 rounded-full transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-bold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 rounded-full transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            removeFromCart(item.id);
                            toast.success("מוצר הוסר בהצלחה");
                          }}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-slate-800">
                        ₪{item.price_at_time * item.quantity}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Form */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Form */}
            <div className={cartItems.length > 0 ? "lg:col-span-1 order-1 lg:order-2" : "lg:col-span-3 max-w-2xl mx-auto w-full"}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl lg:sticky lg:top-24">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">פרטים שלכם 💛</h3>
                  
                  <CheckoutForm 
                    onSubmit={handleSubmitOrder}
                    isSubmitting={isSubmitting}
                    onWhatsApp={handleWhatsAppOrder}
                    cartItems={cartItems}
                  />

                  {/* Cart Summary */}
                  {cartItems.length > 0 && (
                    <div className="border-t border-slate-200 pt-4 mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-600">סה״כ פריטים:</span>
                        <span className="font-bold text-slate-800">
                          {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-bold text-slate-800">סה״כ:</span>
                        <span className="text-2xl font-bold text-teal-600">₪{getTotalPrice()}</span>
                      </div>
                    </div>
                  )}

                  {cartItems.length === 0 && (
                    <div className="border-t border-slate-200 pt-4 mb-6">
                      <p className="text-center text-slate-500 text-sm">
                        לא ניתן להשלים את ההזמנה, הוסף פריטים לסל
                      </p>
                    </div>
                  )}

                  <Link to={createPageUrl("Products")}>
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-2xl"
                    >
                      המשך קניות
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}