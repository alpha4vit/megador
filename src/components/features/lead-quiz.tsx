'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Home, Warehouse, Factory, Shield, Fence, Cog, Phone, MessageCircle, Check } from 'lucide-react';
import { Button } from '../ui/button';

type Destination = 'dacha' | 'house' | 'industrial';
type ProductType = 'gates' | 'fences' | 'complex';
type Messenger = 'viber' | 'telegram' | 'whatsapp' | 'sms';

interface QuizData {
  destination: Destination | null;
  productType: ProductType | null;
  dimensions: {
    width: number;
    height: number;
  };
  contact: {
    name: string;
    phone: string;
    messenger: Messenger | null;
  };
}

const destinations = [
  { id: 'dacha' as const, label: 'Дача', icon: Home, description: 'Для сезонного использования' },
  { id: 'house' as const, label: 'Частный дом', icon: Warehouse, description: 'Постоянное проживание' },
  { id: 'industrial' as const, label: 'Промзона', icon: Factory, description: 'Склады и производства' },
];

const productTypes = [
  { id: 'gates' as const, label: 'Ворота', icon: Shield, description: 'Секционные, откатные, распашные' },
  { id: 'fences' as const, label: 'Забор', icon: Fence, description: 'Металлоштакетник, жалюзи' },
  { id: 'complex' as const, label: 'Комплексное решение', icon: Cog, description: 'Ворота + забор + автоматика' },
];

const messengers = [
  { id: 'viber' as const, label: 'Viber', icon: MessageCircle },
  { id: 'telegram' as const, label: 'Telegram', icon: MessageCircle },
  { id: 'whatsapp' as const, label: 'WhatsApp', icon: MessageCircle },
  { id: 'sms' as const, label: 'SMS', icon: Phone },
];

const totalSteps = 4;

export const LeadQuiz = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState<QuizData>({
    destination: null,
    productType: null,
    dimensions: { width: 300, height: 200 },
    contact: { name: '', phone: '', messenger: null },
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = () => {
    // In a real application, this would send data to a backend
    console.log('Quiz submitted:', quizData);
    setIsSubmitted(true);
  };

  const resetQuiz = () => {
    setCurrentStep(1);
    setQuizData({
      destination: null,
      productType: null,
      dimensions: { width: 300, height: 200 },
      contact: { name: '', phone: '', messenger: null },
    });
    setIsSubmitted(false);
  };

  const progress = (currentStep / totalSteps) * 100;

  if (isSubmitted) {
    return (
      <div className="bg-[#F8F9FA] rounded-2xl p-8 sm:p-12 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-[#2F3E46] mb-4">Спасибо за заявку!</h3>
        <p className="text-gray-600 mb-6">
          Наш специалист свяжется с вами в ближайшее время для уточнения деталей и отправки каталога.
        </p>
        <Button onClick={resetQuiz} size="lg">
          Пройти заново
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Progress Bar */}
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

      {/* Step Content */}
      <div className="min-h-[300px]">
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
            <h3 className="text-2xl font-bold text-[#2F3E46] mb-2">Укажите размеры</h3>
            <p className="text-gray-600 mb-6">Примерные размеры проема (в см)</p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#2F3E46] mb-2">
                  Ширина: {quizData.dimensions.width} см
                </label>
                <input
                  type="range"
                  min="200"
                  max="600"
                  value={quizData.dimensions.width}
                  onChange={(e) =>
                    setQuizData({
                      ...quizData,
                      dimensions: { ...quizData.dimensions, width: parseInt(e.target.value) },
                    })
                  }
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E65F2B]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>200 см</span>
                  <span>600 см</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2F3E46] mb-2">
                  Высота: {quizData.dimensions.height} см
                </label>
                <input
                  type="range"
                  min="150"
                  max="350"
                  value={quizData.dimensions.height}
                  onChange={(e) =>
                    setQuizData({
                      ...quizData,
                      dimensions: { ...quizData.dimensions, height: parseInt(e.target.value) },
                    })
                  }
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E65F2B]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>150 см</span>
                  <span>350 см</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold text-[#2F3E46] mb-2">Куда отправить каталог?</h3>
            <p className="text-gray-600 mb-6">Оставьте контакты для связи</p>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-[#2F3E46] mb-2">Ваше имя</label>
                <input
                  type="text"
                  value={quizData.contact.name}
                  onChange={(e) =>
                    setQuizData({
                      ...quizData,
                      contact: { ...quizData.contact, name: e.target.value },
                    })
                  }
                  placeholder="Введите имя"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#E65F2B] focus:ring-2 focus:ring-[#E65F2B] focus:ring-opacity-20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-[#2F3E46] mb-2">Телефон</label>
                <input
                  type="tel"
                  value={quizData.contact.phone}
                  onChange={(e) =>
                    setQuizData({
                      ...quizData,
                      contact: { ...quizData.contact, phone: e.target.value },
                    })
                  }
                  placeholder="+375 (XX) XXX-XX-XX"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#E65F2B] focus:ring-2 focus:ring-[#E65F2B] focus:ring-opacity-20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-[#2F3E46] mb-2">Предпочтительный мессенджер</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {messengers.map((messenger) => {
                    const Icon = messenger.icon;
                    return (
                      <button
                        key={messenger.id}
                        onClick={() =>
                          setQuizData({
                            ...quizData,
                            contact: { ...quizData.contact, messenger: messenger.id },
                          })
                        }
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
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center"
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
            className="flex items-center"
          >
            Далее
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={
              !quizData.contact.name ||
              !quizData.contact.phone ||
              !quizData.contact.messenger
            }
            className="flex items-center"
          >
            Отправить заявку
            <Check className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
