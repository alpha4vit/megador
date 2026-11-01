'use client';

export default function ControlTypesSection() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Ручное управление */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between">
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#E65F2B]/10 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#E65F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Ручное управление</h3>
                        <p className="text-sm text-gray-500">Для небольших проемов</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    Надежные механические системы. Экономичный и независимый от электричества вариант
                </p>
                <div className="space-y-3">
                    <div className="flex items-start gap-2.5 py-1 text-sm text-[#2F3E46]">
                        <span className="w-1.5 h-0.5 rounded-full bg-[#E65F2B] mt-2 flex-shrink-0" />
                        <p className="leading-relaxed">
                            <strong>Пружинно-инерционный механизм</strong> — самое популярное решение, роллета легко поднимается руками за счет внутренней пружины
                        </p>
                    </div>
                    <div className="flex items-start gap-2.5 py-1 text-sm text-[#2F3E46]">
                        <span className="w-1.5 h-0.5 rounded-full bg-[#E65F2B] mt-2 flex-shrink-0" />
                        <p className="leading-relaxed">
                            <strong>Воротковый привод (кардан)</strong> — плавное вращение ручки-воротка для полотен весом до 100 кг
                        </p>
                    </div>
                    <div className="flex items-start gap-2.5 py-1 text-sm text-[#2F3E46]">
                        <span className="w-1.5 h-0.5 rounded-full bg-[#E65F2B] mt-2 flex-shrink-0" />
                        <p className="leading-relaxed">
                            <strong>Ленточный / Шнуровой привод</strong> — классический вывод шнура внутрь помещения для легких оконных роллет
                        </p>
                    </div>
                </div>
            </div>

            {/* Автоматическое управление */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between">
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#2F3E46]/10 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#2F3E46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Автоматическое управление</h3>
                        <p className="text-sm text-gray-500">Максимальный комфорт</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    Внутривальный электродвигатель Alutech/Somfy. Подходит для тяжелых конструкций (до 200 кг) и высоких требований к удобству
                </p>
                <div className="space-y-3">
                    <div className="flex items-start gap-2.5 py-1 text-sm text-[#2F3E46]">
                        <span className="w-1.5 h-0.5 rounded-full bg-[#E65F2B] mt-2 flex-shrink-0" />
                        <p className="leading-relaxed">
                            <strong>Дистанционное управление</strong> — открытие и закрытие всех роллет в доме одновременно с одного многоканального пульта д/у
                        </p>
                    </div>
                    <div className="flex items-start gap-2.5 py-1 text-sm text-[#2F3E46]">
                        <span className="w-1.5 h-0.5 rounded-full bg-[#E65F2B] mt-2 flex-shrink-0" />
                        <p className="leading-relaxed">
                            <strong>Настенный выключатель</strong> — стационарная кнопка со встроенной автоматикой плавного хода полотна
                        </p>
                    </div>
                    <div className="flex items-start gap-2.5 py-1 text-sm text-[#2F3E46]">
                        <span className="w-1.5 h-0.5 rounded-full bg-[#E65F2B] mt-2 flex-shrink-0" />
                        <p className="leading-relaxed">
                            <strong>Интеллектуальные сценарии</strong> — интеграция с датчиками солнца, таймерами или системой «Умный дом»
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
