'use client';

import {useState} from 'react';
import Link from 'next/link';
import {ArrowRight, Check, Cpu, ShieldCheck, ThermometerSnowflake} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Section} from '@/components/ui/section';
import {Container} from '@/components/ui/container';
import {SplitPortfolio, Project} from '@/components/features/split-portfolio';
import ColorSelector, {ColorItem, ColorCollections} from '@/components/features/color-selector';
import ProductPricingGrid from '@/components/features/product-pricing-grid';

export default function SectionalGatesPage() {
    const colorCollections: ColorCollections = {
        ral: [
            {id: 'ral-9016', name: 'RAL 9016 Белый', value: '#F7FBF5', type: 'solid', code: 'RAL 9016'},
            {id: 'ral-1015', name: 'RAL 1015 Светлая слоновая кость', value: '#EADEBD', type: 'solid', code: 'RAL 1015'},
            {id: 'ral-9006', name: 'RAL 9006 Серый алюминий', value: '#8A9597', type: 'solid', code: 'RAL 9006'},
            {id: 'ral-6005', name: 'RAL 6005 Зеленый мох', value: '#2F4F4F', type: 'solid', code: 'RAL 6005'},
            {id: 'ral-3004', name: 'RAL 3004 Пурпурно-красный', value: '#701F29', type: 'solid', code: 'RAL 3004'},
            {id: 'ral-5010', name: 'RAL 5010 Горечавково-синий', value: '#13447C', type: 'solid', code: 'RAL 5010'},
            {id: 'ral-8014', name: 'RAL 8014 Сепия коричневый', value: '#49392D', type: 'solid', code: 'RAL 8014'},
            {id: 'ral-8017', name: 'RAL 8017 Шоколадно-коричневый', value: '#44322D', type: 'solid', code: 'RAL 8017'},
            {id: 'ral-7016', name: 'RAL 7016 Антрацит', value: '#2F3E46', type: 'solid', code: 'RAL 7016'},
        ],
        wood: [
            {id: 'wood-dark-oak', name: 'Темный дуб', value: '', imageUrl: '/sectional-gates/dark_oak.jpg', type: 'texture'},
            {id: 'wood-dark-cherry', name: 'Темная вишня', value: '', imageUrl: '/sectional-gates/dark_cherry.jpg', type: 'texture'},
            {id: 'wood-gold-oak', name: 'Золотой дуб', value: '', imageUrl: '/sectional-gates/gold_oak.jpg', type: 'texture'},
        ],
        digital: [
            {id: 'digital-brechia', name: 'Бречия Дамаската', value: '', imageUrl: '/sectional-gates/brechia-of-damascus2big.jpg', type: 'digital', textColor: 'light'},
            {id: 'digital-bricks', name: 'Кирпич винтажный', value: '', imageUrl: '/sectional-gates/bricks_vintage.jpg', type: 'digital', textColor: 'light'},
            {id: 'digital-slanez', name: 'Светлый сланец', value: '', imageUrl: '/sectional-gates/bright_slanez.jpg', type: 'digital', textColor: 'light'},
            {id: 'digital-concrete', name: 'Бетон Антик', value: '', imageUrl: '/sectional-gates/concrete-anteak.jpg', type: 'digital', textColor: 'light'},
            {id: 'digital-pine', name: 'Горная сосна', value: '', imageUrl: '/sectional-gates/gornaya-sosna.jpg', type: 'digital', textColor: 'light'},
            {id: 'digital-oak', name: 'Моренный дуб', value: '', imageUrl: '/sectional-gates/morenniy-oak.jpg', type: 'digital', textColor: 'light'},
        ],
    };

    const pricingTiers = [
        {
            id: 'trend',
            title: 'Alutech Trend',
            subtitle: 'Оптимальный выбор',
            badgeText: 'Популярный',
            badgeStyle: 'bg-slate-900',
            features: [
                {label: 'Толщина панели', value: '40 мм'},
                {label: 'Тип пружин', value: 'Торсионные'},
                {label: 'Базовая автоматика', value: 'Nice / Marantec'},
            ],
            price: 'от 1800 BYN',
            productActionKey: 'trend',
        },
        {
            id: 'prestige',
            title: 'Alutech Prestige',
            subtitle: 'Премиум класс',
            badgeText: 'Премиум',
            badgeStyle: 'bg-[#E65F2B]',
            features: [
                {label: 'Толщина панели', value: '45 мм'},
                {label: 'Тип пружин', value: 'Торсионные усиленные'},
                {label: 'Базовая автоматика', value: 'Marantec Pro'},
            ],
            price: 'от 2400 BYN',
            productActionKey: 'prestige',
        },
    ];

    const comparisonMatrix = {
        type: 'content-blocks' as const,
        contentBlocks: [
            {
                title: 'Теплоизоляция и толщина панелей',
                items: [
                    {
                        tierName: 'Trend',
                        badgeStyle: 'bg-[#E65F2B]',
                        value: '40 мм',
                        content: 'Сэндвич-панели толщиной 40 мм (эквивалент 55 см кирпичной кладки) — идеально для умеренных условий и неотапливаемых гаражей.',
                    },
                    {
                        tierName: 'Prestige',
                        badgeStyle: 'bg-[#2F3E46]',
                        value: '45 мм',
                        content: 'Ультра-плотные сэндвич-панели 45 мм с двойными морозостойкими уплотнителями изопрен с внутренней воздушной камерой (эквивалент 60 см кирпичной кладки) — оптимально для энергоэффективных домов и отапливаемых гаражей в Беларуси.',
                    },
                ],
            },
            {
                title: 'Защита от коррозии и фурнитура',
                items: [
                    {
                        tierName: 'Trend',
                        badgeStyle: 'bg-[#E65F2B]',
                        content: 'Горячее цинкование стальных кронштейнов и направляющих роликов — разработано для стандартных условий эксплуатации.',
                    },
                    {
                        tierName: 'Prestige',
                        badgeStyle: 'bg-[#2F3E46]',
                        content: 'Высококачественная нержавеющая сталь AISI 430 для петель, кронштейнов и фурнитуры — ворота практически невосприимчивы к зимним дорожным реагентам и влаге.',
                    },
                ],
            },
            {
                title: 'Внешний вид и эксклюзив',
                items: [
                    {
                        tierName: 'Trend',
                        badgeStyle: 'bg-[#E65F2B]',
                        content: '5 текстур панелей, стандартные цвета RAL и покрытия под дерево.',
                    },
                    {
                        tierName: 'Prestige',
                        badgeStyle: 'bg-[#2F3E46]',
                        content: 'Расширенная палитра RAL, премиальные текстуры под дерево, цифровая печать по индивидуальному проекту.',
                    },
                ],
            },
            {
                title: 'Плавность работы',
                items: [
                    {
                        tierName: 'Trend',
                        badgeStyle: 'bg-[#E65F2B]',
                        content: 'Стандартные одинарные роликовые кронштейны.',
                    },
                    {
                        tierName: 'Prestige',
                        badgeStyle: 'bg-[#2F3E46]',
                        content: 'Специализированные сдвоенные ролики — гарантируют практически бесшумную работу гаражных ворот.',
                    },
                ],
            },
        ],
    };

    const portfolioItems = [
        {
            location: 'Минский р-н, Тарасово',
            series: 'Prestige',
            color: 'Антрацит',
            automation: 'Marantec',
            dimensions: '2500 x 2125 мм',
            timeline: '3 дня'
        },
        {
            location: 'Минск, Цнянка',
            series: 'Trend',
            color: 'Золотой дуб',
            automation: 'Ручное управление',
            dimensions: '3000 x 2125 мм',
            timeline: '2 дня'
        },
        {
            location: 'Минский р-н, Логойск',
            series: 'Prestige',
            color: 'RAL 9016 Белый',
            automation: 'Nice',
            dimensions: '2750 x 2125 мм',
            timeline: '3 дня'
        },
    ];

    const sectionalProjects: Project[] = portfolioItems.map((item, index) => ({
        id: index + 1,
        title: `Секционные ворота ${item.series}`,
        location: item.location,
        material: `Серия ${item.series}, цвет ${item.color}`,
        automation: item.automation,
        installationTime: item.timeline,
        priceRange: 'от 1400 BYN',
        description: `Секционные ворота серии ${item.series} в цвете ${item.color}. Размеры: ${item.dimensions}. Профессиональная установка с гарантией.`,
        image: '/images/portfolio/sectional-gates-placeholder.jpg',
    }));

    return (
        <>
            {/* Hero & Product Description Section */}
            <Section className="bg-zinc-950 lg:bg-transparent !pt-0 lg:!pt-12 pb-12 sm:pb-16 p-0 lg:p-default relative">
                {/* УРОВЕНЬ КОНТЕЙНЕРА: Оставляем обнуленным для десктопа (lg:!pt-0), чтобы отступы не суммировались */}
                <Container size="xl"
                           className="bg-zinc-950 lg:bg-transparent !pt-0 lg:!pt-0 px-0 lg:px-default relative w-full max-w-full">
                    <div className="w-full max-w-[1200px] mx-auto relative lg:px-6">
                        <div
                            className="relative -mx-4 px-6 py-8 sm:-mx-6 sm:p-8 lg:mx-0 lg:p-0 rounded-none sm:rounded-2xl lg:bg-transparent grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch text-white lg:text-gray-900">

                            {/* LAYER 1: ИСПРАВЛЕНО: Оpacity увеличена до 60%, чтобы ворота и дом стали светлыми, четкими и читаемыми */}
                            <img
                                src="/sectional-gates/section-preview-ai.jpeg"
                                className="absolute inset-0 object-cover opacity-60 max-lg:block hidden z-0 pointer-events-none sm:rounded-2xl"
                                style={{width: '100%', height: '100%'}}
                                alt="Sectional Gates Mobile Backdrop"
                            />

                            {/* LAYER 2: ИСПРАВЛЕНО: Градиент ослаблен (вверху стало to-black/10 вместо to-black/30), верхняя часть картинки станет намного светлее */}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 max-lg:block hidden z-10 pointer-events-none sm:rounded-2xl"/>

                            {/* Left Column */}
                            {/* Контент остается без изменений, но убедитесь, что у него стоит relative z-20 */}
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
                                    <span className="text-white lg:text-slate-900">Секционные ворота</span>
                                </nav>

                                {/* Title */}
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white lg:text-slate-900 mb-6 leading-tight">
                                    Секционные ворота Alutech под ключ
                                </h1>

                                {/* Subtitle */}
                                <p className="text-lg text-gray-200 lg:text-gray-600 mb-8 leading-relaxed">
                                    Официальный партнер Alutech в Беларуси. Теплые секционные ворота с профессиональным
                                    монтажом.
                                    Более 20 лет опыта установки в Минске и области. Гарантия на все работы и
                                    материалы.
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
                                        <span>Замер бесплатно</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Монтаж за 1-3 дня</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Гарантия 2 года</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Product Image */}
                            <div className="hidden lg:block w-full h-full relative z-20">
                                <img
                                    src="/sectional-gates/section-preview-ai.jpeg"
                                    alt="Секционные ворота с автоматикой"
                                    className="w-full h-full object-cover rounded-2xl shadow-xl"
                                />
                            </div>

                        </div>
                    </div>
                </Container>
            </Section>


            {/* Technical Features Grid */}
            <Section background="muted">
                <Container background='muted'>
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
                                Высокая теплоизоляция
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Сэндвич-панели толщиной до 45 мм с полиуретановым наполнителем сохраняют тепло в суровые
                                белорусские зимы. Снижение теплопотерь до 40%.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div
                                className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-4 flex-shrink-0">
                                <ShieldCheck className="text-white" size={24} strokeWidth={2}/>
                            </div>
                            <h3 className="text-xl font-bold text-[#2F3E46] mb-3">
                                Долговечность и антикоррозия
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Цинковое и полиуретановое покрытие ПУР-ПА обеспечивает защиту от коррозии на
                                десятилетия. Гарантия от производителя до 10 лет.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div
                                className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-4 flex-shrink-0">
                                <Cpu className="text-white" size={24} strokeWidth={2}/>
                            </div>
                            <h3 className="text-xl font-bold text-[#2F3E46] mb-3">
                                Безопасность эксплуатации
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Встроенные системы защиты от защемления пальцев и обрыва пружин в базовой комплектации.
                                Соответствие европейским стандартам безопасности.
                            </p>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Interactive Color & Texture Selector */}
            <Section>
                <Container>
                    <ColorSelector colorCollections={colorCollections} />
                </Container>
            </Section>

            {/* Transparent Pricing Matrix */}
            <Section background="muted">
                <Container background='muted'>
                    <ProductPricingGrid
                        title="Сравнение серий и цены"
                        subtitle="Прозрачное ценообразование без скрытых платежей"
                        tiers={pricingTiers}
                        comparisonMatrix={comparisonMatrix}
                        desktopGridCols={2}
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
                <Container>
                    <SplitPortfolio projects={sectionalProjects} />

                    {/*<div className="text-center mt-12">*/}
                    {/*    <Button size="lg" variant="outline" className="cta-button-secondary"*/}
                    {/*            data-action="view-portfolio">*/}
                    {/*        Смотреть все проекты*/}
                    {/*        <ArrowRight className="ml-2 w-5 h-5"/>*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                </Container>
            </Section>

            {/* CTA Section */}
            <Section background="muted">
                <Container background='muted'>
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-6">
                            Готовы заказать секционные ворота?
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
