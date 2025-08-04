import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Send, Bot, X, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  showWhatsAppButton?: boolean;
}

const AIAssistant: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFloatingMessage, setShowFloatingMessage] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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

    // Simular delay de escritura
    setTimeout(() => {
      const responseText = getAIResponse(inputValue);
      const showWhatsAppButton = responseText.includes('whatsapp') || responseText.includes('WhatsApp');
      
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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Mensaje de bienvenida
      const welcomeMessage: Message = {
        id: 'welcome',
        text: t('aiAssistant.welcomeMessage'),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
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
          className={`text-white p-6 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isOpen ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={t('aiAssistant.title')}
        >
          <Bot size={32} />
          {!isOpen && (
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Bot className="text-blue-600" size={20} />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t('aiAssistant.title')}
                </span>
              </div>
              <button
                onClick={toggleChat}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.isUser ? (
                        <User size={14} className="text-blue-200" />
                      ) : (
                        <Bot size={14} className="text-gray-500" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.isUser 
                          ? t('aiAssistant.you')
                          : t('aiAssistant.assistant')
                        }
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    {message.showWhatsAppButton && (
                      <div className="mt-3">
                        <a
                          href="https://wa.me/573006361659"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('aiAssistant.placeholder')}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
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