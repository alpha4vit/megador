'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, Check, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeedbackModal, FeedbackModalConfig } from '@/contexts/FeedbackModalContext';
import { useCart, CartItem } from '@/contexts/CartContext';

export default function FeedbackModal() {
  const { isOpen, config, closeModal } = useFeedbackModal();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Gate-specific fields
    width: '',
    height: '',
    withAutomation: true as boolean | null,
    withWicket: true as boolean | null,
    // Contact fields
    name: '',
    phone: '',
    note: '',
  });

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isClosing) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isClosing]);

  // Trigger enter animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(false);
      setStep(1);
      setFormData({
        width: '',
        height: '',
        withAutomation: true,
        withWicket: true,
        name: '',
        phone: '',
        note: '',
      });
      const timeout = setTimeout(() => {
        setIsMounted(true);
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Reset consent when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsConsentGiven(false);
      setShowPrivacyPolicy(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setIsMounted(false);
    setTimeout(() => {
      closeModal();
      setIsClosing(false);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Build the submission payload
    const payload: any = {
      clientName: formData.name,
      phone: formData.phone,
      sourcePage: window.location.pathname,
      formContextType: config?.scope === 'cart_checkout' ? 'CART_CHECKOUT' : config?.scope?.toUpperCase(),
      timestamp: new Date().toISOString(),
      comment: formData.note,
    };

    // Add gate-specific fields if applicable
    if (config?.scope === 'gate') {
      payload.width = formData.width;
      payload.height = formData.height;
      payload.withAutomation = formData.withAutomation;
      payload.withWicket = formData.withWicket;
      payload.gateInfo = config?.gateInfo;
    }

    // Add product info if applicable
    if (config?.scope === 'product' && config?.productInfo) {
      payload.productInfo = config.productInfo;
    }

    // Add cart items if cart checkout
    if (config?.scope === 'cart_checkout') {
      payload.cartItems = cart.map((item) => ({
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));
    }

    console.log('Form submitted:', payload);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Clear cart on successful cart checkout
    if (config?.scope === 'cart_checkout') {
      clearCart();
    }
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Close modal after showing success
    setTimeout(() => {
      setSubmitSuccess(false);
      handleClose();
    }, 2000);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format as +375 (XX) XXX-XX-XX
    if (value.length > 0) {
      if (value[0] === '8') {
        value = '3' + value;
      }
      if (value.startsWith('375')) {
        value = value.substring(3);
      }
    }

    let formatted = '+375';
    if (value.length > 0) {
      formatted += ' (' + value.substring(0, 2);
    }
    if (value.length > 2) {
      formatted += ') ' + value.substring(2, 5);
    }
    if (value.length > 5) {
      formatted += '-' + value.substring(5, 7);
    }
    if (value.length > 7) {
      formatted += '-' + value.substring(7, 9);
    }

    setFormData({ ...formData, phone: formatted });
  };

  if (!isOpen || !config) return null;

  const renderProductSummary = () => {
    if (!config.productInfo) return null;
    
    return (
      <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
        <p className="text-sm text-gray-600 mb-2">Вы заказываете:</p>
        <p className="font-bold text-[#2F3E46] text-lg mb-1">{config.productInfo.name}</p>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {config.productInfo.brand && <span>{config.productInfo.brand}</span>}
          {config.productInfo.brand && <span>•</span>}
          <span className="text-[#E65F2B] font-semibold">{config.productInfo.price}</span>
        </div>
      </div>
    );
  };

  const renderGateParameters = () => {
    if (config.scope !== 'gate') return null;

    return (
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ширина (мм) - опционально
            </label>
            <input
              type="text"
              value={formData.width}
              onChange={(e) => setFormData({ ...formData, width: e.target.value })}
              placeholder="Например: 3000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E65F2B] focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Высота (мм) - опционально
            </label>
            <input
              type="text"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              placeholder="Например: 2125"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E65F2B] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип ворот
          </label>
          <input
            type="text"
            value={config.gateInfo?.gateType || ''}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Автоматика
          </label>
          <div className="relative flex w-full p-1 bg-slate-50 border border-slate-200 rounded-xl select-none">
            {/* Sliding Background Accent */}
            <div
              className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-[#E65F2B] rounded-lg shadow-sm z-0 transition-transform duration-300 ease-in-out ${
                formData.withAutomation === false ? 'translate-x-full' : ''
              }`}
            />
            
            {/* Option 1: С автоматикой */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, withAutomation: true })}
              className={`flex-1 py-3 px-4 rounded-lg transition-colors duration-300 relative z-10 ${
                formData.withAutomation === true ? 'text-white font-medium' : 'text-slate-600'
              }`}
            >
              С автоматикой
            </button>
            
            {/* Option 2: Без автоматики */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, withAutomation: false })}
              className={`flex-1 py-3 px-4 rounded-lg transition-colors duration-300 relative z-10 ${
                formData.withAutomation === false ? 'text-white font-medium' : 'text-slate-600'
              }`}
            >
              Без автоматики
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Калитка
          </label>
          <div className="relative flex w-full p-1 bg-slate-50 border border-slate-200 rounded-xl select-none">
            {/* Sliding Background Accent */}
            <div
              className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-[#E65F2B] rounded-lg shadow-sm z-0 transition-transform duration-300 ease-in-out ${
                formData.withWicket === false ? 'translate-x-full' : ''
              }`}
            />
            
            {/* Option 1: С калиткой */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, withWicket: true })}
              className={`flex-1 py-3 px-4 rounded-lg transition-colors duration-300 relative z-10 ${
                formData.withWicket === true ? 'text-white font-medium' : 'text-slate-600'
              }`}
            >
              С калиткой
            </button>
            
            {/* Option 2: Без калитки */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, withWicket: false })}
              className={`flex-1 py-3 px-4 rounded-lg transition-colors duration-300 relative z-10 ${
                formData.withWicket === false ? 'text-white font-medium' : 'text-slate-600'
              }`}
            >
              Без калитки
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderConsultationIntro = () => {
    if (config.scope !== 'consultation') return null;

    return (
      <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E65F2B] flex items-center justify-center flex-shrink-0 mt-1">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-[#2F3E46] mb-1">Бесплатная консультация</p>
            <p className="text-sm text-gray-600">
              Наш специалист поможет подобрать оптимальное решение под ваши требования и бюджет
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderCartItems = () => {
    if (config.scope !== 'cart_checkout' || cart.length === 0) return null;

    const calculateTotal = () => {
      return cart.reduce((total, item) => {
        const priceNum = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
        return total + (priceNum * item.quantity);
      }, 0);
    };

    return (
      <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
        <p className="text-sm font-semibold text-[#2F3E46] mb-4">Ваш заказ ({cart.length} {cart.length === 1 ? 'товар' : cart.length > 1 && cart.length < 5 ? 'товара' : 'товаров'})</p>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
              {item.image && (
                <img draggable={false}
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-contain rounded"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2F3E46] truncate">{item.title}</p>
                <p className="text-sm text-[#E65F2B] font-medium">{item.price}</p>
              </div>
              
              {/* Desktop: Horizontal controls */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                
                <span className="w-8 text-center font-semibold text-[#2F3E46]">{item.quantity}</span>
                
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
                
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors ml-2"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {/* Mobile: Vertical controls column */}
              <div className="flex md:hidden flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  
                  <span className="w-6 text-center font-semibold text-[#2F3E46] text-sm">{item.quantity}</span>
                  
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Итого:</span>
            <span className="text-xl font-bold text-[#E65F2B]">{calculateTotal()} BYN</span>
          </div>
          <p className="text-xs text-slate-500 leading-normal italic mt-2 px-1">
            Обратите внимание: цена является ориентировочной. Наш менеджер свяжется с вами для уточнения точных параметров и финальной стоимости вашего комплекта.
          </p>
        </div>
      </div>
    );
  };

  const renderContactForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Имя <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ваше имя"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E65F2B] focus:border-transparent outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Телефон <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={handlePhoneChange}
          placeholder="+375 (XX) XXX-XX-XX"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E65F2B] focus:border-transparent outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Комментарий (опционально)
        </label>
        <textarea
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          placeholder="Дополнительная информация..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E65F2B] focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      <div className="flex items-start gap-3 pt-2">
        <input
          type="checkbox"
          id="consent-checkbox"
          checked={isConsentGiven}
          onChange={(e) => setIsConsentGiven(e.target.checked)}
          className="mt-1 w-5 h-5 accent-[#E65F2B] rounded border-gray-300 focus:ring-2 focus:ring-[#E65F2B] focus:ring-offset-0 cursor-pointer"
        />
        <label htmlFor="consent-checkbox" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
          Я даю согласие на обработку моих персональных данных в соответствии с{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowPrivacyPolicy(true);
            }}
            className="text-[#E65F2B] hover:text-[#d4521f] underline font-medium focus:outline-none focus:ring-2 focus:ring-[#E65F2B] focus:ring-offset-1 rounded"
          >
            Политикой обработки персональных данных
          </button>
          .
        </label>
      </div>
    </div>
  );

  const getTitle = () => {
    if (config.title) return config.title;
    
    switch (config.scope) {
      case 'product':
        return 'Оформить заказ';
      case 'gate':
        return 'Рассчитать стоимость';
      case 'consultation':
        return 'Получить консультацию';
      case 'cart_checkout':
        return 'Оформление заказа';
      default:
        return 'Оставить заявку';
    }
  };

  const getSubtitle = () => {
    if (config.subtitle) return config.subtitle;
    
    switch (config.scope) {
      case 'product':
        return 'Заполните форму и мы свяжемся с вами';
      case 'gate':
        return 'Укажите параметры ворот для точного расчета';
      case 'consultation':
        return 'Наш специалист поможет подобрать оптимальное решение';
      case 'cart_checkout':
        return 'Проверьте ваш заказ и заполните контактные данные';
      default:
        return 'Заполните форму и мы свяжемся с вами';
    }
  };

  const renderPrivacyPolicyModal = () => {
    if (!showPrivacyPolicy) return null;

    return (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={() => setShowPrivacyPolicy(false)}
      >
        <div
          className="hidden md:flex flex-col rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-slate-50">
            <h2 className="text-xl font-bold text-[#2F3E46]">Политика обработки персональных данных</h2>
            <button
              onClick={() => setShowPrivacyPolicy(false)}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="text-slate-700 text-sm leading-relaxed mb-4">
              <p className="font-bold text-base mb-4">ПОЛИТИКА ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ</p>
              <p className="font-semibold mb-4">Общества с ограниченной ответственностью «МегаДорАльянс»</p>

              <p className="font-semibold mb-2">1. ОБЩИЕ ПОЛОЖЕНИЯ</p>
              <p className="mb-3">1.1. Настоящая Политика обработки персональных данных (далее — Политика) разработана в соответствии с Законом Республики Беларусь от 7 мая 2021 г. № 99-З «О защите персональных данных» (далее — Закон) и определяет порядок обработки персональных данных пользователей сайта (далее — Пользователи) Обществом с ограниченной ответственностью «МегаДорАльянс» (далее — Оператор).</p>
              <p className="mb-3">1.2. Юридический адрес Оператора: Республика Беларусь (информация заполняется Оператором), УНП (информация заполняется Оператором). Электронная почта для связи и отзыва согласий: (укажите ваш email, например: info@megadoralians.by).</p>
              <p className="mb-4">1.3. Настоящая Политика действует в отношении всех персональных данных, собираемых через форму обратной связи на сайте Оператора.</p>

              <p className="font-semibold mb-2">2. ЦЕЛИ, ПЕРЕЧЕНЬ И ПРАВОВЫЕ ОСНОВАНИЯ ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ</p>
              <p className="mb-3">2.1. Оператор осуществляет обработку персональных данных в следующих целях:</p>
              <ul className="list-disc pl-5 mb-3 space-y-1">
                <li>Для сегментов B2C, B2B и B2G: обработка входящих заявок, запросов и коммерческих предложений от потенциальных клиентов и партнеров;</li>
                <li>Проведение предварительных консультаций по вопросам оказания услуг, поставки товаров или выполнения дорожно-строительных работ;</li>
                <li>Подготовка документов для заключения договоров (включая процедуры государственных и коммерческих закупок).</li>
              </ul>
              <p className="mb-3">2.2. Перечень обрабатываемых персональных данных:</p>
              <ul className="list-disc pl-5 mb-3 space-y-1">
                <li>Имя (ФИО);</li>
                <li>Номер контактного телефона.</li>
              </ul>
              <p className="mb-4">2.3. Правовым основанием обработки персональных данных является согласие Пользователя (п. 1 ст. 5 Закона Республики Беларусь «О защите персональных данных»).</p>

              <p className="font-semibold mb-2">3. ПОРЯДОК И СРОКИ ХРАНЕНИЯ ПЕРСОНАЛЬНЫХ ДАННЫХ</p>
              <p className="mb-3">3.1. Обработка персональных данных осуществляется Оператором с использованием средств автоматизации.</p>
              <p className="mb-4">3.2. Персональные данные хранятся в течение 1 (одного) года с момента обработки входящей заявки или до момента отзыва согласия Пользователем (в зависимости от того, какое событие наступит раньше). В случае заключения договора данные обрабатываются в течение сроков, установленных законодательством РБ для хранения первичных учетных документов.</p>

              <p className="font-semibold mb-2">4. ПРАВА ПОЛЬЗОВАТЕЛЕЙ И МЕХАНИЗМ ИХ РЕАЛИЗАЦИИ</p>
              <p className="mb-2">Пользователь имеет право:</p>
              <ul className="list-disc pl-5 mb-3 space-y-1">
                <li>4.1. На отзыв своего согласия в любое время без объяснения причин. Отзыв согласия осуществляется путем направления Оператору электронного письма на адрес, указанный в п. 1.2 настоящей Политики, либо в письменной воплощении.</li>
                <li>4.2. На получение информации об обработке своих персональных данных и внесение в них изменений.</li>
                <li>4.3. На требование прекращения обработки персональных данных и (или) их удаления при отсутствии иных оснований для их обработки.</li>
                <li>4.4. На обжалование действий (бездействия) и решений Оператора, нарушающих его права при обработке персональных данных, в Национальный центр защиты персональных данных Республики Беларусь.</li>
              </ul>

              <p className="font-semibold mb-2">5. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>5.1. Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа к ним, уничтожения, изменения, блокирования, копирования, распространения.</li>
                <li>5.2. Настоящая Политика является общедоступной и размещается в сети Интернет на сайте Оператора.</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-slate-50">
            <Button
              onClick={() => setShowPrivacyPolicy(false)}
              size="lg"
              className="w-full cta-button-primary"
            >
              Закрыть
            </Button>
          </div>
        </div>

        {/* Mobile Bottom Sheet */}
        <div
          className="md:hidden fixed bottom-0 inset-x-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto p-5 z-[60]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#2F3E46]">Политика обработки персональных данных</h2>
            <button
              onClick={() => setShowPrivacyPolicy(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="text-slate-700 text-sm leading-relaxed mb-4">
            <p className="font-bold text-base mb-4">ПОЛИТИКА ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ</p>
            <p className="font-semibold mb-4">Общества с ограниченной ответственностью «МегаДорАльянс»</p>

            <p className="font-semibold mb-2">1. ОБЩИЕ ПОЛОЖЕНИЯ</p>
            <p className="mb-3">1.1. Настоящая Политика обработки персональных данных (далее — Политика) разработана в соответствии с Законом Республики Беларусь от 7 мая 2021 г. № 99-З «О защите персональных данных» (далее — Закон) и определяет порядок обработки персональных данных пользователей сайта (далее — Пользователи) Обществом с ограниченной ответственностью «МегаДорАльянс» (далее — Оператор).</p>
            <p className="mb-3">1.2. Юридический адрес Оператора: Республика Беларусь (информация заполняется Оператором), УНП (информация заполняется Оператором). Электронная почта для связи и отзыва согласий: (укажите ваш email, например: info@megadoralians.by).</p>
            <p className="mb-4">1.3. Настоящая Политика действует в отношении всех персональных данных, собираемых через форму обратной связи на сайте Оператора.</p>

            <p className="font-semibold mb-2">2. ЦЕЛИ, ПЕРЕЧЕНЬ И ПРАВОВЫЕ ОСНОВАНИЯ ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ</p>
            <p className="mb-3">2.1. Оператор осуществляет обработку персональных данных в следующих целях:</p>
            <ul className="list-disc pl-5 mb-3 space-y-1">
              <li>Для сегментов B2C, B2B и B2G: обработка входящих заявок, запросов и коммерческих предложений от потенциальных клиентов и партнеров;</li>
              <li>Проведение предварительных консультаций по вопросам оказания услуг, поставки товаров или выполнения дорожно-строительных работ;</li>
              <li>Подготовка документов для заключения договоров (включая процедуры государственных и коммерческих закупок).</li>
            </ul>
            <p className="mb-3">2.2. Перечень обрабатываемых персональных данных:</p>
            <ul className="list-disc pl-5 mb-3 space-y-1">
              <li>Имя (ФИО);</li>
              <li>Номер контактного телефона.</li>
            </ul>
            <p className="mb-4">2.3. Правовым основанием обработки персональных данных является согласие Пользователя (п. 1 ст. 5 Закона Республики Беларусь «О защите персональных данных»).</p>

            <p className="font-semibold mb-2">3. ПОРЯДОК И СРОКИ ХРАНЕНИЯ ПЕРСОНАЛЬНЫХ ДАННЫХ</p>
            <p className="mb-3">3.1. Обработка персональных данных осуществляется Оператором с использованием средств автоматизации.</p>
            <p className="mb-4">3.2. Персональные данные хранятся в течение 1 (одного) года с момента обработки входящей заявки или до момента отзыва согласия Пользователем (в зависимости от того, какое событие наступит раньше). В случае заключения договора данные обрабатываются в течение сроков, установленных законодательством РБ для хранения первичных учетных документов.</p>

            <p className="font-semibold mb-2">4. ПРАВА ПОЛЬЗОВАТЕЛЕЙ И МЕХАНИЗМ ИХ РЕАЛИЗАЦИИ</p>
            <p className="mb-2">Пользователь имеет право:</p>
            <ul className="list-disc pl-5 mb-3 space-y-1">
              <li>4.1. На отзыв своего согласия в любое время без объяснения причин. Отзыв согласия осуществляется путем направления Оператору электронного письма на адрес, указанный в п. 1.2 настоящей Политики, либо в письменной воплощении.</li>
              <li>4.2. На получение информации об обработке своих персональных данных и внесение в них изменений.</li>
              <li>4.3. На требование прекращения обработки персональных данных и (или) их удаления при отсутствии иных оснований для их обработки.</li>
              <li>4.4. На обжалование действий (бездействия) и решений Оператора, нарушающих его права при обработке персональных данных, в Национальный центр защиты персональных данных Республики Беларусь.</li>
            </ul>

            <p className="font-semibold mb-2">5. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>5.1. Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа к ним, уничтожения, изменения, блокирования, копирования, распространения.</li>
              <li>5.2. Настоящая Политика является общедоступной и размещается в сети Интернет на сайте Оператора.</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="pt-4">
            <Button
              onClick={() => setShowPrivacyPolicy(false)}
              size="lg"
              className="w-full cta-button-primary"
            >
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      {/* Desktop Modal */}
      <div
        className={`hidden md:flex flex-col rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden bg-white transition-all duration-300 ease-out ${
          isClosing || !isMounted ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-[#2F3E46]">{getTitle()}</h2>
            <p className="text-sm text-gray-600 mt-1">{getSubtitle()}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#2F3E46] mb-2">Заявка отправлена!</h3>
              <p className="text-gray-600 text-center">Мы свяжемся с вами в ближайшее время</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {renderProductSummary()}
              {renderCartItems()}
              {renderGateParameters()}
              {renderConsultationIntro()}
              {renderContactForm()}

              <Button
                type="submit"
                size="lg"
                className={`w-full mt-6 cta-button-primary transition-all duration-300 ease-in-out ${
                  !isConsentGiven 
                    ? 'opacity-50 cursor-not-allowed bg-orange-600/50' 
                    : 'opacity-100 cursor-pointer hover:bg-orange-700 active:scale-98'
                }`}
                disabled={isSubmitting || !isConsentGiven}
              >
                {isSubmitting ? 'Отправка...' : config?.scope === 'cart_checkout' ? 'Оформить заказ' : 'Отправить заявку'}
                {!isSubmitting && <ChevronRight className="ml-2 w-5 h-5" />}
              </Button>
            </form>
          )}

          <p className="text-xs text-gray-500 text-center mt-4">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div
        className={`md:hidden fixed bottom-0 inset-x-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto p-5 z-50 transition-transform duration-300 ease-in-out ${
          isClosing || !isMounted ? 'translate-y-full' : 'translate-y-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#2F3E46]">{getTitle()}</h2>
          <p className="text-sm text-gray-600 mt-1">{getSubtitle()}</p>
        </div>

        {/* Content */}
        {submitSuccess ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-[#2F3E46] mb-2">Заявка отправлена!</h3>
            <p className="text-gray-600 text-center">Мы свяжемся с вами в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {renderProductSummary()}
            {renderCartItems()}
            {renderGateParameters()}
            {renderConsultationIntro()}
            {renderContactForm()}

            <Button
              type="submit"
              size="lg"
              className={`w-full mt-6 cta-button-primary transition-all duration-300 ease-in-out ${
                !isConsentGiven 
                  ? 'opacity-50 cursor-not-allowed bg-orange-600/50' 
                  : 'opacity-100 cursor-pointer hover:bg-orange-700 active:scale-98'
              }`}
              disabled={isSubmitting || !isConsentGiven}
            >
              {isSubmitting ? 'Отправка...' : config?.scope === 'cart_checkout' ? 'Оформить заказ' : 'Отправить заявку'}
              {!isSubmitting && <ChevronRight className="ml-2 w-5 h-5" />}
            </Button>
          </form>
        )}

        <p className="text-xs text-gray-500 text-center mt-4">
          Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
        </p>
      </div>

      {/* Privacy Policy Modal */}
      {renderPrivacyPolicyModal()}
    </div>
  );
}
