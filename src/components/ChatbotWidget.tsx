import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotel } from '../context/HotelContext';
import { ChatMessage } from '../types';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Phone, 
  Calendar, 
  MapPin, 
  Clock, 
  MessageSquare, 
  HelpCircle,
  Minimize2,
  ChevronDown
} from 'lucide-react';

export const ChatbotWidget: React.FC = () => {
  const { language, t, settings, rooms } = useHotel();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const getGreeting = (): string => {
    if (language === 'ky') {
      return 'Саламатсызбы! Мен Bishkek Hotel отелинин AI-консьержимин. Бөлмөлөр, баалар, 12/24 сааттык туруу жана дарек боюнча бардык суроолоруңузга жооп берүүгө даярмын.';
    }
    if (language === 'ru') {
      return 'Здравствуйте! Я AI-консьерж отеля Bishkek Hotel. Подскажу цены на номера, рассчитаю точное время выезда на 12 или 24 часа, объясню как добраться на Садовую 82 и помогу с бронированием.';
    }
    return 'Hello! I am the AI Concierge of Bishkek Hotel. I can help you with room rates, 12h/24h checkout calculations, directions to Sadovaya 82, and instant reservations.';
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'bot',
      text: getGreeting(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Sync initial greeting when language changes
  useEffect(() => {
    setMessages((prev) => [
      {
        id: `msg-greet-${language}`,
        sender: 'bot',
        text: getGreeting(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Intelligent intent recognition and response generator
  const generateBotReply = (userQuery: string): { text: string; action?: ChatMessage['action'] } => {
    const q = userQuery.toLowerCase();

    // 1. Time / Checkout calculation query (e.g. "If I arrive at 20:00 and book 12 hours...")
    const timeMatch = q.match(/(\d{1,2})[:.]?(\d{2})?/);
    const has12 = q.includes('12') || q.includes('он эки') || q.includes('двенадцать');
    const has24 = q.includes('24') || q.includes('жигирма төрт') || q.includes('двадцать четыре') || q.includes('сутки') || q.includes('сутка');

    if ((q.includes('arrive') || q.includes('заеду') || q.includes('келсем') || q.includes('leave') || q.includes('выезд') || q.includes('чыгам') || q.includes('убакыт') || q.includes('расчет')) && timeMatch) {
      const hour = parseInt(timeMatch[1], 10);
      const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      
      const is12Hours = has12 || (!has24 && !q.includes('24'));
      const stayDurationHours = is12Hours ? 12 : 24;
      const departureHour = (hour + stayDurationHours) % 24;
      const depHourStr = String(departureHour).padStart(2, '0');
      const depMinStr = String(minute).padStart(2, '0');
      const arrHourStr = String(hour).padStart(2, '0');
      const arrMinStr = String(minute).padStart(2, '0');

      if (language === 'ky') {
        return {
          text: `Эгер Сиз саат ${arrHourStr}:${depMinStr}де келип, ${stayDurationHours} саатка бөлмө алсаңыз, чыгуу убактыңыз ${is12Hours ? 'эртеси эртең менен' : 'эртеси күнү'} саат ${depHourStr}:${depMinStr} болот. Бизде 12:00 чектөөсү жок!`,
          action: { type: 'book_now', label: 'Бөлмө брондоо' },
        };
      }
      if (language === 'ru') {
        return {
          text: `Если вы заедете в ${arrHourStr}:${depMinStr} на ${stayDurationHours} часов, то выезд будет ровно в ${depHourStr}:${depMinStr} ${is12Hours ? (hour >= 12 ? 'следующего утра' : 'вечера') : 'следующего дня'}. Расчет идет строго от времени заезда без фиксированного 12:00!`,
          action: { type: 'book_now', label: 'Забронировать на это время' },
        };
      }
      return {
        text: `If you check in at ${arrHourStr}:${depMinStr} for a ${stayDurationHours}-hour stay, your checkout will be exactly at ${depHourStr}:${depMinStr} the next ${is12Hours ? 'morning' : 'day'}. We have no rigid 12:00 checkout hour!`,
        action: { type: 'book_now', label: 'Book This Time Slot' },
      };
    }

    // 2. Room prices
    if (q.includes('баа') || q.includes('цен') || q.includes('price') || q.includes('cost') || q.includes('стоит') || q.includes('канча') || q.includes('сом') || q.includes('kgs')) {
      if (language === 'ky') {
        return {
          text: `Биздин баалар:\n• 12 сааттык туруу: №1–2 бөлмөлөр — 2 500 сом, №3–7 бөлмөлөр — 2 800 сом, №8–11 баасы такталууда.\n• 24 сааттык туруу бардык 11 бөлмө үчүн: 5 000 сом.`,
          action: { type: 'view_rooms', label: 'Бөлмөлөрдү көрүү' },
        };
      }
      if (language === 'ru') {
        return {
          text: `Цены на проживание в Bishkek Hotel:\n• 12 часов: номера №1–2 — 2 500 сом, номера №3–7 — 2 800 сом, номера №8–11 — цена уточняется.\n• 24 часа для всех 11 номеров: 5 000 сом.`,
          action: { type: 'view_rooms', label: 'Смотреть все 11 номеров' },
        };
      }
      return {
        text: `Room rates at Bishkek Hotel:\n• 12-Hour Stays: Rooms 1–2 are 2,500 KGS, Rooms 3–7 are 2,800 KGS, Rooms 8–11 price to be determined.\n• 24-Hour Stays for all 11 rooms: 5,000 KGS.`,
        action: { type: 'view_rooms', label: 'View 11 Rooms' },
      };
    }

    // 3. Breakfast question
    if (q.includes('тамак') || q.includes('завтрак') || q.includes('breakfast') || q.includes('таңкы') || q.includes('food') || q.includes('тамактануу') || q.includes('питание')) {
      if (language === 'ky') {
        return {
          text: `🍳 Эртең мененки тамак — Заказ боюнча даярдалат.\n"Эртең мененки тамакты алдын ала заказ кылсаңыз, сиз үчүн жаңы даярдап беребиз."\nБаасы: администратордон такталат. Брондоо учурунда тамак заказ кылуу опциясын тандап же 24/7 ресепшнге кайрылсаңыз болот: 0880 334 335, 0503 334 335.`,
          action: { type: 'book_now', label: 'Брондоо формасына өтүү' },
        };
      }
      if (language === 'ru') {
        return {
          text: `🍳 Завтрак — Под заказ (Заказ боюнча даярдалат).\n"Если вы закажете завтрак заранее, мы приготовим его для вас свежим."\nСтоимость уточняется у администратора (0880 334 335 / 0503 334 335). Вы также можете заказать завтрак прямо в форме онлайн-бронирования.`,
          action: { type: 'book_now', label: 'Забронировать номер' },
        };
      }
      return {
        text: `🍳 Breakfast — Prepared on request.\n"If you pre-order breakfast, we will prepare it fresh for you."\nPrice is coordinated with the front desk (0880 334 335 / 0503 334 335). You can also add breakfast in the reservation wizard.`,
        action: { type: 'book_now', label: 'Book with Breakfast' },
      };
    }

    // 4. Address, Location, Maps
    if (q.includes('дарек') || q.includes('адрес') || q.includes('address') || q.includes('location') || q.includes('кайда') || q.includes('где') || q.includes('карта') || q.includes('map') || q.includes('садовая') || q.includes('буден')) {
      if (language === 'ky') {
        return {
          text: `Биздин дарек: Бишкек шаары, Садовая көчөсү 82 (Будённый көчөсү менен кесилиште).\nТелефондор: 0880 334 335 жана 0503 334 335.`,
          action: { type: 'open_map', label: 'Google Maps ачуу' },
        };
      }
      if (language === 'ru') {
        return {
          text: `Адрес отеля: г. Бишкек, ул. Садовая 82 (пересечение с ул. Будённого).\nТелефоны: 0880 334 335 и 0503 334 335. Ресепшн работает круглосуточно.`,
          action: { type: 'open_map', label: 'Показать на Google Maps' },
        };
      }
      return {
        text: `Hotel Address: Sadovaya 82, Bishkek, Kyrgyzstan (Intersection with Budennogo Street).\nPhones: 0880 334 335 & 0503 334 335. 24/7 Front Desk.`,
        action: { type: 'open_map', label: 'Open in Google Maps' },
      };
    }

    // 5. Phone / Contact
    if (q.includes('тел') || q.includes('phone') || q.includes('номер') || q.includes('ватсап') || q.includes('whatsapp') || q.includes('звон') || q.includes('чал')) {
      if (language === 'ky') {
        return {
          text: `Биздин байланыш номерлерибиз:\n📞 0880 334 335\n📞 0503 334 335\nWhatsApp: +996 503 334 335 (24/7 иштейт).`,
          action: { type: 'call_hotel', label: 'Чалуу (0880 334 335)' },
        };
      }
      if (language === 'ru') {
        return {
          text: `Наши контактные телефоны:\n📞 0880 334 335\n📞 0503 334 335\nWhatsApp: +996 503 334 335 (круглосуточно).`,
          action: { type: 'call_hotel', label: 'Позвонить (0880 334 335)' },
        };
      }
      return {
        text: `Contact numbers:\n📞 0880 334 335\n📞 0503 334 335\nWhatsApp: +996 503 334 335 (24/7 available).`,
        action: { type: 'call_hotel', label: 'Call 0880 334 335' },
      };
    }

    // 6. How to book / Availability
    if (q.includes('брон') || q.includes('book') || q.includes('заказ') || q.includes('номер') || q.includes('свободн') || q.includes('бош')) {
      if (language === 'ky') {
        return {
          text: `Бөлмөнү онлайн оңой брондосоңуз болот:\n1. Келүү күнүн жана так убактысын тандаңыз\n2. 12 же 24 сааттык мөөнөттү тандаңыз\n3. Бош бөлмөлөрдүн ичинен жактырганыңызды тандап, ырастаңыз.`,
          action: { type: 'book_now', label: 'Брондоо формасына өтүү' },
        };
      }
      if (language === 'ru') {
        return {
          text: `Забронировать номер очень просто:\n1. Выберите дату и точное время заезда\n2. Выберите 12 или 24 часа\n3. Система покажет доступные номера без накладок по времени\n4. Заполните имя и телефон для бронирования.`,
          action: { type: 'book_now', label: 'Открыть форму бронирования' },
        };
      }
      return {
        text: `Booking is seamless:\n1. Select your check-in date & exact time\n2. Choose 12-hour or 24-hour stay\n3. Select any available room\n4. Confirm your booking instantly.`,
        action: { type: 'book_now', label: 'Go to Reservation Wizard' },
      };
    }

    // Default fallback when query is not verified/recognized
    if (language === 'ky') {
      return {
        text: `Бул маалымат азырынча системада жок. Так маалымат алуу үчүн 0880 334 335 же 0503 334 335 номерине чалыңыз.`,
        action: { type: 'call_hotel', label: 'Чалуу (0880 334 335)' },
      };
    }
    if (language === 'ru') {
      return {
        text: `Эта информация пока не указана в системе. Для получения точной информации, пожалуйста, позвоните по номерам 0880 334 335 или 0503 334 335.`,
        action: { type: 'call_hotel', label: 'Позвонить (0880 334 335)' },
      };
    }
    return {
      text: `This information is not yet available in the system. For verified details, please call 0880 334 335 or 0503 334 335.`,
      action: { type: 'call_hotel', label: 'Call 0880 334 335' },
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateBotReply(text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: reply.action,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleActionClick = (action: ChatMessage['action']) => {
    if (!action) return;
    if (action.type === 'book_now') {
      navigate('/booking');
      setIsOpen(false);
    } else if (action.type === 'view_rooms') {
      navigate('/rooms');
      setIsOpen(false);
    } else if (action.type === 'open_map') {
      window.open(settings.googleMapsUrl, '_blank');
    } else if (action.type === 'call_hotel') {
      window.location.href = `tel:${settings.phones[0].replace(/\s/g, '')}`;
    }
  };

  return (
    <>
      {/* Floating Chatbot Bubble Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="hidden sm:flex bg-[#14161C]/95 text-[#FAF8F5] text-xs px-3.5 py-2 rounded-xl border border-[#C5A059]/40 shadow-2xl backdrop-blur-sm items-center gap-2 font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-[#C5A059]">
              {language === 'ky' ? 'Сурооңуз барбы? 24/7 AI' : language === 'ru' ? 'Рассчитать время заезда?' : 'Ask 24/7 AI Concierge'}
            </span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-[#C5A059] to-[#DFB972] hover:brightness-110 text-[#0F1115] shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group border-2 border-[#0F1115]"
            aria-label="Open AI Hotel Assistant"
          >
            <Bot className="w-7 h-7 text-[#0F1115]" />
          </button>
        </div>
      )}

      {/* Expanded Chatbot Modal Dialog */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-full sm:w-96 max-w-[calc(100vw-2rem)] h-[540px] max-h-[85vh] bg-[#0F1115] border border-[#252936] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#14161C] p-3.5 border-b border-[#252936] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C5A059] to-[#DFB972] flex items-center justify-center text-[#0F1115]">
                <Bot className="w-5 h-5 text-[#0F1115]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#FAF8F5] flex items-center gap-1.5 font-display">
                  <span>{t.chatHeaderTitle}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </h4>
                <p className="text-[11px] text-[#9CA3AF] font-sans">
                  {t.chatHeaderSubtitle} • {language.toUpperCase()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-[#1F222A] text-[#9CA3AF] hover:text-[#FAF8F5] flex items-center justify-center transition-colors border border-[#252936]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick prompt suggestions */}
          <div className="bg-[#14161C]/70 px-3 py-2 border-b border-[#252936] flex items-center gap-1.5 overflow-x-auto no-scrollbar font-sans">
            <button
              onClick={() => handleSendMessage(t.quickPrompt2)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#1F222A] text-[#C5A059] hover:bg-[#252936] whitespace-nowrap border border-[#252936] shrink-0 transition-colors"
            >
              ⏰ {t.quickPrompt2}
            </button>
            <button
              onClick={() => handleSendMessage(t.quickPrompt1)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#1F222A] text-[#9CA3AF] hover:text-[#FAF8F5] hover:bg-[#252936] whitespace-nowrap border border-[#252936] shrink-0 transition-colors"
            >
              💰 {t.quickPrompt1}
            </button>
            <button
              onClick={() => handleSendMessage(t.quickPrompt3)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#1F222A] text-[#9CA3AF] hover:text-[#FAF8F5] hover:bg-[#252936] whitespace-nowrap border border-[#252936] shrink-0 transition-colors"
            >
              📍 {t.quickPrompt3}
            </button>
            <button
              onClick={() => handleSendMessage(t.quickPrompt4)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#1F222A] text-[#9CA3AF] hover:text-[#FAF8F5] hover:bg-[#252936] whitespace-nowrap border border-[#252936] shrink-0 transition-colors"
            >
              🍳 {t.quickPrompt4}
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#0F1115]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-md whitespace-pre-line leading-relaxed font-sans ${
                    msg.sender === 'user'
                      ? 'bg-[#C5A059] text-[#0F1115] font-semibold rounded-br-none'
                      : 'bg-[#14161C] text-[#E0E0E0] border border-[#252936] rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Optional Quick Action Button attached to Bot response */}
                {msg.action && (
                  <button
                    onClick={() => handleActionClick(msg.action)}
                    className="mt-1.5 px-3 py-1 rounded-lg bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#C5A059] border border-[#C5A059]/30 text-[11px] font-semibold flex items-center gap-1 transition-colors font-sans"
                  >
                    <span>{msg.action.label}</span>
                    <span>→</span>
                  </button>
                )}

                <span className="text-[10px] text-[#6B7280] mt-0.5 px-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-[#14161C] border border-[#252936] text-[#9CA3AF] px-3 py-2 rounded-2xl rounded-bl-none w-20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Escalation Bar */}
          <div className="bg-[#14161C] px-3 py-1.5 border-t border-[#252936] flex items-center justify-between text-[11px] text-[#9CA3AF] font-sans">
            <a
              href={`tel:${settings.phones[0].replace(/\s/g, '')}`}
              className="hover:text-[#C5A059] flex items-center gap-1 font-mono transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C5A059]" />
              <span>0880 334 335</span>
            </a>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-300 flex items-center gap-1 text-emerald-400 font-semibold transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-[#14161C] border-t border-[#252936] flex items-center gap-2 font-sans"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="flex-1 bg-[#0F1115] border border-[#252936] rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5] placeholder-[#6B7280] focus:outline-none focus:border-[#C5A059]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-9 h-9 rounded-xl gold-gradient-btn disabled:opacity-40 flex items-center justify-center transition-all shadow"
            >
              <Send className="w-4 h-4 text-[#0F1115]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
