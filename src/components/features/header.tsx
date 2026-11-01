'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X, ChevronDown, ChevronRight, Warehouse, Home, Factory, Cog, Shield, Fence, Layers } from 'lucide-react';
import { Button } from '../ui/button';

const catalogItems = [
  {
    title: 'Секционные ворота',
    icon: Warehouse,
    description: 'Для гаража и промышленных объектов',
    href: '/catalog/sectional-gates',
  },
  {
    title: 'Роллетные ворота',
    icon: Layers,
    description: 'Роллетные ворота и роллеты',
    href: '/catalog/roller-gates',
  },
  {
    title: 'Откатные ворота',
    icon: Fence,
    description: 'Консольные и подвесные системы',
    href: '/catalog/sliding-gates',
  },
  {
    title: 'Распашные ворота',
    icon: Shield,
    description: 'Кованые и из сэндвич-панелей',
    href: '#swing',
  },
  {
    title: 'Заборы-жалюзи',
    icon: Home,
    description: 'Металлоштакетник и жалюзи',
    href: '#fences',
  },
  {
    title: 'Автоматика для секционных ворот',
    icon: Cog,
    description: 'Приводы и комплектующие',
    href: '/catalog/automation-sectional',
  },
  {
    title: 'Автоматика для откатных ворот',
    icon: Cog,
    description: 'Приводы NICE и Alutech',
    href: '/catalog/automation-sliding',
  },
  {
    title: 'Шлагбаумы',
    icon: Factory,
    description: 'Nice и Alutech',
    href: '/catalog/barriers',
  },
];

export const Header = () => {
  const pathname = usePathname();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatalogAccordionOpen, setIsCatalogAccordionOpen] = useState(false);
  const catalogTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActiveCatalogItem = (href: string) => {
    return pathname === href;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsCatalogAccordionOpen(false);
  };

  const handleCatalogEnter = () => {
    if (catalogTimeoutRef.current) {
      clearTimeout(catalogTimeoutRef.current);
    }
    setIsCatalogOpen(true);
  };

  const handleCatalogLeave = () => {
    catalogTimeoutRef.current = setTimeout(() => {
      setIsCatalogOpen(false);
    }, 150);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (catalogTimeoutRef.current) {
        clearTimeout(catalogTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-[#2F3E46]">
                MEGADOR
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* Catalog with Mega Menu */}
              {/* ИСПРАВЛЕНО: Убран класс className="relative", чтобы не сжимать ширину мега-меню */}
              <div
                  onMouseEnter={handleCatalogEnter}
                  onMouseLeave={handleCatalogLeave}
              >
                <button
                    className="flex items-center text-[#2F3E46] hover:text-[#E65F2B] transition-colors font-medium py-2"
                    onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                >
                  Каталог
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu Dropdown - Full Width */}
                {isCatalogOpen && (
                    /* ИСПРАВЛЕНО: absolute заменен на fixed, а top-full на top-[72px] (или высоту вашего хедера),
                       чтобы меню растягивалось на весь экран и больше никогда не превращалось в суп */
                    <div
                        className="fixed top-[72px] left-0 w-full pt-4 opacity-100 transition-opacity duration-150 ease-out z-50"
                        onMouseEnter={handleCatalogEnter}
                        onMouseLeave={handleCatalogLeave}
                    >
                      {/* Ограничитель ширины сайта, который центрует белую плашку по центру экрана */}
                      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 w-full">

                        <div className="bg-white border border-gray-200 shadow-xl rounded-2xl px-6 py-8 w-full">
                          {/* ИСПРАВЛЕНО: Сетке принудительно возвращен дисплей grid для десктопа (lg:grid-cols-4), чтобы элементы встали просторно */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {catalogItems.map((item) => {
                              const Icon = item.icon;
                              const isActive = isActiveCatalogItem(item.href);
                              return (
                                  <Link
                                      key={item.title}
                                      href={item.href}
                                      className={`group flex items-start gap-4 p-4 transition-all duration-200 ease-in-out rounded-lg cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E65F2B] focus-visible:ring-offset-2 ${
                                        isActive 
                                          ? 'bg-[#FFF5F0]' 
                                          : 'hover:bg-[#F8F9FA] focus:bg-[#F8F9FA]'
                                      }`}
                                      onClick={() => setIsCatalogOpen(false)}
                                  >
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                                      isActive 
                                        ? 'bg-[#E65F2B] text-white' 
                                        : 'bg-[#F8F9FA] group-hover:bg-[#E65F2B] group-hover:text-white focus:bg-[#E65F2B] focus:text-white'
                                    }`}>
                                      <Icon className={`w-6 h-6 transition-all duration-200 ${
                                        isActive 
                                          ? 'text-white' 
                                          : 'text-[#2F3E46] group-hover:text-white focus:text-white'
                                      }`} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <h3 className={`text-sm font-semibold leading-normal transition-colors ${
                                        isActive 
                                          ? 'text-[#E65F2B]' 
                                          : 'text-[#2F3E46] hover:text-[#E65F2B] focus:text-[#E65F2B]'
                                      }`}>
                                        {item.title}
                                      </h3>
                                      <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                                    </div>
                                  </Link>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>
                )}
              </div>

              <a href="#services" className="text-[#2F3E46] hover:text-[#E65F2B] transition-colors">
                Услуги
              </a>
              <a href="#portfolio" className="text-[#2F3E46] hover:text-[#E65F2B] transition-colors">
                Портфолио
              </a>
              <a href="#contact" className="text-[#2F3E46] hover:text-[#E65F2B] transition-colors">
                Контакты
              </a>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="tel:+375296237563" className="flex items-center text-[#2F3E46] hover:text-[#E65F2B] transition-colors">
                <Phone className="w-5 h-5 mr-2" />
                <span className="font-medium">+375 (29) 623 75 63</span>
              </a>
              <Button size="sm">Заказать замер</Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-4 rounded-lg hover:bg-[#F8F9FA] transition-colors min-h-[48px] min-w-[48px]"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Открыть меню"
            >
              <Menu className="w-6 h-6 text-[#2F3E46]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeMobileMenu}
        />

      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-lg font-bold text-[#2F3E46]">Меню</span>
            <button
              className="p-4 rounded-lg hover:bg-[#F8F9FA] transition-colors min-h-[48px] min-w-[48px]"
              onClick={closeMobileMenu}
              aria-label="Закрыть меню"
            >
              <X className="w-6 h-6 text-[#2F3E46]" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Catalog Accordion */}
            <div>
              <button
                className="w-full flex items-center justify-between p-4 rounded-lg text-lg font-medium text-[#2F3E46] hover:bg-[#F8F9FA] transition-colors min-h-[56px]"
                onClick={() => setIsCatalogAccordionOpen(!isCatalogAccordionOpen)}
              >
                <span>Каталог ворот и заборов</span>
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${isCatalogAccordionOpen ? 'rotate-90' : ''}`}
                />
              </button>

              {/* Accordion Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isCatalogAccordionOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="space-y-1 pl-4 py-2">
                  {catalogItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveCatalogItem(item.href);
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        className={`group flex items-center p-4 rounded-lg text-base transition-all duration-200 ease-in-out min-h-[56px] cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E65F2B] focus-visible:ring-offset-2 ${
                          isActive 
                            ? 'bg-[#FFF5F0] text-[#E65F2B]' 
                            : 'text-[#2F3E46] hover:bg-[#F8F9FA] focus:bg-[#F8F9FA] hover:text-[#E65F2B] focus:text-[#E65F2B]'
                        }`}
                        onClick={closeMobileMenu}
                      >
                        <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-[#E65F2B]' : 'text-[#E65F2B]'}`} />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Other Links */}
            <Link
              href="#services"
              className="block p-4 rounded-lg text-lg font-medium text-[#2F3E46] hover:bg-[#F8F9FA] transition-colors min-h-[56px]"
              onClick={closeMobileMenu}
            >
              Услуги
            </Link>
            <Link
              href="#portfolio"
              className="block p-4 rounded-lg text-lg font-medium text-[#2F3E46] hover:bg-[#F8F9FA] transition-colors min-h-[56px]"
              onClick={closeMobileMenu}
            >
              Портфолио
            </Link>
            <Link
              href="#contact"
              className="block p-4 rounded-lg text-lg font-medium text-[#2F3E46] hover:bg-[#F8F9FA] transition-colors min-h-[56px]"
              onClick={closeMobileMenu}
            >
              Контакты
            </Link>
          </nav>

          {/* Fixed CTA at Bottom */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <Button className="w-full py-4 text-lg min-h-[56px]" onClick={closeMobileMenu}>
              Заказать замер
            </Button>
            <a
              href="tel:+375296237563"
              className="flex items-center justify-center p-4 mt-2 rounded-lg text-[#2F3E46] hover:bg-[#F8F9FA] transition-colors min-h-[48px]"
              onClick={closeMobileMenu}
            >
              <Phone className="w-5 h-5 mr-2" />
              <span className="font-medium">+375 (29) 623 75 63</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
