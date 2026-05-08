import { useState } from 'react';
import { Phone, Zap, MapPin, Clock, ShieldCheck, Wrench, Menu, X, Star, Sparkles, AlertTriangle, Loader2, Users, Award, Percent, ArrowLeft, Accessibility, MessageCircle, FileText } from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // הגדרה מפורשת של סוג המשתנה כדי למנוע שגיאות TypeScript
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  // State for Gemini AI Diagnoser
  const [isDiagnoserOpen, setIsDiagnoserOpen] = useState(false);
  const [faultDescription, setFaultDescription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // State for Accessibility Menu
  const [accMenuOpen, setAccMenuOpen] = useState(false);
  const [accHighContrast, setAccHighContrast] = useState(false);
  const [accLargeText, setAccLargeText] = useState(false);
  const [accHighlightLinks, setAccHighlightLinks] = useState(false);

  // State for Terms of Service (Takanon)
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
    
    const systemInstruction = `אתה עוזר וירטואלי חכם של 'חשמלאי 24 שעות'. תפקידך להעריך תקלות חשמל שגולשים כותבים, לתת טיפ בטיחות קצר ומיידי, ולהמליץ להם להתקשר מיד לחשמלאי חירום במספר ${phoneNumber}. ציין שאנחנו מגיעים עד 25 דקות.`;
    
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
      setAiResponse("אירעה שגיאה. אנא חייגו אלינו ישירות.");
    }
    setIsAiLoading(false);
  };

  const renderDiagnoserModal = () => {
    if (!isDiagnoserOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative flex flex-col max-h-[90vh] border border-gray-100 overflow-y-auto">
          <button onClick={() => setIsDiagnoserOpen(false)} className="absolute top-4 left-4 text-gray-400 bg-gray-100 rounded-full p-2"><X size={20} /></button>
          <div className="flex items-center gap-3 mb-4 mt-2"><div className="bg-yellow-100 p-2 rounded-2xl text-yellow-600"><Sparkles size={24} /></div><h2 className="text-xl font-black text-blue-900">אבחון תקלה AI ✨</h2></div>
          <p className="text-gray-600 mb-5 text-sm leading-relaxed">תארו את התקלה במילים שלכם וקבלו הערכת מצב מהירה.</p>
          <textarea className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 h-28 mb-5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="לדוגמה: שמעתי פיצוץ מהשקע..." value={faultDescription} onChange={(e) => setFaultDescription(e.target.value)} />
          <button onClick={analyzeFault} disabled={isAiLoading || !faultDescription.trim()} className="bg-blue-900 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">{isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="text-yellow-400" />}בצע אבחון מהיר</button>
          {aiResponse && <div className="mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4"><div className="flex items-start gap-3"><AlertTriangle className="text-yellow-600 mt-1 shrink-0" size={20} /><p className="text-blue-900 font-medium text-sm">{aiResponse}</p></div><a href={`tel:${phoneNumber}`} className="mt-5 w-full flex items-center justify-center gap-2 bg-yellow-400 text-blue-900 font-black py-3 rounded-xl shadow-md text-base"><Phone size={18} />חיוג חירום מיידי</a></div>}
        </div>
      </div>
    );
  };

  const renderTermsModal = () => {
    if (!isTermsOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 relative flex flex-col max-h-[90vh] overflow-hidden">
          <button onClick={() => setIsTermsOpen(false)} className="absolute top-4 left-4 text-gray-400 bg-gray-100 rounded-full p-2 z-10"><X size={20} /></button>
          <div className="flex items-center gap-3 mb-6"><div className="bg-blue-100 p-2 rounded-2xl text-blue-600"><FileText size={24} /></div><h2 className="text-xl font-black text-blue-900">תקנון ותנאי שימוש</h2></div>
          <div className="overflow-y-auto text-gray-700 space-y-4 text-sm leading-relaxed">
            <p>1. כל העבודות מבוצעות ע"י חשמלאי מוסמך בעל רישיון בתוקף.</p>
            <p>2. הצעת מחיר סופית ומדויקת תינתן רק לאחר בדיקה פיזית של התקלה בשטח.</p>
            <p>3. התחייבות לזמני הגעה כפופה לעומסי תנועה וזמינות כוננים באזור.</p>
            <p>4. אבחון ה-AI הוא כלי עזר בטיחותי בלבד ואינו מחליף ייעוץ מקצועי.</p>
            <p>5. אחריות ניתנת על העבודה והחלפים שסופקו על ידינו בלבד.</p>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end"><button onClick={() => setIsTermsOpen(false)} className="bg-blue-900 text-white font-bold py-2 px-6 rounded-xl">סגור</button></div>
        </div>
      </div>
    );
  };

  const renderAccessibilityMenu = () => {
    return (
      <>
        <style>{`#root, body, html { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; } ${accHighContrast ? '* { background-color: #000 !important; color: #ffeb3b !important; border-color: #fff !important; }' : ''} ${accLargeText ? '* { font-size: 110% !important; }' : ''} ${accHighlightLinks ? 'a, button { text-decoration: underline !important; }' : ''}`}</style>
        <div className="fixed top-20 left-4 z-[90] flex flex-col items-start" dir="rtl">
          <button onClick={() => setAccMenuOpen(!accMenuOpen)} className="bg-blue-600 text-white p-2 rounded-full shadow-xl border-2 border-white"><Accessibility size={24} /></button>
          {accMenuOpen && (
            <div className="mt-2 bg-white text-gray-800 rounded-2xl shadow-2xl p-4 w-52 border border-gray-200">
              <h3 className="font-bold mb-3 border-b pb-2">נגישות</h3>
              <div className="flex flex-col gap-2">
                <button onClick={() => setAccHighContrast(!accHighContrast)} className={`py-2 px-3 rounded-lg text-xs font-medium ${accHighContrast ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>ניגודיות גבוהה</button>
                <button onClick={() => setAccLargeText(!accLargeText)} className={`py-2 px-3 rounded-lg text-xs font-medium ${accLargeText ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>טקסט מוגדל</button>
                <button onClick={() => setAccHighlightLinks(!accHighlightLinks)} className={`py-2 px-3 rounded-lg text-xs font-medium ${accHighlightLinks ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>הדגשת קישורים</button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  if (selectedCity) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-24 selection:bg-blue-200">
        <header className="bg-blue-900 text-white p-3 sticky top-0 z-50 border-b border-blue-800 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
             <button onClick={() => setSelectedCity(null)} className="flex items-center gap-1 text-blue-200 bg-blue-800 px-3 py-1.5 rounded-xl text-xs font-medium"><ArrowLeft size={16} />חזרה לכל הערים</button>
             <div className="flex items-center gap-1 font-black text-lg tracking-tight"><Zap className="text-yellow-400 w-5 h-5" fill="currentColor" />חשמלאי 24/7</div>
          </div>
        </header>

        <section className="bg-blue-900 text-white py-12 px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-red-600 rounded-full px-4 py-1.5 text-xs font-bold mb-6 animate-pulse shadow-lg">זמינות מיידית ב{selectedCity}!</div>
          <h1 className="text-3xl md:text-6xl font-black mb-4">חשמלאי מוסמך ב<span className="text-yellow-400 block sm:inline">{selectedCity}</span></h1>
          <p className="text-base md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-medium leading-relaxed">תקלת חשמל דחופה? מענה 24 שעות גם בשעות הלילה המאוחרות! שירות מקצועי עם אחריות מלאה.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a href={`tel:${phoneNumber}`} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-yellow-400 text-blue-900 font-black text-lg py-3.5 px-6 rounded-full shadow-lg"><Phone size={20} fill="currentColor" />הזמן חשמלאי עכשיו</a>
            <button onClick={() => setIsDiagnoserOpen(true)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-800 text-white border border-blue-500 font-bold text-lg py-3.5 px-6 rounded-full"><Sparkles size={20} className="text-yellow-400" />אבחון תקלה AI ✨</button>
          </div>
        </section>

        <section className="bg-white py-8 border-b border-gray-200"><div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">{[{i:Clock, t:'הגעה עד 25 דק', c:'red'}, {i:Award, t:'יצאת צדיק!', c:'blue'}, {i:Users, t:'+50,000 המלצות', c:'green'}, {i:Percent, t:'מחירים הוגנים', c:'yellow'}].map((x,i)=>(<div key={i} className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl"><x.i size={24} className={x.c === 'red' ? 'text-red-600 mb-2' : x.c === 'blue' ? 'text-blue-600 mb-2' : x.c === 'green' ? 'text-green-600 mb-2' : 'text-yellow-600 mb-2'} /><h3 className="font-bold text-sm">{x.t}</h3></div>))}</div></section>

        <section className="py-12 bg-gray-50 px-4"><div className="max-w-6xl mx-auto"><h2 className="text-2xl font-black text-blue-900 mb-10 text-center">שירותי חשמל ב{selectedCity}</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-5">{services.map((s,i)=>(<div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group"><div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all"><s.icon size={24} /></div><h3 className="font-bold mb-2">{s.title}</h3><p className="text-sm text-gray-600">{s.desc}</p></div>))}</div></div></section>

        <footer className="bg-blue-950 text-blue-200 py-10 text-center px-4"><Zap className="text-yellow-400 mx-auto mb-4" /><p className="mb-4 text-white font-medium">ייעוץ ראשוני בחינם: <a href={`tel:${phoneNumber}`} className="text-yellow-400 font-black tracking-widest">{phoneNumber}</a></p><div className="flex flex-col md:flex-row justify-center items-center gap-4 text-xs opacity-60"><span>© {new Date().getFullYear()} חשמלאי 24/7.</span><button onClick={()=>setIsTermsOpen(true)} className="hover:underline">תקנון</button></div></footer>
        
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t z-[80] shadow-lg"><a href={`tel:${phoneNumber}`} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-lg py-3 rounded-xl shadow-lg"><Phone size={22} fill="currentColor" />חייג לחשמלאי ב{selectedCity}</a></div>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-20 md:bottom-8 right-4 z-[90] bg-[#25D366] text-white p-3 rounded-full shadow-2xl border-2 border-white flex items-center justify-center">
           <MessageCircle size={28} fill="currentColor" />
        </a>
        {renderDiagnoserModal()}{renderAccessibilityMenu()}{renderTermsModal()}
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-24 selection:bg-blue-200">
      <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center"><div className="flex items-center gap-2 font-black text-xl tracking-tight"><Zap className="text-yellow-400" fill="currentColor" />חשמלאי 24/7</div><button className="md:hidden" onClick={()=>setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={26}/> : <Menu size={26}/>}</button><div className="hidden md:flex items-center gap-8"><a href="#areas" className="hover:text-yellow-400">אזורי שירות</a><a href="#services" className="hover:text-yellow-400">שירותים</a><a href={`tel:${phoneNumber}`} className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-bold">{phoneNumber}</a></div></div>
        {isMenuOpen && <div className="md:hidden bg-blue-800 flex flex-col p-4 border-t border-blue-700 shadow-xl"><a href="#areas" className="py-3">אזורי שירות</a><a href="#services" className="py-3">שירותים</a><a href="#about" className="py-3">אודות</a></div>}
      </nav>

      <section className="bg-blue-900 text-white py-12 md:py-20 px-4 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto"><div className="inline-flex bg-red-600 rounded-full px-5 py-2 text-xs font-bold mb-6 animate-pulse">חירום דחוף! עד 25 דקות אצלך</div><h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight">חשמלאי חירום 24/7 <br/><span className="text-yellow-400">מומחה ומומלץ עד הבית</span></h1><p className="text-lg md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">מענה מיידי 24 שעות גם בלילה. שירות מהיר, אמין ומקצועי עם 100% אחריות.</p><div className="flex flex-col sm:flex-row gap-4 justify-center items-center"><a href={`tel:${phoneNumber}`} className="w-full sm:w-auto bg-yellow-400 text-blue-900 font-black text-xl py-4 px-10 rounded-full shadow-xl"><Phone size={24} fill="currentColor" className="inline ml-2" />חייג עכשיו</a><button onClick={()=>setIsDiagnoserOpen(true)} className="w-full sm:w-auto bg-blue-800 text-white border border-blue-500 font-bold text-xl py-4 px-10 rounded-full shadow-lg"><Sparkles size={24} className="text-yellow-400 inline ml-2" />אבחון חכם ✨</button></div></div>
      </section>

      <section id="areas" className="relative z-20 -mt-12 px-3"><div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center"><h2 className="text-2xl font-black text-blue-900 mb-6">בחר עיר לשירות מיידי</h2><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">{cities.map((c,i)=>(<button key={i} onClick={()=>setSelectedCity(c)} className="bg-gray-50 hover:bg-blue-600 hover:text-white border rounded-xl p-3 font-bold text-sm shadow-sm transition-all">{c}</button>))}</div></div></section>

      <section className="bg-gray-50 py-16 px-4 text-center"><div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">{[{i:Award, t:'יצאת צדיק!'}, {i:Clock, t:'25 דק הגעה'}, {i:Users, t:'+50,000 המלצות'}, {i:ShieldCheck, t:'אחריות מלאה'}].map((x,i)=>(<div key={i} className="flex flex-col items-center"><div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4"><x.i size={32} /></div><span className="font-bold text-lg">{x.t}</span></div>))}</div></section>

      <footer className="bg-blue-950 text-blue-200 py-12 text-center px-4"><Zap className="text-yellow-400 mx-auto mb-6 w-12 h-12" /><p className="mb-6 text-xl text-white font-medium">ייעוץ חינם: <a href={`tel:${phoneNumber}`} className="text-yellow-400 font-black" dir="ltr">{phoneNumber}</a></p><div className="flex flex-col md:flex-row justify-center items-center gap-4 text-xs opacity-60"><span>© {new Date().getFullYear()} חשמלאי 24/7.</span><button onClick={()=>setIsTermsOpen(true)} className="hover:underline">תקנון</button></div></footer>
      
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t z-[80] shadow-xl"><a href={`tel:${phoneNumber}`} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-lg py-3 rounded-xl shadow-lg"><Phone size={22} fill="currentColor" />חייג מהיר עכשיו</a></div>
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-20 md:bottom-8 right-4 z-[90] bg-[#25D366] text-white p-3 rounded-full shadow-2xl border-2 border-white flex items-center justify-center">
         <MessageCircle size={28} fill="currentColor" />
      </a>
      {renderDiagnoserModal()}{renderAccessibilityMenu()}{renderTermsModal()}
    </div>
  );
};

export default App;