
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-blue-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 p-2 rounded-xl text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-900 leading-tight">LeesMeester</h1>
            <p className="text-xs text-blue-500 font-medium tracking-wide uppercase">Begrijpend Lezen • Groep 6</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
