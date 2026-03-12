import React, { useState, useEffect } from 'react';

const ProgressBarLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return 100;
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md text-center">
        <h2 className="mb-4 text-xl font-bold text-slate-800 animate-pulse">
          جاري التحميل... {Math.round(progress)}%
        </h2>
        
        <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="h-full w-full animate-[shimmer_2s_infinite] bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:40px_40px]"></div>
          </div>
        </div>
        
        <p className="mt-4 text-sm text-slate-500">
          يرجى الانتظار، السيرفر يستعد للعمل
        </p>
      </div>
    </div>
  );
};

export default ProgressBarLoader;