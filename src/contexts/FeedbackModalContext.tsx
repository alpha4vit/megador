'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type ModalScope = 'product' | 'gate' | 'consultation' | 'cart_checkout';

export interface ProductInfo {
  name: string;
  brand?: string;
  price: string;
  specs?: string[];
}

export interface GateInfo {
  gateType: string;
  width?: string;
  height?: string;
  withAutomation?: boolean;
  withWicket?: boolean;
}

export interface FeedbackModalConfig {
  scope: ModalScope;
  productInfo?: ProductInfo;
  gateInfo?: GateInfo;
  title?: string;
  subtitle?: string;
}

interface FeedbackModalContextType {
  isOpen: boolean;
  config: FeedbackModalConfig | null;
  openModal: (config: FeedbackModalConfig) => void;
  closeModal: () => void;
}

const FeedbackModalContext = createContext<FeedbackModalContextType | undefined>(undefined);

export function FeedbackModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<FeedbackModalConfig | null>(null);

  const openModal = (newConfig: FeedbackModalConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setConfig(null);
    }, 300);
  };

  return (
    <FeedbackModalContext.Provider value={{ isOpen, config, openModal, closeModal }}>
      {children}
    </FeedbackModalContext.Provider>
  );
}

export function useFeedbackModal() {
  const context = useContext(FeedbackModalContext);
  if (context === undefined) {
    throw new Error('useFeedbackModal must be used within a FeedbackModalProvider');
  }
  return context;
}
