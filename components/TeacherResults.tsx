
import React from 'react';
import { QuizData, QuizSubmission } from '../types';

interface TeacherResultsProps {
  quiz: QuizData;
  submissions: QuizSubmission[];
  onBack: () => void;
}

const TeacherResults: React.FC<TeacherResultsProps> = ({ quiz, submissions, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-blue-50">
      <div className="bg-blue-600 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{quiz.title}</h2>
          <p className="opacity-80">{submissions.length} leerlingen hebben op DIT apparaat de quiz gemaakt.</p>
        </div>
        <button onClick={onBack} className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all">
          Terug naar Menu
        </button>
      </div>

      <div className="p-8">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
          <span className="text-2xl">💡</span>
          <div className="text-sm text-yellow-800">
            <p className="font-bold mb-1">Hoe werkt dit overzicht?</p>
            <p>Omdat de app geen centrale database gebruikt, zie je hier de resultaten die <strong>op dit apparaat</strong> zijn ingevuld. Als leerlingen op hun eigen tablet werken, kun je aan het eind van de les even bij hen kijken of hen hun score laten zien.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-blue-50 text-sm uppercase tracking-wider">
                <th className="py-4 px-2 text-blue-900 font-black">Leerling</th>
                <th className="py-4 px-2 text-blue-900 font-black">Score</th>
                <th className="py-4 px-2 text-blue-900 font-black">Open Antwoorden</th>
                <th className="py-4 px-2 text-blue-900 font-black">Tijdstip</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-b border-blue-50 hover:bg-blue-50 transition-colors">
                  <td className="py-4 px-2 font-bold text-blue-800 text-lg">{s.studentName}</td>
                  <td className="py-4 px-2">
                    <span className={`inline-flex items-center justify-center w-16 h-10 rounded-xl font-black ${s.score / s.maxScore >= 0.6 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.score}/{s.maxScore}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <details className="group cursor-pointer">
                      <summary className="text-sm font-bold text-blue-600 group-hover:text-blue-800 flex items-center gap-1">
                        Bekijk details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="mt-3 space-y-4 text-blue-900 bg-blue-50 p-4 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
                        {quiz.questions.map(q => {
                          const answer = s.answers[q.id];
                          if (q.isOpen) {
                            return (
                              <div key={q.id} className="border-b border-blue-100 pb-3 last:border-0">
                                <p className="text-xs font-black text-blue-400 uppercase mb-1">{q.category}</p>
                                <p className="font-bold text-sm mb-1">{q.text}</p>
                                <p className="italic text-blue-700 bg-white p-2 rounded-lg text-sm">"{answer || 'Geen antwoord'}"</p>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </details>
                  </td>
                  <td className="py-4 px-2 text-blue-400 text-xs font-medium">
                    {new Date(s.submittedAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="text-4xl mb-4">🏜️</div>
                    <p className="text-blue-300 font-bold text-lg">Nog geen resultaten binnengekomen op dit apparaat.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherResults;
