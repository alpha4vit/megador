'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Home, Warehouse, Factory, Shield, Fence, Cog, Phone, MessageCircle, Check } from 'lucide-react';
import { Button } from '../ui/button';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const FEEDBACK_ENDPOINT = `${API_BASE_URL}/feedback`;

type Destination = 'dacha' | 'house' | 'industrial';
type ProductType = 'gates' | 'fences' | 'complex';
type Messenger = 'viber' | 'telegram' | 'whatsapp' | 'sms';

interface QuizData {
  destination: Destination | null;
  productType: ProductType | null;
  contact: {
    name: string;
    phone: string;
    messenger: Messenger | null;
  };
}

interface FieldErrors {
  name?: string;
  phone?: string;
  messenger?: string;
  consent?: string;
}

const destinations = [
  { id: 'dacha' as const, label: 'Дача', icon: Home, description: 'Для сезонного использования' },
  { id: 'house' as const, label: 'Частный дом', icon: Warehouse, description: 'Постоянное проживание' },
  { id: 'industrial' as const, label: 'Промзона', icon: Factory, description: 'Склады и производства' },
];

const destinationLabels: Record<Destination, string> = {
  dacha: 'Дача',
  house: 'Частный дом',
  industrial: 'Промзона',
};

const productTypes = [
  { id: 'gates' as const, label: 'Ворота', icon: Shield, description: 'Секционные, откатные, распашные' },
  { id: 'fences' as const, label: 'Забор', icon: Fence, description: 'Металлоштакетник, жалюзи' },
  { id: 'complex' as const, label: 'Комплексное решение', icon: Cog, description: 'Ворота + забор + автоматика' },
];

const productTypeLabels: Record<ProductType, string> = {
  gates: 'Ворота',
  fences: 'Забор',
  complex: 'Комплексное решение',
};

const messengers = [
  { id: 'viber' as const, label: 'Viber', icon: MessageCircle },
  { id: 'telegram' as const, label: 'Telegram', icon: MessageCircle },
  { id: 'whatsapp' as const, label: 'WhatsApp', icon: MessageCircle },
  { id: 'sms' as const, label: 'SMS', icon: Phone },
];

const messengerLabels: Record<Messenger, string> = {
  viber: 'Viber',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  sms: 'SMS',
};

const totalSteps = 3;
const PHONE_PATTERN = /^\+375 \(\d{2}\) \d{3}-\d{2}-\d{2}$/;

const INITIAL_QUIZ_DATA: QuizData = {
  destination: null,
  productType: null,
  contact: { name: '', phone: '', messenger: null },
};

function formatPhoneMask(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.length > 0) {
    if (digits[0] === '8') {
      digits = '3' + digits;
    }
    if (digits.startsWith('375')) {
      digits = digits.substring(3);
    }
  }
  digits = digits.substring(0, 9);

  let formatted = '+375';
  if (digits.length > 0) {
    formatted += ' (' + digits.substring(0, 2);
  }
  if (digits.length > 2) {
    formatted += ') ' + digits.substring(2, 5);
  }
  if (digits.length > 5) {
    formatted += '-' + digits.substring(5, 7);
  }
  if (digits.length > 7) {
    formatted += '-' + digits.substring(7, 9);
  }
  return formatted;
}

function QuizSuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 260, damping: 17 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.2 }}
        className="mb-8 p-2"
      >
        <motion.svg viewBox="0 0 52 52" className="w-28 h-28" fill="none">
          <motion.g
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ delay: 1.45, duration: 0.45, ease: 'easeOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <motion.circle
              cx="26"
              cy="26"
              r="25"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: 'easeInOut', delay: 0.35 }}
            />
            <motion.path
              d="M15 27l7.5 7.5L37 19"
              stroke="#22c55e"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 1.0 }}
            />
          </motion.g>
        </motion.svg>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.35, duration: 0.5, ease: 'easeOut' }}
        className="text-2xl font-bold text-[#2F3E46] mb-2"
      >
        Спасибо за заявку!
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5, ease: 'easeOut' }}
        className="text-gray-600 text-center"
      >
        Наш специалист свяжется с вами в ближайшее время для уточнения деталей и отправки каталога.
      </motion.p>
    </motion.div>
  );
}

export const LeadQuiz = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState<QuizData>(INITIAL_QUIZ_DATA);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateContact = (patch: Partial<QuizData['contact']>) => {
    setQuizData({ ...quizData, contact: { ...quizData.contact, ...patch } });
    setErrors((prev) => {
      const next = { ...prev };
      if ('name' in patch) delete next.name;
      if ('phone' in patch) delete next.phone;
      if ('messenger' in patch) delete next.messenger;
      return next;
    });
  };

  const validateContactStep = (): boolean => {
    const next: FieldErrors = {};
    if (!quizData.contact.name.trim()) {
      next.name = 'Введите ваше имя';
    }
    if (!PHONE_PATTERN.test(quizData.contact.phone)) {
      next.phone = 'Введите номер в формате +375 (XX) XXX-XX-XX';
    }
    if (!quizData.contact.messenger) {
      next.messenger = 'Выберите удобный способ связи';
    }
    if (!isConsentGiven) {
      next.consent = 'Необходимо согласие на обработку персональных данных';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateContactStep()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      fullName: quizData.contact.name.trim(),
      phoneNumber: `+${quizData.contact.phone.replace(/\D/g, '')}`,
      metadata: {
        type: 'QUIZ',
        objectType: quizData.destination ? destinationLabels[quizData.destination] : null,
        productType: quizData.productType ? productTypeLabels[quizData.productType] : null,
        messenger: quizData.contact.messenger ? messengerLabels[quizData.contact.messenger] : null,
      },
    };

    try {
      const response = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      setSubmitError('Не удалось отправить заявку. Пожалуйста, попробуйте ещё раз или свяжитесь с нами по телефону.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(1);
    setQuizData(INITIAL_QUIZ_DATA);
    setIsSubmitted(false);
    setSubmitError(null);
    setIsConsentGiven(false);
    setErrors({});
  };

  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    if (!isSubmitted) return;
    const timer = setTimeout(() => {
      resetQuiz();
    }, 4000);
    return () => clearTimeout(timer);
  }, [isSubmitted]);

  const inputClass = (hasError?: string) =>
    `w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#E65F2B] focus:ring-opacity-20 outline-none transition-all ${
      hasError ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-[#E65F2B]'
    }`;

  return (
    <div className="bg-[#F8F9FA] rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Progress Bar */}
      {!isSubmitted && (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Шаг {currentStep} из {totalSteps}</span>
          <span className="text-sm font-medium text-[#E65F2B]">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-[#E65F2B] h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      )}

      {/* Step Content */}
      <div className="min-h-[300px]">
        <AnimatePresence initial={false} mode="popLayout">
          {isSubmitted ? (
            <QuizSuccessState key="success" />
          ) : (
            <motion.div
              key="quiz-form"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeIn' }}
            >
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold text-[#2F3E46] mb-2">Куда планируете установить?</h3>
            <p className="text-gray-600 mb-6">Выберите тип вашего объекта</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {destinations.map((dest) => {
                const Icon = dest.icon;
                return (
                  <button
                    key={dest.id}
                    onClick={() => setQuizData({ ...quizData, destination: dest.id })}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      quizData.destination === dest.id
                        ? 'border-[#E65F2B] bg-orange-50'
                        : 'border-gray-200 hover:border-[#E65F2B] hover:bg-orange-50'
                    }`}
                  >
                    <Icon className="w-8 h-8 text-[#2F3E46] mb-3 mx-auto" />
                    <h4 className="font-semibold text-[#2F3E46] mb-1">{dest.label}</h4>
                    <p className="text-sm text-gray-500">{dest.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold text-[#2F3E46] mb-2">Что вас интересует?</h3>
            <p className="text-gray-600 mb-6">Выберите тип продукции</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {productTypes.map((product) => {
                const Icon = product.icon;
                return (
                  <button
                    key={product.id}
                    onClick={() => setQuizData({ ...quizData, productType: product.id })}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      quizData.productType === product.id
                        ? 'border-[#E65F2B] bg-orange-50'
                        : 'border-gray-200 hover:border-[#E65F2B] hover:bg-orange-50'
                    }`}
                  >
                    <Icon className="w-8 h-8 text-[#2F3E46] mb-3 mx-auto" />
                    <h4 className="font-semibold text-[#2F3E46] mb-1">{product.label}</h4>
                    <p className="text-sm text-gray-500">{product.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold text-[#2F3E46] mb-2">Куда отправить каталог?</h3>
            <p className="text-gray-600 mb-6">Оставьте контакты для связи</p>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-[#2F3E46] mb-2">
                  ФИО <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={quizData.contact.name}
                  onChange={(e) => updateContact({ name: e.target.value })}
                  placeholder="Введите имя"
                  className={inputClass(errors.name)}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-base font-medium text-[#2F3E46] mb-2">
                  Номер телефона <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={quizData.contact.phone}
                  onChange={(e) => updateContact({ phone: formatPhoneMask(e.target.value) })}
                  placeholder="+375 (XX) XXX-XX-XX"
                  className={inputClass(errors.phone)}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-base font-medium text-[#2F3E46] mb-2">
                  Предпочтительный мессенджер <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {messengers.map((messenger) => {
                    const Icon = messenger.icon;
                    return (
                      <button
                        key={messenger.id}
                        onClick={() => updateContact({ messenger: messenger.id })}
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
                          quizData.contact.messenger === messenger.id
                            ? 'border-[#E65F2B] bg-orange-50'
                            : 'border-gray-200 hover:border-[#E65F2B] hover:bg-orange-50'
                        }`}
                      >
                        <Icon className="w-6 h-6 text-[#2F3E46] mb-2" />
                        <span className="text-sm font-medium text-[#2F3E46]">{messenger.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.messenger && <p className="mt-1 text-sm text-red-500">{errors.messenger}</p>}
              </div>
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="quiz-consent-checkbox"
                  checked={isConsentGiven}
                  onChange={(e) => {
                    setIsConsentGiven(e.target.checked);
                    setErrors((prev) => {
                      const next = { ...prev };
                      if (e.target.checked) delete next.consent;
                      return next;
                    });
                  }}
                  className="mt-1 w-5 h-5 accent-[#E65F2B] rounded border-gray-300 focus:ring-2 focus:ring-[#E65F2B] focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="quiz-consent-checkbox" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                  Я согласен на обработку персональных данных в соответствии с политикой конфиденциальности
                  {errors.consent && <span className="block mt-1 text-red-500">{errors.consent}</span>}
                </label>
              </div>
              {submitError && <p className="text-sm text-red-500">{submitError}</p>}
            </div>
          </div>
        )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {!isSubmitted && (
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center transition-all duration-300 ease-in-out active:scale-95"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        {currentStep < totalSteps ? (
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !quizData.destination) ||
              (currentStep === 2 && !quizData.productType)
            }
            className={`flex items-center transition-all duration-300 ease-in-out active:scale-95 ${
              currentStep === 1 && !quizData.destination
                ? 'opacity-60 bg-[#E8A87E] cursor-not-allowed'
                : currentStep === 2 && !quizData.productType
                  ? 'opacity-60 bg-[#E8A87E] cursor-not-allowed'
                  : 'opacity-100 cursor-pointer'
            }`}
          >
            Далее
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isConsentGiven}
            className={`flex items-center transition-all duration-300 ease-in-out active:scale-95 ${
              isConsentGiven
                ? 'opacity-100 bg-[#E65F2B] hover:bg-[#D45425] cursor-pointer'
                : 'opacity-60 bg-[#E8A87E] cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            <Check className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      )}
    </div>
  );
};
