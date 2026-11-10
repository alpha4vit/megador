export type PortfolioGateType = 'SWING' | 'SLIDING' | 'SECTIONAL' | 'ROLLER' | 'BARRIER';

export interface PortfolioSpec {
    label: string;
    value: string;
}

export interface PortfolioProject {
    id: string;
    title: string;
    type: PortfolioGateType;
    typeLabel: string;
    location: string;
    description: string;
    specs: PortfolioSpec[];
    cost: string;
    images: string[];
    coordinates: [number, number]; // [latitude, longitude]
    badges: string[];
}

export const PORTFOLIO_TYPE_LABELS: Record<PortfolioGateType, string> = {
    SWING: 'Распашные ворота',
    SLIDING: 'Откатные ворота',
    SECTIONAL: 'Секционные ворота',
    ROLLER: 'Роллетные ворота',
    BARRIER: 'Шлагбаум',
};

export const PORTFOLIO_FILTERS: { id: PortfolioGateType | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'Все работы' },
    { id: 'SWING', label: 'Распашные' },
    { id: 'SLIDING', label: 'Откатные' },
    { id: 'SECTIONAL', label: 'Секционные' },
    { id: 'ROLLER', label: 'Роллетные' },
    { id: 'BARRIER', label: 'Шлагбаумы' },
];

// Данные сформированы на основе реальных успешных сделок из CRM (Битрикс24).
// Стоимость анонимизирована — указана только ориентировочная рыночная оценка по типу ворот.
export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
    {
        id: 'bx-001',
        title: 'Распашные ворота в г. Чашники',
        type: 'SWING',
        typeLabel: 'Распашные ворота',
        location: 'г. Чашники, Витебская обл.',
        description: 'Распашные ворота (г. Чашники, Витебская обл.) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '1076 × 2280 мм' },
            { label: 'Материал', value: 'Сэндвич-панель' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2500 BYN',
        images: [
            '/main/webp/swing.webp',
        ],
        coordinates: [54.85, 30.37],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-002',
        title: 'Секционные ворота в г. Колодищи',
        type: 'SECTIONAL',
        typeLabel: 'Секционные ворота',
        location: 'г. Колодищи, Минский р-н',
        description: 'Секционные ворота (г. Колодищи, Минский р-н) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '3985 × 3100 мм' },
            { label: 'Материал', value: 'Сэндвич-панель 40–45 мм' },
            { label: 'Цвет', value: 'RAL 5010' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2200 BYN',
        images: [
            '/main/webp/sectional.webp',
            '/main/webp/sectional2.webp',
        ],
        coordinates: [53.91, 27.66],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-003',
        title: 'Секционные ворота в г. Шклов',
        type: 'SECTIONAL',
        typeLabel: 'Секционные ворота',
        location: 'г. Шклов, Могилёвская обл.',
        description: 'Секционные ворота (г. Шклов, Могилёвская обл.) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '5000 × 4200 мм' },
            { label: 'Материал', value: 'Сэндвич-панель 40–45 мм' },
            { label: 'Цвет', value: 'RAL 7004' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2200 BYN',
        images: [
            '/main/webp/sectional2.webp',
            
        ],
        coordinates: [54.21, 30.21],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-004',
        title: 'Секционные ворота в г. Лида',
        type: 'SECTIONAL',
        typeLabel: 'Секционные ворота',
        location: 'г. Лида, Гродненская обл.',
        description: 'Секционные ворота (г. Лида, Гродненская обл.) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '3000 × 2800 мм' },
            { label: 'Материал', value: 'Сэндвич-панель 40–45 мм' },
            { label: 'Цвет', value: 'RAL 7024' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2200 BYN',
        images: [
            
            
        ],
        coordinates: [53.55, 25.31],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-005',
        title: 'Секционные ворота в д. Ждановичи',
        type: 'SECTIONAL',
        typeLabel: 'Секционные ворота',
        location: 'д. Ждановичи, Минский р-н',
        description: 'Секционные ворота (д. Ждановичи, Минский р-н) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '2800 × 3150 мм' },
            { label: 'Материал', value: 'Сэндвич-панель 40–45 мм' },
            { label: 'Цвет', value: 'RAL 7024' },
            { label: 'Автоматика', value: 'DoorHan TR-50FC' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2200 BYN',
        images: [
            
            
        ],
        coordinates: [53.887, 27.445],
        badges: ['DoorHan TR-50FC'],
    },
    {
        id: 'bx-006',
        title: 'Секционные ворота в г. Витебск',
        type: 'SECTIONAL',
        typeLabel: 'Секционные ворота',
        location: 'г. Витебск',
        description: 'Секционные ворота (г. Витебск) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '2500 × 2500 мм' },
            { label: 'Материал', value: 'Сэндвич-панель 40–45 мм' },
            { label: 'Цвет', value: 'RAL 7024' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2200 BYN',
        images: [
            
            
        ],
        coordinates: [55.19, 30.2],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-007',
        title: 'Секционные ворота в д. Осаново',
        type: 'SECTIONAL',
        typeLabel: 'Секционные ворота',
        location: 'д. Осаново, Молодечненский р-н',
        description: 'Секционные ворота (д. Осаново, Молодечненский р-н) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '3000 × 2250 мм' },
            { label: 'Материал', value: 'Сэндвич-панель 40–45 мм' },
            { label: 'Автоматика', value: 'Nice LG 800' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2200 BYN',
        images: [
            
            
        ],
        coordinates: [54.32, 26.86],
        badges: ['Nice LG 800'],
    },
    {
        id: 'bx-008',
        title: 'Секционные ворота в г. Сморгонь',
        type: 'SECTIONAL',
        typeLabel: 'Секционные ворота',
        location: 'г. Сморгонь, Гродненская обл.',
        description: 'Секционные ворота (г. Сморгонь, Гродненская обл.) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '3250 × 2775 мм' },
            { label: 'Материал', value: 'Сэндвич-панель 40–45 мм' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2200 BYN',
        images: [
            
            
        ],
        coordinates: [54.48, 26.41],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-009',
        title: 'Распашные ворота в д. Боровляны',
        type: 'SWING',
        typeLabel: 'Распашные ворота',
        location: 'д. Боровляны, Минский р-н',
        description: 'Распашные ворота (д. Боровляны, Минский р-н) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '3490 × 1800 мм' },
            { label: 'Материал', value: 'Профнастил / сэндвич-панель' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2500 BYN',
        images: [
            '/main/webp/swing.webp',
        ],
        coordinates: [53.96, 27.71],
        badges: ['Калитка'],
    },
    {
        id: 'bx-010',
        title: 'Роллетные ворота в г. Мосты',
        type: 'ROLLER',
        typeLabel: 'Роллетные ворота',
        location: 'г. Мосты, Гродненская обл.',
        description: 'Роллетные ворота (г. Мосты, Гродненская обл.) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '2330 × 2600 мм' },
            { label: 'Материал', value: 'Роллетные ламели, сэндвич-панель' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2900 BYN',
        images: [
            
            
        ],
        coordinates: [53.42, 24.55],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-011',
        title: 'Секционные ворота в г. Слуцк',
        type: 'SECTIONAL',
        typeLabel: 'Секционные ворота',
        location: 'г. Слуцк, Минская обл.',
        description: 'Секционные ворота (г. Слуцк, Минская обл.) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '2420 × 2400 мм' },
            { label: 'Материал', value: 'Сэндвич-панель 40–45 мм' },
            { label: 'Автоматика', value: 'Nice LG 800' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2200 BYN',
        images: [
            
            '/main/webp/sectional.webp',
        ],
        coordinates: [52.97, 29.24],
        badges: ['Nice LG 800'],
    },
    {
        id: 'bx-012',
        title: 'Секционные ворота в г. Климовичи',
        type: 'SECTIONAL',
        typeLabel: 'Секционные ворота',
        location: 'г. Климовичи, Могилёвская обл.',
        description: 'Секционные ворота (г. Климовичи, Могилёвская обл.) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '4100 × 3600 мм' },
            { label: 'Материал', value: 'Сэндвич-панель 40–45 мм' },
            { label: 'Цвет', value: 'RAL 7024' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2200 BYN',
        images: [
            '/main/webp/sectional.webp',
            '/main/webp/sectional2.webp',
        ],
        coordinates: [53.6, 32.33],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-013',
        title: 'Секционные ворота в г. Минск',
        type: 'SECTIONAL',
        typeLabel: 'Секционные ворота',
        location: 'г. Минск',
        description: 'Секционные ворота (г. Минск) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '3325 × 3000 мм' },
            { label: 'Материал', value: 'Сэндвич-панель 40–45 мм' },
            { label: 'Цвет', value: 'RAL 9006' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2200 BYN',
        images: [
            '/main/webp/sectional2.webp',
            
        ],
        coordinates: [53.9, 27.56],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-014',
        title: 'Роллетные ворота в г. Жодино',
        type: 'ROLLER',
        typeLabel: 'Роллетные ворота',
        location: 'г. Жодино',
        description: 'Роллетные ворота (г. Жодино) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '900 × 2000 мм' },
            { label: 'Материал', value: 'Роллетные ламели, сэндвич-панель' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2900 BYN',
        images: [
            
            
        ],
        coordinates: [54.09, 28.31],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-015',
        title: 'Распашные ворота в г. Колодищи',
        type: 'SWING',
        typeLabel: 'Распашные ворота',
        location: 'г. Колодищи, Минский р-н',
        description: 'Распашные ворота (г. Колодищи, Минский р-н) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '3000 × 3000 мм' },
            { label: 'Материал', value: 'Профнастил / сэндвич-панель' },
            { label: 'Цвет', value: 'RAL 5005' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2500 BYN',
        images: [
            '/main/webp/swing.webp',
        ],
        coordinates: [53.91, 27.66],
        badges: ['Калитка'],
    },
    {
        id: 'bx-016',
        title: 'Секционные ворота в г. Молодечно',
        type: 'SECTIONAL',
        typeLabel: 'Секционные ворота',
        location: 'г. Молодечно, Минская обл.',
        description: 'Секционные ворота (г. Молодечно, Минская обл.) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '4740 × 4350 мм' },
            { label: 'Материал', value: 'Сэндвич-панель 40–45 мм' },
            { label: 'Цвет', value: 'RAL 5010' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2200 BYN',
        images: [
            
            
        ],
        coordinates: [54.32, 26.86],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-017',
        title: 'Промышленные откатные ворота в г. Колодищи',
        type: 'SLIDING',
        typeLabel: 'Откатные ворота',
        location: 'г. Колодищи, Минский р-н',
        description: 'Промышленные откатные ворота (г. Колодищи, Минский р-н) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '6000 × 2000 мм' },
            { label: 'Материал', value: 'Наполнение: сэндвич-панель / профнастил' },
            { label: 'Автоматика', value: 'Alutech RTO 1000' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 3200 BYN',
        images: [
            '/main/webp/sliding.webp',
            '/main/sliding.jpeg',
        ],
        coordinates: [53.91, 27.66],
        badges: ['Alutech RTO 1000', 'Калитка'],
    },
    {
        id: 'bx-018',
        title: 'Секционные ворота в г. Пинск',
        type: 'SECTIONAL',
        typeLabel: 'Секционные ворота',
        location: 'г. Пинск, Брестская обл.',
        description: 'Секционные ворота (г. Пинск, Брестская обл.) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Материал', value: 'Сэндвич-панель 40–45 мм' },
            { label: 'Цвет', value: 'RAL 7016' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2200 BYN',
        images: [
            
            
        ],
        coordinates: [52.12, 25.32],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-019',
        title: 'Промышленные откатные ворота в г. Солигорск',
        type: 'SLIDING',
        typeLabel: 'Откатные ворота',
        location: 'г. Солигорск, Минская обл.',
        description: 'Промышленные откатные ворота (г. Солигорск, Минская обл.) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '4800 × 1800 мм' },
            { label: 'Материал', value: 'Наполнение: профнастил' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 3200 BYN',
        images: [
            '/main/sliding.jpeg',
            '/main/webp/sliding.webp',
        ],
        coordinates: [52.79, 27.54],
        badges: ['Фундамент'],
    },
    {
        id: 'bx-020',
        title: 'Секционные ворота в д. Ратомка',
        type: 'SECTIONAL',
        typeLabel: 'Секционные ворота',
        location: 'д. Ратомка, Минский р-н',
        description: 'Секционные ворота (д. Ратомка, Минский р-н) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Материал', value: 'Сэндвич-панель 40–45 мм' },
            { label: 'Цвет', value: 'RAL 8019' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2200 BYN',
        images: [
            
            
        ],
        coordinates: [53.93, 27.66],
        badges: ['Калитка'],
    },
    {
        id: 'bx-021',
        title: 'Промышленные откатные ворота в д. Боровляны',
        type: 'SLIDING',
        typeLabel: 'Откатные ворота',
        location: 'д. Боровляны, Минский р-н',
        description: 'Промышленные откатные ворота (д. Боровляны, Минский р-н) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '3900 × 1790 мм' },
            { label: 'Материал', value: 'Наполнение: сэндвич-панель / профнастил' },
            { label: 'Автоматика', value: 'Alutech RTO 500' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 3200 BYN',
        images: [
            '/main/webp/sliding.webp',
            '/main/sliding.jpeg',
        ],
        coordinates: [53.96, 27.71],
        badges: ['Alutech RTO 500', 'Калитка'],
    },
    {
        id: 'bx-022',
        title: 'Роллетные ворота в г. Колодищи',
        type: 'ROLLER',
        typeLabel: 'Роллетные ворота',
        location: 'г. Колодищи, Минский р-н',
        description: 'Роллетные ворота (г. Колодищи, Минский р-н) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '1731 × 2295 мм' },
            { label: 'Материал', value: 'Роллетные ламели, сэндвич-панель' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2900 BYN',
        images: [
            
            
        ],
        coordinates: [53.91, 27.66],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-023',
        title: 'Распашные ворота в г. Шклов',
        type: 'SWING',
        typeLabel: 'Распашные ворота',
        location: 'г. Шклов, Могилёвская обл.',
        description: 'Распашные ворота (г. Шклов, Могилёвская обл.) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '2632 × 2730 мм' },
            { label: 'Материал', value: 'Сэндвич-панель' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2500 BYN',
        images: [
            '/main/webp/swing.webp',
        ],
        coordinates: [54.21, 30.21],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-024',
        title: 'Роллетные ворота в г. Минск',
        type: 'ROLLER',
        typeLabel: 'Роллетные ворота',
        location: 'г. Минск',
        description: 'Роллетные ворота (г. Минск) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '2566 × 2595 мм' },
            { label: 'Материал', value: 'Роллетные ламели, сэндвич-панель' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2900 BYN',
        images: [
            
            
        ],
        coordinates: [53.9, 27.56],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-025',
        title: 'Распашные ворота в д. Ждановичи',
        type: 'SWING',
        typeLabel: 'Распашные ворота',
        location: 'д. Ждановичи, Минский р-н',
        description: 'Распашные ворота (д. Ждановичи, Минский р-н) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '1206 × 1615 мм' },
            { label: 'Материал', value: 'Профнастил / сэндвич-панель' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2500 BYN',
        images: [
            '/main/webp/swing.webp',
        ],
        coordinates: [53.887, 27.445],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-026',
        title: 'Распашные ворота в г. Минск',
        type: 'SWING',
        typeLabel: 'Распашные ворота',
        location: 'г. Минск',
        description: 'Распашные ворота (г. Минск) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '3600 × 3300 мм' },
            { label: 'Материал', value: 'Профнастил / сэндвич-панель' },
            { label: 'Цвет', value: 'RAL 9006' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 2500 BYN',
        images: [
            '/main/webp/swing.webp',
        ],
        coordinates: [53.9, 27.56],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-027',
        title: 'Промышленные откатные ворота в г. Брест',
        type: 'SLIDING',
        typeLabel: 'Откатные ворота',
        location: 'г. Брест',
        description: 'Промышленные откатные ворота (г. Брест) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '6000 × 2200 мм' },
            { label: 'Материал', value: 'Наполнение: профнастил' },
            { label: 'Цвет', value: 'RAL 5005' },
            { label: 'Автоматика', value: 'Alutech RTO 1000' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 3200 BYN',
        images: [
            '/main/sliding.jpeg',
            '/main/webp/sliding.webp',
        ],
        coordinates: [52.1, 23.73],
        badges: ['Alutech RTO 1000'],
    },
    {
        id: 'bx-028',
        title: 'Промышленные откатные ворота в г. Новолукомль',
        type: 'SLIDING',
        typeLabel: 'Откатные ворота',
        location: 'г. Новолукомль, Витебская обл.',
        description: 'Промышленные откатные ворота (г. Новолукомль, Витебская обл.) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '6200 × 2200 мм' },
            { label: 'Материал', value: 'Наполнение: сэндвич-панель / профнастил' },
            { label: 'Автоматика', value: 'Alutech RTO 1000' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 3200 BYN',
        images: [
            '/main/webp/sliding.webp',
            '/main/sliding.jpeg',
        ],
        coordinates: [54.66, 29.25],
        badges: ['Alutech RTO 1000'],
    },
    {
        id: 'bx-029',
        title: 'Промышленные откатные ворота в д. Тарасово',
        type: 'SLIDING',
        typeLabel: 'Откатные ворота',
        location: 'д. Тарасово, Минский р-н',
        description: 'Промышленные откатные ворота (д. Тарасово, Минский р-н) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '3900 × 1670 мм' },
            { label: 'Материал', value: 'Наполнение: металлический штакетник' },
            { label: 'Цвет', value: 'RAL 8019' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 3200 BYN',
        images: [
            '/main/sliding.jpeg',
            '/main/webp/sliding.webp',
        ],
        coordinates: [53.912, 27.412],
        badges: ['Гарантия на работы'],
    },
    {
        id: 'bx-030',
        title: 'Промышленные откатные ворота в г. Заславль',
        type: 'SLIDING',
        typeLabel: 'Откатные ворота',
        location: 'г. Заславль',
        description: 'Промышленные откатные ворота (г. Заславль) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Размеры', value: '4400 × 1800 мм' },
            { label: 'Материал', value: 'Наполнение: металлический штакетник' },
            { label: 'Цвет', value: 'RAL 8017' },
            { label: 'Автоматика', value: 'Alutech RTO 500' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 3200 BYN',
        images: [

        ],
        coordinates: [53.99, 27.3],
        badges: ['Alutech RTO 500', 'Калитка'],
    },
    {
        id: 'bx-031',
        title: 'Шлагбаум в г. Минск',
        type: 'BARRIER',
        typeLabel: 'Шлагбаум',
        location: 'г. Минск',
        description: 'Шлагбаум (г. Минск) — реальный проект из портфолио Megador. Изготовление и монтаж под ключ собственными бригадами.',
        specs: [
            { label: 'Материал', value: 'Стрела 5–6 м, промышленные приводы' },
            { label: 'Монтаж', value: 'Под ключ, бригада Megador' }
        ],
        cost: 'от 4200 BYN',
        images: [
            '/barriers/barriers-preview.jpeg',
        ],
        coordinates: [53.9, 27.56],
        badges: ['Гарантия на работы'],
    },
];
