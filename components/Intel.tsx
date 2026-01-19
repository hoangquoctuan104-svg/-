import React from 'react';
import { INTEL_DATA } from '../utils/constants';

const Intel: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">情报局</h1>
        <p className="text-brand-subtext font-light text-lg">来自亚马逊卖家后台的最新官方动态与合规更新。</p>
      </header>
      
      <div className="grid gap-6">
        {INTEL_DATA.map((item) => (
          <div 
            key={item.id} 
            className="group bg-white rounded-2xl p-7 shadow-soft hover:shadow-card transition-all duration-300 border border-transparent hover:border-gray-100"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-brand-blue transition-colors">
                {item.title}
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-brand-blue whitespace-nowrap">
                {item.date}
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-7 mb-6 font-light">
              {item.summary}
            </p>
            <div className="flex justify-end">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-semibold text-brand-blue hover:text-blue-700 transition-colors group/link"
              >
                阅读官方原文
                <svg className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Intel;