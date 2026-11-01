import { Hero } from "@/components/features/hero";
import { LeadQuiz } from "@/components/features/lead-quiz";
import { SplitPortfolio } from "@/components/features/split-portfolio";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Lead Quiz Section */}
      <Section background="muted" id="quiz-section">
        <Container background="muted">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4" style={{ fontFamily: 'var(--font-montserrat)' }}>
              Получите персональное предложение
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              Ответьте на 4 простых вопроса и мы подберем оптимальное решение для вашего объекта
            </p>
          </div>
          <LeadQuiz />
        </Container>
      </Section>

      {/* Split Portfolio Section */}
      <SplitPortfolio />

      {/* Features Section */}
      <Section background="muted">
        <Container background="muted">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4" style={{ fontFamily: 'var(--font-montserrat)' }}>
              Почему выбирают нас
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E65F2B] bg-opacity-10 flex items-center justify-center">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-[#2F3E46] mb-2">20+ лет</h3>
              <p className="text-gray-600">Опыта на рынке Беларуси</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E65F2B] bg-opacity-10 flex items-center justify-center">
                <span className="text-3xl">🏗️</span>
              </div>
              <h3 className="text-2xl font-bold text-[#2F3E46] mb-2">1000+</h3>
              <p className="text-gray-600">Установленных объектов</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E65F2B] bg-opacity-10 flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-[#2F3E46] mb-2">Гарантия</h3>
              <p className="text-gray-600">На все работы и материалы</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
