import { useState } from 'react';
import { 
  Phone, Zap, MapPin, Clock, ShieldCheck, Wrench, Menu, X, 
  Star, Sparkles, AlertTriangle, Loader2, Users, Award, 
  Percent, ArrowLeft, Accessibility, MessageCircle, FileText 
} from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // הגדרה מפורשת של סוג המשתנה כדי למנוע שגיאות TypeScript בבנייה ב-Vercel
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const [isDiagnoserOpen, setIsDiagnoserOpen] = useState(false);
  const [faultDescription, setFaultDescription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [accMenuOpen, setAccMenuOpen] = useState(false);
  const [accHighContrast, setAccHighContrast] = useState(false);
  const [accLargeText, setAccLargeText] = useState(false);
  const [accHighlightLinks, setAccHighlightLinks] = useState(false);

  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const cities = [
    'אשקלון', 'אשדוד', 'יבנה', 'רחובות', 'נס ציונה', 'באר יעקב', 
    'ראשון לציון', 'חולון', 'בת ים', 'תל אביב', 'יפו', 'רמת גן', 
    'גבעתיים', 'בני ברק', 'פתח תקווה', 'הרצליה', 'רמת השרון', 
    'רעננה', 'כפר סבא', 'נתניה'
  ];

  const services = [
    { title: 'קצרים ותקלות חשמל', icon: Zap, desc: 'איתור וטיפול בקצרים, זליגות חשמל ותקלות מורכבות במקצועיות ובמהירות.' },
    { title: 'החלפת לוחות חשמל', icon: ShieldCheck, desc: 'שדרוג מחד פאזי לתלת פאזי, החלפת פקקים ואוטומטים על פי תקן מחמיר.' },
    { title: 'התקנת גופי תאורה', icon: Wrench, desc: 'התקנת נברשות, מאווררי תקרה, גופי תאורה שקועים, ונקודות חשמל חדשות.' },
  ];

  const phoneNumber = "050-4278183";
  const waNumber = "972504278183"; 
  const waMessage = selectedCity 
    ? `היי, הגעתי מהאתר ואני צריך חשמלאי ב${selectedCity}. אפשר פרטים?` 
    : `היי, הגעתי מהאתר ואני צריך חשמלאי. אפשר פרטים?`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  const analyzeFault = async () => {
    if (!faultDescription.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    
    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const systemInstruction = `אתה עוזר וירטואלי חכם של 'חשמלאי 24 שעות'. תפקידך להעריך תקלות חשמל, לתת טיפ בטיחות ולהמליץ להתקשר ל-${phoneNumber}. ציין הגעה עד 25 דקות.`;
    
    const payload = {
      contents: [{ parts: [{ text: faultDescription }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "אנא התקשרו אלינו ישירות לייעוץ.";
      setAiResponse(text);
    } catch {
      setAiResponse("אירעה שגיאה בתקשורת. אנא חייגו אלינו ישירות.");
    }
    setIsAiLoading(false);
  };

  const renderDiagnoserModal = () => {
    if (!isDiagnoserOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative flex flex-col max-h-[90vh] border border-gray-100 overflow-y-auto">
          <button onClick={() => setIsDiagnoserOpen(false)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 rounded-full p-2">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-4 mt-2">
            <div className="bg-yellow-100 p-2 rounded-2xl text-yellow-600 shadow-inner">
              <Sparkles size={24} />
            </div>
            <h2 className="text-xl font-black text-blue-900 tracking-tight">אבחון תקלה AI ✨</h2>
          </div>
          <p className="text-gray-600 mb-5 text-sm leading-relaxed">תארו את התקלה במילים שלכם והמערכת תיתן לכם הערכת מצב מהירה.</p>
          <textarea 
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-28 mb-5 text-gray-800 shadow-inner"
            placeholder="לדוגמה: שמעתי פיצוץ קטן מהשקע בסלון..."
            value={faultDescription}
            onChange={(e) => setFaultDescription(e.target.value)}
          />
          <button 
            onClick={analyzeFault} 
            disabled={isAiLoading || !faultDescription.trim()}
            className="bg-blue-900 text-white font-bold py-3 rounded-2xl hover:bg-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
          >
            {isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="text-yellow-400" />}
            {isAiLoading ? 'מנתח...' : 'בצע אבחון מהיר'}
          </button>
          {aiResponse && (
            <div className="mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-600 mt-1 shrink-0" size={20} />
                <p className="text-blue-900 leading-relaxed font-medium text-sm">{aiResponse}</p>
              </div>
              <a href={`tel:${phoneNumber}`} className="mt-5 w-full flex items-center justify-center gap-2 bg-yellow-400 text-blue-900 font-black py-3 rounded-xl hover:bg-yellow-300 transition-colors shadow-md text-white no-underline">
                <Phone size={18} />
                לחיוג חירום מיידי
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTermsModal = () => {
    if (!isTermsOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 relative flex flex-col max-h-[90vh] border border-gray-100 overflow-hidden">
          <button onClick={() => setIsTermsOpen(false)} className="absolute top-4 left-4 md:top-6 md:left-6 text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 rounded-full p-2 z-10">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-6 mt-2 md:mt-0">
            <div className="bg-blue-100 p-2 md:p-3 rounded-2xl text-blue-600 shadow-inner">
              <FileText size={24} className="md:w-7 md:h-7" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-blue-900 tracking-tight">תקנון ותנאי שימוש</h2>
          </div>
          <div className="overflow-y-auto text-gray-700 space-y-4 text-sm md:text-base leading-relaxed pr-2">
            <p>1. כל העבודות מבוצעות ע"י חשמלאי מוסמך בעל רישיון בתוקף.</p>
            <p>2. הצעת מחיר סופית ומדויקת תינתן רק לאחר בדיקה פיזית של התקלה בשטח.</p>
            <p>3. התחייבות לזמני הגעה כפופה לעומסי תנועה וזמינות כוננים באזור.</p>
            <p>4. אבחון ה-AI הוא כלי עזר בטיחותי בלבד ואינו מחליף ייעוץ מקצועי בשטח.</p>
            <p>5. אחריות ניתנת על העבודה והחלפים שסופקו על ידינו בלבד.</p>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
             <button onClick={() => setIsTermsOpen(false)} className="bg-blue-900 text-white font-bold py-2 px-6 rounded-xl hover:bg-blue-800 transition-all">
               הבנתי, סגור
             </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAccessibilityMenu = () => {
    return (
      <>
        <style>
          {`
            #root, body, html { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; }
            ${accHighContrast ? '* { background-color: #000 !important; color: #ffeb3b !important; border-color: #fff !important; }' : ''}
            ${accLargeText ? '* { font-size: 110% !important; line-height: 1.6 !important; }' : ''}
            ${accHighlightLinks ? 'a, button { text-decoration: underline !important; border-bottom: 2px solid #ffeb3b !important; }' : ''}
          `}
        </style>
        <div className="fixed top-20 md:top-24 left-4 z-[90] flex flex-col items-start" dir="rtl">
          <button 
            onClick={() => setAccMenuOpen(!accMenuOpen)}
            className="bg-blue-600 text-white p-2 md:p-3 rounded-full shadow-xl hover:bg-blue-700 transition-all border-2 border-white"
            title="תפריט נגישות"
          >
            <Accessibility size={24} className="md:w-7 md:h-7" />
          </button>
          {accMenuOpen && (
            <div className="mt-2 bg-white text-gray-800 rounded-2xl shadow-2xl p-4 w-52 md:w-56 border border-gray-200">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                <h3 className="font-bold text-sm md:text-base">תפריט נגישות</h3>
                <button onClick={() => setAccMenuOpen(false)} className="text-gray-500 hover:text-gray-800"><X size={18} /></button>
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                <button onClick={() => setAccHighContrast(!accHighContrast)} className={`py-2 px-3 rounded-lg text-xs md:text-sm font-medium transition-colors ${accHighContrast ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>◐ ניגודיות גבוהה</button>
                <button onClick={() => setAccLargeText(!accLargeText)} className={`py-2 px-3 rounded-lg text-xs md:text-sm font-medium transition-colors ${accLargeText ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>A+ טקסט מוגדל</button>
                <button onClick={() => setAccHighlightLinks(!accHighlightLinks)} className={`py-2 px-3 rounded-lg text-xs md:text-sm font-medium transition-colors ${accHighlightLinks ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>⎁ הדגשת קישורים</button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  if (selectedCity) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-24 md:pb-0 selection:bg-blue-200">
        <header className="bg-blue-900 text-white p-3 md:p-4 sticky top-0 z-50 border-b border-blue-800 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
             <button onClick={() => setSelectedCity(null)} className="flex items-center gap-1 md:gap-2 text-blue-200 hover:text-white bg-blue-800 px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all text-xs md:text-sm font-medium">
                <ArrowLeft size={16} />
                <span>חזרה לערים</span>
             </button>
             <div className="flex items-center gap-1 md:gap-2 font-black text-lg md:text-xl tracking-tight">
               <Zap className="text-yellow-400 w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
               <span>חשמלאי <span className="text-yellow-400">24/7</span></span>
             </div>
          </div>
        </header>

        <section className="bg-blue-900 text-white py-12 md:py-20 px-4 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-red-600 border border-red-500 text-white rounded-full px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-base font-bold mb-6 md:mb-8 shadow-lg animate-pulse">
              זמינות מיידית: הגעה עד 25 דקות ב{selectedCity}!
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 tracking-tight leading-tight">
              חשמלאי מוסמך ב<span className="text-yellow-400 block sm:inline">{selectedCity}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 md:mb-10 max-w-2xl mx-auto font-medium px-2">
              מענה 24 שעות גם בשעות הלילה המאוחרות! שירות מקצועי, יסודי ועם אחריות מלאה.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <a href={`tel:${phoneNumber}`} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 md:gap-3 bg-yellow-400 text-blue-900 font-black text-lg md:text-xl py-3.5 px-6 md:py-4 md:px-8 rounded-full hover:bg-yellow-300 transition-all shadow-xl hover:-translate-y-1 text-white no-underline">
                <Phone size={20} fill="currentColor" className="md:w-6 md:h-6" />
                הזמן חשמלאי עכשיו
              </a>
              <button onClick={() => setIsDiagnoserOpen(true)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 md:gap-3 bg-blue-800 text-white border border-blue-500 font-bold text-lg md:text-xl py-3.5 px-6 md:py-4 md:px-8 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:-translate-y-1">
                <Sparkles size={20} className="text-yellow-400 md:w-6 md:h-6" />
                אבחון תקלה AI ✨
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white py-8 md:py-10 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
            {[
              {i:Clock, t:'הגעה עד 25 דקות', c:'red'}, 
              {i:Award, t:'יצאת צדיק!', c:'blue'}, 
              {i:Users, t:'+50,000 המלצות', c:'green'}, 
              {i:Percent, t:'מחירים הוגנים', c:'yellow'}
            ].map((x,idx)=>{
              const IconComp = x.i;
              return (
              <div key={idx} className="flex flex-col items-center p-4 md:p-6 bg-gray-50 rounded-2xl md:rounded-3xl border border-gray-100">
                <div className={`bg-gray-100 text-blue-600 p-2 md:p-3 rounded-xl mb-3`}><IconComp size={24} className="md:w-7 md:h-7" /></div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">{x.t}</h3>
              </div>
            );})}
          </div>
        </section>

        <section className="py-12 md:py-20 bg-gray-50 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-black text-blue-900 mb-10 tracking-tight">שירותי חשמל נפוצים ב{selectedCity}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 text-right">
              {services.map((srv, idx) => (
                <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <srv.icon size={24} className="md:w-7 md:h-7" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{srv.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{srv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="bg-blue-950 text-blue-200 py-10 md:py-12 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Zap className="text-yellow-400 mx-auto mb-4 md:mb-6 w-10 h-10 md:w-12 md:h-12" />
            <p className="mb-4 md:mb-6 text-lg md:text-xl text-white font-medium">הייעוץ הראשוני טלפוני הינו בחינם. זמינים עבורכם תמיד.</p>
            <a href={`tel:${phoneNumber}`} className="inline-flex text-yellow-400 hover:text-yellow-300 font-black text-2xl md:text-3xl transition-colors mb-4 no-underline" dir="ltr">{phoneNumber}</a>
            <div className="mt-6 md:mt-8 flex flex-col md:flex-row justify-center items-center gap-4 text-xs md:text-sm opacity-60">
              <span>© {new Date().getFullYear()} חשמלאי 24/7. כל הזכויות שמורות.</span>
              <button onClick={() => setIsTermsOpen(true)} className="hover:text-white hover:underline transition-colors underline">תקנון ותנאי שימוש</button>
            </div>
          </div>
        </footer>

        <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t z-[80] shadow-lg pb-safe">
           <a href={`tel:${phoneNumber}`} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-lg py-3.5 px-6 rounded-xl active:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 no-underline">
              <Phone size={22} fill="currentColor" />
              חייג לחשמלאי ב{selectedCity}
           </a>
        </div>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[90] bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-2xl hover:bg-[#20bd5a] hover:scale-110 transition-all border-2 border-white flex items-center justify-center">
          <MessageCircle size={28} className="md:w-8 md:h-8" fill="currentColor" />
        </a>
        {renderDiagnoserModal()}{renderAccessibilityMenu()}{renderTermsModal()}
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-24 md:pb-0 selection:bg-blue-200">
      <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-400 w-6 h-6 md:w-8 md:h-8" fill="currentColor" />
            <span className="font-black text-xl md:text-2xl tracking-tight">חשמלאי <span className="text-yellow-400">24/7</span></span>
          </div>
          <button className="md:hidden p-1" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">{isMenuOpen ? <X size={26} /> : <Menu size={26} />}</button>
          <div className="hidden md:flex items-center gap-8 font-medium">
            <a href="#areas" className="text-blue-100 hover:text-white transition-colors no-underline">אזורי שירות</a>
            <a href="#services" className="text-blue-100 hover:text-white transition-colors no-underline">שירותים</a>
            <a href={`tel:${phoneNumber}`} className="bg-yellow-400 text-blue-900 px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-yellow-300 transition-all shadow-md no-underline text-blue-900">
              <Phone size={18} fill="currentColor" />{phoneNumber}
            </a>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-blue-800 border-t border-blue-700 absolute w-full shadow-xl z-50">
            <div className="flex flex-col px-4 py-2">
              <a href="#areas" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-white py-3 border-b border-blue-700/50 no-underline">אזורי שירות</a>
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-white py-3 no-underline">שירותים</a>
            </div>
          </div>
        )}
      </nav>

      <section className="relative bg-blue-900 text-white pt-12 md:pt-20 pb-24 md:pb-28 px-4 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-red-600 border border-red-500 text-white rounded-full px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-base font-bold mb-6 md:mb-8 shadow-xl animate-pulse">
            חירום דחוף! עד 25 דקות אצלך
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 tracking-tight leading-[1.1]">
            חשמלאי חירום 24/7 <br className="hidden sm:block"/><span className="text-yellow-400">מומחה ומומלץ עד הבית</span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-blue-100 mb-8 md:mb-10 max-w-2xl mx-auto font-medium px-2">
            מענה מיידי 24 שעות גם בלילה. שירות מהיר, אמין, ומקצועי עם 100% אחריות.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <a href={`tel:${phoneNumber}`} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 md:gap-3 bg-yellow-400 text-blue-900 font-black text-lg md:text-xl py-3.5 px-8 md:py-4 md:px-10 rounded-full hover:bg-yellow-300 transition-all shadow-xl hover:-translate-y-1 text-blue-900 no-underline">
              <Phone size={20} fill="currentColor" className="md:w-6 md:h-6" />חייג עכשיו
            </a>
            <button onClick={() => setIsDiagnoserOpen(true)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 md:gap-3 bg-blue-800 text-white border border-blue-500 font-bold text-lg md:text-xl py-3.5 px-8 md:py-4 md:px-10 rounded-full hover:bg-blue-700 transition-all hover:-translate-y-1 shadow-lg">
              <Sparkles size={20} className="text-yellow-400 md:w-6 md:h-6" />אבחון חכם AI ✨
            </button>
          </div>
        </div>
      </section>

      <section id="areas" className="relative z-20 -mt-12 md:-mt-16 px-3 md:px-4 text-center">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl md:rounded-3xl shadow-xl p-5 sm:p-8 md:p-12 border border-gray-100">
          <h2 className="text-2xl md:text-3xl font-black text-blue-900 mb-6 tracking-tight">בחר עיר לשירות מיידי</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
            {cities.map((city, idx) => (
              <button key={idx} onClick={() => setSelectedCity(city)} className="flex items-center justify-center gap-1.5 md:gap-2 bg-gray-50 hover:bg-blue-600 hover:text-white border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4 transition-all text-gray-800 font-bold text-sm md:text-lg shadow-sm hover:shadow-md">
                <MapPin size={16} className="md:w-5 md:h-5 text-blue-500" />{city}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-10 md:py-16 border-b border-gray-200 mt-6 md:mt-0 text-center">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            {i:Award, t:'יצאת צדיק!'}, 
            {i:Clock, t:'25 דק הגעה'}, 
            {i:Users, t:'+50,000 המלצות'}, 
            {i:ShieldCheck, t:'אחריות מלאה'}
          ].map((x,idx)=>{
            const BadgeIcon = x.i;
            return (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 md:mb-4"><BadgeIcon size={24} className="md:w-8 md:h-8" /></div>
              <span className="font-bold text-base md:text-xl text-gray-900">{x.t}</span>
            </div>
          );})}
        </div>
      </section>

      <footer className="bg-blue-950 text-blue-200 py-10 md:py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Zap className="text-yellow-400 mx-auto mb-4 md:mb-6 w-10 h-10 md:w-12 md:h-12" />
          <p className="mb-4 md:mb-6 text-lg md:text-xl text-white font-medium">הייעוץ הראשוני טלפוני הינו בחינם. זמינים עבורכם תמיד.</p>
          <a href={`tel:${phoneNumber}`} className="inline-flex text-yellow-400 hover:text-yellow-300 font-black text-2xl md:text-3xl transition-colors mb-4 no-underline" dir="ltr">{phoneNumber}</a>
          <div className="mt-6 md:mt-8 flex flex-col md:flex-row justify-center items-center gap-4 text-xs md:text-sm opacity-60">
            <span>© {new Date().getFullYear()} חשמלאי 24/7.</span>
            <button onClick={() => setIsTermsOpen(true)} className="hover:text-white hover:underline transition-colors underline">תקנון ותנאי שימוש</button>
          </div>
        </div>
      </footer>

      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t z-[80] shadow-lg pb-safe">
         <a href={`tel:${phoneNumber}`} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-lg py-3.5 px-6 rounded-xl active:bg-blue-700 transition-colors shadow-lg no-underline">
            <Phone size={22} fill="currentColor" />לחיוג מהיר עכשיו
         </a>
      </div>
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[90] bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-2xl hover:bg-[#20bd5a] hover:scale-110 transition-all border-2 border-white flex items-center justify-center">
        <MessageCircle size={28} className="md:w-8 md:h-8" fill="currentColor" />
      </a>
      {renderDiagnoserModal()}{renderAccessibilityMenu()}{renderTermsModal()}
    </div>
  );
};

export default App;