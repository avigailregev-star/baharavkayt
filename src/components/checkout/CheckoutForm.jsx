import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { CalendarIcon, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function CheckoutForm({ 
  onSubmit, 
  isSubmitting = false,
  onWhatsApp,
  cartItems = []
}) {
  const [isGift, setIsGift] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [readyTime, setReadyTime] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestsCount, setGuestsCount] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!customerName || !phone) {
      toast.error("אנא מלאי שם וטלפון");
      return;
    }

    if (!deliveryMethod) {
      toast.error("אנא בחרי שיטת משלוח");
      return;
    }

    if (isGift && deliveryMethod !== "משלוח") {
      toast.error("אפשרות מתנה זמינה רק במשלוח");
      return;
    }

    if (!readyTime) {
      toast.error("אנא בחרי מתי זה צריך להיות מוכן");
      return;
    }

    if (deliveryMethod === "משלוח") {
      if (!deliveryAddress) {
        toast.error("אנא הכניסי כתובת למשלוח");
        return;
      }
      if (isGift && (!senderName || !senderPhone || !recipientName)) {
        toast.error("אנא מלאי את כל פרטי המתנה");
        return;
      }
    }

    const formData = {
      customer_name: isGift ? senderName : customerName,
      phone: isGift ? senderPhone : phone,
      event_date: eventDate ? format(eventDate, "yyyy-MM-dd") : null,
      guests_count: parseInt(guestsCount) || 0,
      notes: notes,
      delivery_method: deliveryMethod,
      ready_time: readyTime ? readyTime.toISOString() : null,
      delivery_address: deliveryMethod === "משלוח" ? deliveryAddress : null,
      is_gift: deliveryMethod === "משלוח" ? isGift : false,
      gift_message: isGift ? giftMessage : null,
      sender_name: isGift ? senderName : null,
      sender_phone: isGift ? senderPhone : null,
      recipient_name: isGift ? recipientName : null,
      status: "חדש"
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 w-full max-w-full">
      {/* isGift at the top */}
      <div className="flex items-center justify-between bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl p-4 border border-pink-200">
        <Label htmlFor="isGiftTop" className="text-slate-700 font-medium cursor-pointer">
          זו מתנה? 🎁
        </Label>
        <Switch
          id="isGiftTop"
          checked={isGift}
          onCheckedChange={(checked) => {
            setIsGift(checked);
            if (checked && deliveryMethod !== "משלוח") {
              setDeliveryMethod("משלוח");
            }
          }}
        />
      </div>

      {isGift && deliveryMethod !== "משלוח" && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 flex items-start gap-3">
          <div className="text-yellow-700 text-sm">
            <p className="font-semibold">⚠️ אפשרות מתנה זמינה רק במשלוח</p>
            <p className="text-xs mt-1">בחרתי לך משלוח באופן אוטומטי</p>
          </div>
        </div>
      )}

      {/* Gift Flow */}
      {isGift ? (
        <>
          {/* Sender Details */}
          <div className="bg-blue-50 rounded-xl p-4 space-y-4">
            <h4 className="font-bold text-slate-800">פרטי השולח *</h4>
            <div className="w-full">
              <Label htmlFor="senderName" className="text-slate-700">שם השולח *</Label>
              <Input
                id="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="שם מלא"
                className="mt-2 h-12 rounded-xl w-full"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="senderPhone" className="text-slate-700">טלפון השולח *</Label>
              <Input
                id="senderPhone"
                type="tel"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="050-000-0000"
                className="mt-2 h-12 rounded-xl w-full"
              />
            </div>
          </div>

          {/* Recipient Details */}
          <div className="bg-pink-50 rounded-xl p-4 space-y-4">
            <h4 className="font-bold text-slate-800">פרטי המקבל *</h4>
            <div className="w-full">
              <Label htmlFor="recipientName" className="text-slate-700">שם המקבל *</Label>
              <Input
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="שם מלא"
                className="mt-2 h-12 rounded-xl w-full"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="recipientPhone" className="text-slate-700">טלפון המקבל *</Label>
              <Input
                id="recipientPhone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="050-000-0000"
                className="mt-2 h-12 rounded-xl w-full"
              />
            </div>
          </div>

          {/* Recipient Address */}
          <div className="w-full">
            <Label htmlFor="address" className="text-slate-700">כתובת המקבל *</Label>
            <Textarea
              id="address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="הכניסי כתובת מלאה"
              rows={2}
              className="mt-2 rounded-xl resize-none w-full"
            />
          </div>

          {/* Gift Message */}
          <div className="w-full">
            <Label htmlFor="giftMessage" className="text-slate-700">ברכה למתנה</Label>
            <Textarea
              id="giftMessage"
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder="הכניסי ברכה אישית..."
              rows={3}
              className="mt-2 rounded-xl resize-none w-full"
            />
          </div>

          {/* Regular fields */}
          <div className="w-full">
            <Label htmlFor="guestsGift" className="text-slate-700">מספר אנשים</Label>
            <Input
              id="guestsGift"
              type="number"
              min="1"
              value={guestsCount}
              onChange={(e) => setGuestsCount(e.target.value)}
              placeholder="כמה אורחים?"
              className="mt-2 h-12 rounded-xl w-full"
            />
          </div>

          <div className="w-full">
            <Label className="text-slate-700">שיטת משלוח *</Label>
            <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
              <SelectTrigger className="w-full mt-2 h-12 rounded-xl">
                <SelectValue placeholder="בחרי איסוף או משלוח" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="איסוף">איסוף עצמי</SelectItem>
                <SelectItem value="משלוח">משלוח</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      ) : (
        <>
          {/* Regular Flow */}
          <div className="w-full">
            <Label htmlFor="name" className="text-slate-700">שם מלא *</Label>
            <Input
              id="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="הכנס/י שם"
              className="mt-2 h-12 rounded-xl w-full"
            />
          </div>

          <div className="w-full">
            <Label htmlFor="phone" className="text-slate-700">טלפון *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="050-000-0000"
              className="mt-2 h-12 rounded-xl w-full"
            />
          </div>

          <div>
            <Label htmlFor="guests" className="text-slate-700">מספר אנשים</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              value={guestsCount}
              onChange={(e) => setGuestsCount(e.target.value)}
              placeholder="כמה אורחים?"
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div>
            <Label className="text-slate-700">שיטת משלוח *</Label>
            <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
              <SelectTrigger className="w-full mt-2 h-12 rounded-xl">
                <SelectValue placeholder="בחרי איסוף או משלוח" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="איסוף">איסוף עצמי</SelectItem>
                <SelectItem value="משלוח">משלוח</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {deliveryMethod === "משלוח" && (
            <div className="w-full">
              <Label htmlFor="address" className="text-slate-700">כתובת למשלוח *</Label>
              <Textarea
                id="address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="הכניסי כתובת מלאה"
                rows={2}
                className="mt-2 rounded-xl resize-none w-full"
              />
            </div>
          )}
        </>
      )}

      {/* Event Date and Time */}
      <div className="w-full">
        <Label className="text-slate-700">תאריך האירוע ושעה *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2 h-12 rounded-2xl justify-start text-right font-normal"
            >
              <CalendarIcon className="ml-2 h-4 w-4" />
              {readyTime ? format(readyTime, "dd/MM/yyyy HH:mm", { locale: he }) : "בחרי תאריך ושעה"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <Calendar
              mode="single"
              selected={readyTime}
              onSelect={(date) => {
                if (date) {
                  const newDate = new Date(date);
                  if (readyTime) {
                    newDate.setHours(readyTime.getHours());
                    newDate.setMinutes(readyTime.getMinutes());
                  } else {
                    newDate.setHours(12);
                    newDate.setMinutes(0);
                  }
                  setReadyTime(newDate);
                  setEventDate(newDate);
                }
              }}
              disabled={(date) => date < new Date()}
              locale={he}
            />
            <div className="flex gap-2 mt-3 pt-3 border-t">
              <Input
                type="time"
                value={readyTime ? format(readyTime, "HH:mm") : ""}
                onChange={(e) => {
                  if (readyTime && e.target.value) {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDate = new Date(readyTime);
                    newDate.setHours(parseInt(hours));
                    newDate.setMinutes(parseInt(minutes));
                    setReadyTime(newDate);
                    setEventDate(newDate);
                  } else if (e.target.value) {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDate = new Date();
                    newDate.setHours(parseInt(hours));
                    newDate.setMinutes(parseInt(minutes));
                    setReadyTime(newDate);
                    setEventDate(newDate);
                  }
                }}
                className="flex-1 h-10 rounded-xl"
              />
            </div>
          </PopoverContent>
        </Popover>
        <p className="text-xs text-slate-500 mt-1">ההזמנה מותנית באישור טלפוני שהתאריך פנוי.</p>
      </div>

      {/* Delivery Fee Note */}
      {deliveryMethod === "משלוח" && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
          <p className="text-teal-700 text-sm font-medium">
            💡 דמי משלוח ישוקללו במחיר לאחר שיחה טלפונית.
          </p>
        </div>
      )}

      {/* Notes */}
      <div className="w-full">
        <Label htmlFor="notes" className="text-slate-700">הערות נוספות</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="רגישויות למזון, בקשות מיוחדות..."
          rows={3}
          className="mt-2 rounded-xl resize-none w-full"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-gradient-to-r from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500 rounded-2xl font-medium"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              שולח...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 ml-2" />
              בואו נזמין 💛
            </>
          )}
        </Button>

        {onWhatsApp && (
          <Button
            type="button"
            onClick={onWhatsApp}
            className="w-full h-12 bg-green-500 hover:bg-green-600 rounded-2xl text-white font-medium"
          >
            שלחי הודעה בוואטסאפ 💬
          </Button>
        )}
      </div>
    </form>
  );
}