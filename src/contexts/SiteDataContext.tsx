'use client';

import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import type {CatalogProduct, PortfolioProject, ProductSection, ProjectSection} from '@/data/types';
import {
    apiCreateProduct, apiCreateProject, apiDeleteProduct, apiDeleteProject,
    apiGetProducts, apiGetProjects, apiUpdateProduct, apiUpdateProject,
} from '@/data/apiClient';

interface SiteDataContextValue {
    products: CatalogProduct[];
    projects: PortfolioProject[];
    /** True once the initial fetch from the backend completed (success or failure). */
    hydrated: boolean;
    /** Set when the backend could not be reached. */
    error: string | null;
    // Catalog products
    getProducts: (section?: ProductSection) => CatalogProduct[];
    saveProduct: (product: CatalogProduct) => Promise<void>;
    removeProduct: (id: string) => Promise<void>;
    // Unified work projects (portfolio page + service-page "Примеры работ")
    getProjects: (section?: ProjectSection, onlyServicePage?: boolean) => PortfolioProject[];
    saveProject: (project: PortfolioProject) => Promise<void>;
    removeProject: (id: string) => Promise<void>;
    /** Re-fetch everything from the backend. */
    refresh: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

function upsertById<T extends {id: string}>(list: T[], item: T): T[] {
    const idx = list.findIndex((x) => x.id === item.id);
    if (idx === -1) return [...list, item];
    const next = [...list];
    next[idx] = item;
    return next;
}

/** Server-issued ids are UUIDs; locally generated draft ids ('prod-…', 'pf-…') are not. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isPersisted = (id: string) => UUID_RE.test(id);

export function SiteDataProvider({children}: {children: ReactNode}) {
    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [projects, setProjects] = useState<PortfolioProject[]>([]);
    const [hydrated, setHydrated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            const [prods, projs] = await Promise.all([apiGetProducts(), apiGetProjects()]);
            setProducts(prods);
            setProjects(projs);
            setError(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load site data');
        } finally {
            setHydrated(true);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
        void refresh();
    }, [refresh]);

    const value = useMemo<SiteDataContextValue>(() => ({
        products,
        projects,
        hydrated,
        error,
        getProducts: (section) => (section ? products.filter((p) => p.section === section) : products),
        saveProduct: async (product) => {
            const saved = isPersisted(product.id)
                ? await apiUpdateProduct(product.id, product)
                : await apiCreateProduct(product);
            setProducts((prev) => upsertById(prev.filter((p) => p.id !== product.id), saved));
        },
        removeProduct: async (id) => {
            await apiDeleteProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        },
        getProjects: (section, onlyServicePage = false) =>
            projects.filter((p) =>
                (!section || p.section === section) &&
                (!onlyServicePage || p.showOnServicePage),
            ),
        saveProject: async (project) => {
            const saved = isPersisted(project.id)
                ? await apiUpdateProject(project.id, project)
                : await apiCreateProject(project);
            setProjects((prev) => upsertById(prev.filter((p) => p.id !== project.id), saved));
        },
        removeProject: async (id) => {
            await apiDeleteProject(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
        },
        refresh,
    }), [products, projects, hydrated, error, refresh]);

    return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteDataContextValue {
    const ctx = useContext(SiteDataContext);
    if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider');
    return ctx;
}
