import type {CatalogProduct, PortfolioProject, ProductSection, ProjectSection} from './types';
import {clearAdminToken, getAdminToken} from '@/lib/admin-auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = getAdminToken();
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
        ...init,
    });
    if (res.status === 401 || res.status === 403) {
        // Token expired or invalid — drop it and send the admin back to login.
        clearAdminToken();
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
            window.location.assign('/admin');
        }
    }
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`API ${init?.method ?? 'GET'} ${path} failed: ${res.status} ${body}`);
    }
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}

// ---------- Catalog products ----------

export function apiGetProducts(section?: ProductSection): Promise<CatalogProduct[]> {
    const qs = section ? `?section=${encodeURIComponent(section)}` : '';
    return request<CatalogProduct[]>(`/api/v1/products${qs}`);
}

export function apiCreateProduct(product: CatalogProduct): Promise<CatalogProduct> {
    return request<CatalogProduct>('/api/v1/products', {method: 'POST', body: JSON.stringify(toProductPayload(product))});
}

export function apiUpdateProduct(id: string, product: CatalogProduct): Promise<CatalogProduct> {
    return request<CatalogProduct>(`/api/v1/products/${id}`, {method: 'PUT', body: JSON.stringify(toProductPayload(product))});
}

export function apiDeleteProduct(id: string): Promise<void> {
    return request<void>(`/api/v1/products/${id}`, {method: 'DELETE'});
}

// ---------- Portfolio projects ----------

export function apiGetProjects(section?: ProjectSection, onlyServicePage?: boolean): Promise<PortfolioProject[]> {
    const params = new URLSearchParams();
    if (section) params.set('section', section);
    if (onlyServicePage) params.set('onlyServicePage', 'true');
    const qs = params.toString();
    return request<PortfolioProject[]>(`/api/v1/portfolio${qs ? `?${qs}` : ''}`);
}

export function apiCreateProject(project: PortfolioProject): Promise<PortfolioProject> {
    return request<PortfolioProject>('/api/v1/portfolio', {method: 'POST', body: JSON.stringify(toProjectPayload(project))});
}

export function apiUpdateProject(id: string, project: PortfolioProject): Promise<PortfolioProject> {
    return request<PortfolioProject>(`/api/v1/portfolio/${id}`, {method: 'PUT', body: JSON.stringify(toProjectPayload(project))});
}

export function apiDeleteProject(id: string): Promise<void> {
    return request<void>(`/api/v1/portfolio/${id}`, {method: 'DELETE'});
}

// ---------- Media uploads ----------

export interface UploadedImage {
    id: string;
    /** Relative URL like /api/v1/media/{id} — served lazily, binary never inlined. */
    url: string;
    width: number | null;
    height: number | null;
    sizeBytes: number;
}

/** Uploads an image file; backend compresses to WebP and stores it. Requires admin JWT. */
export async function apiUploadImage(file: File): Promise<UploadedImage> {
    const token = getAdminToken();
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/api/v1/media`, {
        method: 'POST',
        headers: token ? {Authorization: `Bearer ${token}`} : {},
        body: form,
    });
    if (res.status === 401 || res.status === 403) {
        clearAdminToken();
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
            window.location.assign('/admin');
        }
    }
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`Upload failed: ${res.status} ${body}`);
    }
    return res.json() as Promise<UploadedImage>;
}

/** Downloads a remote image server-side, compresses to WebP and stores it. */
export async function apiImportImage(url: string): Promise<UploadedImage> {
    const token = getAdminToken();
    const res = await fetch(`${API_BASE}/api/v1/media/import`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
        body: JSON.stringify({url}),
    });
    if (res.status === 401 || res.status === 403) {
        clearAdminToken();
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
            window.location.assign('/admin');
        }
    }
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`Import failed: ${res.status} ${body}`);
    }
    return res.json() as Promise<UploadedImage>;
}

// ---------- Payload shaping ----------
// The backend request DTOs accept the same field names; server-managed fields
// (id on create, createdAt/updatedAt) are ignored by Spring's Jackson config.

function toProductPayload(product: CatalogProduct) {
    return product;
}

function toProjectPayload(project: PortfolioProject) {
    return project;
}
