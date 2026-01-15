
import React, { useState } from 'react';
import { QuizData } from '../types';

interface ExportModalProps {
  quiz: QuizData;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ quiz, onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    });
  };

  const getKahootFormat = () => {
    // Basic format: Question, Choice 1, Choice 2, Choice 3, Choice 4, Time, Correct Answers
    return quiz.questions
      .filter(q => !q.isOpen)
      .map(q => {
        const opts = q.options || ['', '', '', ''];
        return `${q.text}\t${opts[0]}\t${opts[1]}\t${opts[2] || ''}\t${opts[3] || ''}\t20\t${(q.correctAnswerIndex || 0) + 1}`;
      })
      .join('\n');
  };

  const getFormsFormat = () => {
    return quiz.questions.map((q, i) => {
      let text = `${i + 1}. ${q.text}\n`;
      if (q.isOpen) {
        text += "[Open vraag]\n";
      } else {
        q.options?.forEach((opt, oi) => {
          text += `${String.fromCharCode(65 + oi)}) ${opt}\n`;
        });
        text += `Correct: ${String.fromCharCode(65 + (q.correctAnswerIndex || 0))}\n`;
      }
      return text;
    }).join('\n');
  };

  return (
    <div className="fixed inset-0 bg-blue-900 bg-opacity-80 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-blue-900">Quiz Exporteren</h3>
            <p className="text-blue-500">Kies hoe je de vragen bij de leerlingen wilt krijgen.</p>
          </div>
          <button onClick={onClose} className="text-blue-300 hover:text-blue-600 text-2xl font-black">×</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kahoot / Quizizz Option */}
          <div className="border-2 border-blue-50 p-6 rounded-2xl hover:border-purple-200 transition-colors group">
            <div className="text-3xl mb-4">💜</div>
            <h4 className="font-bold text-blue-900 mb-2">Kahoot / Quizizz</h4>
            <p className="text-xs text-blue-400 mb-4">Kopieer en plak direct in de 'Import Spreadsheet' functie van Kahoot of Quizizz.</p>
            <button 
              onClick={() => copyToClipboard(getKahootFormat(), 'kahoot')}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
            >
              {copiedType === 'kahoot' ? '✅ Gekopieerd!' : 'Kopieer voor Import'}
            </button>
          </div>

          {/* Google Forms Option */}
          <div className="border-2 border-blue-50 p-6 rounded-2xl hover:border-green-200 transition-colors group">
            <div className="text-3xl mb-4">📝</div>
            <h4 className="font-bold text-blue-900 mb-2">Google Forms</h4>
            <p className="text-xs text-blue-400 mb-4">Een overzichtelijke lijst met vragen en antwoorden om handmatig over te nemen.</p>
            <button 
              onClick={() => copyToClipboard(getFormsFormat(), 'forms')}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-700 transition-all"
            >
              {copiedType === 'forms' ? '✅ Gekopieerd!' : 'Kopieer Lijst'}
            </button>
          </div>

          {/* Print Option */}
          <div className="border-2 border-blue-50 p-6 rounded-2xl hover:border-yellow-200 transition-colors group md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🖨️</div>
              <div className="flex-grow">
                <h4 className="font-bold text-blue-900">Print op Papier</h4>
                <p className="text-xs text-blue-400">Maak een mooi werkblad voor in de klas.</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="bg-yellow-400 text-yellow-900 px-8 py-3 rounded-xl font-bold shadow-md hover:bg-yellow-500 transition-all"
              >
                Print Quiz
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-blue-50 text-center">
          <p className="text-sm text-blue-300 italic mb-4">Wil je de leerlingen toch op hun eigen tablet laten werken?</p>
          <button 
            onClick={onClose}
            className="text-blue-600 font-bold hover:underline"
          >
            Start de quiz hier op het scherm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
