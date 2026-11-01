'use client';

import {Button} from '../ui/button';

export const Hero = () => {
    const scrollToQuiz = () => {
        const quizSection = document.getElementById('quiz-section');
        if (quizSection) {
            quizSection.scrollIntoView({behavior: 'smooth'});
        }
    };

    const imagePath = "/main-preview.jpeg";

    return (
        <section className="w-full pt-4 lg:pt-8 pb-12">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-6 relative">
                {/* ИСПРАВЛЕНО: Убран класс bg-zinc-900 с десктопного уровня */}
                <div
                    className="relative -mx-4 px-6 py-8 sm:-mx-6 sm:p-8 lg:mx-0 lg:p-0 rounded-none sm:rounded-2xl lg:bg-transparent grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch text-white lg:text-gray-900">

                    {/* ИСПРАВЛЕНО: Базовый черный фон для мобилки вынесен в отдельный изолированный слой на уровень -z-30 */}
                    <div className="absolute inset-0 bg-zinc-950 -z-30 block lg:hidden"/>

                    {/* LAYER A: Mobile Background Controls (Visible ONLY below 1024px) */}
                    {/* ИСПРАВЛЕНО: Индекс поднят на -z-20. Теперь картинка гарантированно лежит ПОВЕРХ черного фона */}
                    <img
                        src={imagePath}
                        className="absolute inset-0 w-full h-full object-cover opacity-65 -z-20 block lg:hidden sm:rounded-2xl"
                        alt="Background Backdrop"
                    />

                    {/* ИСПРАВЛЕНО: Градиент стал более прозрачным вверху (from-black/90 остался только снизу у кнопок, а сверху ушел в /10) */}
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 -z-10 block lg:hidden sm:rounded-2xl"/>
                    {/* LAYER B: Left Content Column (Typography, Bullets, Buttons) */}
                    <div className="flex flex-col justify-center py-4 lg:py-0 relative z-10">
                        <div className="space-y-6 sm:space-y-8">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white lg:text-slate-900 leading-tight"
                                style={{fontFamily: 'var(--font-montserrat)'}}>
                                Архитектура безопасности.
                                <br/>
                                <span className="text-[#E65F2B]">Ворота и заборы под ключ</span>
                                <br/>
                                в Минске
                            </h1>

                            <div className="space-y-4">
                                <p className="text-lg sm:text-xl text-gray-200 lg:text-gray-600 leading-relaxed max-w-xl">
                                    Официальный партнер Alutech. Производство и установка с гарантией качества более 20
                                    лет.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-300 lg:text-gray-500">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span>Сертифицированное производство</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-300 lg:text-gray-500">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span>Бесплатный замер в Минске</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-300 lg:text-gray-500">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span>Гарантия на все работы</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button size="lg" onClick={scrollToQuiz} className="text-base sm:text-lg px-8 py-4">
                                    Рассчитать стоимость
                                </Button>
                                <Button size="lg" variant="outline"
                                        className="text-base sm:text-lg px-8 py-4 border-white text-white lg:border-gray-300 lg:text-gray-700">
                                    Смотреть портфолио
                                </Button>
                            </div>

                        </div>
                    </div>

                    {/* LAYER C: Right Content Column (Desktop Image - Visible ONLY at 1024px+) */}
                    <div className="hidden lg:block w-full h-full">
                        <img
                            src={imagePath}
                            className="w-full h-full max-h-[calc(100%)] object-cover rounded-2xl shadow-xl"
                            alt="Megador Presentation"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};
