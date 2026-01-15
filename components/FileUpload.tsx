
import React, { useState } from 'react';

interface FileUploadProps {
  onStartProcessing: (type: 'text' | 'url' | 'file', value: any) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onStartProcessing, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'url' | 'pdf' | 'text'>('url');
  const [inputValue, setInputValue] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result?.toString().split(',')[1];
        if (base64) {
          onStartProcessing('file', { data: base64, mimeType: file.type });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!inputValue.trim() && activeTab !== 'pdf') return;
    onStartProcessing(activeTab as any, inputValue);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-blue-50 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Wat gaan we vandaag lezen?</h2>
      
      <div className="flex bg-blue-50 p-1 rounded-2xl mb-8">
        {[
          { id: 'url', label: 'Internet Link' },
          { id: 'pdf', label: 'Upload PDF' },
          { id: 'text', label: 'Eigen Tekst' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-blue-400 hover:text-blue-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'url' && (
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2">Plak een URL van een website:</label>
            <input
              type="url"
              placeholder="https://voorbeeld.nl/nieuws"
              className="w-full p-4 rounded-2xl border-2 border-blue-100 focus:border-blue-500 focus:outline-none transition-colors"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        )}

        {activeTab === 'pdf' && (
          <div className="border-4 border-dashed border-blue-100 rounded-3xl p-10 text-center hover:bg-blue-50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".pdf,image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="font-bold text-blue-900">Klik of sleep hier je bestand</p>
              <p className="text-sm text-blue-400 mt-1">PDF of een foto van een tekst</p>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2">Plak hier je tekst:</label>
            <textarea
              rows={6}
              placeholder="Plak hier het verhaal of de tekst..."
              className="w-full p-4 rounded-2xl border-2 border-blue-100 focus:border-blue-500 focus:outline-none transition-colors"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        )}

        {activeTab !== 'pdf' && (
          <button
            onClick={handleSubmit}
            disabled={isLoading || !inputValue.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
              isLoading || !inputValue.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500 hover:shadow-yellow-200'
            }`}
          >
            {isLoading ? 'Even geduld...' : 'Maak Vragen! 🚀'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
