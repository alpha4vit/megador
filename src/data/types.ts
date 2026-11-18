// Centralized entity schemas for the Megador catalog.
// These interfaces are intentionally flat and JSON-serializable so they can be
// mirrored 1:1 by Kotlin DTOs when the in-memory store is swapped for a real API.

export type SectionKey =
    | 'portfolio'
    | 'sectional'
    | 'sliding'
    | 'swing'
    | 'barriers'
    | 'roller-gates'
    | 'accessories'
    | 'automation-swing'
    | 'automation-sliding'
    | 'automation-sectional'
    | 'sun-protection'
    | 'docking-equipment';

/** Catalog sections that render product cards (automation pages + accessories). */
export type ProductSection =
    | 'accessories'
    | 'automation-swing'
    | 'automation-sliding'
    | 'automation-sectional'
    | 'roller-gates'
    | 'sun-protection'
    | 'docking-equipment';

/** Unified section for completed installations (portfolio + service-page examples). */
export type ProjectSection = 'sectional' | 'sliding' | 'swing' | 'barriers' | 'roller-gates' | 'sun-protection' | 'docking-equipment';

/** Localized Russian names for project sections — used as automatic title fallbacks. */
export const PROJECT_SECTION_LABELS: Record<ProjectSection, string> = {
    sectional: 'Секционные ворота',
    sliding: 'Откатные ворота',
    swing: 'Распашные ворота',
    barriers: 'Шлагбаумы',
    'roller-gates': 'Роллетные ворота',
    'sun-protection': 'Внешняя солнцезащита',
    'docking-equipment': 'Перегрузочная техника',
};

export interface Spec {
    label: string;
    value: string;
}

/** Flexible pricing: numeric price in BYN + "price on request" flag. */
export interface Priceable {
    /** Price in BYN. Ignored when priceOnRequest is true. */
    price?: number | null;
    priceOnRequest: boolean;
    /** Optional prefix shown before the amount, e.g. "от". */
    pricePrefix?: string;
}

/** Product card shown on automation/accessories catalog pages. */
export interface CatalogProduct extends Priceable {
    id: string;
    section: ProductSection;
    /** Tab/group inside the section page, e.g. 'nice' | 'alutech' | 'remotes'. */
    tab: string;
    title: string;
    subtitle: string;
    description?: string;
    badgeText: string;
    /** Tailwind background class for the badge, e.g. 'bg-slate-900'. */
    badgeStyle: string;
    specs: Spec[];
    productActionKey?: string;
    /** Image URLs; the first entry is used as the cover image. */
    images: string[];
    buttonText?: string;
}

/**
 * Completed real-world installation — single source of truth for both the
 * main /portfolio page (grid + Yandex map) and the "Примеры работ" sliders
 * on service landing pages. `showOnServicePage` controls service-page visibility.
 */
export interface PortfolioProject extends Priceable {
    id: string;
    section: ProjectSection;
    /** Optional custom title; pages fall back to a composed "<typeLabel> — <location>" title. */
    title?: string | null;
    /** Display label for the gate type, e.g. "Распашные ворота". */
    typeLabel: string;
    location: string;
    description: string;
    series: string;
    color: string;
    automation: string;
    dimensions: string;
    timeline: string;
    specs: Spec[];
    images: string[];
    /** [latitude, longitude] — used to place the project on the map; null when not pinned. */
    coordinates: [number, number] | null;
    badges: string[];
    /** Show this project in the "Примеры работ" block on its service landing page. */
    showOnServicePage: boolean;
}

/** Local rendering shape consumed by the product-card grids on public pages. */
export interface ProductCard {
    id: string;
    title: string;
    subtitle: string;
    badgeText: string;
    badgeStyle: string;
    specs: string[];
    price: string;
    productActionKey: string;
    image: string;
    buttonText?: string;
    description?: string;
}

/**
 * Display title for a project: custom title, or a fallback to the localized
 * section name (optionally suffixed with the location for context).
 */
export function projectTitle(
    project: Pick<PortfolioProject, 'title' | 'typeLabel' | 'location' | 'section'>,
    {withLocation = false}: {withLocation?: boolean} = {},
): string {
    const custom = project.title?.trim();
    if (custom && !custom.includes('$1')) return custom;
    const base = project.typeLabel?.trim() || PROJECT_SECTION_LABELS[project.section] || 'Проект';
    return withLocation && project.location ? `${base} — ${project.location}` : base;
}

/** Format a Priceable entity into the display string used across the site. */
export function formatPrice(item: Priceable): string {
    if (item.priceOnRequest || item.price == null) return 'Цена по запросу';
    const prefix = item.pricePrefix ? `${item.pricePrefix} ` : '';
    return `${prefix}${item.price} BYN`;
}

/** Parse a legacy display price string ("от 1880 BYN", "по запросу") into Priceable fields. */
export function parsePriceString(s?: string): Priceable {
    if (!s || /по запросу/i.test(s)) return { priceOnRequest: true };
    const m = s.match(/(\d[\d\s]*(?:[.,]\d+)?)/);
    if (!m) return { priceOnRequest: true };
    const price = parseFloat(m[1].replace(/\s/g, '').replace(',', '.'));
    const pricePrefix = s.slice(0, m.index).trim() || undefined;
    return { price, priceOnRequest: false, pricePrefix };
}

/** Convert a stored CatalogProduct into the ProductCard shape used by page grids. */
export function toProductCard(item: CatalogProduct): ProductCard {
    return {
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        badgeText: item.badgeText,
        badgeStyle: item.badgeStyle,
        specs: item.specs.map((s) => (s.label ? `${s.label}: ${s.value}` : s.value)),
        price: formatPrice(item),
        productActionKey: item.productActionKey ?? item.id,
        image: item.images[0] ?? '',
        buttonText: item.buttonText,
        description: item.description,
    };
}
