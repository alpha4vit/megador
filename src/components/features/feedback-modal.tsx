'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronRight, ChevronDown, Check, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeedbackModal, FeedbackModalConfig, ModalScope } from '@/contexts/FeedbackModalContext';
import { useCart, CartItem } from '@/contexts/CartContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const FEEDBACK_ENDPOINT = `${API_BASE_URL}/api/feedback`;

type FeedbackMetadata = Record<string, unknown> & { type: string };

type GateKind = 'SECTIONAL_GATES' | 'ROLLER_GATES' | 'SLIDING_GATES' | 'SWING_GATES' | 'BARRIER';

interface FormState {
  // Gate-specific fields
  width: string;
  height: string;
  headroom: string;
  withAutomation: boolean | null;
  withWicket: boolean | null;
  needFoundation: boolean | null;
  needPosts: boolean | null;
  needSupportPost: boolean | null;
  hasEmergencyOverride: boolean | null;
  installationType: '' | 'SURFACE_MOUNT' | 'BUILT_IN';
  intensity: '' | 'LOW' | 'MEDIUM' | 'HIGH';
  boomType: '' | 'STRAIGHT' | 'FOLDING';
  accessControlMethod: string;
  // Contact fields
  name: string;
  phone: string;
  note: string;
}

const INITIAL_FORM_STATE: FormState = {
  width: '',
  height: '',
  headroom: '',
  withAutomation: null,
  withWicket: null,
  needFoundation: null,
  needPosts: null,
  needSupportPost: null,
  hasEmergencyOverride: null,
  installationType: '',
  intensity: '',
  boomType: '',
  accessControlMethod: '',
  name: '',
  phone: '',
  note: '',
};

function parseMillimeters(value: string): number | null {
  const parsed = parseInt(value.replace(/\D/g, ''), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function detectGateKind(gateType: string): GateKind {
  const normalized = gateType.toLowerCase();
  if (normalized.includes('шлагбаум')) return 'BARRIER';
  if (normalized.includes('роллет')) return 'ROLLER_GATES';
  if (normalized.includes('откат')) return 'SLIDING_GATES';
  if (normalized.includes('распаш')) return 'SWING_GATES';
  return 'SECTIONAL_GATES';
}

function buildGateMetadata(kind: GateKind, formData: FormState): FeedbackMetadata {
  const width = parseMillimeters(formData.width);
  const height = parseMillimeters(formData.height);
  const headroom = parseMillimeters(formData.headroom);

  switch (kind) {
    case 'BARRIER':
      return {
        type: 'BARRIER',
        boomLength: width,
        hasWicket: formData.withWicket,
        needFoundation: formData.needFoundation,
        intensity: formData.intensity || null,
        accessControlMethod: formData.accessControlMethod || null,
        boomType: formData.boomType || undefined,
        needSupportPost: formData.needSupportPost,
      };
    case 'ROLLER_GATES':
      return {
        type: 'ROLLER_GATES',
        width,
        height,
        installationType: formData.installationType || null,
        hasAutomation: formData.withAutomation,
        hasEmergencyOverride: formData.hasEmergencyOverride,
      };
    case 'SLIDING_GATES':
      return {
        type: 'SLIDING_GATES',
        width,
        height,
        headroom,
        hasAutomation: formData.withAutomation,
        hasWicket: formData.withWicket,
        needFoundation: formData.needFoundation,
      };
    case 'SWING_GATES':
      return {
        type: 'SWING_GATES',
        width,
        height,
        hasAutomation: formData.withAutomation,
        hasWicket: formData.withWicket,
        needPosts: formData.needPosts,
      };
    case 'SECTIONAL_GATES':
    default:
      return {
        type: 'SECTIONAL_GATES',
        width,
        height,
        headroom,
        hasAutomation: formData.withAutomation,
        hasWicket: formData.withWicket,
      };
  }
}

function buildMetadata(
  scope: ModalScope | undefined,
  config: FeedbackModalConfig | null,
  formData: FormState,
  cart: CartItem[],
): FeedbackMetadata {
  const note = formData.note.trim();

  if (scope === 'gate') {
    const metadata = buildGateMetadata(detectGateKind(config?.gateInfo?.gateType ?? ''), formData);
    if (config?.portfolioProject) {
      metadata.portfolioProjectId = config.portfolioProject.id;
      metadata.portfolioProjectTitle = config.portfolioProject.title;
    }
    return metadata;
  }

  if (scope === 'cart_checkout') {
    return {
      type: 'PRODUCT',
      items: cart.map((item) => ({ name: item.title, quantity: item.quantity })),
      comment: note || null,
    };
  }

  if (scope === 'product' && config?.productInfo) {
    const { name, price } = config.productInfo;
    const comment = [name ? `${name}${price ? ` — ${price}` : ''}` : null, note || null]
      .filter(Boolean)
      .join('\n');
    return { type: 'PRODUCT', items: [{ name: config.productInfo.name, quantity: 1 }], comment: comment || null };
  }

  if (scope === 'consultation') {
    return { type: 'CONSULTATION', question: note || null };
  }

  const comment = [config?.title ?? null, note || null].filter(Boolean).join('\n');
  return { type: 'PRODUCT', items: [], comment: comment || null };
}

function SuccessState() {
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
        Заявка отправлена!
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5, ease: 'easeOut' }}
        className="text-gray-600 text-center"
      >
        Мы свяжемся с вами в ближайшее время
      </motion.p>
    </motion.div>
  );
}

export default function FeedbackModal() {
  const { isOpen, config, closeModal } = useFeedbackModal();
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalItems } = useCart();
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);

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
      setSubmitError(null);
      setFormData(INITIAL_FORM_STATE);
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
    setSubmitError(null);

    const phoneDigits = formData.phone.replace(/\D/g, '');
    const payload = {
      fullName: formData.name.trim(),
      phoneNumber: phoneDigits ? `+${phoneDigits}` : '',
      metadata: buildMetadata(config?.scope, config, formData, cart),
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
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setIsSubmitting(false);
      setSubmitError('Не удалось отправить заявку. Пожалуйста, попробуйте ещё раз или свяжитесь с нами по телефону.');
      return;
    }

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
    }, 3200);
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

  const fieldInputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E65F2B] focus:border-transparent outline-none transition-all';

  const renderMmField = (
    label: string,
    field: 'width' | 'height' | 'headroom',
    placeholder = 'Например: 3000',
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {/*<span className="text-gray-400 font-normal">- опционально</span>*/}
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={formData[field]}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        placeholder={placeholder}
        className={fieldInputClass}
      />
    </div>
  );

  const renderSelectField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: { value: string; label: string }[],
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {/*<span className="text-gray-400 font-normal">- опционально</span>*/}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldInputClass} appearance-none pr-11`}
        >
          <option value="" className="text-gray-400">Не указано</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
    </div>
  );

  const renderBoolToggle = (
    label: string,
    yesLabel: string,
    noLabel: string,
    value: boolean | null,
    onChange: (value: boolean) => void,
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="relative flex w-full p-1 bg-slate-50 border border-slate-200 rounded-xl select-none">
        {/* Sliding Background Accent */}
        <div
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-[#E65F2B] rounded-lg shadow-sm z-0 transition-all duration-300 ease-in-out ${
            value === null
              ? 'opacity-0'
              : value === false
                ? 'translate-x-full opacity-100'
                : 'opacity-100'
          }`}
        />

        {/* Option 1: Yes */}
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 py-3 px-4 rounded-lg transition-colors duration-300 relative z-10 ${
            value === true ? 'text-white font-medium' : 'text-slate-600'
          }`}
        >
          {yesLabel}
        </button>

        {/* Option 2: No */}
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 py-3 px-4 rounded-lg transition-colors duration-300 relative z-10 ${
            value === false ? 'text-white font-medium' : 'text-slate-600'
          }`}
        >
          {noLabel}
        </button>
      </div>
    </div>
  );

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setFormData({ ...formData, [field]: value });

  const renderGateKindFields = (kind: GateKind) => {
    switch (kind) {
      case 'BARRIER':
        return (
          <>
            {renderMmField('Длина стрелы (мм)', 'width')}
            {renderBoolToggle('Калитка', 'С калиткой', 'Без калитки', formData.withWicket, (v) => setField('withWicket', v))}
            {renderBoolToggle('Фундамент', 'Нужен фундамент', 'Не нужен', formData.needFoundation, (v) => setField('needFoundation', v))}
            {renderSelectField('Интенсивность', formData.intensity, (v) => setField('intensity', v as FormState['intensity']), [
              { value: 'LOW', label: 'Низкая' },
              { value: 'MEDIUM', label: 'Средняя' },
              { value: 'HIGH', label: 'Высокая' },
            ])}
            {renderSelectField('Метод контроля доступа', formData.accessControlMethod, (v) => setField('accessControlMethod', v), [
              { value: 'Радиопульт', label: 'Радиопульт' },
              { value: 'Кнопка', label: 'Кнопка вызова' },
              { value: 'Считыватель карт', label: 'Считыватель карт/брелоков' },
              { value: 'ANPR', label: 'ANPR (распознавание номеров)' },
              { value: 'GSM', label: 'GSM/телефон' },
            ])}
            {renderSelectField('Тип стрелы', formData.boomType, (v) => setField('boomType', v as FormState['boomType']), [
              { value: 'STRAIGHT', label: 'Прямой' },
              { value: 'FOLDING', label: 'Складной' },
            ])}
            {renderBoolToggle('Опорная стойка', 'Нужна стойка', 'Не нужна', formData.needSupportPost, (v) => setField('needSupportPost', v))}
          </>
        );
      case 'ROLLER_GATES':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              {renderMmField('Ширина (мм)', 'width')}
              {renderMmField('Высота (мм)', 'height', 'Например: 2500')}
            </div>
            {renderSelectField('Тип установки', formData.installationType, (v) => setField('installationType', v as FormState['installationType']), [
              { value: 'SURFACE_MOUNT', label: 'Наземный' },
              { value: 'BUILT_IN', label: 'Встроенный (в откос)' },
            ])}
            {renderBoolToggle('Автоматика', 'С автоматикой', 'Без автоматики', formData.withAutomation, (v) => setField('withAutomation', v))}
            {renderBoolToggle('Аварийный привод', 'С аварийным приводом', 'Без аварийного привода', formData.hasEmergencyOverride, (v) => setField('hasEmergencyOverride', v))}
          </>
        );
      case 'SLIDING_GATES':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              {renderMmField('Ширина (мм)', 'width')}
              {renderMmField('Высота (мм)', 'height', 'Например: 2125')}
            </div>
            {renderBoolToggle('Автоматика', 'С автоматикой', 'Без автоматики', formData.withAutomation, (v) => setField('withAutomation', v))}
            {renderBoolToggle('Калитка', 'С калиткой', 'Без калитки', formData.withWicket, (v) => setField('withWicket', v))}
            {renderBoolToggle('Фундамент', 'Нужен фундамент', 'Не нужен', formData.needFoundation, (v) => setField('needFoundation', v))}
          </>
        );
      case 'SWING_GATES':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              {renderMmField('Ширина (мм)', 'width')}
              {renderMmField('Высота (мм)', 'height', 'Например: 2125')}
            </div>
            {renderBoolToggle('Автоматика', 'С автоматикой', 'Без автоматики', formData.withAutomation, (v) => setField('withAutomation', v))}
            {renderBoolToggle('Калитка', 'С калиткой', 'Без калитки', formData.withWicket, (v) => setField('withWicket', v))}
            {renderBoolToggle('Столбы', 'Нужны столбы', 'Без столбов', formData.needPosts, (v) => setField('needPosts', v))}
          </>
        );
      case 'SECTIONAL_GATES':
      default:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              {renderMmField('Ширина (мм)', 'width')}
              {renderMmField('Высота (мм)', 'height', 'Например: 2125')}
            </div>
            {renderMmField('Подпространство (мм)', 'headroom', 'Например: 500')}
            {renderBoolToggle('Автоматика', 'С автоматикой', 'Без автоматики', formData.withAutomation, (v) => setField('withAutomation', v))}
            {renderBoolToggle('Калитка', 'С калиткой', 'Без калитки', formData.withWicket, (v) => setField('withWicket', v))}
          </>
        );
    }
  };

  const renderGateParameters = () => {
    if (config.scope !== 'gate') return null;

    const kind = detectGateKind(config.gateInfo?.gateType ?? '');

    return (
      <div className="space-y-4 mb-6">
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

        {config.portfolioProject && (
          <div className="bg-[#FFF5F0] border border-orange-100 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 mb-0.5">Кейс из раздела «Наши работы»</p>
            <p className="text-sm font-semibold text-[#2F3E46]">{config.portfolioProject.title}</p>
          </div>
        )}

        {renderGateKindFields(kind)}
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
        {(() => {
          const totalQty = getTotalItems();
          const mod100 = totalQty % 100;
          const mod10 = totalQty % 10;
          const word = mod100 > 10 && mod100 < 20 ? 'товаров' : mod10 > 1 && mod10 < 5 ? 'товара' : mod10 === 1 ? 'товар' : 'товаров';
          return (
            <p className="text-sm font-semibold text-[#2F3E46] mb-4">Ваш заказ ({totalQty} {word})</p>
          );
        })()}
        
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
          Комментарий
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
          <AnimatePresence initial={false} mode="popLayout">
            {submitSuccess ? (
              <SuccessState key="success" />
            ) : (
              <motion.form
                key="feedback-form"
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeIn' }}
                onSubmit={handleSubmit}
              >
              {renderProductSummary()}
              {renderCartItems()}
              {renderGateParameters()}
              {renderConsultationIntro()}
              {renderContactForm()}

              {submitError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
                  {submitError}
                </p>
              )}

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
              </motion.form>
            )}
          </AnimatePresence>

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
        <AnimatePresence initial={false} mode="popLayout">
          {submitSuccess ? (
            <SuccessState key="success" />
          ) : (
            <motion.form
              key="feedback-form-mobile"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeIn' }}
              onSubmit={handleSubmit}
            >
            {renderProductSummary()}
            {renderCartItems()}
            {renderGateParameters()}
            {renderConsultationIntro()}
            {renderContactForm()}

            {submitError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
                {submitError}
              </p>
            )}

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
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-xs text-gray-500 text-center mt-4">
          Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
        </p>
      </div>

      {/* Privacy Policy Modal */}
      {renderPrivacyPolicyModal()}
    </div>
  );
}
