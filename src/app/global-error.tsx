'use client';

import Link from 'next/link';
import {Phone} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {BarrierIllustration} from '@/components/features/barrier-illustration';

interface GlobalErrorProps {
    error: Error & {digest?: string};
    reset: () => void;
}

/**
 * Root-level error boundary — replaces the root layout when it crashes,
 * so it must render its own <html>/<body> and cannot rely on layout providers.
 */
export default function GlobalError({reset}: GlobalErrorProps) {
    return (
        <html lang="ru">
            <body className="min-h-screen bg-[#F8F9FA] text-[#2F3E46] antialiased">
                <main className="min-h-screen flex items-center px-4 py-16">
                    <div className="max-w-3xl mx-auto w-full text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-[#FFF5F0] border border-[#E65F2B]/30">
                            <span className="w-2 h-2 rounded-full bg-[#E65F2B] animate-pulse"/>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#E65F2B]">Временный сбой</span>
                        </div>

                        <div className="max-w-xl mx-auto mb-8">
                            <BarrierIllustration
                                code="500"
                                mode="server-error"
                                onActivate={() => window.location.reload()}
                                className="w-full h-auto"
                            />
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4">
                            Проезд временно закрыт на обслуживание
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto mb-8">
                            Произошла техническая ошибка при загрузке данных. Попробуйте обновить страницу
                            или свяжитесь с нами напрямую по телефону.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                            <Button size="lg" className="cta-button-primary w-full sm:w-auto" onClick={reset}>
                                Попробовать снова
                            </Button>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 border-2 border-[#2F3E46] text-[#2F3E46] hover:bg-white px-8 py-4 text-lg w-full sm:w-auto"
                            >
                                На главную
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2">
                            <a href="tel:+375296237563" className="inline-flex items-center gap-2 text-sm font-medium text-[#2F3E46] hover:text-[#E65F2B] transition-colors">
                                <Phone className="w-4 h-4"/>
                                +375 (29) 623 75 63
                            </a>
                            <a href="tel:+375333026676" className="inline-flex items-center gap-2 text-sm font-medium text-[#2F3E46] hover:text-[#E65F2B] transition-colors">
                                <Phone className="w-4 h-4"/>
                                +375 (33) 302 66 76
                            </a>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    );
}
