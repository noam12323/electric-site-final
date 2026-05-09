import { useState } from 'react';
import { 
  Phone, Zap, Wrench, Menu, X, 
  Sparkles, Loader2, MessageCircle, MapPin, ShieldCheck
} from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isDiagnoserOpen, setIsDiagnoserOpen] = useState(false);
  const [faultDescription, setFaultDescription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const cities = ['אשקלון', 'אשדוד', 'יבנה', 'רחובות', 'נס ציונה', 'באר יעקב', 'ראשון לציון', 'חולון', 'בת ים', 'תל אביב', 'יפו', 'רמת גן', 'גבעתיים', 'בני ברק', 'פתח תקווה', 'הרצליה', 'רמת השרון', 'רעננה', 'כפר סבא', 'נתניה'];

  const phoneNumber = "050-4278183";
  const waLink = `https://wa.me/972504278183`;

  const analyzeFault = async () => {
    if (!faultDescription.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: faultDescription }] }], systemInstruction: { parts: [{ text: "אתה עוזר חשמלאי. ציין הגעה תוך 25 דקות." }] } })
      });
      const data = await response.json();
      setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "אנא התקשרו לייעוץ.");
    } catch { setAiResponse("חייגו אלינו ישירות לטיפול בתקלה."); }
    setIsAiLoading(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="bg-blue-900 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Zap className="text-yellow-400" /> 
          <span className="font-black text-xl">חשמלאי 24/7</span>
        </div>
        <div className="hidden md:flex gap-4">
          <a href={`tel:${phoneNumber}`} className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-bold no-underline">חייג: {phoneNumber}</a>
        </div>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-blue-800 text-white p-4 flex flex-col gap-4 border-t border-blue-700">
          <a href={`tel:${phoneNumber}`} className="font-bold no-underline text-white">לחיוג מיידי: {phoneNumber}</a>
        </div>
      )}

      <header className="bg-blue-900 text-white py-16 px-4 text-center border-b border-blue-800">
        <div className="bg-red-600 inline-block px-4 py-1 rounded-full text-sm font-bold animate-pulse mb-6">זמינות מיידית: עד 25 דקות אצלך!</div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">חשמלאי מוסמך מומלץ <br/><span className="text-yellow-400">{selectedCity ? `ב${selectedCity}` : 'במרכז והסביבה'}</span></h1>
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
          <a href={`tel:${phoneNumber}`} className="bg-yellow-400 text-blue-900 text-xl font-black py-4 px-8 rounded-2xl no-underline shadow-xl hover:bg-yellow-300 transition-all">חייג להזמנת חשמלאי</a>
          <button onClick={() => setIsDiagnoserOpen(true)} className="bg-blue-700 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-xl flex items-center justify-center gap-2 border border-blue-500">
            <Sparkles className="text-yellow-400"/> אבחון תקלה AI ✨
          </button>
        </div>
      </header>

      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-black text-blue-900 text-center mb-8">בחר עיר לשירות דחוף:</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {cities.map(city => (
            <button key={city} onClick={() => setSelectedCity(city)} className={`p-3 rounded-xl border transition-all font-bold flex items-center justify-center gap-2 ${selectedCity === city ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'}`}>
              <MapPin size={16} className={selectedCity === city ? 'text-white' : 'text-blue-500'} /> {city}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white py-12 px-4 border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4 items-start">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><ShieldCheck /></div>
            <div>
              <h3 className="font-bold text-xl mb-2">חשמלאי מוסמך</h3>
              <p className="text-gray-600">כל העבודות מבוצעות תחת רישיון ובתקנים המחמירים ביותר.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Wrench /></div>
            <div>
              <h3 className="font-bold text-xl mb-2">תיקון כל סוגי התקלות</h3>
              <p className="text-gray-600">קצרים, לוחות חשמל, התקנת גופי תאורה ושיפוץ תשתיות.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-blue-950 text-white py-16 text-center">
        <Zap className="text-yellow-400 mx-auto mb-4" size={40} />
        <p className="text-xl mb-4 font-medium">זמינות מלאה 24 שעות ביממה, גם בשבת וחג</p>
        <a href={`tel:${phoneNumber}`} className="text-3xl md:text-4xl font-black text-yellow-400 no-underline block mb-6">{phoneNumber}</a>
        <p className="opacity-50 text-sm">© {new Date().getFullYear()} חשמלאי 24 שעות - שירות מהיר ומקצועי</p>
      </footer>

      {isDiagnoserOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full relative text-gray-800 shadow-2xl">
            <button onClick={() => setIsDiagnoserOpen(false)} className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X size={20}/></button>
            <h2 className="text-xl font-black mb-4 flex items-center gap-2 text-blue-900"><Sparkles className="text-yellow-500"/> אבחון תקלה חכם</h2>
            <p className="text-sm text-gray-600 mb-4">תאר את הבעיה (למשל: "אין חשמל בכל הבית" או "ריח שרוף") וה-AI שלנו ימליץ על פעולה בטיחותית.</p>
            <textarea className="w-full border-2 border-gray-100 p-4 rounded-2xl h-32 mb-4 bg-gray-50 focus:border-blue-500 outline-none transition-all" placeholder="כתוב כאן..." value={faultDescription} onChange={(e) => setFaultDescription(e.target.value)} />
            <button onClick={analyzeFault} disabled={isAiLoading} className="w-full bg-blue-900 text-white font-black py-4 rounded-2xl hover:bg-blue-800 transition-all flex items-center justify-center">
              {isAiLoading ? <Loader2 className="animate-spin" /> : 'נתח תקלה עכשיו'}
            </button>
            {aiResponse && <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm leading-relaxed text-blue-900 font-medium">{aiResponse}</div>}
          </div>
        </div>
      )}

      <a href={waLink} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all border-2 border-white flex items-center justify-center z-[90]">
        <MessageCircle size={32} />
      </a>
    </div>
  );
};

export default App;