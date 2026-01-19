import React, { useState } from 'react';
import Intel from './components/Intel';
import Chat from './components/Chat';
import Diagnosis from './components/Diagnosis';
import { NavigationTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('intel');

  const renderContent = () => {
    switch (activeTab) {
      case 'intel': return <Intel />;
      case 'chat': return <Chat />;
      case 'diagnosis': return <Diagnosis />;
      default: return <Intel />;
    }
  };

  const NavButton = ({ id, label, icon }: { id: NavigationTab; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
        activeTab === id
          ? 'bg-brand-blue text-white shadow-lg shadow-blue-200/50'
          : 'text-gray-500 hover:bg-white hover:text-brand-blue hover:shadow-sm'
      }`}
    >
      <span className={`${activeTab === id ? 'text-white' : 'text-gray-400 group-hover:text-brand-blue'} transition-colors`}>
        {icon}
      </span>
      <span className="font-medium text-[15px] tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-bg flex text-gray-800 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-[#F8F9FA] border-r border-gray-100 p-6 fixed inset-y-0 z-10">
        <div className="mb-12 flex items-center space-x-3 px-2 mt-2">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-orange-400 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-100">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-gray-900 leading-none">亚马逊合规专家</span>
            <span className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mt-1">Professionalist</span>
          </div>
        </div>

        <nav className="space-y-3 flex-1">
          <NavButton 
            id="intel" 
            label="合规情报局" 
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            } 
          />
          <NavButton 
            id="chat" 
            label="专家咨询台" 
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            } 
          />
          <NavButton 
            id="diagnosis" 
            label="全能诊断室" 
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            } 
          />
        </nav>

        <div className="pt-8 border-t border-gray-200/60">
           <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-50">
             <div className="flex justify-between items-center mb-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">系统状态</h4>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
             </div>
             <div className="flex items-center space-x-2">
               <span className="text-sm font-semibold text-gray-700">合规核心已激活</span>
             </div>
           </div>
        </div>
      </aside>

      {/* Mobile Nav Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 z-20 flex justify-center items-center shadow-sm">
        <span className="font-bold text-lg text-gray-900">亚马逊合规专家</span>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-5 md:p-10 pt-24 md:pt-10 bg-brand-bg transition-all">
        {renderContent()}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-20 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         <button onClick={() => setActiveTab('intel')} className={`p-2 rounded-xl flex flex-col items-center transition-colors ${activeTab === 'intel' ? 'text-brand-blue' : 'text-gray-400'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
            <span className="text-[10px] font-medium mt-1">情报局</span>
         </button>
         <button onClick={() => setActiveTab('chat')} className={`p-2 rounded-xl flex flex-col items-center transition-colors ${activeTab === 'chat' ? 'text-brand-blue' : 'text-gray-400'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
             <span className="text-[10px] font-medium mt-1">咨询台</span>
         </button>
         <button onClick={() => setActiveTab('diagnosis')} className={`p-2 rounded-xl flex flex-col items-center transition-colors ${activeTab === 'diagnosis' ? 'text-brand-blue' : 'text-gray-400'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             <span className="text-[10px] font-medium mt-1">诊断室</span>
         </button>
      </div>
    </div>
  );
};

export default App;