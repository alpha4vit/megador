'use client';

export default function InstallationMethods() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Ручное управление */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between">
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#E65F2B]/10 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#E65F2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Накладной монтаж (Классический)</h3>
                        <p className="text-sm text-gray-500">Для небольших проемов</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-start gap-2.5 py-1 text-sm text-[#2F3E46]">
                        <span className="w-1.5 h-0.5 rounded-full bg-[#E65F2B] mt-2 flex-shrink-0" />
                        <p className="leading-relaxed">
                            Идеально подходит для уже готовых объектов
                        </p>
                    </div>
                    <div className="flex items-start gap-2.5 py-1 text-sm text-[#2F3E46]">
                        <span className="w-1.5 h-0.5 rounded-full bg-[#E65F2B] mt-2 flex-shrink-0" />
                        <p className="leading-relaxed">
                            Не уменьшает световой проем окна
                        </p>
                    </div>
                    <div className="flex items-start gap-2.5 py-1 text-sm text-[#2F3E46]">
                        <span className="w-1.5 h-0.5 rounded-full bg-[#E65F2B] mt-2 flex-shrink-0" />
                        <p className="leading-relaxed">
                            Простая и быстрая установка без изменения конструкции проема
                        </p>
                    </div>
                </div>
            </div>

            {/* Автоматическое управление */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between">
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#2F3E46]/10 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#2F3E46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Встроенный монтаж (Скрытый)</h3>
                        <p className="text-sm text-gray-500">Эстетика минимализма</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-start gap-2.5 py-1 text-sm text-[#2F3E46]">
                        <span className="w-1.5 h-0.5 rounded-full bg-[#E65F2B] mt-2 flex-shrink-0" />
                        <p className="leading-relaxed">
                            Максимальная защита от взлома (невозможно поддеть направляющие)
                        </p>
                    </div>
                    <div className="flex items-start gap-2.5 py-1 text-sm text-[#2F3E46]">
                        <span className="w-1.5 h-0.5 rounded-full bg-[#E65F2B] mt-2 flex-shrink-0" />
                        <p className="leading-relaxed">
                            Роллета выглядит как единое целое с фасадом
                        </p>
                    </div>
                    <div className="flex items-start gap-2.5 py-1 text-sm text-[#2F3E46]">
                        <span className="w-1.5 h-0.5 rounded-full bg-[#E65F2B] mt-2 flex-shrink-0" />
                        <p className="leading-relaxed">
                            Короб может быть полностью скрыт в нише над окном
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
