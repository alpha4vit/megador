'use client';

import Link from 'next/link';
import {
    ArrowRight, Check, EyeOff, Home, Ruler, ShieldCheck, Smartphone, Sun,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Section} from '@/components/ui/section';
import {Container} from '@/components/ui/container';
import ProductFeaturesSection from '@/components/features/product-features-section';
import {SplitPortfolio, type Project} from '@/components/features/split-portfolio';
import {useFeedbackModal} from '@/contexts/FeedbackModalContext';
import {useSiteData} from '@/contexts/SiteDataContext';
import {DataLoading} from '@/components/features/data-loading';
import {formatPrice, projectTitle, type CatalogProduct} from '@/data/types';

const HERO_IMAGE = '/main/webp/main-preview.webp';

const benefitCards = [
    {
        icon: Sun,
        title: 'Сохранение прохлады',
        description: 'Специальные ткани отражают солнечное излучение и снижают нагрев помещения и зоны отдыха.',
    },
    {
        icon: ShieldCheck,
        title: 'Защита от солнечного света',
        description: 'Возможность 100% затемнения — блокировка света, UV-лучей и посторонних взглядов даже в яркий полдень.',
    },
    {
        icon: EyeOff,
        title: 'Обеспечение приватности',
        description: 'Плотные полотна скрывают обзор с улицы, создавая комфортное личное пространство на террасе или в беседке.',
    },
    {
        icon: Home,
        title: 'Для дома, террасы и беседки',
        description: 'Решения для частных домов, летних кухонь, ресторанов и коммерческих зон — от небольших окон до больших проёмов.',
    },
];

const zoneChips = ['Частный дом', 'Терраса', 'Беседка', 'Зимний сад', 'Летняя кухня', 'Ресторан и кафе'];

const seriesDetails: Record<string, string[]> = {
    zip: [
        'ZIP-замок фиксирует полотно в боковых направляющих по всей длине',
        'Ветровая нагрузка до 28,3 м/с — для открытых участков',
        'Полная защита от пыли, осадков и насекомых',
        '100% затемнение для зон у окна и рабочих мест',
    ],
    cable: [
        'Нержавеющие тросы Ø3 мм — пониженная ветровая нагрузка',
        'Монтаж на угловые окна и сложные конфигурации проёмов',
        'Стыковка полотен на соседних стеклопакетах под углом 90°',
        'Минимум конструктивных элементов — максимум света',
    ],
};

type ComparisonTone = 'strong' | 'neutral' | 'limit';

interface ComparisonValue {
    text: string;
    tone: ComparisonTone;
}

interface ComparisonRow {
    characteristic: string;
    zip: ComparisonValue;
    cable: ComparisonValue;
}

const comparisonRows: ComparisonRow[] = [
    {
        characteristic: 'Главная фишка',
        zip: {text: 'Максимальная герметичность — полотно впаяно в шину по принципу «молнии»', tone: 'strong'},
        cable: {text: 'Невесомый минимализм — тонкие тросы из нержавейки Ø3 мм без боковых стоек', tone: 'strong'},
    },
    {
        characteristic: 'Ветровая устойчивость',
        zip: {text: 'Штормовая (до 28,3 м/с) — полотно не хлопает и не выдувается из направляющих', tone: 'strong'},
        cable: {text: 'Для тихих зон — оптимально для фасадов, защищённых от сильных порывов ветра', tone: 'neutral'},
    },
    {
        characteristic: 'Защита от насекомых и пыли',
        zip: {text: '100% (функция москитной сетки) — полное прилегание без боковых зазоров', tone: 'strong'},
        cable: {text: 'Нет (только защита от солнца) — по бокам остаются технологические зазоры', tone: 'limit'},
    },
    {
        characteristic: 'Полное затемнение (Blackout)',
        zip: {text: 'Да, до 100% темноты — с тканью Soltis B92 / Lumex 0% свет не проникает по краям', tone: 'strong'},
        cable: {text: 'Эффект мягкой тени — возможны боковые засветы по периметру окна', tone: 'limit'},
    },
    {
        characteristic: 'Угловые окна и стыки 90°',
        zip: {text: 'Только прямые проёмы (требуется монтаж боковых шин 33×43 мм)', tone: 'limit'},
        cable: {text: 'Идеально для углов 90° — ставится на стыки панорамных стеклопакетов без стоек', tone: 'strong'},
    },
    {
        characteristic: 'Где лучше применять',
        zip: {text: 'Открытые террасы, перголы, ветреные участки, спальни и домашние кинотеатры', tone: 'neutral'},
        cable: {text: 'Угловое панорамное остекление коттеджей, защищённые от ветра балконы и веранды', tone: 'neutral'},
    },
    {
        characteristic: 'Ориентир по бюджету',
        zip: {text: 'Максимум возможностей и защиты', tone: 'neutral'},
        cable: {text: 'Выгоднее при остеклении больших фасадов', tone: 'neutral'},
    },
];

const sharedSpecs = [
    {label: 'Короб (кассета)', value: '110 / 125 мм'},
    {label: 'Макс. площадь', value: 'до 16,8 м² (ширина до 4,5 м)'},
    {label: 'Ткани', value: 'Serge Ferrari Soltis и Lumex'},
];

const mobileMatrixRows: {label: string; zip: {text: string; strong: boolean}; cable: {text: string; strong: boolean}}[] = [
    {label: 'Фиксация', zip: {text: 'Боковые шины (замок)', strong: true}, cable: {text: 'Тросы Ø3 мм', strong: false}},
    {label: 'Ветер', zip: {text: 'До 28,3 м/с (шторм)', strong: true}, cable: {text: 'Слабый / умеренный', strong: false}},
    {label: 'Москитная сетка', zip: {text: 'Да, 100% защита', strong: true}, cable: {text: 'Нет (есть зазоры)', strong: false}},
    {label: 'Темнота (Blackout)', zip: {text: 'До 100%', strong: true}, cable: {text: 'Мягкая тень', strong: false}},
    {label: 'Углы 90°', zip: {text: 'Только прямые окна', strong: false}, cable: {text: 'Подходит для углов', strong: true}},
];

function MobileMatrixCell({value}: {value: {text: string; strong: boolean}}) {
    return (
        <span className={`inline-flex items-start gap-1 text-xs leading-snug ${value.strong ? 'font-semibold text-[#2F3E46]' : 'text-slate-500'}`}>
            {value.strong && <Check className="w-3.5 h-3.5 text-emerald-600 mt-px flex-shrink-0" strokeWidth={2.5}/>}
            <span>{value.text}</span>
        </span>
    );
}

function ComparisonValueCell({value}: {value: ComparisonValue}) {
    return (
        <span className="inline-flex items-start gap-1">
            {value.tone === 'strong' && (
                <Check className="w-4 h-4 text-emerald-600 mr-0.5 mt-0.5 flex-shrink-0" strokeWidth={2.5}/>
            )}
            <span className={value.tone === 'strong' ? 'font-semibold text-[#2F3E46]' : value.tone === 'limit' ? 'text-gray-500' : 'text-gray-600'}>
                {value.text}
            </span>
        </span>
    );
}

const fabricControlCards = [
    {
        id: 'fabrics',
        title: 'Ткани и уход',
        description: 'Широкий выбор полотен Soltis и Lumex с сертификатами европейского качества.',
        icon: Ruler,
        bullets: [
            {text: 'Устойчивость к УФ-излучению — ткань не выгорает годами'},
            {text: 'Варианты прозрачности: полная блокировка света, полупрозрачные и декоративные'},
            {text: 'Простота ухода — достаточно протирки влажной губкой'},
        ],
    },
    {
        id: 'control',
        title: 'Умное управление',
        description: 'Автоматика ALUTECH Smart и классические приводы для любого сценария.',
        icon: Smartphone,
        bullets: [
            {text: 'ALUTECH Smart — управление с телефона, голосовые сценарии и интеграция с умным домом'},
            {text: 'Автоматический привод — пульт ДУ и настенный выключатель в комплекте'},
            {text: 'Плавный ход и бесшумная работа даже на широких полотнах'},
        ],
    },
];

function SeriesCard({product, onCta}: {product: CatalogProduct; onCta: () => void}) {
    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-[#2F3E46] leading-snug">{product.title}</h3>
                    {product.badgeText && (
                        <span className={`px-3 py-1 ${product.badgeStyle} text-white text-xs font-semibold rounded-full whitespace-nowrap`}>
                            {product.badgeText}
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-500">{product.subtitle}</p>
            </div>
            <div className="p-5 flex-1">
                {product.description && <p className="text-sm text-gray-600 leading-relaxed mb-4">{product.description}</p>}
                <ul className="space-y-2">
                    {(seriesDetails[product.tab] ?? []).map((text) => (
                        <li key={text} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#E65F2B] mt-0.5 flex-shrink-0"/>
                            <span className="text-sm text-gray-600">{text}</span>
                        </li>
                    ))}
                    {product.specs.length > 0 && (
                        <li className="pt-2 mt-2 border-t border-gray-100 space-y-1.5">
                            {product.specs.map((s, i) => (
                                <div key={i} className="flex justify-between gap-3 text-sm">
                                    <span className="text-gray-500">{s.label}</span>
                                    <span className="font-medium text-[#2F3E46] text-right">{s.value}</span>
                                </div>
                            ))}
                        </li>
                    )}
                </ul>
            </div>
            <div className="p-5 bg-[#F8F9FA]">
                <div className="text-xl font-bold text-[#E65F2B] mb-3">{formatPrice(product)}</div>
                <Button size="lg" className="w-full cta-button-primary" onClick={onCta}>
                    Заказать замер
                </Button>
            </div>
        </div>
    );
}

export default function SolntsezashchitaPage() {
    const {openModal} = useFeedbackModal();
    const {getProducts, getProjects, hydrated} = useSiteData();

    const products = getProducts('sun-protection');
    const orderedProducts = ['zip', 'cable']
        .map((tab) => products.find((p) => p.tab === tab))
        .filter((p): p is CatalogProduct => Boolean(p));
    // Include any extra tabs the admin may add later, after the two canonical series.
    const extraProducts = products.filter((p) => !['zip', 'cable'].includes(p.tab));
    const allSeries = [...orderedProducts, ...extraProducts];

    const portfolioItems = getProjects('sun-protection', true);
    const sunProjects: Project[] = portfolioItems.map((item, index) => ({
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

    const seriesCta = (product: CatalogProduct) =>
        openModal({
            scope: 'consultation',
            title: `Подобрать ${product.title}`,
            subtitle: 'Наш специалист поможет подобрать систему под ваши проёмы и зону установки',
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
                                alt="Внешняя солнцезащита Mobile Backdrop"
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
                                    <span className="text-white lg:text-slate-900">Внешняя солнцезащита</span>
                                </nav>

                                {/* Title */}
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white lg:text-slate-900 mb-6 leading-tight">
                                    Внешняя солнцезащита
                                </h1>

                                {/* Subtitle */}
                                <p className="text-lg text-gray-200 lg:text-gray-600 mb-8 leading-relaxed">
                                    Системы внешней солнцезащиты изготавливаем по индивидуальным размерам — ширина до 4,5 м,
                                    площадь до 16,8 м². Контроль качества на производстве. Бесплатный выезд на замер.
                                </p>

                                {/* CTA Button */}
                                <Button
                                    size="lg"
                                    className="w-fit cta-button-primary"
                                    onClick={() => openModal({
                                        scope: 'consultation',
                                        title: 'Подобрать солнцезащиту',
                                        subtitle: 'Наш специалист поможет подобрать систему под ваши проёмы и зону установки',
                                    })}
                                >
                                    Подобрать систему солнцезащиты
                                    <ArrowRight className="ml-2 w-5 h-5"/>
                                </Button>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap gap-6 mt-8">
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Изготовление по индивидуальным размерам</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Контроль качества на производстве</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Бесплатный выезд на замер</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Product Image */}
                            <div className="hidden lg:block w-full h-full max-h-[500px] relative overflow-hidden rounded-2xl z-20">
                                <img draggable={false}
                                    src={HERO_IMAGE}
                                    alt="Внешняя солнцезащита"
                                    className="absolute inset-0 w-full h-full object-cover object-center"
                                />
                            </div>

                        </div>
                    </div>
                </Container>
            </Section>

            {/* Benefits */}
            <Section background="white" className="py-10 lg:py-16">
                <Container>
                    <div className="text-center max-w-3xl mx-auto px-4 mb-8 lg:mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4"
                            style={{fontFamily: 'var(--font-montserrat)'}}>
                            Зачем нужна внешняя солнцезащита
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Солнце нагревает фасады и остекление, выжигает мебель и мешает пользоваться террасой в жару.
                            Внешние системы решают это до того, как тепло попадёт внутрь.
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

            {/* Series & Comparison */}
            <Section background="muted">
                <Container background="muted">
                    <div className="text-center max-w-3xl mx-auto px-4 mt-6 mb-8 lg:mt-12 lg:mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4"
                            style={{fontFamily: 'var(--font-montserrat)'}}>
                            Серии и сравнение
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Две базовые системы — подбираем под тип проёма, ветровую нагрузку и желаемую эстетику
                        </p>
                    </div>

                    {allSeries.length > 0 ? (
                        <div className={`grid grid-cols-1 gap-6 mb-12 ${allSeries.length > 2 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} lg:max-w-5xl lg:mx-auto`}>
                            {allSeries.map((product) => (
                                <SeriesCard key={product.id} product={product} onCta={() => seriesCta(product)}/>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 mb-12">
                            <p className="text-gray-500">Ассортимент серий скоро появится — оставьте заявку, и мы подберём решение.</p>
                            <Button size="lg" className="mt-6 cta-button-primary"
                                    onClick={() => openModal({scope: 'consultation'})}>
                                Получить консультацию
                                <ArrowRight className="ml-2 w-5 h-5"/>
                            </Button>
                        </div>
                    )}

                    {/* Comparison table — desktop */}
                    <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[680px] border-collapse">
                                <thead>
                                    <tr className="bg-[#F8F9FA] border-b-2 border-gray-200">
                                        <th className="text-left py-4 px-5 font-bold text-[#2F3E46] text-sm w-[28%]">Критерий</th>
                                        <th className="text-left py-4 px-5 font-bold text-[#2F3E46] text-sm">
                                            <span className="inline-flex items-center gap-2">
                                                ZIP-система
                                                <span className="px-2 py-0.5 bg-[#E65F2B] text-white text-[10px] font-semibold rounded-full">герметичность</span>
                                            </span>
                                        </th>
                                        <th className="text-left py-4 px-5 font-bold text-[#2F3E46] text-sm">
                                            <span className="inline-flex items-center gap-2">
                                                Тросовая система
                                                <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-semibold rounded-full">минимализм</span>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonRows.map((row, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 last:border-0 even:bg-gray-50/50 align-top">
                                            <td className="py-4 px-5 text-sm font-semibold text-[#2F3E46]">{row.characteristic}</td>
                                            <td className="py-4 px-5 text-sm"><ComparisonValueCell value={row.zip}/></td>
                                            <td className="py-4 px-5 text-sm"><ComparisonValueCell value={row.cable}/></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Shared specs — identical for both systems */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3.5 bg-[#F8F9FA] border-t border-gray-200">
                            <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Общее для обеих систем</span>
                            {sharedSpecs.map((s) => (
                                <span key={s.label} className="text-xs text-gray-600">
                                    <span className="font-medium text-[#2F3E46]">{s.label}:</span> {s.value}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Comparison — mobile compact matrix */}
                    <div className="md:hidden bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Column headers */}
                        <div className="grid grid-cols-2 border-b-2 border-gray-200 bg-[#F8F9FA]">
                            <div className="py-3 px-3 text-center text-xs font-bold text-[#2F3E46] border-r border-gray-200">ZIP-система</div>
                            <div className="py-3 px-3 text-center text-xs font-bold text-[#2F3E46]">Тросовая</div>
                        </div>
                        {mobileMatrixRows.map((row, idx) => (
                            <div key={row.label} className={idx > 0 ? 'border-t border-slate-100' : ''}>
                                <p className="pt-3 pb-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    {row.label}
                                </p>
                                <div className="grid grid-cols-2 pb-3">
                                    <div className="px-3 flex justify-center border-r border-slate-100">
                                        <MobileMatrixCell value={row.zip}/>
                                    </div>
                                    <div className="px-3 flex justify-center">
                                        <MobileMatrixCell value={row.cable}/>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Shared specs */}
                        <div className="border-t border-gray-200 bg-[#F8F9FA] px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Общее для обеих систем</p>
                            <div className="space-y-1">
                                {sharedSpecs.map((spec) => (
                                    <p key={spec.label} className="text-xs text-gray-600">
                                        <span className="font-medium text-[#2F3E46]">{spec.label}:</span> {spec.value}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Fabrics & Smart Control */}
            <ProductFeaturesSection
                backgroundColor="white"
                sectionTitle="Ткани и умное управление"
                description="Полотна европейского качества и автоматика под любой сценарий — от простого пульта до голосового управления"
                cards={fabricControlCards}
            />

            {/* Application Zones & Portfolio */}
            <Section background="muted">
                <Container background="muted">
                    <div className="text-center max-w-3xl mx-auto px-4 mt-6 mb-8 lg:mt-12 lg:mb-10">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4"
                            style={{fontFamily: 'var(--font-montserrat)'}}>
                            Где применяют внешнюю солнцезащиту
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            От частного дома до коммерческих объектов — системы адаптируются под любой проём
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2.5 mb-10">
                        {zoneChips.map((zone) => (
                            <span key={zone}
                                  className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-[#2F3E46] shadow-sm">
                                {zone}
                            </span>
                        ))}
                    </div>
                </Container>
            </Section>

            {sunProjects.length > 0 && <SplitPortfolio background="muted" projects={sunProjects}/>}

            {/* CTA */}
            <Section background="white">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4">
                            Рассчитаем солнцезащиту под ваши размеры
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                            Оставьте заявку на бесплатный замер — специалист приедет, снимет размеры и предложит
                            оптимальную систему с расчётом стоимости
                        </p>
                        <Button
                            size="lg"
                            className="cta-button-primary"
                            onClick={() => openModal({
                                scope: 'consultation',
                                title: 'Бесплатный замер солнцезащиты',
                                subtitle: 'Оставьте контакты — перезвоним и согласуем удобное время выезда',
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
