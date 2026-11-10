'use client';

import {useMemo, useState} from 'react';
import Link from 'next/link';
import {AnimatePresence, motion} from 'framer-motion';
import {ArrowRight, LayoutGrid, Map as MapIcon, MapPin} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Section} from '@/components/ui/section';
import {Container} from '@/components/ui/container';
import {useFeedbackModal} from '@/contexts/FeedbackModalContext';
import {PORTFOLIO_FILTERS, PORTFOLIO_PROJECTS, PortfolioGateType, PortfolioProject} from '@/components/features/portfolio/portfolio-data';
import {PortfolioMap} from '@/components/features/portfolio/portfolio-map';
import {ProjectDetailsModal} from '@/components/features/portfolio/project-details-modal';
import {PortfolioImage} from '@/components/features/portfolio/portfolio-image';

type ViewMode = 'grid' | 'map';

export default function PortfolioPage() {
    const {openModal} = useFeedbackModal();

    const [activeFilter, setActiveFilter] = useState<PortfolioGateType | 'ALL'>('ALL');
    const [view, setView] = useState<ViewMode>('grid');
    const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

    const filteredProjects = useMemo(
        () => activeFilter === 'ALL' ? PORTFOLIO_PROJECTS : PORTFOLIO_PROJECTS.filter((p) => p.type === activeFilter),
        [activeFilter],
    );

    const openCaseForm = (project: PortfolioProject) => {
        setSelectedProject(null);
        setTimeout(() => {
            openModal({
                scope: 'gate',
                gateInfo: {
                    gateType: project.typeLabel,
                },
                portfolioProject: {
                    id: project.id,
                    title: project.title,
                },
                title: `Хочу такие же ворота — ${project.title}`,
                subtitle: 'Оставьте контакты, и мы подготовим расчёт по аналогичному проекту',
            });
        }, 300);
    };

    return (
        <>
            {/* Hero */}
            <Section className="!pt-8 lg:!pt-14 pb-10">
                <Container>
                    <div className="max-w-3xl">
                        <nav className="flex flex-wrap items-center gap-1 text-xs sm:text-sm whitespace-nowrap overflow-x-auto scrollbar-none text-gray-500 mb-4">
                            <Link href="/" className="hover:text-[#E65F2B] transition-colors">Главная</Link>
                            <span>/</span>
                            <span className="text-[#2F3E46]">Наши работы</span>
                        </nav>
                        <h1
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2F3E46] mb-4 leading-tight"
                            style={{fontFamily: 'var(--font-montserrat)'}}
                        >
                            Наши работы
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Более 20 лет мы проектируем, производим и монтируем ворота, шлагбаумы и калитки
                            по всей Беларуси. Каждый проект ниже — реальная установка с адресом, характеристиками
                            и стоимостью. Изучайте кейсы в сетке или на карте и закажите такие же ворота под ключ.
                        </p>
                        <div className="flex flex-wrap gap-6 mt-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-5 h-5 text-[#E65F2B]"/>
                                <span>Минск и вся Беларусь</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="w-5 h-5 rounded-full bg-[#E65F2B] text-white text-xs flex items-center justify-center font-bold">+</span>
                                <span>{PORTFOLIO_PROJECTS.length} реализованных проектов</span>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Sticky filter bar + view switcher */}
            <div className="sticky top-16 sm:top-20 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
                <Container>
                    <div className="flex flex-col gap-2.5 py-3 sm:flex-row sm:items-center sm:gap-3">
                        {/* Row 1: category filters — horizontal swipe on mobile */}
                        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 sm:flex-1">
                            {PORTFOLIO_FILTERS.map((filter) => {
                                const isActive = activeFilter === filter.id;
                                return (
                                    <button
                                        key={filter.id}
                                        type="button"
                                        onClick={() => setActiveFilter(filter.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                                            isActive
                                                ? 'bg-[#2F3E46] text-white shadow-sm'
                                                : 'bg-[#F8F9FA] text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Row 2 (mobile) / inline (desktop): view switcher */}
                        <div className="sm:ml-auto sm:flex-shrink-0">
                            <div className="grid grid-cols-2 sm:flex items-center bg-[#F8F9FA] border border-gray-200 rounded-full p-1 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={() => setView('grid')}
                                    className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-1.5 rounded-full text-sm font-medium transition-all ${
                                        view === 'grid' ? 'bg-white text-[#2F3E46] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <LayoutGrid className="w-4 h-4"/>
                                    Сетка
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView('map')}
                                    className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-1.5 rounded-full text-sm font-medium transition-all ${
                                        view === 'map' ? 'bg-white text-[#2F3E46] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <MapIcon className="w-4 h-4"/>
                                    Карта
                                </button>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Views */}
            <Section background="muted" className="!pt-8">
                <Container background="muted">
                    <AnimatePresence mode="wait">
                        {view === 'grid' ? (
                            <motion.div
                                key="grid"
                                initial={{opacity: 0, y: 16}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -12}}
                                transition={{duration: 0.25, ease: 'easeOut'}}
                            >
                                {filteredProjects.length === 0 ? (
                                    <div className="text-center py-16 text-gray-500">
                                        <p className="text-lg font-medium mb-2">В этой категории пока нет проектов</p>
                                        <p className="text-sm">Попробуйте выбрать другой фильтр или оставьте заявку — сделаем ворота под ваши размеры.</p>
                                        <Button
                                            size="lg"
                                            className="mt-6 cta-button-primary"
                                            onClick={() => openModal({scope: 'gate'})}
                                        >
                                            Рассчитать стоимость
                                            <ArrowRight className="ml-2 w-5 h-5"/>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredProjects.map((project, index) => (
                                            <motion.article
                                                key={project.id}
                                                initial={{opacity: 0, y: 20}}
                                                animate={{opacity: 1, y: 0}}
                                                transition={{duration: 0.3, delay: index * 0.05, ease: 'easeOut'}}
                                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-shadow cursor-pointer flex flex-col"
                                                onClick={() => setSelectedProject(project)}
                                            >
                                                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                                                    <PortfolioImage
                                                        type={project.type}
                                                        src={project.images[0] ?? ''}
                                                        alt={project.title}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        fallbackClassName="transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wide text-white bg-[#2F3E46]/80 backdrop-blur-sm rounded-full px-3 py-1">
                                                        {project.typeLabel}
                                                    </span>
                                                    <span className="absolute bottom-3 right-3 text-sm font-bold text-white bg-[#E65F2B] rounded-lg px-2.5 py-1 shadow">
                                                        {project.cost}
                                                    </span>
                                                </div>
                                                <div className="p-5 flex flex-col flex-1">
                                                    <h3 className="text-base font-bold text-[#2F3E46] leading-snug mb-2 line-clamp-2 group-hover:text-[#E65F2B] transition-colors">
                                                        {project.title}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                                                        <MapPin className="w-3.5 h-3.5 text-[#E65F2B] flex-shrink-0"/>
                                                        <span className="truncate">{project.location}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                                        {project.badges.slice(0, 2).map((badge) => (
                                                            <span key={badge} className="text-[11px] text-gray-600 bg-[#F8F9FA] border border-gray-200 rounded-full px-2.5 py-0.5">
                                                                {badge}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.article>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="map"
                                initial={{opacity: 0, y: 16}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -12}}
                                transition={{duration: 0.25, ease: 'easeOut'}}
                                className="h-[70vh] min-h-[480px]"
                            >
                                <PortfolioMap projects={filteredProjects} onSelectProject={setSelectedProject}/>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Container>
            </Section>

            <ProjectDetailsModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
                onCta={openCaseForm}
            />
        </>
    );
}
