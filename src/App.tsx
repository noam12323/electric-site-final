import { useState } from 'react';
import { Phone, Zap, MapPin, Clock, ShieldCheck, Wrench, Menu, X, Sparkles, AlertTriangle, Loader2, Users, Award, Percent, ArrowLeft, Accessibility, MessageCircle, FileText } from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const cities = ['אשקלון', 'אשדוד', 'יבנה', 'רחובות', 'נס ציונה', 'באר יעקב', 'ראשון לציון', 'חולון', 'בת ים', 'תל אביב', 'יפו', 'רמת גן', 'גבעתיים', 'בני ברק', 'פתח תקווה', 'הרצליה', 'רמת השרון', 'רעננה', 'כפר סבא', 'נתניה'];
  const services = [{ title: 'קצרים ותקלות חשמל', icon: Zap, desc: 'איתור וטיפול בקצרים מקצועי.' }, { title: 'החלפת לוחות חשמל', icon: ShieldCheck, desc: 'שדרוג לוחות חשמל.' }, { title: 'התקנת גופי תאורה', icon: Wrench, desc: 'התקנת תאורה ונקודות חשמל.' }];

  const phoneNumber = "050-4278183";
  const waLink = `https://wa.me/972504278183`;

  const analyzeFault = async () => {
    if (!faultDescription.trim()) return;
    setIsAiLoading(true);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=`;
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: faultDescription }] }], systemInstruction: { parts: [{ text: "עוזר חשמלאי חכם" }] } }) });
      const data = await response.json();
      setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "חייגו לייעוץ.");
    } catch { setAiResponse("חייגו לייעוץ."); }
    setIsAiLoading(false);
  };

  return (
    <div dir="rtl" className={`min-h-screen ${accHighContrast ? 'bg-black text-yellow-400' : 'bg-gray-50'}`}>
      <header className="bg-blue-900 text-white p-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2"><Zap className="text-yellow-400" /><b>חשמלאי 24/7</b></div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden"><Menu /></button>
      </header>

      <main className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-4xl font-black mb-6">חשמלאי חירום {selectedCity ? `ב${selectedCity}` : ''}</h1>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <a href={`tel:${phoneNumber}`} className="bg-yellow-400 text-blue-900 p-4 rounded-full font-bold no-underline flex items-center gap-2"><Phone />חייג עכשיו</a>
          <button onClick={() => setIsDiagnoserOpen(true)} className="bg-blue-800 text-white p-4 rounded-full font-bold flex items-center gap-2"><Sparkles />אבחון AI</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {cities.map((c) => (<button key={c} onClick={() => setSelectedCity(c)} className="bg-white p-3 rounded-xl border border-gray-200 hover:bg-blue-600 hover:text-white transition-all">{c}</button>))}
        </div>
      </main>

      {isDiagnoserOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full relative text-gray-800">
            <button onClick={() => setIsDiagnoserOpen(false)} className="absolute top-4 left-4"><X /></button>
            <h2 className="text-xl font-bold mb-4">אבחון תקלה AI</h2>
            <textarea className="w-full border p-3 rounded-xl h-32 mb-4" placeholder="תאר את התקלה..." value={faultDescription} onChange={(e) => setFaultDescription(e.target.value)} />
            <button onClick={analyzeFault} disabled={isAiLoading} className="bg-blue-900 text-white w-full py-3 rounded-xl">{isAiLoading ? <Loader2 className="animate-spin mx-auto" /> : 'אבחן'}</button>
            {aiResponse && <p className="mt-4 p-3 bg-blue-50 rounded-xl">{aiResponse}</p>}
          </div>
        </div>
      )}
      
      <a href={waLink} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl"><MessageCircle size={30} /></a>
    </div>
  );
};

export default App;