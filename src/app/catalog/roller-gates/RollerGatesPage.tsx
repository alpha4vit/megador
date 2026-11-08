'use client';

import Link from 'next/link';
import {ArrowRight, Check, Cpu, ShieldCheck, ThermometerSnowflake} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Section} from '@/components/ui/section';
import {Container} from '@/components/ui/container';
import {Project, SplitPortfolio} from '@/components/features/split-portfolio';
import ColorSelector, {ColorCollections} from '@/components/features/color-selector';
import ProductPricingGrid from '@/components/features/product-pricing-grid';
import ControlTypesSection from '@/components/features/control-types-section';
import InstallationMethods from "@/components/features/installationMethods";
import { useFeedbackModal } from '@/contexts/FeedbackModalContext';

export default function RollerGatesPage() {
    const { openModal } = useFeedbackModal();

    const colorCollections: ColorCollections = {
        ral: [
            {id: 'ral-white', name: 'Белый ', value: '#F7FBF5', type: 'solid', code: 'RAL 9016'},
            {id: 'ral-white-bone', name: 'Слоновая кость', value: '#EADEBD', type: 'solid', code: 'RAL 1015'},
            {id: 'ral-white-metallic', name: 'Серебристый металлик', value: '#A5A8A6', type: 'solid', code: 'RAL 9006'},
            {id: 'ral-green', name: 'Зеленая ель', value: '#26392F', type: 'solid', code: 'RAL 6009'},
            {id: 'ral-rubin-red', name: 'Красный рубин', value: '#701F29', type: 'solid', code: 'RAL 3004'},
            {id: 'ral-blue', name: 'Темно-синий', value: '#232C3F', type: 'solid', code: 'RAL 5011'},
            {id: 'ral-brown', name: 'Коричневый ', value: '#49392D', type: 'solid', code: 'RAL 8014'},
            {id: 'ral-brow-choco', name: 'Школоадно-коричневый ', value: '#44322D', type: 'solid', code: 'RAL 8017'},
            {id: 'ral-anthracite', name: 'Антрацит', value: '#373F43', type: 'solid', code: 'RAL 7016'},
            {id: 'ral-gray', name: 'Серый', value: '#B4B8B0', type: 'solid', code: 'RAL 7038'},
        ],
        wood: [
            {id: 'gold-oak', name: 'Золотой дуб', value: '', imageUrl: '/roller-gates/webp/gold_oak.jpg', type: 'texture'},
            {id: 'irish-oak', name: 'Ирландский дуб', value: '', imageUrl: '/roller-gates/webp/irish_oak.webp', type: 'texture'},
            {id: 'walnut', name: 'Орех', value: '', imageUrl: '/roller-gates/webp/walnut.webp', type: 'texture'},
            {id: 'cherry', name: 'Вишня', value: '', imageUrl: '/roller-gates/webp/cherry.webp', type: 'texture'},
        ],
        digital: [
            {id: 'digital-brechia', name: 'Бречия Дамаската', value: '', imageUrl: '/roller-gates/webp/brechia-of-damascus2big.webp', type: 'digital', textColor: 'light'},
            {id: 'digital-bricks', name: 'Кирпич винтажный', value: '', imageUrl: '/bricks_vintage.webp', type: 'digital', textColor: 'light'},
            {id: 'digital-slanez', name: 'Светлый сланец', value: '', imageUrl: '/bright_slanez.webp', type: 'digital', textColor: 'light'},
            {id: 'digital-concrete', name: 'Бетон Антик', value: '', imageUrl: '/concrete-anteak.webp', type: 'digital', textColor: 'light'},
        ],
    };

    const pricingTiers = [
        {
            id: 'trend',
            title: 'Alutech Trend',
            subtitle: '77мм профиль',
            badgeText: 'Практичный выбор',
            badgeStyle: 'bg-slate-900',
            features: [
                {label: 'Толщина профиля', value: '77 мм'},
                {label: 'Наполнитель', value: 'Мягкий пенный'},
                {label: 'Профиль', value: 'AG/77 роликовой прокатки'},
            ],
            price: 'от 300 BYN',
            productActionKey: 'trend',
        },
        {
            id: 'prestige',
            title: 'Alutech Prestige',
            subtitle: '77мм утолщенный профиль',
            badgeText: 'Премиум',
            badgeStyle: 'bg-[#E65F2B]',
            features: [
                {label: 'Толщина профиля', value: '77 мм утолщенный'},
                {label: 'Наполнитель', value: 'Твердый пенный'},
                {label: 'Профиль', value: 'AR/77 повышенной прочности'},
            ],
            price: 'от 350 BYN',
            productActionKey: 'prestige',
        },
        {
            id: 'security',
            title: 'Alutech Security',
            subtitle: 'Противовзломный сегмент',
            badgeText: 'Лучшая защита',
            badgeStyle: 'bg-red-700',
            features: [
                {label: 'Толщина профиля', value: '1.0–1.5 мм'},
                {label: 'Конструкция', value: 'Экструдированный профиль'},
                {label: 'Взломостойкость', value: 'Класс Р3–Р5'},
            ],
            price: 'от 400 BYN',
            productActionKey: 'security',
        },
    ];

    const comparisonMatrix = {
        type: 'table' as const,
        tableHeaders: ['Trend', 'Prestige', 'Security'],
        tableRows: [
            {characteristic: 'Назначение', values: ['Базовая защита', 'Повышенный комфорт и стиль', 'Высокие требования к безопасности']},
            {characteristic: 'Профиль', values: ['С пенозаполнением (стандарт)', 'С пенозаполнением (высокая плотность)', 'Экструдированный толстостенный с ребром жесткости']},
            {characteristic: 'Толщина ленты', values: ['~0.36 мм', '~0.49 мм', '1.0 – 1.5 мм (стенки профиля)']},
            {characteristic: 'Взломостойкость', values: ['Класс Р1', 'Класс Р1 (устойчив к деформациям)', 'Высокий класс Р3 - Р5 (сертифицировано)']},
            {characteristic: 'Изоляция', values: ['Стандартная', 'Высокая (зимой задерживает тепло до 30%)', 'Минимальная (акцент на прочность)']},
            {characteristic: 'Ветроустойчивость', values: ['Стандартная', 'Выдерживает ураганные ветры', 'Исключительная жесткость полотна']},
            {characteristic: 'Палитра', values: ['Базовый набор', 'Расширенная (более 30 цветов)', 'Ограниченный выбор защитных цветов']},
            {characteristic: 'Локация', values: ['Дачи, окна 2 этажа, охраняемые поселки', 'Частные дома, коттеджи, 1 этажи', 'Банки, ювелирные магазины, склады, VIP-объекты']},
        ],
    };

    const portfolioItems = [
        {
            location: 'Минский р-н, Смолевичи',
            series: 'Prestige',
            color: 'Антрацит',
            automation: 'Marantec',
            dimensions: '3000 x 2500 мм',
            timeline: '2 дня'
        },
        {
            location: 'Минск, Уручье',
            series: 'Trend',
            color: 'Золотой дуб',
            automation: 'Ручное управление',
            dimensions: '3500 x 2500 мм',
            timeline: '2 дня'
        },
        {
            location: 'Минский р-н, Ждановичи',
            series: 'Prestige',
            color: 'RAL 9016 Белый',
            automation: 'Nice',
            dimensions: '3200 x 2500 мм',
            timeline: '3 дня'
        },
    ];

    const rollerProjects: Project[] = portfolioItems.map((item, index) => ({
        id: index + 1,
        title: `Роллетные ворота ${item.series}`,
        location: item.location,
        material: `Серия ${item.series}, цвет ${item.color}`,
        automation: item.automation,
        installationTime: item.timeline,
        priceRange: 'от 1200 BYN',
        description: `Роллетные ворота серии ${item.series} в цвете ${item.color}. Размеры: ${item.dimensions}. Профессиональная установка с гарантией.`,
        image: '/images/portfolio/roller-gates/webp-placeholder.webp',
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
                                src="/roller-gates/webp/rollet-preview.webp"
                                className="absolute inset-0 object-cover opacity-60 max-lg:block hidden z-0 pointer-events-none sm:rounded-2xl"
                                style={{width: '100%', height: '100%'}}
                                alt="Roller Gates Mobile Backdrop"
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
                                    <span className="text-white lg:text-slate-900">Роллетные ворота</span>
                                </nav>

                                {/* Title */}
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white lg:text-slate-900 mb-6 leading-tight">
                                    Роллетные ворота и защитные жалюзи-роллеты Alutech под ключ
                                </h1>

                                {/* Subtitle */}
                                <p className="text-lg text-gray-200 lg:text-gray-600 mb-8 leading-relaxed">
                                    Современные защитные алюминиевые системы в Минске. Сочетают в себе надежность оконных решеток, солнцезащиту и функции энергосбережения.
                                </p>

                                {/* CTA Button */}
                                <Button 
                                    size="lg" 
                                    className="w-fit cta-button-primary" 
                                    onClick={() => openModal({
                                        scope: 'gate',
                                        gateInfo: {
                                            gateType: 'Роллетные ворота',
                                        },
                                    })}
                                >
                                    Рассчитать стоимость по моим размерам
                                    <ArrowRight className="ml-2 w-5 h-5"/>
                                </Button>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap gap-6 mt-8">
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Прямой договор с заводом Алютех (без посредников)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Снижение нагрузок на проемы за счет легкого веса алюминия</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Официальная гарантия и монтаж</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Product Image */}
                            <div className="hidden lg:block w-full h-full relative z-20">
                                <img draggable={false}
                                    src="/roller-gates/webp/rollet-preview.webp"
                                    alt="Роллетные ворота с автоматикой"
                                    className="w-full h-full object-cover rounded-2xl shadow-xl"
                                />
                            </div>

                        </div>
                    </div>
                </Container>
            </Section>

            {/* Technical Features Grid */}
            <Section background="muted">
                <Container background="muted">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4">
                            Технические преимущества
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Инновационные решения для максимального комфорта и безопасности
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div
                                className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-4 flex-shrink-0">
                                <ThermometerSnowflake className="text-white" size={24} strokeWidth={2}/>
                            </div>
                            <h3 className="text-xl font-bold text-[#2F3E46] mb-3">
                                Алюминиевый профиль 77мм
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Экструдированный алюминиевый профиль с полиуретановым наполнителем обеспечивает отличную теплоизоляцию и звукоизоляцию. Устойчив к коррозии и механическим повреждениям.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div
                                className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-4 flex-shrink-0">
                                <ShieldCheck className="text-white" size={24} strokeWidth={2}/>
                            </div>
                            <h3 className="text-xl font-bold text-[#2F3E46] mb-3">
                                Ветрозащитные замки
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Встроенные ветрозащитные замки предотвращают самопроизвольное поднятие полотна при сильном ветре. Защитный короб скрывает механизм и защищает от пыли и влаги.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div
                                className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-4 flex-shrink-0">
                                <Cpu className="text-white" size={24} strokeWidth={2}/>
                            </div>
                            <h3 className="text-xl font-bold text-[#2F3E46] mb-3">
                                Ручное и автоматическое управление
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Возможность ручного открывания с помощью шнурового привода или автоматического управления с электроприводом. Интеграция с системами умного дома и пультами ДУ.
                            </p>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Interactive Color & Texture Selector */}
            <Section>
                <Container>
                    <ColorSelector colorCollections={colorCollections} showDigitalTab={false} />
                </Container>
            </Section>

            <section className="w-full bg-[#F8F9FA] py-16">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4">
                            Способы монтажа
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Выберите оптимальный вариант установки для вашего объекта
                        </p>
                    </div>
                    <InstallationMethods />
                </div>
            </section>

            {/* Control Types */}
            <section className="w-full bg-white border-y border-gray-100 py-16">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4">
                            Варианты управления
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Механические и автоматические системы для любого удобства
                        </p>
                    </div>
                    <ControlTypesSection />
                </div>
            </section>

            {/* Transparent Pricing Matrix */}
            <Section background="muted">
                <Container background='muted'>
                    <ProductPricingGrid
                        title="Сравнение серий и цены"
                        subtitle="Прозрачное ценообразование без скрытых платежей"
                        tiers={pricingTiers}
                        comparisonMatrix={comparisonMatrix}
                        desktopGridCols={3}
                    />

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

            {/* Portfolio Showcase */}
            <Section>
                    <SplitPortfolio projects={rollerProjects} />
            </Section>

            {/* CTA Section */}
            <Section background="muted">
                <Container background="muted">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-6">
                            Готовы заказать роллетные ворота?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Оставьте заявку на бесплатный замер и получите точный расчет стоимости в течение 24 часов
                        </p>
                        <Button 
                            size="lg" 
                            className="cta-button-primary" 
                            onClick={() => openModal({
                                scope: 'gate',
                                gateInfo: {
                                    gateType: 'Роллетные ворота',
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
