
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Quiz from './components/Quiz';
import TeacherResults from './components/TeacherResults';
import ExportModal from './components/ExportModal';
import { generateReadingQuiz } from './services/geminiService';
import { QuizData, QuizSubmission } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'teacher' | 'student' | 'results'>('teacher');
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState<QuizData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [savedQuizzes, setSavedQuizzes] = useState<QuizData[]>(() => {
    try {
      const saved = localStorage.getItem('leemeester_quizzes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [submissions, setSubmissions] = useState<QuizSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('leemeester_submissions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Robust UTF-8 safe Base64 encoding for the URL
  const encodeQuiz = (quiz: QuizData) => {
    try {
      const json = JSON.stringify(quiz);
      const uint8 = new TextEncoder().encode(json);
      let binString = "";
      uint8.forEach((byte) => { binString += String.fromCharCode(byte); });
      return btoa(binString);
    } catch (e) {
      console.error("Encoding failed", e);
      return null;
    }
  };

  const decodeQuiz = (encoded: string): QuizData | null => {
    try {
      const binString = atob(encoded);
      const uint8 = new Uint8Array(binString.length);
      for (let i = 0; i < binString.length; i++) {
        uint8[i] = binString.charCodeAt(i);
      }
      const json = new TextDecoder().decode(uint8);
      return JSON.parse(json);
    } catch (e) {
      console.error("Decoding failed", e);
      return null;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const portableData = params.get('d');
    
    if (portableData) {
      const quiz = decodeQuiz(portableData);
      if (quiz) {
        setActiveQuiz(quiz);
        setView('student');
        setSavedQuizzes(prev => {
          if (prev.find(q => q.id === quiz.id)) return prev;
          return [quiz, ...prev];
        });
      } else {
        setError("De link is te lang voor deze browser. Vraag de leerkracht om de Export-optie (PDF/Print) te gebruiken.");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('leemeester_quizzes', JSON.stringify(savedQuizzes));
    localStorage.setItem('leemeester_submissions', JSON.stringify(submissions));
  }, [savedQuizzes, submissions]);

  const handleStartProcessing = async (type: 'text' | 'url' | 'file', value: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateReadingQuiz(value, type === 'url');
      setSavedQuizzes([data, ...savedQuizzes]);
      setActiveQuiz(data);
      setShowShareModal(data.id);
    } catch (err) {
      setError('Er ging iets mis. Probeer een kortere tekst.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmission = (sub: QuizSubmission) => {
    setSubmissions([...submissions, sub]);
  };

  const getQuizUrl = (id: string) => {
    const quiz = savedQuizzes.find(q => q.id === id);
    if (!quiz) return window.location.origin + window.location.pathname;
    const encoded = encodeQuiz(quiz);
    return `${window.location.origin}${window.location.pathname}?d=${encoded}`;
  };

  const copyLink = (id: string) => {
    const url = getQuizUrl(id);
    navigator.clipboard.writeText(url).then(() => {
      alert('Link gekopieerd!');
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 print:bg-white">
      <div className="print:hidden">
        <Header />
      </div>
      
      <main className="max-w-6xl mx-auto px-6 py-12 print:p-0">
        {error && (
          <div className="mb-8 bg-red-100 border-2 border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in">
            <span className="text-2xl">⚠️</span>
            <div className="flex-grow font-bold">{error}</div>
            <button onClick={() => setError(null)} className="font-black">X</button>
          </div>
        )}

        {loading && (
          <div className="text-center py-20 animate-pulse print:hidden">
            <div className="w-20 h-20 border-8 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-2xl font-black text-blue-900">LeesMeester maakt de quiz...</h3>
          </div>
        )}

        {showShareModal && (
          <div className="fixed inset-0 bg-blue-900 bg-opacity-80 z-[100] flex items-center justify-center p-6 backdrop-blur-sm print:hidden">
            <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl scale-in-center">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Deel met de klas 📢</h3>
              <div className="bg-white p-4 inline-block rounded-2xl border-4 border-blue-50 mb-6">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getQuizUrl(showShareModal))}`} 
                  alt="QR Code" 
                  className="w-48 h-48"
                />
              </div>
              <div className="space-y-3">
                <button onClick={() => copyLink(showShareModal)} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-md hover:bg-blue-700 transition-all">Kopieer Link</button>
                <button 
                  onClick={() => {
                    const q = savedQuizzes.find(item => item.id === showShareModal);
                    if (q) setShowExportModal(q);
                    setShowShareModal(null);
                  }} 
                  className="w-full bg-yellow-400 text-yellow-900 py-3 rounded-2xl font-bold"
                >
                  Andere deelopties (Export/Print)
                </button>
                <button onClick={() => setShowShareModal(null)} className="w-full bg-gray-100 text-gray-600 py-3 rounded-2xl font-bold">Sluiten</button>
              </div>
            </div>
          </div>
        )}

        {showExportModal && (
          <ExportModal quiz={showExportModal} onClose={() => setShowExportModal(null)} />
        )}

        {!loading && view === 'teacher' && !activeQuiz && (
          <div className="space-y-12 print:hidden">
            <div className="text-center">
              <h2 className="text-4xl font-black text-blue-900 mb-2">Hoi Meester of Juf! 👋</h2>
              <p className="text-blue-500 font-medium">Maak een quiz van een link, PDF of eigen tekst.</p>
            </div>
            
            <FileUpload onStartProcessing={handleStartProcessing} isLoading={false} />

            {savedQuizzes.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-black text-blue-900 mb-8">Jouw Quiz-archief</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {savedQuizzes.map(q => (
                    <div key={q.id} className="bg-white p-6 rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-200 transition-all flex flex-col">
                      <h4 className="font-bold text-blue-900 mb-4 truncate text-lg">{q.title}</h4>
                      <div className="mt-auto space-y-2">
                        <div className="flex gap-2">
                          <button onClick={() => { setActiveQuiz(q); setView('results'); }} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-xs font-bold">Resultaten</button>
                          <button onClick={() => setShowShareModal(q.id)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-xs font-bold">QR-Code</button>
                        </div>
                        <button onClick={() => setShowExportModal(q)} className="w-full border-2 border-blue-100 text-blue-400 py-2 rounded-xl text-xs font-bold hover:bg-blue-50 transition-all">Export / Print</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && view === 'results' && activeQuiz && (
          <div className="print:hidden">
            <TeacherResults 
              quiz={activeQuiz} 
              submissions={submissions.filter(s => s.quizId === activeQuiz.id)} 
              onBack={() => { setActiveQuiz(null); setView('teacher'); }} 
            />
          </div>
        )}

        {!loading && activeQuiz && view !== 'results' && (
          <Quiz 
            data={activeQuiz} 
            isStudentView={view === 'student'} 
            onSubmit={handleSubmission} 
            onReset={() => { 
              setActiveQuiz(null); 
              setView('teacher'); 
              window.history.replaceState({}, '', window.location.pathname); 
            }} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
