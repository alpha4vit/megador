import Link from 'next/link';
import {BarrierIllustration} from '@/components/features/barrier-illustration';
import {Container} from '@/components/ui/container';
import {Section} from '@/components/ui/section';

export default function NotFound() {
    return (
        <Section background="muted" className="min-h-[80vh] flex items-center">
            <Container background="muted">
                <div className="max-w-3xl mx-auto w-full text-center">
                    <div className="max-w-xl mx-auto mb-8">
                        <BarrierIllustration code="404" mode="not-found" className="w-full h-auto"/>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4"
                        style={{fontFamily: 'var(--font-montserrat)'}}>
                        Проезд не существует
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto mb-8">
                        Похоже, этой страницы нет на нашей карте. Возможно, ссылка устарела
                        или в адресе опечатка.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 bg-[#E65F2B] text-white hover:bg-[#D45425] px-8 py-4 text-lg w-full sm:w-auto"
                        >
                            На главную
                        </Link>
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 border-2 border-[#2F3E46] text-[#2F3E46] hover:bg-[#F8F9FA] px-8 py-4 text-lg w-full sm:w-auto"
                        >
                            Смотреть портфолио
                        </Link>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
