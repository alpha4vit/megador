'use client';

import {useState} from 'react';
import Link from 'next/link';
import {ArrowRight, Check, FileCheck, Wrench} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Section} from '@/components/ui/section';
import {Container} from '@/components/ui/container';
import {Project, SplitPortfolio} from '@/components/features/split-portfolio';
import ProductPricingGrid, {PricingTier} from '@/components/features/product-pricing-grid';
import ProductFeaturesSection from '@/components/features/product-features-section';

export default function BarriersPage() {
    const [activeBrand, setActiveBrand] = useState('alutech');

    const parseSpecsToFeatures = (specs: string[]) => {
        return specs.map((spec) => {
            const parts = spec.split(':');
            if (parts.length === 2) {
                return { label: parts[0].trim(), value: parts[1].trim() };
            }
            return { label: '', value: spec };
        });
    };

    const alutechBarrierTiers: PricingTier[] = [
        {
            id: 'asb-6r-l',
            title: 'Алютех ASB-6R/L',
            subtitle: 'Базовая модель для жилых зон',
            badgeText: 'Народный выбор',
            badgeStyle: 'bg-slate-900',
            features: parseSpecsToFeatures([
                'Назначение: Жилые дворы, ТСЖ, парковки',
                'Длина стрелы: До 6 метров',
                'Корпус: Прочный стальной',
                'Подсветка: Встроенная светодиодная',
                'Пуск/остановка: Плавное замедление хода',
                'СКУД: Поддержка базовых радиокоманд',
            ]),
            price: 'от 2250 BYN',
            productActionKey: 'asb-6r-l',
        },
        {
            id: 'bravo-bv-5',
            title: 'Алютех BRAVO BV-5',
            subtitle: 'Стильное решение для частных выездов',
            badgeText: 'Оптимальный баланс',
            badgeStyle: 'bg-zinc-700',
            features: parseSpecsToFeatures([
                'Назначение: Небольшие частные и коммерческие выезды',
                'Длина стрелы: До 4.3 метров',
                'Корпус: Стильный алюминиевый корпус со светодиодным кольцом',
                'Подсветка: Интегрированная светодиодная индикация',
                'Пуск/остановка: Электронное регулирование скорости',
                'СКУД: Быстрое подключение фотоэлементов и считывателей',
            ]),
            price: 'от 2350 BYN',
            productActionKey: 'bravo-bv-5',
        },
    ];

    const niceBarrierTiers: PricingTier[] = [
        {
            id: 'nice-sbar',
            title: 'NICE SBAR',
            subtitle: 'Быстрое решение для малых проездов',
            badgeText: 'Быстрый старт',
            badgeStyle: 'bg-zinc-700',
            features: parseSpecsToFeatures([
                'Назначение: Малые и средние проезды, частные сектора',
                'Длина стрелы: До 4 метров',
                'Корпус: Оцинкованная сталь с полимерным покрытием',
                'Подсветка: Возможность установки сигнальной лампы',
                'Пуск/остановка: Автоматическое определение препятствий',
                'СКУД: Встроенный разъем для систем контроля доступа (СКУД)',
            ]),
            price: 'от 3690 BYN',
            productActionKey: 'nice-sbar',
        },
        {
            id: 'nice-widem',
            title: 'NICE WIDEM',
            subtitle: 'Популярная модель для бизнеса',
            badgeText: 'Хит продаж',
            badgeStyle: 'bg-[#E65F2B]',
            features: parseSpecsToFeatures([
                'Назначение: Бизнес-центры, промышленные объекты',
                'Длина стрелы: До 5 метров',
                'Корпус: Усиленный стальной',
                'Подсветка: Интегрированная светодиодная лента на стрелу',
                'Пуск/остановка: Легкое программирование функций и пауз',
                'СКУД: Полная совместимость со шлагбаумами серии Wide',
            ]),
            price: 'от 3950 BYN',
            productActionKey: 'nice-widem',
        },
        {
            id: 'nice-l-bar',
            title: 'NICE L-BAR',
            subtitle: 'Премиальное решение для промышленности',
            badgeText: 'Премиальный сегмент',
            badgeStyle: 'bg-zinc-800',
            features: parseSpecsToFeatures([
                'Назначение: Промышленные зоны со сверхшироким проездом',
                'Длина стрелы: От 7 до 9 метров',
                'Корпус: Прочная оцинкованная сталь (доступна версия INOX)',
                'Подсветка: Полноразмерный светодиодный светофор',
                'Пуск/остановка: Раздельное высокоточное управление скоростью',
                'СКУД: Поддержка синхронной работы двух встречных шлагбаумов (Master/Slave)',
            ]),
            price: 'от 4250 BYN',
            productActionKey: 'nice-l-bar',
        },
        {
            id: 'nice-m-bar',
            title: 'NICE M-BAR',
            subtitle: 'Максимальная надежность для интенсивного трафика',
            badgeText: 'Максимальная нагрузка',
            badgeStyle: 'bg-black',
            features: parseSpecsToFeatures([
                'Назначение: Интенсивный непрерывный поток транспорта',
                'Длина стрелы: До 5-7 метров',
                'Корпус: Высокопрочный стальной оцинкованный корпус',
                'Подсветка: Встроенная мигающая светодиодная подсветка',
                'Пуск/остановка: Мощный мотор 24В с плавным контролем ускорения',
                'СКУД: Интеллектуальный блок управления с поддержкой любых СКУД контроллеров',
            ]),
            price: 'от 7000 BYN',
            productActionKey: 'nice-m-bar',
        },
    ];

    const barrierServicesCards = [
        {
            id: 'design-approval',
            title: 'Проектирование и Согласование',
            description: 'Сотрудничаем с ведущими проектными бюро Минска. Берем на себя полную подготовку проектной документации и дальнейшие согласования в госорганах для получения официального разрешения на установку шлагбаума.',
            icon: FileCheck,
            bullets: [
                { text: 'Подготовка проектной документации' },
                { text: 'Согласование в госорганах' },
                { text: 'Получение официального разрешения' },
            ],
        },
        {
            id: 'repair-modernization',
            title: 'Ремонт и Модернизация',
            description: 'Оперативно устраняем неисправности любой сложности. Оказываем регулярные услуги технического обслуживания шлагбаумов и настройки автоматики — в том числе для оборудования, купленного у сторонних поставщиков.',
            icon: Wrench,
            bullets: [
                { text: 'Оперативное устранение неисправностей' },
                { text: 'Техническое обслуживание' },
                { text: 'Настройка автоматики любого производителя' },
            ],
        },
    ];

    const portfolioItems = [
        {
            location: 'Минск, Парковка ТЦ',
            series: 'NICE S-Bar',
            color: 'Стальной',
            automation: 'NICE',
            dimensions: '6000 мм',
            timeline: '1 день'
        },
        {
            location: 'Минский р-н, Складской комплекс',
            series: 'NICE M-Bar',
            color: 'INOX',
            automation: 'NICE',
            dimensions: '9000 мм',
            timeline: '2 дня'
        },
        {
            location: 'Минск, Жилой комплекс',
            series: 'Алютех AN-Motors',
            color: 'Стальной',
            automation: 'AN-Motors',
            dimensions: '5000 мм',
            timeline: '1 день'
        },
    ];

    const barrierProjects: Project[] = portfolioItems.map((item, index) => ({
        id: index + 1,
        title: `Шлагбаум ${item.series}`,
        location: item.location,
        material: `Серия ${item.series}, корпус ${item.color}`,
        automation: item.automation,
        installationTime: item.timeline,
        priceRange: 'от 2250 BYN',
        description: `Автоматический шлагбаум серии ${item.series} с корпусом ${item.color}. Длина стрелы: ${item.dimensions}. Профессиональная установка с гарантией.`,
        image: '/images/portfolio/barriers-placeholder.jpg',
    }));

    return (
        <>
            {/* Hero & Product Description Section */}
            <Section className="bg-zinc-950 lg:bg-transparent !pt-0 lg:!pt-12 pb-12 sm:pb-16 p-0 lg:p-default relative">
                <Container size="xl"
                           className="bg-zinc-950 lg:bg-transparent !pt-0 lg:!pt-0 px-0 lg:px-default relative w-full max-w-full">
                    <div className="w-full max-w-[1200px] mx-auto relative lg:px-6">
                        <div
                            className="relative -mx-4 px-6 py-8 sm:-mx-6 sm:p-8 lg:mx-0 lg:p-0 rounded-none sm:rounded-2xl lg:bg-transparent grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch text-white lg:text-gray-900">

                            {/* LAYER 1: Mobile backdrop image */}
                            <img
                                src="/barriers/barriers-preview.jpeg"
                                className="absolute inset-0 object-cover opacity-60 max-lg:block hidden z-0 pointer-events-none sm:rounded-2xl"
                                style={{width: '100%', height: '100%'}}
                                alt="Automatic Barriers Mobile Backdrop"
                            />

                            {/* LAYER 2: Gradient overlay */}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 max-lg:block hidden z-10 pointer-events-none sm:rounded-2xl"/>

                            {/* Left Column */}
                            <div className="flex flex-col justify-center py-4 lg:py-0 relative z-20">
                                {/* Breadcrumbs */}
                                <nav
                                    className="flex flex-wrap items-center gap-1 text-xs sm:text-sm whitespace-nowrap overflow-x-auto scrollbar-none max-w-full text-gray-300 lg:text-gray-500 mb-6">
                                    <Link href="/" className="hover:text-[#E65F2B] transition-colors">
                                        Главная
                                    </Link>
                                    <span>/</span>
                                    <Link href="/catalog" className="hover:text-[#E65F2B] transition-colors">
                                        Каталог
                                    </Link>
                                    <span>/</span>
                                    <span className="text-white lg:text-slate-900">Автоматические шлагбаумы</span>
                                </nav>

                                {/* Title */}
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white lg:text-slate-900 mb-6 leading-tight">
                                    Автоматические шлагбаумы с установкой и настройкой под ключ в Минске
                                </h1>

                                {/* Subtitle */}
                                <p className="text-lg text-gray-200 lg:text-gray-600 mb-8 leading-relaxed">
                                    Надежный контроль доступа и оперативное управление въездом/выездом автотранспорта на охраняемую территорию. Интеллектуальные системы управления, устойчивые к сложным климатическим условиям Беларуси.
                                </p>

                                {/* CTA Button */}
                                <Button size="lg" className="w-fit cta-button-primary" data-action="calculate-cost">
                                    Рассчитать стоимость по моим размерам
                                    <ArrowRight className="ml-2 w-5 h-5"/>
                                </Button>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap gap-6 mt-8">
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Полный цикл: от проектирования и согласования до монтажа</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Официальный дилер Алютех и NICE — прямые поставки без наценок</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Собственная служба сервиса, постгарантийного обслуживания и ремонта</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Product Image */}
                            <div className="hidden lg:block w-full h-full relative z-20">
                                <img
                                    src="/barriers/barriers-preview.jpeg"
                                    alt="Автоматические шлагбаумы"
                                    className="w-full h-full object-cover rounded-2xl shadow-xl"
                                />
                            </div>

                        </div>
                    </div>
                </Container>
            </Section>

            <Section background="muted" className="py-8 lg:py-16">
                <Container background="muted">
                    <div className="text-center max-w-3xl mx-auto px-4 mt-6 mb-4 lg:mt-16 lg:mb-8">
                        <h2
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4"
                            style={{ fontFamily: 'var(--font-montserrat)' }}
                        >
                            Стоимость и комплектации шлагбаумов
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Выберите подходящий бренд техники и конфигурацию под интенсивность движения и ширину проезда вашего объекта.
                        </p>
                    </div>
                    <div className="w-full max-w-[500px] mx-auto bg-zinc-100/80 p-1.5 rounded-2xl flex items-center justify-between relative select-none border border-zinc-200/30 mt-2 mb-4 lg:mt-6 lg:mb-8">
                        <button
                            onClick={() => setActiveBrand('alutech')}
                            className={`flex-1 text-center py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 relative z-10 whitespace-normal leading-tight ${
                                activeBrand === 'alutech' ? 'bg-white text-[#E65F2B] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            ALUTECH / AN-Motors
                        </button>
                        <button
                            onClick={() => setActiveBrand('nice')}
                            className={`flex-1 text-center py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 relative z-10 whitespace-normal leading-tight ${
                                activeBrand === 'nice' ? 'bg-white text-[#E65F2B] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            NICE Италия
                        </button>
                    </div>
                    {activeBrand === 'alutech' ? (
                        <ProductPricingGrid
                            tiers={alutechBarrierTiers}
                            desktopGridCols={2}
                        />
                    ) : (
                        <ProductPricingGrid
                            tiers={niceBarrierTiers}
                            desktopGridCols={2}
                        />
                    )}

                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-2 text-lg text-[#2F3E46]">
                            <Check className="w-6 h-6 text-[#E65F2B]"/>
                            <span className="font-semibold">Замер бесплатно</span>
                        </div>
                        <p className="text-gray-600 mt-2">
                            Выезд специалиста для точного расчета стоимости в удобное для вас время
                        </p>
                    </div>
                </Container>
            </Section>


            {/* Models Display */}

            <ProductFeaturesSection
                backgroundColor="white"
                sectionTitle="Наши услуги"
                description="Полный спектр услуг по проектированию, установке и обслуживанию автоматических шлагбаумов"
                cards={barrierServicesCards}
            />

            {/* Portfolio Showcase */}
            <Section background='muted' className="py-8 lg:py-20">
                    <SplitPortfolio background='muted' projects={barrierProjects} />
            </Section>

            {/* CTA Section */}
            <Section background="white" className="py-8 lg:py-20">
                <Container background="white">
                    <div className="max-w-3xl mx-auto text-center mt-6 mb-4 lg:mt-16 lg:mb-8">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-6">
                            Готовы заказать автоматический шлагбаум?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Оставьте заявку на бесплатный замер и получите точный расчет стоимости в течение 24 часов
                        </p>
                        <Button size="lg" className="cta-button-primary" data-action="measurement-request">
                            Заказать бесплатный замер
                            <ArrowRight className="ml-2 w-5 h-5"/>
                        </Button>
                    </div>
                </Container>
            </Section>
        </>
    );
}
