import React, { useState } from 'react';
import { analyzeCompliance } from '../services/geminiService';
import { DiagnosisResult } from '../types';

const Diagnosis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'doc' | 'image'>('doc');
  
  // Input State
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null); // For Image preview
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const resetState = () => {
    setTextInput('');
    setSelectedFile(null);
    setFilePreview(null);
    setResult(null);
  };

  const handleTabChange = (tab: 'doc' | 'image') => {
    setActiveTab(tab);
    resetState();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setResult(null);
      
      // For images, create a preview
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleDiagnosis = async () => {
    if (!textInput.trim() && !selectedFile) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      let fileData: string | undefined;
      let mimeType: string | undefined;

      if (selectedFile) {
        fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
             // Remove data URL prefix (e.g., "data:application/pdf;base64,")
             const result = reader.result as string;
             const base64 = result.split(',')[1];
             resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
        mimeType = selectedFile.type;
      }

      const jsonString = await analyzeCompliance({
        text: textInput,
        fileData,
        mimeType
      });
      
      const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedResult = JSON.parse(cleanJson);
      
      setResult({
        hasViolation: parsedResult.hasViolation,
        message: parsedResult.message || (parsedResult.hasViolation ? "发现违规风险" : "检测通过"),
        details: parsedResult.details || []
      });

    } catch (error) {
      console.error(error);
      setResult({
        hasViolation: false,
        message: "分析服务暂时不可用，请稍后重试。",
        details: ["请检查网络连接或API密钥配置"]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">全能诊断室</h1>
        <p className="text-brand-subtext font-light text-lg">AI 驱动的合规检测，支持文本、文档 (PDF) 及图片。</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-gray-100/80 p-1.5 rounded-2xl mb-8 w-fit backdrop-blur-sm">
        <button
          onClick={() => handleTabChange('doc')}
          className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === 'doc' 
              ? 'bg-white text-brand-blue shadow-sm' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          文案与文档
        </button>
        <button
          onClick={() => handleTabChange('image')}
          className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === 'image' 
              ? 'bg-white text-brand-blue shadow-sm' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          图片与标签
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-card border border-gray-50 p-8 min-h-[500px] flex flex-col">
        
        {/* Input Area */}
        <div className="space-y-6 flex-1">
          
          {/* Text & Doc Tab */}
          {activeTab === 'doc' && (
            <div className="space-y-6 animate-fade-in">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
                  粘贴产品文案
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="在此输入标题、五点描述或详情页文案..."
                  className="w-full h-40 p-5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue resize-none text-sm leading-relaxed transition-all placeholder-gray-400"
                />
              </div>

              {/* File Upload for Docs */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
                  或上传文档文件 (PDF, TXT, CSV)
                </label>
                <div className="relative group border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 hover:border-brand-blue/40 transition-all duration-200">
                  <input
                    type="file"
                    accept=".pdf,.txt,.csv,.json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                     {selectedFile ? (
                       <div className="flex items-center space-x-2 text-brand-blue bg-blue-50 px-4 py-2 rounded-lg">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                         <span className="font-medium text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                       </div>
                     ) : (
                       <>
                         <svg className="w-8 h-8 text-gray-400 group-hover:text-brand-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                         </svg>
                         <span className="text-sm text-gray-500 font-medium">点击上传文档进行扫描</span>
                       </>
                     )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Image Tab */}
          {activeTab === 'image' && (
            <div className="space-y-6 animate-fade-in">
              <div className="group relative border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:bg-gray-50 hover:border-brand-blue/50 transition-all duration-300">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {filePreview ? (
                   <div className="relative z-20 pointer-events-none">
                      <img src={filePreview} alt="Preview" className="h-48 mx-auto object-contain rounded-lg shadow-sm" />
                      <p className="mt-4 text-sm font-medium text-gray-600 bg-white/80 inline-block px-3 py-1 rounded-full">{selectedFile?.name}</p>
                   </div>
                ) : (
                  <div className="space-y-4 pointer-events-none group-hover:scale-105 transition-transform duration-300">
                    <div className="mx-auto w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center shadow-inner">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                        <p className="text-gray-900 font-semibold text-lg">上传产品图片或包装图</p>
                        <p className="text-sm text-gray-400 mt-1">支持 JPG, PNG, WEBP</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-6 border-t border-gray-100">
           <button
              onClick={handleDiagnosis}
              disabled={(!textInput.trim() && !selectedFile) || isAnalyzing}
              className="w-full bg-brand-orange text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-100 hover:shadow-orange-200 hover:bg-orange-600 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>智能合规引擎运行中...</span>
                </>
              ) : (
                '开始全面诊断'
              )}
            </button>
        </div>

        {/* Result Area */}
        {result && (
          <div className={`mt-8 p-6 rounded-2xl border animate-slide-up ${
            result.hasViolation ? 'bg-red-50/50 border-red-100' : 'bg-green-50/50 border-green-100'
          }`}>
            <div className="flex items-start space-x-4">
              <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                 result.hasViolation ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
                {result.hasViolation 
                  ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                }
              </div>
              <div className="flex-1">
                 <h3 className={`font-bold text-lg mb-1 ${
                    result.hasViolation ? 'text-red-800' : 'text-green-800'
                 }`}>
                    {result.message}
                 </h3>
                 {result.details && result.details.length > 0 && (
                   <ul className="mt-3 space-y-2">
                     {result.details.map((d, i) => (
                       <li key={i} className={`flex items-start text-sm ${
                         result.hasViolation ? 'text-red-700' : 'text-green-700'
                       }`}>
                         <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                         <span className="leading-relaxed">{d}</span>
                       </li>
                     ))}
                   </ul>
                 )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diagnosis;