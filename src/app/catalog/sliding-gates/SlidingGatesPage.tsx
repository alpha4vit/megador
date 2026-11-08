'use client';

import Link from 'next/link';
import {ArrowRight, Check, Layers, ShieldAlert} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Section} from '@/components/ui/section';
import {Container} from '@/components/ui/container';
import {SplitPortfolio, Project} from '@/components/features/split-portfolio';
import ProductPricingGrid from '@/components/features/product-pricing-grid';
import ProductFeaturesSection from '@/components/features/product-features-section';
import { useFeedbackModal } from '@/contexts/FeedbackModalContext';

export default function SlidingGatesPage() {
    const { openModal } = useFeedbackModal();

    const pricingTiers = [
        {
            id: 'budget',
            title: 'Каркас под зашитие',
            subtitle: 'Бюджетный сегмент',
            badgeText: 'Выгодный старт',
            badgeStyle: 'bg-slate-900',
            features: [
                {label: 'Конструкция', value: 'Рама из профильной трубы 60x40 мм'},
                {label: 'Назначение', value: 'Под заполнение любым вашим материалом'},
                {label: 'Комплектация', value: 'Консоль 6м с несущими роликами'},
                {label: 'Покрытие', value: 'Антикоррозийная покраска каркаса'},
            ],
            price: 'от 1000 BYN',
            productActionKey: 'budget',
        },
        {
            id: 'optimal',
            title: 'Откатные ворота с автоматикой',
            subtitle: 'Оптимальный выбор',
            badgeText: 'Хит продаж',
            badgeStyle: 'bg-[#E65F2B]',
            features: [
                {label: 'Конструкция', value: 'Прочный стальной каркас проема до 4000x2000 мм'},
                {label: 'Автоматика', value: 'Электропривод с пультами управления'},
                {label: 'Комплектация', value: 'Консольный комплект, зубчатая рейка'},
                {label: 'Монтаж', value: 'Установка автоматики под ключ'},
            ],
            price: 'от 2000 BYN',
            productActionKey: 'optimal',
        },
        {
            id: 'premium',
            title: 'Алюминиевые откатные ворота',
            subtitle: 'Премиум сегмент',
            badgeText: 'Надежность и стиль',
            badgeStyle: 'bg-zinc-700',
            features: [
                {label: 'Конструкция', value: 'Сдвижные ворота из алюминиевого профиля'},
                {label: 'Преимущества', value: 'Отсутствие видимых элементов крепежа'},
                {label: 'Защита', value: 'Защита от коррозии'},
                {label: 'Комплектация', value: 'Комплект для створки на базе шины Алютех'},
            ],
            price: 'от 2500 BYN',
            productActionKey: 'premium',
        },
        {
            id: 'elite',
            title: 'Сендвич-панель Alutech ADS 400',
            subtitle: 'Элитный сегмент',
            badgeText: 'Максимальное качество',
            badgeStyle: 'bg-black',
            features: [
                {label: 'Конструкция', value: 'Полотно из сэндвич-панелей 45 мм'},
                {label: 'Заполнение', value: 'Внутреннее или накладное'},
                {label: 'Дизайн', value: 'Возможность установки калитки'},
                {label: 'Цвет', value: 'Подбор цвета под фасад здания'},
            ],
            price: 'от 3500 BYN',
            productActionKey: 'elite',
        },
    ];

    const comparisonMatrix = {
        type: 'table' as const,
        tableHeaders: ['Каркас', 'С автоматикой', 'Алюминий', 'Сэндвич'],
        tableRows: [
            {characteristic: 'Материал каркаса', values: ['Профильная труба 60x40 мм', 'Стальной каркас', 'Алюминиевый профиль', 'Сэндвич-панель 45 мм']},
            {characteristic: 'Максимальный проем', values: ['4000x2000 мм', '4000x2000 мм', '5000x2500 мм', '6000x2500 мм']},
            {characteristic: 'Вес полотна', values: ['До 300 кг', 'До 450 кг', 'До 700 кг', 'До 700 кг']},
            {characteristic: 'Автоматика', values: ['Опционально', 'В комплекте', 'Опционально', 'Опционально']},
            {characteristic: 'Тип шины', values: ['SG.01.002', 'SG.01.002', 'SG.02.002', 'SG.02.002']},
            {characteristic: 'Защита от коррозии', values: ['Покраска', 'Покраска', 'Оцинкованная', 'Оцинкованная']},
            {characteristic: 'Назначение', values: ['Бюджетное решение', 'Оптимальный выбор', 'Премиум сегмент', 'Элитный сегмент']},
        ],
    };

    const slidingFeaturesCards = [
        {
            id: 'construction-types',
            title: 'Виды и устройство конструкций',
            description: 'Мы производим надежные консольные системы на базе комплектующих Алютех весом до 450 кг (шины SG.01.002) и до 700 кг (шины SG.02.002), доступные как на простой, так и на оцинкованной шине.',
            icon: Layers,
            bullets: [
                {text: 'Консольный тип — полотно парит над землей, не требуя рельсов'},
                {text: 'Бесшумность работы и легкость ручного открытия'},
                {text: 'Экономия пространства — створка сдвигается вдоль забора'},
            ],
        },
        {
            id: 'filling-options',
            title: 'Варианты эксклюзивного заполнения',
            description: 'Реализуем любые дизайнерские идеи заказчика под ключ.',
            icon: ShieldAlert,
            bullets: [
                {text: 'Горизонтальные ламели-жалюзи повышенной жесткости'},
                {text: 'Классические кованые элементы и эксклюзивные эскизы'},
                {text: 'Зашитие натуральным деревом или металлическим штакетником'},
            ],
        },
    ];

    const portfolioItems = [
        {
            location: 'д. Тарасово',
            series: 'Сэндвич-панель',
            color: 'Антрацит',
            automation: 'Alutech SG.02.002',
            dimensions: '4000 x 2000 мм',
            timeline: '1 день'
        },
        {
            location: 'Минский р-н, Смолевичи',
            series: 'Алюминий',
            color: 'RAL 9016 Белый',
            automation: 'Nice',
            dimensions: '5000 x 2000 мм',
            timeline: '2 дня'
        },
        {
            location: 'Минск, Уручье',
            series: 'Каркас',
            color: 'Профнастил',
            automation: 'Ручное управление',
            dimensions: '3500 x 2000 мм',
            timeline: '1 день'
        },
    ];

    const slidingProjects: Project[] = portfolioItems.map((item, index) => ({
        id: index + 1,
        title: `Откатные ворота ${item.series}`,
        location: item.location,
        material: `Серия ${item.series}, цвет ${item.color}`,
        automation: item.automation,
        installationTime: item.timeline,
        priceRange: 'от 1000 BYN',
        description: `Откатные ворота серии ${item.series} в цвете ${item.color}. Размеры: ${item.dimensions}. Профессиональная установка с гарантией.`,
        image: '/main/webp/sliding.webp',
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
                            <img draggable={false}
                                src="/main/webp/sliding.webp"
                                className="absolute inset-0 object-cover opacity-60 max-lg:block hidden z-0 pointer-events-none sm:rounded-2xl"
                                style={{width: '100%', height: '100%'}}
                                alt="Sliding Gates Mobile Backdrop"
                            />

                            {/* LAYER 2: Gradient overlay */}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 max-lg:block hidden z-10 pointer-events-none sm:rounded-2xl"/>

                            {/* Left Column */}
                            <div className="flex flex-col justify-center py-0 relative z-20">
                                {/* Breadcrumbs */}
                                <nav
                                    className="flex flex-wrap items-center gap-1 text-xs sm:text-sm whitespace-nowrap overflow-x-auto scrollbar-none max-w-full text-gray-300 lg:text-gray-500 mb-4">
                                    <Link href="/" className="hover:text-[#E65F2B] transition-colors">
                                        Главная
                                    </Link>
                                    <span>/</span>
                                    <Link href="/catalog" className="hover:text-[#E65F2B] transition-colors">
                                        Каталог
                                    </Link>
                                    <span>/</span>
                                    <span className="text-white lg:text-slate-900">Откатные ворота</span>
                                </nav>

                                {/* Title */}
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white lg:text-slate-900 mb-4 leading-tight">
                                    Откатные ворота под ключ в Минске: изготовление, продажа и монтаж
                                </h1>

                                {/* Subtitle */}
                                <p className="text-lg text-gray-200 lg:text-gray-600 mb-6 leading-relaxed">
                                    Современное прогрессивное решение для въезда на частную территорию. Изготовление консольных ворот по индивидуальным размерам с официальной гарантией от производителя.
                                </p>

                                {/* CTA Button */}
                                <Button 
                                    size="lg" 
                                    className="w-fit cta-button-primary" 
                                    onClick={() => openModal({
                                        scope: 'gate',
                                        gateInfo: {
                                            gateType: 'Откатные ворота',
                                        },
                                    })}
                                >
                                    Рассчитать стоимость по моим размерам
                                    <ArrowRight className="ml-2 w-5 h-5"/>
                                </Button>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap gap-6 mt-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Консольные ворота под ключ — избавим вас от всех хлопот</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Индивидуальный расчет стоимости и гибкие скидки</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Гарантийное и постгарантийное сервисное обслуживание</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Product Image */}
                            <div className="hidden lg:block w-full h-full relative z-20">
                                <img draggable={false}
                                    src="/main/webp/sliding.webp"
                                    alt="Откатные ворота с автоматикой"
                                    className="w-full h-full object-cover rounded-2xl shadow-xl"
                                />
                            </div>

                        </div>
                    </div>
                </Container>
            </Section>

            {/* Product Series Comparison Block */}
            <Section background="muted">
                <Container background='muted'>
                    <ProductPricingGrid
                        title="Сравнение серий и цены"
                        subtitle="Прозрачное ценообразование без скрытых платежей"
                        tiers={pricingTiers}
                        comparisonMatrix={comparisonMatrix}
                        desktopGridCols={2}
                    />

                    <div className="mt-12 text-center">
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

            {/* Product Features Section */}
            <ProductFeaturesSection
                backgroundColor="white"
                sectionTitle="Технические особенности"
                description="Инновационные решения для максимального комфорта и безопасности"
                cards={slidingFeaturesCards}
            />

            {/* Portfolio Showcase */}
            <SplitPortfolio background='muted' projects={slidingProjects} />

            {/* CTA Section */}
            <Section background="white">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4">
                            Готовы заказать откатные ворота?
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                            Оставьте заявку на бесплатный замер и получите точный расчет стоимости в течение 24 часов
                        </p>
                        <Button 
                            size="lg" 
                            className="cta-button-primary" 
                            onClick={() => openModal({
                                scope: 'gate',
                                gateInfo: {
                                    gateType: 'Откатные ворота',
                                },
                            })}
                        >
                            Заказать бесплатный замер
                            <ArrowRight className="ml-2 w-5 h-5"/>
                        </Button>
                    </div>
                </Container>
            </Section>
        </>
    );
}
