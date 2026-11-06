// src/components/HelpChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChatCircle,
  X,
  PaperPlaneTilt,
  ArrowRight,
} from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import { findBotResponse } from '../lib/helpBot';
import { cn } from '../lib/utils';

export function HelpChat() {
  const { currentUser } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('skill_share_help_messages');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'initial',
        from: 'bot',
        text: 'Hello! I am your Skill Share guide for NED University. How can I help you today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [showTooltip, setShowTooltip] = useState(() => {
    return !localStorage.getItem('skill_share_help_dismissed');
  });

  const messagesEndRef = useRef(null);
  const launcherRef = useRef(null);
  const inputRef = useRef(null);

  // Sync messages to sessionStorage (max 20)
  useEffect(() => {
    try {
      sessionStorage.setItem('skill_share_help_messages', JSON.stringify(messages.slice(-20)));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle focus movement & Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      setShowTooltip(false);
      localStorage.setItem('skill_share_help_dismissed', 'true');
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setIsOpen(false);
      launcherRef.current?.focus();
    }
  };

  const handleDismissTooltip = (e) => {
    e.stopPropagation();
    setShowTooltip(false);
    localStorage.setItem('skill_share_help_dismissed', 'true');
  };

  const handleSend = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      from: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Brain matching
    const res = findBotResponse(text);
    setTimeout(() => {
      const botMsg = {
        id: `b-${Date.now()}`,
        from: 'bot',
        text: res ? res.answer : "I couldn't find an answer to that. Please check our FAQ or contact admin.",
        actions: res ? res.actions : [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 250);
  };

  const handleClearChat = () => {
    const greeting = currentUser
      ? `Hello ${currentUser.name.split(' ')[0]}! What question do you have about Skill Share at NED?`
      : 'Hello! What question do you have about Skill Share at NED?';
    setMessages([
      {
        id: `init-${Date.now()}`,
        from: 'bot',
        text: greeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    sessionStorage.removeItem('skill_share_help_messages');
  };

  // Context-aware quick reply chips based on role and current page
  const getQuickReplies = () => {
    const isMentorsPage = location.pathname.startsWith('/mentors');
    const isLanding = location.pathname === '/';

    if (!currentUser) {
      if (isLanding) return ['How does it work?', 'Is it free?', 'How to sign up'];
      if (isMentorsPage) return ['How do I request a session?', 'Is it free?', 'GPA minimum'];
      return ['What is Skill Share?', 'Is it free?', 'Sign up'];
    }

    if (currentUser.role === 'mentor') {
      return ['How do I set my availability?', 'How long are sessions?', 'Volunteer certificate'];
    }

    if (currentUser.role === 'admin') {
      return ['How do approvals work?', 'What can admin see?', 'Report a problem'];
    }

    // Normal student
    if (isMentorsPage) {
      return ['How do I request a session?', 'How does ranking work?', 'Are sessions free?'];
    }
    return ['How do I request a session?', 'What happens after I request?', 'How to leave feedback'];
  };

  return (
    <aside aria-label="Help and Support Chatbot" className="fixed bottom-5 right-5 z-40">
      {/* First visit dismissible tooltip */}
      {!isOpen && showTooltip && (
        <div className="absolute bottom-16 right-0 mb-2 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--ink)] border border-white/10 text-white text-xs shadow-md whitespace-nowrap">
          <span>New here? Ask for help</span>
          <button
            type="button"
            onClick={handleDismissTooltip}
            className="text-[var(--gray-400)] hover:text-white p-0.5"
            aria-label="Dismiss help hint"
          >
            <X className="size-3" weight="bold" />
          </button>
        </div>
      )}

      {/* Floating Launcher Button: black pill "Help" with a round chat icon */}
      <button
        ref={launcherRef}
        type="button"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls="help-chat-panel"
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--ink)] hover:bg-[var(--green-900)] text-white text-sm font-bold transition-colors cursor-pointer shadow-lg"
      >
        <div className="size-6 rounded-full bg-black text-[var(--green-400)] flex items-center justify-center">
          <ChatCircle className="size-3.5" weight="fill" />
        </div>
        <span>Help</span>
      </button>

      {/* Slide-out/Fade Panel: white panel with black header, user bubbles black, bot bubbles snow */}
      {isOpen && (
        <div
          id="help-chat-panel"
          role="dialog"
          aria-label="Skill Share Help Assistant"
          className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[380px] h-[520px] max-h-[80vh] flex flex-col rounded-[28px] bg-white border border-[var(--line)] shadow-2xl overflow-hidden z-50 text-[var(--ink)]"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-[var(--ink)] text-white border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-black text-[var(--green-400)] flex items-center justify-center">
                <ChatCircle className="size-4" weight="fill" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Skill Share Help</h3>
                <p className="text-[11px] text-[var(--gray-400)]">NED Peer Mentoring Guide</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearChat}
                className="text-xs text-[var(--gray-400)] hover:text-white transition-colors"
                title="Clear conversation"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[var(--gray-400)] hover:text-white p-1 rounded-full hover:bg-white/10"
                aria-label="Close help"
              >
                <X className="size-4" weight="bold" />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3 text-sm"
            role="log"
            aria-live="polite"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex flex-col',
                  m.from === 'user' ? 'items-end' : 'items-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-[20px] p-3.5 text-xs sm:text-sm leading-relaxed',
                    m.from === 'user'
                      ? 'bg-[var(--ink)] text-white'
                      : 'bg-[var(--snow)] text-[var(--ink)] border border-[var(--line)]'
                  )}
                >
                  <p>{m.text}</p>

                  {/* Optional Action Buttons */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[var(--line)] flex flex-wrap gap-1.5">
                      {m.actions.map((act) => (
                        <button
                          key={act.path}
                          type="button"
                          onClick={() => {
                            if (act.path.startsWith('/#')) {
                              navigate('/');
                              setTimeout(() => {
                                const id = act.path.replace('/#', '');
                                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                              }, 150);
                            } else {
                              navigate(act.path);
                            }
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--ink)] text-white text-[11px] font-semibold hover:bg-[var(--green-900)] transition-colors"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="size-3" weight="bold" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[var(--gray-400)] mt-0.5 px-2">{m.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2.5 bg-[var(--snow)] border-t border-[var(--line)]">
            <p className="text-[10px] uppercase font-bold text-[var(--gray-600)] mb-1.5">Suggested topics:</p>
            <div className="flex flex-wrap gap-1.5">
              {getQuickReplies().map((qr) => (
                <button
                  key={qr}
                  type="button"
                  onClick={() => handleSend(qr)}
                  className="px-3 py-1 rounded-full bg-white border border-[var(--line)] text-xs font-semibold text-[var(--ink)] hover:border-[var(--ink)] transition-colors cursor-pointer"
                >
                  {qr}
                </button>
              ))}
            </div>
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[var(--line)] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question or topic..."
              className="flex-1 px-4 py-2.5 text-xs rounded-[14px] border border-[var(--line)] bg-[var(--snow)] text-[var(--ink)] focus:outline-none focus:border-[var(--ink)]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-[var(--ink)] text-white disabled:opacity-40 hover:bg-[var(--green-900)] transition-colors cursor-pointer"
              aria-label="Send message"
            >
              <PaperPlaneTilt className="size-4" weight="bold" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
