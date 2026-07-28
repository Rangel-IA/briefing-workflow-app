/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-client';
import { ChevronUp, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { introText, questions } from './data';
import { Question } from './types';

export default function App() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean, message: string, analysis?: string } | null>(null);
  
  // Handlers
  const handleStart = () => {
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > -1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSingleSelect = (questionId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
    // Auto-advance after a brief delay for single select
    setTimeout(() => {
      handleNext();
    }, 450);
  };

  const handleMultipleSelect = (questionId: number, option: string) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter((item: string) => item !== option) };
      }
      return { ...prev, [questionId]: [...current, option] };
    });
  };

  const handleCompositeSelect = (questionId: number, groupLabel: string, option: string) => {
    setAnswers(prev => {
      const current = prev[questionId] || {};
      return { ...prev, [questionId]: { ...current, [groupLabel]: option } };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const questionsText = questions.reduce((acc, q) => {
        acc[q.id] = q.title;
        return acc;
      }, {} as Record<number, string>);

      const res = await fetch('/api/submit-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, questionsText, userEmail })
      });

      const data = await res.json();
      setSubmitResult({
        success: data.success,
        message: data.message,
        analysis: data.analysis
      });
    } catch (e) {
      setSubmitResult({
        success: false,
        message: 'Ocorreu um erro ao enviar os dados. Verifique a conexão ou a configuração do servidor.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        // Prevent default to avoid form submission if we had one
        e.preventDefault();
        
        // If intro, start
        if (currentStep === -1) {
          handleStart();
          return;
        }

        // If on a question, check if it's answerable and advance
        if (currentStep >= 0 && currentStep < questions.length) {
          const q = questions[currentStep];
          const ans = answers[q.id];
          
          if (q.type === 'single' && ans) {
            handleNext();
          } else if (q.type === 'multiple' || q.type === 'composite') {
            handleNext();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, answers]);

  // Derived state
  const isComplete = currentStep === questions.length;
  const progress = currentStep >= 0 ? ((currentStep) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#111827] flex flex-col font-sans overflow-hidden selection:bg-stone-200">
      {/* Top Progress Bar */}
      {currentStep >= 0 && (
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-stone-100 z-50">
          <div 
            className="h-full bg-stone-900 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full max-w-4xl mx-auto px-6 py-12 md:px-12">
        <AnimatePresence mode="wait">
          
          {/* Intro Screen */}
          {currentStep === -1 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-start max-w-2xl"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight mb-8">
                Diagnóstico Estratégico
              </h1>
              <p className="text-lg md:text-xl text-stone-600 leading-relaxed mb-12">
                {introText}
              </p>
              <button
                onClick={handleStart}
                className="group flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-stone-800 transition-all active:scale-95"
              >
                Começar
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="mt-4 flex items-center gap-2 text-sm text-stone-400">
                <span>Pressione</span>
                <kbd className="px-2 py-1 bg-stone-100 border border-stone-200 rounded text-stone-600 font-sans font-medium text-xs">Enter ↵</kbd>
              </div>
            </motion.div>
          )}

          {/* Question Screens */}
          {currentStep >= 0 && currentStep < questions.length && (
            <motion.div
              key={`q-${currentStep}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-3xl flex flex-col"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-500 font-medium text-sm">
                  {questions[currentStep].id}
                </span>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight leading-tight">
                  {questions[currentStep].title}
                </h2>
              </div>

              {/* Rationale Block */}
              <div className="mb-10 pl-12 text-stone-500 text-sm md:text-base leading-relaxed">
                {questions[currentStep].rationale.split('\n').map((line, i) => (
                  <p key={i} className={i === 0 ? "font-medium text-stone-700 mb-1" : ""}>
                    {line}
                  </p>
                ))}
              </div>

              {/* Options */}
              <div className="pl-0 md:pl-12 flex flex-col gap-3">
                {questions[currentStep].type === 'single' && (
                  questions[currentStep].options?.map((opt, idx) => (
                    <OptionButton
                      key={idx}
                      label={opt}
                      selected={answers[questions[currentStep].id] === opt}
                      onClick={() => handleSingleSelect(questions[currentStep].id, opt)}
                    />
                  ))
                )}

                {questions[currentStep].type === 'multiple' && (
                  <>
                    {questions[currentStep].options?.map((opt, idx) => {
                      const isSelected = (answers[questions[currentStep].id] || []).includes(opt);
                      return (
                        <OptionButton
                          key={idx}
                          label={opt}
                          selected={isSelected}
                          multiple
                          onClick={() => handleMultipleSelect(questions[currentStep].id, opt)}
                        />
                      );
                    })}
                    <div className="mt-6">
                      <ContinueButton onClick={handleNext} />
                    </div>
                  </>
                )}

                {questions[currentStep].type === 'composite' && (
                  <div className="flex flex-col gap-8">
                    {questions[currentStep].groups?.map((group, gIdx) => (
                      <div key={gIdx} className="flex flex-col gap-3">
                        <h3 className="font-medium text-stone-800 text-lg mb-2">{group.label}</h3>
                        {group.options.map((opt, oIdx) => {
                          const isSelected = (answers[questions[currentStep].id]?.[group.label]) === opt;
                          return (
                            <OptionButton
                              key={oIdx}
                              label={opt}
                              selected={isSelected}
                              onClick={() => handleCompositeSelect(questions[currentStep].id, group.label, opt)}
                            />
                          );
                        })}
                      </div>
                    ))}
                    <div className="mt-4">
                      <ContinueButton onClick={handleNext} />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Outro Screen */}
          {isComplete && (
            <motion.div
              key="outro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center max-w-2xl"
            >
              {!submitResult ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    {isSubmitting ? (
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight mb-4">
                    Tudo pronto.
                  </h2>
                  <p className="text-stone-500 text-lg mb-8 max-w-md mx-auto">
                    Suas respostas foram registradas. Vamos analisar os dados e gerar um diagnóstico estratégico para estruturarmos a proposta.
                  </p>
                  
                  <div className="max-w-md mx-auto mb-10 text-left">
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Seu e-mail para receber uma cópia (opcional)
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all bg-stone-50"
                      placeholder="seu@email.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <button 
                    className="bg-stone-900 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-stone-800 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Gerando Análise...' : 'Gerar e Enviar Diagnóstico'}
                  </button>
                </div>
              ) : (
                <div className="w-full text-center">
                  <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight mb-4">
                    Muito obrigado!
                  </h2>
                  <p className="text-stone-500 text-lg mb-4 max-w-md mx-auto">
                    Diagnóstico concluído com sucesso. Um relatório foi enviado para o seu e-mail.
                  </p>
                  <p className="text-stone-800 font-medium text-lg max-w-md mx-auto">
                    Entrarei em contato em breve após análise das respostas.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-t from-[#FDFDFD] to-transparent pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2">
          {currentStep > -1 && !isComplete && (
            <button
              onClick={handlePrev}
              className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg transition-colors flex items-center justify-center"
              aria-label="Pergunta anterior"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}
          {currentStep >= 0 && !isComplete && (
            <button
              onClick={handleNext}
              className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg transition-colors flex items-center justify-center"
              aria-label="Próxima pergunta"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function OptionButton({ label, selected, onClick, multiple }: { key?: string | number, label: string, selected: boolean, onClick: () => void, multiple?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
        ${selected 
          ? 'border-stone-900 bg-stone-900/5' 
          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
        }
      `}
    >
      <span className={`text-lg ${selected ? 'font-medium text-stone-900' : 'text-stone-700'}`}>
        {label}
      </span>
      {selected && (
        <Check className="w-5 h-5 text-stone-900 shrink-0" />
      )}
    </button>
  );
}

function ContinueButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onClick}
        className="bg-stone-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors active:scale-95"
      >
        Continuar
      </button>
      <div className="hidden sm:flex items-center gap-2 text-sm text-stone-400">
        <span>Pressione</span>
        <kbd className="px-2 py-1 bg-stone-100 border border-stone-200 rounded text-stone-600 font-sans font-medium text-xs">Enter ↵</kbd>
      </div>
    </div>
  );
}

