import React, { useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("אימייל או סיסמה שגויים");
      setLoading(false);
    } else {
      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get("redirect") ?? "/AdminOrders";
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center" dir="rtl">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/bc9336e73_image.png"
            alt="ליבא"
            className="h-16 w-auto object-contain"
          />
        </div>

        <h1 className="text-xl font-bold text-slate-700 text-center mb-6">כניסת מנהל</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">אימייל</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="password">סיסמה</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "מתחבר..." : "כניסה"}
          </Button>
        </form>
      </div>
    </div>
  );
}
