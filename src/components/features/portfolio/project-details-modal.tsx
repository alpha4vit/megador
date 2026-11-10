'use client';

import {useCallback, useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ArrowRight, Check, ChevronLeft, ChevronRight, MapPin, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {PortfolioImageFallback} from './portfolio-image';
import type {PortfolioProject} from './portfolio-data';

interface ProjectDetailsModalProps {
    project: PortfolioProject | null;
    onClose: () => void;
    onCta: (project: PortfolioProject) => void;
}

const EXIT_TRANSITION = {duration: 0.28, ease: [0.32, 0.72, 0, 1] as const};

export function ProjectDetailsModal({project, onClose, onCta}: ProjectDetailsModalProps) {
    const [activeImage, setActiveImage] = useState(0);
    const [failedImageIdx, setFailedImageIdx] = useState(-1);
    // Keep the last non-null project so AnimatePresence can play the exit
    // animation with real content after `project` flips to null.
    const [displayed, setDisplayed] = useState<PortfolioProject | null>(project);
    const [prevProject, setPrevProject] = useState(project);

    if (project !== prevProject) {
        setPrevProject(project);
        if (project !== null) {
            setDisplayed(project);
            setActiveImage(0);
            setFailedImageIdx(-1);
        }
    }

    const shown = project ?? displayed;

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    // Escape key + scroll lock
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && project) handleClose();
        };
        if (project) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [project, handleClose]);

    if (shown === null) return null;

    const galleryImages = shown.images.filter(Boolean);
    const hasImages = galleryImages.length > 0;
    const goPrev = () => setActiveImage((i) => (i - 1 + galleryImages.length) % galleryImages.length);
    const goNext = () => setActiveImage((i) => (i + 1) % galleryImages.length);
    const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
        if (galleryImages.length <= 1) return;
        if (info.offset.x < -40 || info.velocity.x < -300) goNext();
        else if (info.offset.x > 40 || info.velocity.x > 300) goPrev();
    };

    const gallery = hasImages && (
        <div className="flex items-center justify-center bg-[#F8F9FA] p-4 sm:p-6 lg:p-8 lg:flex-1 lg:min-h-0">
            <div className="relative w-full max-w-[560px]">
                <motion.div
                    drag={galleryImages.length > 1 ? 'x' : false}
                    dragConstraints={{left: 0, right: 0}}
                    dragElastic={0.15}
                    onDragEnd={handleDragEnd}
                    className="relative w-full aspect-[4/3] lg:max-h-[65vh] rounded-2xl overflow-hidden bg-zinc-100 shadow-sm cursor-grab active:cursor-grabbing touch-pan-y"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {failedImageIdx === activeImage ? (
                            <PortfolioImageFallback
                                key={`fallback-${activeImage}`}
                                type={shown.type}
                                className="absolute inset-0"
                            />
                        ) : (
                            <motion.img
                                key={activeImage}
                                draggable={false}
                                src={galleryImages[activeImage]}
                                alt={shown.title}
                                onError={() => setFailedImageIdx(activeImage)}
                                initial={{opacity: 0, scale: 1.04}}
                                animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.35, ease: 'easeOut'}}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                {galleryImages.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Предыдущее фото"
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white active:bg-gray-200 active:scale-90 shadow-md flex items-center justify-center text-[#2F3E46] transition-all duration-100"
                        >
                            <ChevronLeft className="w-5 h-5"/>
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            aria-label="Следующее фото"
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white active:bg-gray-200 active:scale-90 shadow-md flex items-center justify-center text-[#2F3E46] transition-all duration-100"
                        >
                            <ChevronRight className="w-5 h-5"/>
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 max-w-[75%] overflow-hidden">
                            {galleryImages.map((_, i) => {
                                const distance = Math.abs(i - activeImage);
                                const dotClass =
                                    distance === 0
                                        ? 'w-6 bg-[#E65F2B]'
                                        : distance === 1
                                            ? 'w-2 bg-white/90'
                                            : 'w-1.5 bg-white/50 scale-75';
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setActiveImage(i)}
                                        aria-label={`Фото ${i + 1}`}
                                        className={`h-1.5 rounded-full transition-all duration-300 ease-out ${dotClass}`}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    const sidebar = (
        <div className={`flex flex-col p-6 lg:p-8 lg:min-h-0 lg:overflow-y-auto ${hasImages ? 'lg:w-[420px] lg:flex-shrink-0' : 'lg:w-full'}`}>
            <div className="mb-5">
                <span className="inline-block text-xs font-semibold uppercase tracking-wide text-[#E65F2B] bg-orange-50 border border-orange-100 rounded-full px-3 py-1 mb-3">
                    {shown.typeLabel}
                </span>
                <h2 className="text-2xl font-bold text-[#2F3E46] leading-snug mb-2">{shown.title}</h2>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-[#E65F2B]"/>
                    <span>{shown.location}</span>
                </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-6">{shown.description}</p>

            <div className="mb-6">
                <h3 className="text-sm font-bold text-[#2F3E46] mb-3">Характеристики</h3>
                <dl className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                    {shown.specs.map((spec) => (
                        <div key={spec.label} className="flex justify-between gap-4 px-4 py-2.5 bg-white">
                            <dt className="text-xs text-gray-500">{spec.label}</dt>
                            <dd className="text-xs font-medium text-[#2F3E46] text-right">{spec.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            {shown.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {shown.badges.map((badge) => (
                        <span key={badge} className="inline-flex items-center gap-1 text-xs text-gray-600 bg-[#F8F9FA] border border-gray-200 rounded-full px-3 py-1">
                            <Check className="w-3 h-3 text-[#E65F2B]"/>
                            {badge}
                        </span>
                    ))}
                </div>
            )}

            <div className="mt-auto pb-8">
                <div className="flex items-baseline justify-between mb-4">
                    <span className="text-sm text-gray-500">Ориентировочная стоимость</span>
                    <span className="text-2xl font-bold text-[#E65F2B]">{shown.cost}</span>
                </div>
                <Button
                    size="lg"
                    className="w-full cta-button-primary"
                    onClick={() => shown && onCta(shown)}
                >
                    Хочу такие же ворота
                    <ArrowRight className="ml-2 w-5 h-5"/>
                </Button>
                <p className="text-xs text-gray-400 text-center mt-3">
                    Финальная цена зависит от размеров и опций — рассчитаем точно
                </p>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            {project !== null && shown !== null && (
                <motion.div
                    key="portfolio-details-backdrop"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={EXIT_TRANSITION}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end lg:items-center justify-center lg:p-6"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{opacity: 0, y: 40, scale: 0.98}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: 24, scale: 0.95}}
                        transition={EXIT_TRANSITION}
                        className={`w-full max-h-[92vh] overflow-y-auto lg:overflow-visible ${hasImages ? 'lg:max-w-5xl' : 'lg:max-w-2xl'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full flex flex-col lg:flex-row lg:max-h-[85vh]">
                            <motion.button
                                type="button"
                                onClick={handleClose}
                                aria-label="Закрыть"
                                whileTap={{scale: 0.9}}
                                className="absolute top-3 right-3 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-[#2F3E46] transition-colors"
                            >
                                <X className="w-5 h-5"/>
                            </motion.button>
                            {gallery}
                            {sidebar}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
