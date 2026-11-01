import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'muted' | 'gray';
  id?: string;
}

export const Section = ({ children, className = '', background = 'white', id }: SectionProps) => {
  const backgrounds = {
    white: 'bg-white',
    muted: 'bg-[#F8F9FA]',
    gray: 'bg-zinc-50 border-y border-gray-100/50',
  };

  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${backgrounds[background]} ${className}`}>
      {children}
    </section>
  );
};
