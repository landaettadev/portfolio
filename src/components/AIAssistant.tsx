import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Send, Bot, X, User, Trash2, MessageSquare } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import { analytics } from '../utils/analytics';
import type { Message } from '../types';

const QUICK_SUGGESTIONS = [
  { key: 'experience', icon: '💼' },
  { key: 'tech', icon: '🛠️' },
  { key: 'projects', icon: '🚀' },
  { key: 'contact', icon: '📧' },
  { key: 'cv', icon: '📄' },
  { key: 'availability', icon: '✅' },
];

const AIAssistant: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFloatingMessage, setShowFloatingMessage] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Focus trap for accessibility
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (!isOpen || e.key !== 'Tab') return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, input, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [handleTabKey]);

  // Ocultar mensaje flotante después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFloatingMessage(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Respuestas predefinidas basadas en el idioma
  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Preguntas sobre experiencia
    if (message.includes('experience') || message.includes('años') || message.includes('experiencia')) {
      return t('aiAssistant.responses.experience');
    }

    // Preguntas sobre tecnologías
    if (message.includes('tech') || message.includes('stack') || message.includes('tecnologías') || message.includes('tecnologias')) {
      return t('aiAssistant.responses.tech');
    }

    // Preguntas sobre proyectos
    if (message.includes('project') || message.includes('proyecto') || message.includes('work')) {
      return t('aiAssistant.responses.projects');
    }

    // Preguntas sobre educación
    if (message.includes('education') || message.includes('study') || message.includes('estudio') || message.includes('educación')) {
      return t('aiAssistant.responses.education');
    }

    // Preguntas sobre ubicación
    if (message.includes('where') || message.includes('location') || message.includes('dónde') || message.includes('ubicación')) {
      return t('aiAssistant.responses.location');
    }

    // Preguntas sobre disponibilidad
    if (message.includes('available') || message.includes('hire') || message.includes('contratar') || message.includes('disponible')) {
      return t('aiAssistant.responses.availability');
    }

    // Preguntas sobre freelancing
    if (message.includes('freelance') || message.includes('freelancer') || message.includes('independiente')) {
      return t('aiAssistant.responses.freelance');
    }

    // Preguntas sobre contacto general
    if (message.includes('contact') || message.includes('contacto') || message.includes('contactar')) {
      return t('aiAssistant.responses.contact');
    }

    // Preguntas sobre WhatsApp específicamente (debe ir antes de IA para evitar conflicto)
    if (message.includes('whatsapp') || message.includes('whats app') || message.includes('wa')) {
      return t('aiAssistant.responses.whatsapp');
    }

    // Preguntas sobre email
    if (message.includes('email') || message.includes('correo') || message.includes('mail')) {
      return t('aiAssistant.responses.email');
    }

    // Preguntas sobre teléfono
    if (message.includes('phone') || message.includes('teléfono') || message.includes('telefono') || message.includes('celular')) {
      return t('aiAssistant.responses.phone');
    }

    // Preguntas sobre CV
    if (message.includes('cv') || message.includes('resume') || message.includes('curriculum') || message.includes('currículum')) {
      return t('aiAssistant.responses.cv');
    }

    // Preguntas sobre descarga
    if (message.includes('download') || message.includes('descargar') || message.includes('descarga')) {
      return t('aiAssistant.responses.download');
    }

    // Preguntas sobre IA (debe ir después de WhatsApp para evitar conflicto)
    if ((message.includes('ai') && !message.includes('email') && !message.includes('whatsapp')) || message.includes('machine learning') || message.includes('inteligencia artificial')) {
      return t('aiAssistant.responses.ai');
    }

    // Respuesta por defecto
    return t('aiAssistant.responses.default');
  };

  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString(i18n.language === 'es' ? 'es-ES' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle quick suggestion click
  const handleQuickSuggestion = (key: string) => {
    const suggestionText = t(`aiAssistant.suggestions.${key}`);
    setInputValue(suggestionText);
    // Auto-send after a brief delay
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: suggestionText,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      analytics.aiAssistantMessage(key);

      setTimeout(() => {
        const responseText = getAIResponse(suggestionText);
        const showWhatsAppButton = responseText.toLowerCase().includes('whatsapp');
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          isUser: false,
          timestamp: new Date(),
          showWhatsAppButton,
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1000);
    }, 100);
    setInputValue('');
  };

  // Clear chat history
  const clearChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: t('aiAssistant.welcomeMessage'),
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    analytics.aiAssistantMessage('custom');

    // Simular delay de escritura
    setTimeout(() => {
      const responseText = getAIResponse(inputValue);
      const showWhatsAppButton = responseText.toLowerCase().includes('whatsapp');
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        showWhatsAppButton,
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // Increment unread if chat is closed
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      analytics.aiAssistantOpen();
      setUnreadCount(0);
      
      if (messages.length === 0) {
        // Mensaje de bienvenida
        const welcomeMessage: Message = {
          id: 'welcome',
          text: t('aiAssistant.welcomeMessage'),
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    }
  };

  return (
    <>
      {/* Botón flotante con mensaje */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3">
        {/* Mensaje flotante */}
        {!isOpen && showFloatingMessage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {t('aiAssistant.floatingMessage')}
              </span>
            </div>
            {/* Flecha apuntando al botón */}
            <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
              <div className="w-0 h-0 border-l-8 border-l-white dark:border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </motion.div>
        )}

        {/* Botón */}
        <motion.button
          onClick={toggleChat}
          className={`relative text-white p-6 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isOpen ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isOpen ? t('aiAssistant.close') : t('aiAssistant.open')}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          {isOpen ? <X size={32} /> : <Bot size={32} />}
          {!isOpen && unreadCount > 0 && (
            <motion.div
              className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {unreadCount}
            </motion.div>
          )}
          {!isOpen && unreadCount === 0 && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>

      {/* Chat modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-title"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[70vh] sm:h-[500px] max-h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center space-x-2">
                <Bot className="text-white" size={20} />
                <span id="chat-title" className="font-semibold text-white">
                  {t('aiAssistant.title')}
                </span>
                <span className="text-xs text-blue-200 bg-blue-500/30 px-2 py-0.5 rounded-full">
                  AI
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearChat}
                  className="text-white/70 hover:text-white p-1 rounded transition-colors"
                  aria-label={t('aiAssistant.clearChat')}
                  title={t('aiAssistant.clearChat')}
                >
                  <Trash2 size={18} />
                </button>
                <button
                  ref={firstFocusableRef}
                  onClick={toggleChat}
                  className="text-white/70 hover:text-white p-1 rounded transition-colors"
                  aria-label={t('aiAssistant.close')}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <div className="flex items-center space-x-2">
                        {message.isUser ? (
                          <User size={14} className="text-blue-200" />
                        ) : (
                          <Bot size={14} className="text-blue-500 dark:text-blue-400" />
                        )}
                        <span className="text-xs font-medium opacity-80">
                          {message.isUser 
                            ? t('aiAssistant.you')
                            : t('aiAssistant.assistant')
                          }
                        </span>
                      </div>
                      <span className="text-xs opacity-50">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                    {message.showWhatsAppButton && (
                      <div className="mt-3">
                        <a
                          href={`https://wa.me/${CONTACT_INFO.WHATSAPP}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          aria-label={t('aiAssistant.openWhatsApp')}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                          WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot size={14} className="text-gray-500" />
                      <span className="text-xs opacity-70">
                        {t('aiAssistant.assistant')}
                      </span>
                    </div>
                    <div className="flex space-x-1 mt-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <MessageSquare size={12} />
                  {t('aiAssistant.quickSuggestions')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion.key}
                      onClick={() => handleQuickSuggestion(suggestion.key)}
                      className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                    >
                      <span>{suggestion.icon}</span>
                      <span>{t(`aiAssistant.suggestionLabels.${suggestion.key}`)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('aiAssistant.placeholder')}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  aria-label={t('aiAssistant.placeholder')}
                />
                <button
                  ref={lastFocusableRef}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label={t('aiAssistant.send')}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant; 