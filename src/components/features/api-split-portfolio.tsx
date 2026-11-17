'use client';

import {useSiteData} from '@/contexts/SiteDataContext';
import {formatPrice, projectTitle} from '@/data/types';
import {SplitPortfolio, type Project} from './split-portfolio';
import {DataLoading} from './data-loading';

/** SplitPortfolio backed by the live backend portfolio projects. */
export function ApiSplitPortfolio({background = 'white', limit = 4}: {background?: 'white' | 'muted'; limit?: number}) {
    const {getProjects, hydrated} = useSiteData();

    if (!hydrated) return <DataLoading/>;

    const projects: Project[] = getProjects()
        .slice(0, limit)
        .map((item, index) => ({
            id: index + 1,
            title: projectTitle(item),
            location: item.location,
            material: item.series ? `Серия ${item.series}, цвет ${item.color}` : '',
            automation: item.automation,
            installationTime: item.timeline,
            priceRange: formatPrice(item),
            description: item.description || `Проект: ${projectTitle(item)}. Профессиональная установка с гарантией.`,
            image: item.images[0],
        }));

    if (projects.length === 0) return null;
    return <SplitPortfolio projects={projects} background={background}/>;
}
