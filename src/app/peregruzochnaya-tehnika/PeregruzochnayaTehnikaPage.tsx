'use client';

import Link from 'next/link';
import {
    ArrowRight, Check, Container as ContainerIcon, Crosshair, Droplets, Forklift, Gauge, Hammer,
    Layers, Package, ShieldCheck, Snowflake, Umbrella, Wrench, Zap,
    type LucideIcon,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Section} from '@/components/ui/section';
import {Container} from '@/components/ui/container';
import {SplitPortfolio, type Project} from '@/components/features/split-portfolio';
import {useFeedbackModal} from '@/contexts/FeedbackModalContext';
import {useSiteData} from '@/contexts/SiteDataContext';
import {DataLoading} from '@/components/features/data-loading';
import {formatPrice, projectTitle, type CatalogProduct, type Spec} from '@/data/types';

const HERO_IMAGE = '/main/webp/main-preview.webp';

const benefitCards = [
    {
        icon: Snowflake,
        title: 'Сохранение микроклимата склада',
        description: 'Герметизация стыка исключает сквозняки и снижает затраты на отопление и кондиционирование.',
    },
    {
        icon: Forklift,
        title: 'Ускорение грузооборота',
        description: 'Уравнительные платформы компенсируют перепад высот между рампой и кузовом фуры для беспрепятственного заезда погрузчика.',
    },
    {
        icon: ContainerIcon,
        title: 'Экономия полезной площади',
        description: 'Выносные площадки и тамбуры позволяют организовать пост погрузки за пределами склада без перестройки фасада.',
    },
    {
        icon: ShieldCheck,
        title: 'Защита транспорта и здания',
        description: 'Колесные направляющие и амортизирующие бамперы предотвращают повреждение стен и кузовов при стыковке.',
    },
];

const levelerComparisonRows: {characteristic: string; sl: string; tl: string; winner?: 'sl' | 'tl'}[] = [
    {characteristic: 'Аппарель', sl: 'Поворотная', tl: 'Выдвижная телескопическая'},
    {characteristic: 'Выдвижение аппарели', sl: '—', tl: 'до 1000 мм'},
    {characteristic: 'Оптимальный транспорт', sl: 'Стандартные еврофуры', tl: 'Нестандартный транспорт, боковая и торцевая загрузка', winner: 'tl'},
    {characteristic: 'Заполнение кузова', sl: 'Частичное', tl: 'Полное', winner: 'tl'},
    {characteristic: 'Ориентир по бюджету', sl: 'Базовый бюджет', tl: 'Расширенные возможности', winner: 'sl'},
];

function specText(specs: Spec[] | undefined): string {
    return (specs ?? []).map((s) => (s.label ? `${s.label}: ${s.value}` : s.value)).join(' · ');
}

interface ShowcaseBenefit {
    icon: LucideIcon;
    title: string;
    subtitle: string;
}

interface ShowcaseConfig {
    caption: string;
    benefits: [ShowcaseBenefit, ShowcaseBenefit];
}

const showcaseConfigs: Record<string, ShowcaseConfig> = {
    pato: {
        caption: 'Система PATO',
        benefits: [
            {icon: Snowflake, title: 'Теплоизоляция склада', subtitle: 'Открытие дверей кузова внутри теплового контура'},
            {icon: Zap, title: 'Скорость стыковки', subtitle: 'Сокращение времени погрузки-разгрузки'},
        ],
    },
    levelers: {
        caption: 'Платформы серий TL и SL',
        benefits: [
            {icon: Gauge, title: 'Эффективность', subtitle: 'Увеличение производительности перегрузочных работ'},
            {icon: Layers, title: 'Вариативность', subtitle: 'Выбор платформы TL или SL под особенности объекта'},
        ],
    },
    shelters: {
        caption: 'Герметизатор серии DSF',
        benefits: [
            {icon: ShieldCheck, title: 'Долговечность', subtitle: 'Выполнены с применением износостойких материалов'},
            {icon: Droplets, title: 'Продуманный конструктив', subtitle: 'Способствует отводу воды по краям герметизатора'},
        ],
    },
    platforms: {
        caption: 'Площадки серий PSL и PTL',
        benefits: [
            {icon: Package, title: 'Практичность', subtitle: 'Экономия полезных складских площадей'},
            {icon: Wrench, title: 'Быстрый монтаж', subtitle: 'Без необходимости перестройки фасада здания'},
        ],
    },
    tambours: {
        caption: 'Тамбур серии DH',
        benefits: [
            {icon: Hammer, title: 'Удобство монтажа', subtitle: 'Простая сборка и установка, в том числе под углом'},
            {icon: Umbrella, title: 'Комфортная работа', subtitle: 'Защита груза от неблагоприятных погодных факторов'},
        ],
    },
    extras: {
        caption: 'Направляющие для колес серии WG',
        benefits: [
            {icon: Crosshair, title: 'Удобство и комфорт', subtitle: 'Обеспечивает безопасную и точную стыковку техники'},
            {icon: ShieldCheck, title: 'Долговечность', subtitle: 'Продлевает срок службы перегрузочного оборудования и стен'},
        ],
    },
};

function EquipmentShowcase({product, flip, onCta}: {product: CatalogProduct; flip: boolean; onCta: () => void}) {
    const config = showcaseConfigs[product.tab] ?? {
        caption: product.subtitle || product.title,
        benefits: [
            {icon: ShieldCheck, title: 'Надёжность', subtitle: 'Оборудование по стандарту EN 1398'},
            {icon: Wrench, title: 'Монтаж под ключ', subtitle: 'Проектирование и установка'},
        ] as [ShowcaseBenefit, ShowcaseBenefit],
    };
    const image = product.images[0];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            {/* Media */}
            <div className={flip ? 'lg:order-2' : ''}>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-100 shadow-sm">
                    {image ? (
                        <img draggable={false}
                            src={image}
                            alt={product.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F8F9FA] to-zinc-200">
                            <Forklift className="w-20 h-20 text-zinc-300"/>
                        </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none"/>
                    <span className="absolute bottom-4 left-4 right-4 text-white font-bold text-lg sm:text-xl drop-shadow">
                        {config.caption}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className={flip ? 'lg:order-1' : ''}>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#2F3E46] mb-4"
                    style={{fontFamily: 'var(--font-montserrat)'}}>
                    {product.title}
                </h3>
                {product.description && (
                    <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                )}
                <Button size="lg" className="cta-button-primary mb-8" onClick={onCta}>
                    Рассчитать решение
                    <ArrowRight className="ml-2 w-5 h-5"/>
                </Button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {config.benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                            <div key={benefit.title} className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] flex items-center justify-center text-[#E65F2B] flex-shrink-0">
                                    <Icon className="w-5 h-5"/>
                                </div>
                                <div>
                                    <p className="font-bold text-[#2F3E46] text-sm">{benefit.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{benefit.subtitle}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function PeregruzochnayaTehnikaPage() {
    const {openModal} = useFeedbackModal();
    const {getProducts, getProjects, hydrated} = useSiteData();

    const equipment = getProducts('docking-equipment');
    const EQUIPMENT_TAB_ORDER = ['pato', 'levelers', 'shelters', 'platforms', 'tambours', 'extras'];
    const orderedEquipment = [
        ...EQUIPMENT_TAB_ORDER
            .map((tab) => equipment.find((p) => p.tab === tab))
            .filter((p): p is CatalogProduct => Boolean(p)),
        ...equipment.filter((p) => !EQUIPMENT_TAB_ORDER.includes(p.tab)),
    ];

    const portfolioItems = getProjects('docking-equipment', true);
    const dockProjects: Project[] = portfolioItems.map((item, index) => ({
        id: index + 1,
        title: projectTitle(item),
        location: item.location,
        material: item.series ? `Серия ${item.series}, цвет ${item.color}` : '',
        automation: item.automation,
        installationTime: item.timeline,
        priceRange: formatPrice(item),
        description: item.description || `Проект: ${projectTitle(item)}. Профессиональная установка с гарантией.`,
        image: item.images[0],
    }));

    const equipmentCta = (product: CatalogProduct) =>
        openModal({
            scope: 'product',
            productInfo: {
                name: product.title,
                price: formatPrice(product),
                specs: product.specs.map((s) => specText([s])),
            },
            title: `Консультация: ${product.title}`,
            subtitle: 'Расскажите о задаче — подберём оборудование и рассчитаем проект',
        });

    const consultationCta = () =>
        openModal({
            scope: 'consultation',
            title: 'Проект перегрузочного терминала',
            subtitle: 'Специалист рассчитает состав оборудования и стоимость под ваши задачи',
        });

    if (!hydrated) {
        return <DataLoading/>;
    }

    return (
        <>
            {/* Hero */}
            <Section className="bg-zinc-950 lg:bg-transparent !pt-0 lg:!pt-12 pb-12 sm:pb-16 p-0 lg:p-default relative">
                <Container size="xl"
                           className="bg-zinc-950 lg:bg-transparent !pt-0 lg:!pt-0 px-0 lg:px-default relative w-full max-w-full">
                    <div className="w-full max-w-[1200px] mx-auto relative lg:px-6">
                        <div
                            className="relative -mx-4 px-6 py-8 sm:-mx-6 sm:p-8 lg:mx-0 lg:p-0 rounded-none sm:rounded-2xl lg:bg-transparent grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center lg:max-h-[500px] text-white lg:text-gray-900 bg-white">

                            {/* Mobile backdrop image */}
                            <img draggable={false}
                                src={HERO_IMAGE}
                                className="absolute inset-0 object-cover opacity-60 max-lg:block hidden z-0 pointer-events-none sm:rounded-2xl"
                                style={{width: '100%', height: '100%'}}
                                alt="Перегрузочная техника Mobile Backdrop"
                            />

                            {/* Gradient overlay */}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 max-lg:block hidden z-10 pointer-events-none sm:rounded-2xl"/>

                            {/* Left Column */}
                            <div className="flex flex-col justify-center h-auto py-4 lg:py-0 relative z-20">
                                {/* Breadcrumbs */}
                                <nav
                                    className="flex flex-wrap items-center gap-1 text-xs sm:text-sm whitespace-nowrap overflow-x-auto scrollbar-none max-w-full text-gray-300 lg:text-gray-500 mb-6">
                                    <Link href="/" className="hover:text-[#E65F2B] transition-colors">
                                        Главная
                                    </Link>
                                    <span className="text-slate-400" aria-hidden="true">›</span>
                                    <span className="text-white lg:text-slate-900">Перегрузочная техника</span>
                                </nav>

                                {/* Title */}
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white lg:text-slate-900 mb-6 leading-tight">
                                    Перегрузочная техника
                                </h1>

                                {/* Subtitle */}
                                <p className="text-lg text-gray-200 lg:text-gray-600 mb-8 leading-relaxed">
                                    Современные решения для организации эффективного, быстрого и безопасного процесса
                                    погрузки-разгрузки на складах и логистических терминалах.
                                </p>

                                {/* CTA Button */}
                                <Button
                                    size="lg"
                                    className="w-fit cta-button-primary"
                                    onClick={consultationCta}
                                >
                                    Рассчитать проект
                                    <ArrowRight className="ml-2 w-5 h-5"/>
                                </Button>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap gap-6 mt-8">
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Безопасность по европейскому стандарту EN 1398</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Заводское тестирование каждого изделия</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Проектирование и монтаж под ключ</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Product Image */}
                            <div className="hidden lg:block w-full h-full max-h-[500px] relative overflow-hidden rounded-2xl z-20">
                                <img draggable={false}
                                    src={HERO_IMAGE}
                                    alt="Перегрузочная техника"
                                    className="absolute inset-0 w-full h-full object-cover object-center"
                                />
                            </div>

                        </div>
                    </div>
                </Container>
            </Section>

            {/* Problems Solved & Benefits */}
            <Section background="white" className="py-10 lg:py-16">
                <Container>
                    <div className="text-center max-w-3xl mx-auto px-4 mb-8 lg:mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4"
                            style={{fontFamily: 'var(--font-montserrat)'}}>
                            Какие задачи решает перегрузочная техника
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Правильно организованный док терминал ускоряет грузооборот и экономит ресурсы склада
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {benefitCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <div key={card.title}
                                     className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6 flex flex-col">
                                    <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] flex items-center justify-center mb-4 text-[#E65F2B]">
                                        <Icon className="w-6 h-6"/>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#2F3E46] mb-2">{card.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </Container>
            </Section>

            {/* Equipment Catalog Grid */}
            <Section background="muted">
                <Container background="muted">
                    <div className="text-center max-w-3xl mx-auto px-4 mt-6 mb-8 lg:mt-12 lg:mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4"
                            style={{fontFamily: 'var(--font-montserrat)'}}>
                            Ассортимент перегрузочной техники
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Оборудование для организации эффективной и безопасной погрузки-разгрузки — по стандарту EN 1398
                        </p>
                    </div>

                    {orderedEquipment.length > 0 ? (
                        <div className="space-y-14 lg:space-y-20">
                            {orderedEquipment.map((product, index) => (
                                <EquipmentShowcase key={product.id} product={product} flip={index % 2 === 1}
                                                    onCta={() => equipmentCta(product)}/>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Ассортимент оборудования скоро появится — оставьте заявку на расчёт проекта.</p>
                            <Button size="lg" className="mt-6 cta-button-primary" onClick={consultationCta}>
                                Рассчитать проект
                                <ArrowRight className="ml-2 w-5 h-5"/>
                            </Button>
                        </div>
                    )}
                </Container>
            </Section>

            {/* SL vs TL Levelers Comparison */}
            <Section background="white">
                <Container>
                    <div className="text-center max-w-3xl mx-auto px-4 mb-8 lg:mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4"
                            style={{fontFamily: 'var(--font-montserrat)'}}>
                            Какую платформу выбрать: SL или TL?
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Два типа уравнительных платформ под разные задачи и бюджеты
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* SL card */}
                        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-[#F8F9FA]">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-[#2F3E46]">Платформа SL</h3>
                                    <span className="px-3 py-1 bg-slate-900 text-white text-xs font-semibold rounded-full">базовый бюджет</span>
                                </div>
                                <p className="text-sm text-gray-500">С поворотной аппарелью</p>
                            </div>
                            <div className="p-5">
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                    Оптимальна для стандартных еврофур при регулярной стыковке с доком.
                                    Проверенное решение с минимальной стоимостью владения.
                                </p>
                                <ul className="space-y-2">
                                    {['Поворотная аппарель', 'Стандартные еврофуры 13,6 м', 'Минимальная цена'].map((t) => (
                                        <li key={t} className="flex items-center gap-2 text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-[#E65F2B] flex-shrink-0"/>
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* TL card */}
                        <div className="bg-white rounded-2xl border-2 border-[#E65F2B]/40 shadow-md overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-[#FFF5F0]">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-[#2F3E46]">Платформа TL</h3>
                                    <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
                                        <span className="flex-1 sm:flex-none min-w-fit inline-flex items-center justify-center px-3 py-1 bg-[#E65F2B] text-white text-xs font-semibold rounded-full">максимум возможностей</span>
                                        <span className="flex-1 sm:flex-none min-w-fit inline-flex items-center justify-center px-3 py-1 bg-[#E65F2B]/15 text-[#E65F2B] border border-[#E65F2B]/40 text-[10px] font-bold uppercase tracking-wide rounded-full">выбор экспертов</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">С выдвижной телескопической аппарелью</p>
                            </div>
                            <div className="p-5">
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                    Телескопическая аппарель выдвигается до 1000 мм — точная подача к кузову
                                    любого транспорта. Подходит для боковой и торцевой загрузки с полным заполнением кузова.
                                </p>
                                <ul className="space-y-2">
                                    {['Выдвижение аппарели до 1000 мм', 'Нестандартный транспорт', 'Боковая и торцевая загрузка', 'Полное заполнение кузова'].map((t) => (
                                        <li key={t} className="flex items-center gap-2 text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-[#E65F2B] flex-shrink-0"/>
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Comparison table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[560px] border-collapse">
                                <thead>
                                    <tr className="bg-[#F8F9FA] border-b-2 border-gray-200">
                                        <th className="text-left py-3.5 px-5 font-bold text-[#2F3E46] text-sm w-[30%]">Характеристика</th>
                                        <th className="text-left py-3.5 px-5 font-bold text-[#2F3E46] text-sm">SL — поворотная</th>
                                        <th className="text-left py-3.5 px-5 font-bold text-[#2F3E46] text-sm">TL — выдвижная</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {levelerComparisonRows.map((row, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 last:border-0 even:bg-gray-50/50">
                                            <td className="py-3.5 px-5 text-sm font-medium text-gray-700">{row.characteristic}</td>
                                            <td className={`py-3.5 px-5 text-sm ${row.winner === 'sl' ? 'font-semibold text-[#2F3E46]' : 'text-gray-600'}`}>
                                                {row.winner === 'sl' && <Check className="inline w-4 h-4 text-emerald-600 mr-1 -mt-0.5"/>}
                                                {row.sl}
                                            </td>
                                            <td className={`py-3.5 px-5 text-sm ${row.winner === 'tl' ? 'font-semibold text-[#2F3E46]' : 'text-gray-600'}`}>
                                                {row.winner === 'tl' && <Check className="inline w-4 h-4 text-emerald-600 mr-1 -mt-0.5"/>}
                                                {row.tl}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <Button size="lg" className="cta-button-primary" onClick={consultationCta}>
                            Помочь выбрать платформу
                            <ArrowRight className="ml-2 w-5 h-5"/>
                        </Button>
                    </div>
                </Container>
            </Section>

            {/* Portfolio */}
            {dockProjects.length > 0 && <SplitPortfolio background="muted" projects={dockProjects}/>}

            {/* CTA */}
            <Section background="white">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4">
                            Спроектируем перегрузочный терминал под ключ
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                            Оставьте заявку — рассчитаем состав оборудования, подготовим проект и выполним монтаж с гарантией
                        </p>
                        <Button
                            size="lg"
                            className="cta-button-primary"
                            onClick={consultationCta}
                        >
                            Рассчитать проект
                            <ArrowRight className="ml-2 w-5 h-5"/>
                        </Button>
                    </div>
                </Container>
            </Section>
        </>
    );
}
