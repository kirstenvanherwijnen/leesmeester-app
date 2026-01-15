
import React, { useState } from 'react';
import { QuizData, QuizSubmission } from '../types';

interface QuizProps {
  data: QuizData;
  isStudentView?: boolean;
  onSubmit?: (submission: QuizSubmission) => void;
  onReset: () => void;
}

const Quiz: React.FC<QuizProps> = ({ data, isStudentView, onSubmit, onReset }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [answers, setAnswers] = useState<{ [key: string]: string | number }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showText, setShowText] = useState(false);

  const currentQuestion = data.questions[currentIdx];

  const handleNext = () => {
    if (currentIdx < data.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowFeedback(false);
    } else {
      if (isStudentView) {
        submitQuiz();
      } else {
        setIsFinished(true);
      }
    }
  };

  const submitQuiz = () => {
    if (!studentName && isStudentView) return alert('Vul eerst je naam in!');
    
    let score = 0;
    let mcCount = 0;
    data.questions.forEach(q => {
      if (!q.isOpen) {
        mcCount++;
        if (answers[q.id] === q.correctAnswerIndex) score++;
      }
    });

    const submission: QuizSubmission = {
      id: Math.random().toString(36).substr(2, 9),
      quizId: data.id,
      studentName: studentName || 'Anoniem',
      answers,
      score,
      maxScore: mcCount,
      submittedAt: Date.now()
    };

    onSubmit?.(submission);
    setIsFinished(true);
  };

  if (isStudentView && !studentName && !isFinished) {
    return (
      <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-xl text-center border-4 border-blue-50 print:hidden">
        <div className="text-5xl mb-6">👋</div>
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Klaar voor de start?</h2>
        <input 
          type="text" 
          placeholder="Jouw naam..." 
          className="w-full p-4 rounded-2xl border-2 border-blue-100 mb-6 text-center text-lg focus:border-blue-400 focus:outline-none transition-all"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <button 
          onClick={() => studentName && setCurrentIdx(0)}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
        >
          Start de Vragen!
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl text-center border-4 border-blue-50 print:hidden">
        <div className="text-6xl mb-6">🚀</div>
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Goed gedaan!</h2>
        <p className="text-lg text-blue-500 mb-8">Je hebt alle vragen beantwoord.</p>
        <button onClick={onReset} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all">
          Terug naar het begin
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Print-Only Header */}
      <div className="hidden print:block mb-8 border-b-2 border-black pb-4">
        <div className="flex justify-between items-end mb-4">
          <h1 className="text-3xl font-bold">Naam: ___________________________</h1>
          <p className="text-sm font-bold">Datum: ___ / ___ / 20___</p>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">Leestoets: {data.title}</h2>
      </div>

      {/* Interactive Header Info */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-black text-blue-900">{data.title}</h3>
          <p className="text-blue-500 font-medium italic">Succes met de vragen!</p>
        </div>
        
        <button 
          onClick={() => setShowText(!showText)}
          className="bg-blue-100 text-blue-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-200 transition-all"
        >
          {showText ? '🙈 Verberg Tekst' : '📖 Toon Tekst'}
        </button>
      </div>

      {/* Print-Only Content or Interactive View */}
      <div className="hidden print:block">
        <div className="mb-8 p-6 border-2 border-gray-200 rounded-lg italic text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
          {data.fullText}
        </div>
        <div className="space-y-8">
          {data.questions.map((q, i) => (
            <div key={q.id} className="break-inside-avoid mb-6">
              <p className="font-bold text-lg mb-2">{i + 1}. {q.text}</p>
              {q.isOpen ? (
                <div className="h-24 border-b-2 border-gray-200 mt-2"></div>
              ) : (
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {q.options?.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black rounded-full"></div>
                      <span className="text-base">{String.fromCharCode(65 + oi)}) {opt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Panel */}
      <div className="print:hidden">
        {showText && (
          <div className="bg-white rounded-3xl shadow-inner p-8 border-2 border-blue-100 mb-8 max-h-96 overflow-y-auto">
            <div className="text-lg text-blue-800 leading-relaxed whitespace-pre-wrap">
              {data.fullText}
            </div>
          </div>
        )}

        <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-10">
            <span className="bg-blue-500 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-blue-400">
              Vraag {currentIdx + 1} van {data.questions.length}
            </span>
            <span className="text-blue-200 font-bold text-sm bg-blue-700 px-4 py-2 rounded-full">
              {currentQuestion.category}
            </span>
          </div>

          <div className="flex-grow">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-tight">
              {currentQuestion.text}
            </h2>

            {currentQuestion.isOpen ? (
              <textarea
                className="w-full p-6 rounded-2xl text-blue-900 min-h-[200px] focus:outline-none shadow-xl text-lg border-4 border-blue-400 focus:border-white transition-all"
                placeholder="Typ hier jouw antwoord..."
                value={(answers[currentQuestion.id] as string) || ''}
                onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options?.map((opt, i) => {
                  const isSelected = answers[currentQuestion.id] === i;
                  const isCorrect = i === currentQuestion.correctAnswerIndex;
                  
                  let btnClass = "bg-blue-500 bg-opacity-20 border-2 border-blue-400 hover:bg-opacity-40 hover:border-blue-300";
                  if (isSelected) btnClass = "bg-white text-blue-900 border-white shadow-xl scale-[1.02]";
                  if (showFeedback) {
                    if (isCorrect) btnClass = "bg-green-400 text-green-900 border-green-200 shadow-lg scale-[1.02]";
                    else if (isSelected) btnClass = "bg-red-400 text-red-900 border-red-200 opacity-80";
                    else btnClass = "opacity-40 border-transparent";
                  }

                  return (
                    <button
                      key={i}
                      disabled={showFeedback}
                      onClick={() => setAnswers({ ...answers, [currentQuestion.id]: i })}
                      className={`w-full text-left p-6 rounded-2xl font-bold transition-all flex items-center gap-5 text-lg ${btnClass}`}
                    >
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-black bg-opacity-10 flex items-center justify-center font-black">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-10 flex gap-4">
            {!showFeedback || currentQuestion.isOpen ? (
              <button 
                onClick={currentQuestion.isOpen ? handleNext : () => setShowFeedback(true)}
                disabled={answers[currentQuestion.id] === undefined && !currentQuestion.isOpen}
                className="w-full bg-yellow-400 text-yellow-900 py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-yellow-500 disabled:opacity-50 transition-all active:scale-95"
              >
                {currentQuestion.isOpen ? (currentIdx === data.questions.length - 1 ? 'Afronden 🏁' : 'Volgende Vraag →') : 'Antwoord Controleren'}
              </button>
            ) : (
              <button 
                onClick={handleNext} 
                className="w-full bg-white text-blue-900 py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-blue-50 transition-all active:scale-95"
              >
                {currentIdx === data.questions.length - 1 ? 'Afronden 🏁' : 'Volgende Vraag →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
