'use client';

import { Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#2F3E46] text-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">MEGADOR</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Производство и установка ворот, заборов и автоматики с гарантией качества. Более 20 лет опыта на рынке Беларуси.
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">
                  РБ, г. Минск, ул. Харьковская 54А, оф. 2
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                <a href="tel:+375296237563" className="text-gray-300 hover:text-white transition-colors">
                  +375 (29) 623 75 63
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                <a href="mailto:info@megador.by" className="text-gray-300 hover:text-white transition-colors">
                  info@megador.by
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Каталог</h4>
            <ul className="space-y-2">
              <li>
                <a href="#gates" className="text-gray-300 hover:text-white transition-colors">
                  Секционные ворота
                </a>
              </li>
              <li>
                <a href="#gates" className="text-gray-300 hover:text-white transition-colors">
                  Откатные ворота
                </a>
              </li>
              <li>
                <a href="#gates" className="text-gray-300 hover:text-white transition-colors">
                  Распашные ворота
                </a>
              </li>
              <li>
                <a href="#fences" className="text-gray-300 hover:text-white transition-colors">
                  Заборы
                </a>
              </li>
              <li>
                <a href="#automation" className="text-gray-300 hover:text-white transition-colors">
                  Автоматика
                </a>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Нужна консультация?</h4>
            <p className="text-gray-300 mb-4">
              Оставьте заявку и наш специалист свяжется с вами в ближайшее время
            </p>
            <button className="w-full inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-[#E65F2B] text-white hover:bg-[#D45425] focus:ring-[#E65F2B] px-6 py-3 text-base">
              Заказать звонок
            </button>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2026 MegaDor.by. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};
