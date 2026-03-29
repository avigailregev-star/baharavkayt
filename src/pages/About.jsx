import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Heart, Award, Users, Leaf, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const values = [
  {
    icon: Heart,
    title: "אהבה לאוכל",
    description: "כל מגש מוכן באהבה ובתשוקה לקולינריה איכותית"
  },
  {
    icon: Leaf,
    title: "טריות ואיכות",
    description: "חומרי גלם טריים בלבד, בלי פשרות"
  },
  {
    icon: Award,
    title: "מקצועיות",
    description: "שנים של ניסיון בהכנת אירועים מושלמים"
  },
  {
    icon: Users,
    title: "שירות אישי",
    description: "התאמה מדויקת לצרכים שלכם"
  }];


  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/6d98884cc_.jpeg"
            alt="מטבח"
            className="w-full h-full object-contain" />

          <div className="absolute inset-0 bg-gradient-to-l from-slate-900/70 via-slate-900/50 to-slate-900/30" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl">

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">מי אני

            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              שמי לבנת, ואני עומדת מאחורי העסק „ליבא".
              <br /><br />
              מתוך רצון גדול להכניס הרבה לב אל החוויה הקולינרית, אני יוצרת מגשים וחוויות שנולדו מאהבה לאנשים ולמפגש היפה שנוצר סביב אוכל.
              <br /><br />
              מאחורי המגשים והצבעים עומדת שאיפה לשמח, להעניק חוויה נעימה, אסתטית ומלאת תשומת לב.
              <br /><br />
              העסק שלי נולד מהחיבור בין יצירה, אוכל ונשמה – ומתוך רצון להביא אור, יופי ופשטות מרגשת אל שולחן האירוח.
              <br /><br />
              אני בוחרת חומרי גלם בקפידה, חושבת על הפרטים הקטנים, ומרכיבה כל הזמנה כאילו היא מיועדת למישהו יקר במיוחד.
              <br /><br />
              כי בשבילי, אוכל הוא שפה של רגש, אהבה ויצירה.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>

              <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-6">הסיפור שלי

              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">אז איך הכל התחיל, אתם שואלים?

              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p className="">
                  במשך כ־15 שנים עסקתי בחינוך, ובמקביל תמיד לימדתי אומנות – חוגי ציור וסדנאות יצירה.
                  <br /><br />
                  אני מאמינה שיצירה היא דרך אדירה להביא את הפנים שלי לעולם.
                  <br /><br />
                  לפני כמה שנים נדרשתי למנוחת הגוף, ומתוך העצירה הזו התחיל לבצבץ לו הרעיון.
                  <br /><br />
                  זו הייתה תקופת הקורונה – אנשים חיפשו עידוד בתוך הבידוד, ואני, בבית ועם כוחות מוגבלים, שאלתי את עצמי: למה לא לשמח, אפילו קצת?
                  <br /><br />
                  משם הכול התחיל להתגלגל – ארוחות בוקר, מגשי פירות, סלי פיקניק, והיום, ברוך ה', העסק כבר גדל ומציע מגשי אירוח לאירועים של עד 150 איש.
                  <br /><br />
                  מרגישה שהכל מושגח מאת ה'.
                  <br /><br />
                  כל מגש נוצר מתוך חיבור עמוק ליצירה ולאסתטיקה.
                  <br /><br />
                  אני מביאה אליכם את האומנות והלב שלי – ישר לצלחת.
                </p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">

              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697923a2c6ab10695acab3d6/97ac8cb61_1.jpeg" alt="הצוות שלנו" className="w-full h-[500px] object-contain" />

              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              הערכים שלנו
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              המחויבות שלנו לאיכות באה לידי ביטוי בכל פרט
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300">

                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600">
                  {value.description}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
              בואו נהפוך את האירוע שלכם לבלתי נשכח
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              נשמח לשמוע על האירוע שלכם ולהכין הצעה מותאמת אישית
            </p>
            <Link to={createPageUrl("OrderRequest")}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-10 py-6 rounded-2xl text-lg font-medium shadow-xl shadow-orange-500/25">

                בקשת הזמנה
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>);

}