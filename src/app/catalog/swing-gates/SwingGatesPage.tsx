'use client';

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    Calendar,
    Check,
    ClipboardCheck,
    CreditCard,
    Crown,
    DoorOpen,
    Factory,
    Fence,
    Hammer,
    KeyRound,
    Layers,
    ShieldCheck,
    Wrench,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Section} from '@/components/ui/section';
import {Container} from '@/components/ui/container';
import {Project, SplitPortfolio} from '@/components/features/split-portfolio';
import ProductFeaturesSection from '@/components/features/product-features-section';
import ProcessMap, {Step} from '@/components/features/process-map';
import {useFeedbackModal} from '@/contexts/FeedbackModalContext';

export default function SwingGatesPage() {
    const {openModal} = useFeedbackModal();

    const gateCategories = [
        {
            id: 'garage-sandwich',
            title: 'Гаражные распашные из сэндвич-панелей',
            description: 'Теплые распашные ворота из сэндвич-панелей — когда нет возможности установить секционные ворота.',
            icon: Layers,
            features: [
                'Толщина панелей 40-45 мм',
                'Отличная теплоизоляция',
                'Защита от промерзания по контуру',
                'Полная герметичность проема',
            ],
            suitableFor: 'Идеально для отапливаемых или пристроенных к дому гаражей, где важно сохранять температуру.',
        },
        {
            id: 'wrought-iron',
            title: 'Кованые ворота',
            description: 'Классические кованые элементы и эксклюзивные эскизы для представительского входа.',
            icon: Hammer,
            features: [
                'Эксклюзивный ручной труд',
                'Индивидуальные эскизы под заказ',
                'Многослойная обработка антикоррозийным грунтом',
                'Повышенная прочность и долговечность',
            ],
            suitableFor: 'Для статусных загородных домов, где ворота являются важным элементом ландшафтного дизайна.',
        },
        {
            id: 'ads-400',
            title: 'Ворота из сэндвич-панелей ADS 400',
            description: 'Прочное полотно из сэндвич-панелей 45 мм с подбором цвета под фасад здания.',
            icon: DoorOpen,
            features: [
                'Усиленный алюминиевый профиль (абсолютно не ржавеет)',
                'Скрытый крепеж для защиты от взлома',
                'Высокая ремонтопригодность (замена одной панели без разбора ворот)',
                'Более 20 вариантов заполнения',
            ],
            suitableFor: 'Для тех, кто ищет премиальное качество на десятилетия без необходимости регулярного ухода и подкрашивания.',
        },
        {
            id: 'profiled-sheet',
            title: 'Ворота, заполненные профильным листом',
            description: 'Бюджетное и надежное заполнение профнастилом любых расцветок.',
            icon: Fence,
            features: [
                'Легкий вес конструкции (минимальная нагрузка на столбы и автоматику)',
                'Самая доступная и бюджетная стоимость',
                'Качественное полимерное покрытие (не выгорает)',
                'Быстрый и простой монтаж',
            ],
            suitableFor: 'Самый практичный, надежный и экономный вариант для дачи, загородного участка или частного дома.',
        },
        {
            id: 'exclusive',
            title: 'Эксклюзивные ворота',
            description: 'Индивидуальные решения по эскизам заказчика — от компоновки до фурнитуры.',
            icon: Crown,
            features: [
                'Комбинация современных материалов (дерево, жалюзи, лазерная резка)',
                'Нестандартная геометрия и размеры створок',
                'Использование скрытых петель',
                'Премиальная европейская фурнитура',
            ],
            suitableFor: 'Для сложных архитектурных проектов и уникального экстерьера.',
        },
        {
            id: 'wicket',
            title: 'С калиткой',
            description: 'Отдельные или встроенные калитки с механическим или электрическим замком, управление от домофона или пульта.',
            icon: KeyRound,
            features: [
                'Значительная экономия ресурса автоматики основных ворот',
                'Возможность интеграции электрозащелки под домофон',
                'Комплектуется надежным врезным замком и доводчиком',
                'Два варианта: встроенная в створку или отдельно стоящая',
            ],
            suitableFor: 'Для ежедневного комфортного доступа на территорию без необходимости открывать ворота целиком.',
        },
    ];

    const openGateModal = () =>
        openModal({
            scope: 'gate',
            gateInfo: {
                gateType: 'Распашные ворота',
            },
        });

    const [selectedCategory, setSelectedCategory] = useState<(typeof gateCategories)[number] | null>(null);
    const [isDetailClosing, setIsDetailClosing] = useState(false);
    const [isDetailMounted, setIsDetailMounted] = useState(false);

    const handleDetailClose = useCallback(() => {
        if (isDetailClosing) return;
        setIsDetailClosing(true);
        setIsDetailMounted(false);
        setTimeout(() => {
            setSelectedCategory(null);
            setIsDetailClosing(false);
        }, 300);
    }, [isDetailClosing]);

    const openCategoryLeadForm = (category: (typeof gateCategories)[number]) => {
        handleDetailClose();
        setTimeout(() => {
            openModal({
                scope: 'gate',
                gateInfo: {
                    gateType: `Распашные ворота — ${category.title}`,
                },
                title: category.title,
            });
        }, 300);
    };

    // Handle escape key to close detail modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedCategory && !isDetailClosing) {
                handleDetailClose();
            }
        };

        if (selectedCategory) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [selectedCategory, isDetailClosing, handleDetailClose]);

    // Trigger enter animation after mount
    useEffect(() => {
        if (selectedCategory) {
            const timeout = setTimeout(() => {
                setIsDetailMounted(true);
            }, 10);
            return () => clearTimeout(timeout);
        }
    }, [selectedCategory]);

    const swingFeaturesCards = [
        {
            id: 'construction-advantages',
            title: 'Простота и надежность конструкции',
            description: 'Распашные ворота отличаются простотой конструкции и высокой надежностью. Никаких ограничений по высоте проема — створки открываются в любую сторону.',
            icon: ShieldCheck,
            bullets: [
                {text: 'Простая конструкция без сложных направляющих и балансировочных пружин'},
                {text: 'Отсутствие ограничений по высоте проема'},
                {text: 'Возможность автоматизации стандартными приводами Nice и Alutech'},
            ],
        },
        {
            id: 'custom-production',
            title: 'Производство без посредников',
            description: 'Мы сами делаем ворота, поэтому вы можете заказать абсолютно любые варианты заполнения и устройства — и обращаетесь напрямую к производителю, что выходит дешевле.',
            icon: Factory,
            bullets: [
                {text: 'Бюджетная стоимость при фирменном качестве'},
                {text: 'Огромный выбор вариантов, отличающихся сложностью и стоимостью'},
                {text: 'Ворота подбираются индивидуально под дизайн вашего дома'},
            ],
        },
    ];

    const portfolioItems = [
        {
            location: 'д. Ждановичи',
            series: 'Сэндвич-панель',
            color: 'Антрацит',
            automation: 'Nice для распашных ворот',
            dimensions: '4000 x 2000 мм',
            timeline: '1 день'
        },
        {
            location: 'Минск, Уручье',
            series: 'Кованые',
            color: 'RAL 9016 Белый',
            automation: 'Alutech AM-5000',
            dimensions: '3500 x 2000 мм',
            timeline: '1 день'
        },
        {
            location: 'Минский р-н, Смолевичи',
            series: 'Профлист',
            color: 'Профнастил',
            automation: 'Ручное управление',
            dimensions: '4500 x 2200 мм',
            timeline: '2 дня'
        },
    ];

    const swingProjects: Project[] = portfolioItems.map((item, index) => ({
        id: index + 1,
        title: `Распашные ворота ${item.series}`,
        location: item.location,
        material: `Серия ${item.series}, цвет ${item.color}`,
        automation: item.automation,
        installationTime: item.timeline,
        priceRange: 'от 2000 BYN',
        description: `Распашные ворота серии ${item.series} в цвете ${item.color}. Размеры: ${item.dimensions}. Профессиональная установка с гарантией.`,
        image: '/main/webp/swing.webp',
    }));

    const processSteps: Step[] = [
        {
            icon: ClipboardCheck,
            time: '1-2 дня',
            title: 'Замеры',
            description: 'Выезд специалиста для точных измерений проема и консультации по выбору оптимального варианта ворот',
        },
        {
            icon: Wrench,
            time: '5-10 дней',
            title: 'Изготовление',
            description: 'Производство ворот на собственном производстве по индивидуальным размерам и эскизам',
        },
        {
            icon: Calendar,
            time: '1 день',
            title: 'Установка',
            description: 'Профессиональный монтаж бригадой с опытом установки ворот более 20 лет',
        },
        {
            icon: CreditCard,
            time: 'По факту',
            title: 'Оплата',
            description: 'Оплата после выполнения работ и проверки работоспособности ворот',
        },
    ];

    const priceLists = [
        {
            id: 'garage-gates',
            title: 'Гаражные ворота',
            size: '92 kb',
            href: 'https://megador.by/resource/site/price/gv.xlsx',
        },
        {
            id: 'automation',
            title: 'Автоматика',
            size: '4 343 kb',
            href: 'https://megador.by/resource/site/price/automatic.xls',
        },
        {
            id: 'sliding-components',
            title: 'Комплектующие для откатных ворот',
            size: '4 583 kb',
            href: 'https://megador.by/resource/site/price/complet.xls',
        },
    ];

    const trustItems = [
        'Собственное производство',
        'Опыт в изготовлении и монтаже ворот — более 20 лет',
        'Квалифицированные работники',
        'Гарантия на все работы',
        'Обслуживание ворот наших клиентов на особых условиях',
    ];

    const renderCategoryContent = (category: (typeof gateCategories)[number]) => {
        const Icon = category.icon;
        return (
            <>
                <div className="flex items-center gap-4 mb-5">
                    <div
                        className="w-12 h-12 rounded-xl bg-[#F8F9FA] flex items-center justify-center flex-shrink-0 text-[#2F3E46]">
                        <Icon className="w-6 h-6"/>
                    </div>
                    <h3 className="text-xl font-bold text-[#2F3E46] leading-snug">
                        {category.title}
                    </h3>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    {category.description}
                </p>

                <div className="mb-5">
                    <h4 className="text-sm font-bold text-[#2F3E46] mb-2">Технические характеристики</h4>
                    <ul className="space-y-2">
                        {category.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-[#E65F2B] flex-shrink-0 mt-0.5"/>
                                <span className="text-sm text-gray-600 leading-relaxed">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-[#FFF5F0] border border-orange-100 rounded-xl p-4 mb-6">
                    <h4 className="text-sm font-bold text-[#2F3E46] mb-1">Для кого</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{category.suitableFor}</p>
                </div>

                <Button
                    size="lg"
                    className="w-full cta-button-primary"
                    onClick={() => openCategoryLeadForm(category)}
                >
                    Рассчитать стоимость
                    <ArrowRight className="ml-2 w-5 h-5"/>
                </Button>
            </>
        );
    };

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
                                 src="/main/webp/swing.webp"
                                 className="absolute inset-0 object-cover opacity-60 max-lg:block hidden z-0 pointer-events-none sm:rounded-2xl"
                                 style={{width: '100%', height: '100%'}}
                                 alt="Swing Gates Mobile Backdrop"
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
                                    <span className="text-white lg:text-slate-900">Распашные ворота</span>
                                </nav>

                                {/* Title */}
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white lg:text-slate-900 mb-4 leading-tight">
                                    Распашные ворота под ключ в Минске: изготовление, продажа и монтаж
                                </h1>

                                {/* Subtitle */}
                                <p className="text-lg text-gray-200 lg:text-gray-600 mb-6 leading-relaxed">
                                    Простая конструкция, высокая надежность, никаких ограничений по высоте проема,
                                    бюджетная стоимость и возможность автоматизации. Изготовление по индивидуальным
                                    размерам с официальной гарантией от производителя.
                                </p>

                                {/* CTA Button */}
                                <Button
                                    size="lg"
                                    className="w-fit cta-button-primary"
                                    onClick={openGateModal}
                                >
                                    Рассчитать стоимость по моим размерам
                                    <ArrowRight className="ml-2 w-5 h-5"/>
                                </Button>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap gap-6 mt-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Прямые цены от производителя без посредников</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Возможность автоматизации</span>
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
                                     src="/main/webp/swing.webp"
                                     alt="Распашные ворота"
                                     className="w-full h-full object-cover rounded-2xl shadow-xl"
                                />
                            </div>

                        </div>
                    </div>
                </Container>
            </Section>

            {/* Product Categories Grid */}
            <Section background="muted">
                <Container background='muted'>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4">
                            Виды распашных ворот
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Мы сами делаем ворота, поэтому вы можете заказать абсолютно любые варианты заполнения и
                            устройства
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gateCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl bg-[#F8F9FA] flex items-center justify-center mb-4 flex-shrink-0 text-[#2F3E46]">
                                        <Icon className="w-6 h-6"/>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#2F3E46] mb-2">
                                        {category.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-grow">
                                        {category.description}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-fit text-[#E65F2B] border-[#E65F2B] hover:bg-orange-50"
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        Подробнее
                                        <ArrowRight className="ml-2 w-4 h-4"/>
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </Container>
            </Section>

            {/* Product Features Section */}
            <ProductFeaturesSection
                backgroundColor="white"
                sectionTitle="Почему распашные ворота заказывают у нас"
                description="Все просто: собственное производство и более 20 лет опыта"
                cards={swingFeaturesCards}
            />

            {/* Process Timeline */}
            <Section background="muted" className="py-8 lg:py-20">
                <Container background="muted">
                    <div className="text-center max-w-3xl mx-auto px-4 mt-6 mb-12 lg:mt-16 lg:mb-12">
                        <h2
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4"
                            style={{fontFamily: 'var(--font-montserrat)'}}
                        >
                            ЭТАПЫ ОТ ЗВОНКА ДО РЕЗУЛЬТАТА
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Простой и прозрачный процесс от замера до установки
                        </p>
                    </div>

                    <ProcessMap steps={processSteps}/>
                </Container>
            </Section>

            {/* Trust Section */}

            {/* Portfolio Showcase */}
            <SplitPortfolio background='white' projects={swingProjects}/>

            {/* Price Lists / Downloads */}
            {/*<Section background="muted">*/}
            {/*    <Container>*/}
            {/*        <div className="text-center mb-10">*/}
            {/*            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4">*/}
            {/*                Скачать прайс*/}
            {/*            </h2>*/}
            {/*            <p className="text-gray-600 max-w-2xl mx-auto">*/}
            {/*                Актуальные прайс-листы на продукцию и комплектующие*/}
            {/*            </p>*/}
            {/*        </div>*/}

            {/*        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">*/}
            {/*            {priceLists.map((list) => (*/}
            {/*                <a*/}
            {/*                    key={list.id}*/}
            {/*                    href={list.href}*/}
            {/*                    target="_blank"*/}
            {/*                    rel="noopener noreferrer"*/}
            {/*                    className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-[#E65F2B]/40 transition-all"*/}
            {/*                >*/}
            {/*                    <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] flex items-center justify-center flex-shrink-0 text-[#2F3E46] group-hover:bg-[#FFF5F0] group-hover:text-[#E65F2B] transition-colors">*/}
            {/*                        <FileSpreadsheet className="w-6 h-6"/>*/}
            {/*                    </div>*/}
            {/*                    <div className="flex-1 min-w-0">*/}
            {/*                        <h3 className="text-base font-bold text-[#2F3E46] truncate">{list.title}</h3>*/}
            {/*                        <p className="text-xs text-gray-500">размер файла: {list.size}</p>*/}
            {/*                    </div>*/}
            {/*                    <Download className="w-5 h-5 text-gray-400 group-hover:text-[#E65F2B] transition-colors flex-shrink-0"/>*/}
            {/*                </a>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </Container>*/}
            {/*</Section>*/}

            {/* CTA Section */}
            <Section background="muted">
                <Container background='muted'>
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-6">
                            Готовы заказать распашные ворота?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Оставьте заявку на бесплатный замер и получите точный расчет стоимости в течение 24 часов
                        </p>
                        <Button
                            size="lg"
                            className="cta-button-primary"
                            onClick={openGateModal}
                        >
                            Заказать бесплатный замер
                            <ArrowRight className="ml-2 w-5 h-5"/>
                        </Button>
                    </div>
                </Container>
            </Section>

            {/* Category Detail Modal */}
            {selectedCategory && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isDetailClosing ? 'opacity-0' : 'opacity-100'}`}
                    onClick={handleDetailClose}
                >
                    {/* Desktop Modal */}
                    <div
                        className={`hidden md:flex flex-col rounded-2xl shadow-2xl max-w-xl w-full mx-4 max-h-[90vh] overflow-hidden bg-white transition-all duration-300 ease-out ${isDetailClosing || !isDetailMounted ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 pb-0">
                            <h2 className="text-xl font-bold text-[#2F3E46]">Виды распашных ворот</h2>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {renderCategoryContent(selectedCategory)}
                        </div>
                    </div>

                    {/* Mobile Bottom Sheet */}
                    <div
                        className={`md:hidden fixed bottom-0 inset-x-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto p-5 z-50 transition-transform duration-300 ease-in-out ${isDetailClosing || !isDetailMounted ? 'translate-y-full' : 'translate-y-0'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drag Handle */}
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full"/>
                        </div>

                        {renderCategoryContent(selectedCategory)}
                    </div>
                </div>
            )}
        </>
    );
}
