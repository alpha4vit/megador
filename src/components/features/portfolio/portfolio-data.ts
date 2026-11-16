// Portfolio types now live in the centralized data layer (@/data/types).
// Re-exported here for backward compatibility with existing imports.
export type {ProjectSection, PortfolioProject, Spec as PortfolioSpec} from '@/data/types';
export {PROJECT_SECTION_LABELS} from '@/data/types';
import type {ProjectSection} from '@/data/types';

export const PORTFOLIO_FILTERS: { id: ProjectSection | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'Все работы' },
    { id: 'swing', label: 'Распашные' },
    { id: 'sliding', label: 'Откатные' },
    { id: 'sectional', label: 'Секционные' },
    { id: 'roller-gates', label: 'Роллетные ворота' },
    { id: 'barriers', label: 'Шлагбаумы' },
];
