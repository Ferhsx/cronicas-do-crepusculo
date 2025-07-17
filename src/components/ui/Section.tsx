import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-lg ${className}`}>
        <h2 className="font-cinzel text-xl font-bold text-amber-300/90 border-b border-slate-700 pb-2 mb-4">{title}</h2>
        {children}
    </div>
);

export default Section;