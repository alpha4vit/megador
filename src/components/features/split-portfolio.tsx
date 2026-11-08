'use client';

import {useEffect, useRef, useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

export interface Project {
    id: number;
    title: string;
    location: string;
    material: string;
    automation: string;
    installationTime: string;
    priceRange: string;
    description: string;
    image?: string;
}

const defaultProjects: Project[] = [
    {
        id: 1,
        title: 'Откатные ворота',
        location: 'д. Тарасово',
        material: 'Сэндвич-панель ADS 400, оцинкованная шина',
        automation: 'Alutech SG.02.002 до 700кг',
        installationTime: '1 день',
        priceRange: 'от 3500 BYN',
        description: 'Консольные откатные ворота с сэндвич-наполнением. Установлена автоматика Alutech с пультом управления. Каркас из профильной трубы 60x40 мм с порошковой покраской.',
        image: '/main/webp/sliding.webp',
    },
    {
        id: 2,
        title: 'Секционные ворота',
        location: 'г. Минск',
        material: 'Alutech Prestige, толщина 45мм',
        automation: 'С автоматикой Nice',
        installationTime: '1 день',
        priceRange: 'от 1400 BYN',
        description: 'Панорамные секционные ворота серии Prestige. Двойные ролики, уплотнители EPDM. Возможность цифрового принта "под дерево".',
        image: '/main/webp/sectional2.webp',
    },
    {
        id: 3,
        title: 'Забор плетенка',
        location: 'Минский р-н',
        material: 'Дерево (строганая доска технической сушки)',
        automation: 'Без автоматики',
        installationTime: '3-4 дня',
        priceRange: 'от 45 BYN/м.кв',
        description: 'Объемное деревянное ограждение из переплетенных досок. Обеспечивает полную приватность участка, обладает высокой прочностью и оригинальной фактурой.',
        image: '/main/webp/fence.webp',
    },
    {
        id: 4,
        title: 'Распашные ворота',
        location: 'д. Ждановичи',
        material: 'Сэндвич-панель, кованые элементы',
        automation: 'Nice для распашных ворот',
        installationTime: '1 день',
        priceRange: 'от 2500 BYN',
        description: 'Теплые распашные ворота из сэндвич-панелей с декоративными коваными элементами. Встроенная калитка с электрозамком.',
        image: '/main/webp/swing.webp',
    },
];

interface SplitPortfolioProps {
    projects?: Project[];
    background?: 'white' | 'muted' | 'gray';
}

const backgrounds = {
    white: 'bg-white',
    muted: 'bg-[#F8F9FA]',
    gray: 'bg-zinc-50 border-y border-gray-100/50',
};

export const SplitPortfolio = ({projects = defaultProjects, background = 'white'}: SplitPortfolioProps) => {
    const [activeProject, setActiveProject] = useState(0);
    const [activePortfolioSlide, setActivePortfolioSlide] = useState(0);
    const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
    const portfolioCarouselRef = useRef<HTMLDivElement>(null);
    const [maxCardHeight, setMaxCardHeight] = useState<number>(0);

    // Desktop scroll observer
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.getAttribute('data-index') || '0');
                    setActiveProject(index);
                }
            });
        }, observerOptions);

        const currentSections = sectionsRef.current;
        currentSections.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => {
            currentSections.forEach((section) => {
                if (section) observer.unobserve(section);
            });
        };
    }, []);

    // Mobile carousel scroll handler
    const handleCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const cardWidth = container.firstElementChild?.clientWidth || container.clientWidth;
        const gap = 16;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + gap));
        setActivePortfolioSlide(newIndex);
    };

    // Calculate maximum card height for uniform layout
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const updateMaxHeight = () => {
            if (portfolioCarouselRef.current && window.innerWidth < 1024) {
                const cards = portfolioCarouselRef.current.querySelectorAll('[data-card-item]');
                let maxHeight = 0;
                cards.forEach((card) => {
                    const cardEl = card as HTMLElement;
                    cardEl.style.height = 'auto';
                    const height = cardEl.offsetHeight;
                    if (height > maxHeight) {
                        maxHeight = height;
                    }
                });
                setMaxCardHeight(maxHeight);
                cards.forEach((card) => {
                    (card as HTMLElement).style.height = `${maxHeight}px`;
                });
            }
        };

        // Delay calculation to ensure DOM is fully rendered
        const timer = setTimeout(updateMaxHeight, 100);
        window.addEventListener('resize', updateMaxHeight);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateMaxHeight);
        };
    }, [projects]);

    return (
        <section className={`pt-12 lg:pt-16 pb-4 lg:pb-8 ${backgrounds[background]}`}>
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="text-center mb-4 lg:mt-0 lg:mb-6 mx-auto">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4"
                        style={{fontFamily: 'var(--font-montserrat)'}}>
                        Наши работы
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Реализованные проекты по всей Беларуси. Качество, проверенное временем.
                    </p>
                </div>

                {/* Mobile Carousel (< 1024px) */}
                <div className="lg:hidden">
                    <div
                        ref={portfolioCarouselRef}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide"
                        onScroll={handleCarouselScroll}
                        style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
                    >
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                data-card-item
                                className="flex-shrink-0 w-[85vw] snap-center"
                            >
                                <div className="bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col">
                                    {/* Project Image */}
                                    <div
                                        className="rounded-2xl overflow-hidden shadow-sm border border-gray-100/50">
                                        {/* Реальное изображение проекта с адаптивными пропорциями 4:3 */}
                                        <div
                                            className="aspect-[4/3] bg-gradient-to-br from-[#2F3E46] to-[#1a252b] relative overflow-hidden w-full">
                                            {project.image ? (
                                                <img draggable={false}
                                                    src={project.image}
                                                    alt={project.title}
                                                    // object-cover идеально заполняет контейнер 4:3 без растягивания или сжатия фото
                                                    className="w-full h-full object-cover animate-fadeIn"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                // Фаллбэк-заглушка на случай, если в объекте данных imageUrl пустой или отсутствует
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center p-6 text-center">
                                                    <div className="text-center">
                                                        <div
                                                            className="w-16 h-16 mx-auto mb-2 rounded-full bg-[#E65F2B] bg-opacity-20 flex items-center justify-center">
                                                            <span className="text-2xl">🏠</span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-white mb-0.5">{project.title}</h3>
                                                        <p className="text-gray-300 text-xs">{project.location}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Project Info */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-[#2F3E46] mb-1 line-clamp-2">{project.title}</h3>
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-1">{project.location}</p>

                                        {/* Specs Grid */}
                                        <div className="grid grid-cols-2 gap-2 mt-auto">
                                            <div className="bg-white rounded-lg p-3">
                                                <p className="text-xs text-gray-500 mb-1">Материал</p>
                                                <p className="text-sm font-medium text-[#2F3E46] leading-tight line-clamp-2">{project.material}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3">
                                                <p className="text-xs text-gray-500 mb-1">Автоматика</p>
                                                <p className="text-sm font-medium text-[#2F3E46] leading-tight line-clamp-2">{project.automation}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3">
                                                <p className="text-xs text-gray-500 mb-1">Установка</p>
                                                <p className="text-sm font-medium text-[#2F3E46]">{project.installationTime}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3">
                                                <p className="text-xs text-gray-500 mb-1">Стоимость</p>
                                                <p className="text-sm font-bold text-[#E65F2B]">{project.priceRange}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Controls (< 1024px) */}
                    <div className="flex lg:hidden items-center justify-center gap-6 mt-6 mb-4 w-full">
                        <button
                            onClick={() => {
                                if (portfolioCarouselRef.current) {
                                    const container = portfolioCarouselRef.current;
                                    const cardWidth = container.firstElementChild?.clientWidth || container.clientWidth;
                                    const gap = 16;
                                    const nextIndex = Math.max(0, activePortfolioSlide - 1);
                                    setActivePortfolioSlide(nextIndex);
                                    container.scrollTo({left: nextIndex * (cardWidth + gap), behavior: 'smooth'});
                                }
                            }}
                            disabled={activePortfolioSlide === 0}
                            className={`p-2 rounded-full transition-all ${
                                activePortfolioSlide === 0
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-[#E65F2B] hover:bg-orange-50'
                            }`}
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-6 h-6"/>
                        </button>

                        {/* Carousel Dots */}
                        <div className="flex justify-center gap-3">
                            {projects.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all min-w-[12px] min-h-[12px] ${
                                        index === activePortfolioSlide ? 'bg-[#E65F2B] w-8' : 'bg-gray-300'
                                    }`}
                                    onClick={() => {
                                        if (portfolioCarouselRef.current) {
                                            const container = portfolioCarouselRef.current;
                                            const cardWidth = container.firstElementChild?.clientWidth || container.clientWidth;
                                            const gap = 16;
                                            portfolioCarouselRef.current.scrollTo({
                                                left: index * (cardWidth + gap),
                                                behavior: 'smooth',
                                            });
                                        }
                                    }}
                                    aria-label={`Slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                if (portfolioCarouselRef.current) {
                                    const container = portfolioCarouselRef.current;
                                    const cardWidth = container.firstElementChild?.clientWidth || container.clientWidth;
                                    const gap = 16;
                                    const totalCards = projects.length;
                                    const nextIndex = Math.min(totalCards - 1, activePortfolioSlide + 1);
                                    setActivePortfolioSlide(nextIndex);
                                    if (nextIndex === totalCards - 1) {
                                        container.scrollTo({left: container.scrollWidth, behavior: 'smooth'});
                                    } else {
                                        container.scrollTo({left: nextIndex * (cardWidth + gap), behavior: 'smooth'});
                                    }
                                }
                            }}
                            disabled={activePortfolioSlide === projects.length - 1}
                            className={`p-2 rounded-full transition-all ${
                                activePortfolioSlide === projects.length - 1
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-[#E65F2B] hover:bg-orange-50'
                            }`}
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-6 h-6"/>
                        </button>
                    </div>
                </div>

                {/* Desktop Split View (≥ 1024px) */}
                <div className="hidden lg:flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left Side - Sticky Image */}
                    <div className="md:w-1/2 md:sticky md:top-24 md:self-start h-[400px] md:h-[600px] lg:h-[700px]">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#F8F9FA]">
                            {projects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                        index === activeProject ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    {project.image ? (
                                        <img draggable={false}
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover animate-fadeIn"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-full bg-gradient-to-br from-[#2F3E46] to-[#1a252b] flex items-center justify-center">
                                            <div className="text-center p-8">
                                                <div
                                                    className="w-32 h-32 mx-auto mb-4 rounded-full bg-[#E65F2B] bg-opacity-20 flex items-center justify-center">
                                                    <span className="text-4xl">🏠</span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                                                <p className="text-gray-300">{project.location}</p>
                                                <p className="text-sm text-gray-400 mt-4">Изображение проекта</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Scrollable Content */}
                    <div className="md:w-1/2 space-y-16 md:space-y-24">
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                ref={(el) => {
                                    sectionsRef.current[index] = el;
                                }}
                                data-index={index}
                                className="scroll-mt-24"
                            >
                                <div className="pb-8 border-b border-gray-200 last:border-0">
                                    <div className="flex items-center gap-3 mb-4">
                    <span
                        className="w-10 h-10 rounded-full bg-[#E65F2B] text-white flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </span>
                                        <div>
                                            <h3 className="text-2xl font-bold text-[#2F3E46]">{project.title}</h3>
                                            <p className="text-gray-500">{project.location}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-[#F8F9FA] rounded-lg p-4">
                                            <p className="text-sm text-gray-500 mb-1">Материал</p>
                                            <p className="font-medium text-[#2F3E46]">{project.material}</p>
                                        </div>
                                        <div className="bg-[#F8F9FA] rounded-lg p-4">
                                            <p className="text-sm text-gray-500 mb-1">Автоматика</p>
                                            <p className="font-medium text-[#2F3E46]">{project.automation}</p>
                                        </div>
                                        <div className="bg-[#F8F9FA] rounded-lg p-4">
                                            <p className="text-sm text-gray-500 mb-1">Установка</p>
                                            <p className="font-medium text-[#2F3E46]">{project.installationTime}</p>
                                        </div>
                                        <div className="bg-[#F8F9FA] rounded-lg p-4">
                                            <p className="text-sm text-gray-500 mb-1">Стоимость</p>
                                            <p className="font-bold text-[#E65F2B]">{project.priceRange}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
