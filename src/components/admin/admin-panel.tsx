'use client';

import {useMemo, useState} from 'react';
import Link from 'next/link';
import {
    ExternalLink, ImageOff, LayoutDashboard, Plus, Pencil, Trash2, CheckCircle2, AlertCircle, X, LogOut,
    FolderOpen, DoorClosed, MoveHorizontal, DoorOpen, Fence, Package, Settings, Blinds, Sun, Forklift,
} from 'lucide-react';
import type {CatalogProduct, PortfolioProject, ProductSection, ProjectSection} from '@/data/types';
import {formatPrice, projectTitle} from '@/data/types';
import {useSiteData} from '@/contexts/SiteDataContext';
import {ItemEditor, type EditorConfig, type EditorKind} from './item-editor';

type ManagedEntity = CatalogProduct | PortfolioProject;

interface SectionDef {
    key: string;
    title: string;
    icon: typeof LayoutDashboard;
    kind: EditorKind;
    /** ProductSection or ProjectSection stored on items. */
    section?: ProductSection | ProjectSection;
    entity: 'products' | 'projects' | 'both';
}

const SECTIONS: SectionDef[] = [
    {key: 'portfolio', title: 'Портфолио', icon: FolderOpen, kind: 'project', entity: 'projects'},
    {key: 'sectional', title: 'Секционные ворота', icon: DoorClosed, kind: 'project', section: 'sectional', entity: 'projects'},
    {key: 'sliding', title: 'Откатные ворота', icon: MoveHorizontal, kind: 'project', section: 'sliding', entity: 'projects'},
    {key: 'swing', title: 'Распашные ворота', icon: DoorOpen, kind: 'project', section: 'swing', entity: 'projects'},
    {key: 'barriers', title: 'Шлагбаумы', icon: Fence, kind: 'project', section: 'barriers', entity: 'projects'},
    {key: 'roller-gates', title: 'Роллетные ворота', icon: Blinds, kind: 'mixed', section: 'roller-gates', entity: 'both'},
    {key: 'accessories', title: 'Комплектующие', icon: Package, kind: 'product', section: 'accessories', entity: 'products'},
    {key: 'automation-swing', title: 'Автоматика: Распашные', icon: Settings, kind: 'product', section: 'automation-swing', entity: 'products'},
    {key: 'automation-sliding', title: 'Автоматика: Откатные', icon: Settings, kind: 'product', section: 'automation-sliding', entity: 'products'},
    {key: 'automation-sectional', title: 'Автоматика: Секционные', icon: Settings, kind: 'product', section: 'automation-sectional', entity: 'products'},
    {key: 'sun-protection', title: 'Внешняя солнцезащита', icon: Sun, kind: 'mixed', section: 'sun-protection', entity: 'both'},
    {key: 'docking-equipment', title: 'Перегрузочная техника', icon: Forklift, kind: 'mixed', section: 'docking-equipment', entity: 'both'},
];

/** Canonical tab order per product section — ensures all groups are offered in the editor. */
const KNOWN_TABS: Partial<Record<ProductSection, string[]>> = {
    'automation-sliding': ['nice', 'alutech', 'hispeed'],
    'automation-swing': ['nice', 'alutech'],
    'sun-protection': ['zip', 'cable'],
    'docking-equipment': ['pato', 'levelers', 'shelters', 'platforms', 'tambours', 'extras'],
};

const TAB_LABELS: Record<string, string> = {
    nice: 'NICE',
    alutech: 'Alutech',
    hispeed: 'Hi-Speed',
    household: 'Бытовые / гаражные',
    industrial: 'Промышленные',
    accessories: 'Комплектующие и рейки',
    remotes: 'Пульты управления',
    safety: 'Элементы безопасности',
    smart: 'Умные модули',
    rollers: 'Серии',
    zip: 'ZIP-система',
    cable: 'Тросовая система',
    pato: 'Система PATO',
    levelers: 'Доклевеллеры',
    shelters: 'Докшелтеры',
    platforms: 'Площадки',
    tambours: 'Тамбуры',
    extras: 'Доп. оборудование',
};

function isProduct(item: ManagedEntity): item is CatalogProduct {
    return 'tab' in item;
}

function isProject(item: ManagedEntity): item is PortfolioProject {
    return 'section' in item && 'showOnServicePage' in item;
}

function entityTitle(item: ManagedEntity): string {
    if (isProject(item)) return projectTitle(item);
    return item.title;
}

function entitySubtitle(item: ManagedEntity): string {
    if (isProduct(item)) return item.subtitle;
    if (isProject(item)) {
        const parts = [item.series, item.color, item.automation, item.dimensions].filter(Boolean);
        return parts.length > 0 ? parts.join(' · ') : item.location;
    }
    return '';
}

function entityThumb(item: ManagedEntity): string | undefined {
    return item.images[0];
}

export default function AdminPanel({onLogout}: {onLogout: () => void}) {
    const {products, projects, saveProduct, saveProject, removeProduct, removeProject, hydrated, error} = useSiteData();
    const [activeKey, setActiveKey] = useState(SECTIONS[0].key);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [editing, setEditing] = useState<ManagedEntity | null>(null);
    const [creating, setCreating] = useState(false);
    const [toast, setToast] = useState<{kind: 'success' | 'error'; text: string} | null>(null);

    const showToast = (kind: 'success' | 'error', text: string) => {
        setToast({kind, text});
        setTimeout(() => setToast(null), 4000);
    };

    const section = SECTIONS.find((s) => s.key === activeKey)!;

    const items = useMemo<ManagedEntity[]>(() => {
        if (section.entity === 'products') {
            let list = products.filter((p) => p.section === section.section);
            if (activeTab !== 'all') list = list.filter((p) => p.tab === activeTab);
            return list;
        }
        if (section.entity === 'both') {
            const prods = products
                .filter((p) => p.section === section.section)
                .filter((p) => activeTab === 'all' || p.tab === activeTab);
            const projs = projects.filter((p) => p.section === section.section);
            return [...prods, ...projs];
        }
        if (section.section) return projects.filter((p) => p.section === section.section);
        return projects;
    }, [section, products, projects, activeTab]);

    const tabs = useMemo(() => {
        if (section.entity !== 'products' && section.entity !== 'both') return [];
        const present = new Set(products.filter((p) => p.section === section.section).map((p) => p.tab));
        const known = (section.section && KNOWN_TABS[section.section as ProductSection]) ?? [];
        known.forEach((t) => present.add(t));
        return [...known.filter((t) => present.has(t)), ...[...present].filter((t) => !known.includes(t))];
    }, [section, products]);

    const editorConfig: EditorConfig = {
        kind: section.kind,
        section: section.section,
        tabs: tabs.map((t) => ({value: t, label: TAB_LABELS[t] ?? t})),
    };

    const handleSave = async (entity: ManagedEntity) => {
        try {
            if (isProduct(entity)) await saveProduct(entity);
            else await saveProject(entity);
            showToast('success', 'Сохранено');
            setEditing(null);
            setCreating(false);
        } catch (e) {
            showToast('error', `Ошибка сохранения: ${e instanceof Error ? e.message : 'unknown'}`);
        }
    };

    const handleDelete = async (item: ManagedEntity) => {
        try {
            if (isProduct(item)) await removeProduct(item.id);
            else await removeProject(item.id);
            showToast('success', 'Удалено');
        } catch (e) {
            showToast('error', `Ошибка удаления: ${e instanceof Error ? e.message : 'unknown'}`);
        }
    };

    const openCreate = () => {
        setEditing(null);
        setCreating(true);
        if (section.entity === 'products' && tabs.length > 0) setActiveTab('all');
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <div className="flex flex-col lg:flex-row">
                {/* Sidebar */}
                <aside className="lg:w-72 lg:min-h-screen bg-[#2F3E46] text-white flex flex-col">
                    <div className="px-5 py-5 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <LayoutDashboard className="w-5 h-5 text-[#E65F2B]"/>
                            <span className="font-bold text-lg tracking-tight">MEGADOR Admin</span>
                        </div>
                        <p className="text-xs text-white/50 mt-1">Управление контентом сайта</p>
                    </div>
                    <nav className="flex-1 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden p-3 space-y-1">
                        {SECTIONS.map((s) => {
                            const Icon = s.icon;
                            const count = s.entity === 'products'
                                ? products.filter((p) => p.section === s.section).length
                                : s.entity === 'both'
                                    ? products.filter((p) => p.section === s.section).length +
                                      projects.filter((p) => p.section === s.section).length
                                    : s.section
                                        ? projects.filter((p) => p.section === s.section).length
                                        : projects.length;
                            const active = s.key === activeKey;
                            return (
                                <button
                                    key={s.key}
                                    onClick={() => { setActiveKey(s.key); setActiveTab('all'); setCreating(false); setEditing(null); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                        active ? 'bg-[#E65F2B] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0"/>
                                    <span className="flex-1 text-left">{s.title}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-white/10'}`}>{count}</span>
                                </button>
                            );
                        })}
                    </nav>
                    <div className="p-3 border-t border-white/10 space-y-2">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
                        >
                            <ExternalLink className="w-4 h-4"/> View Live Site
                        </Link>
                        <button
                            onClick={onLogout}
                            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/15 text-sm font-medium text-white/80 transition-colors"
                        >
                            <LogOut className="w-4 h-4"/> Выйти
                        </button>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        <div>
                            <h1 className="text-2xl font-bold text-[#2F3E46]">{section.title}</h1>
                            <p className="text-sm text-gray-500 mt-0.5">{items.length} элементов</p>
                        </div>
                        <button
                            onClick={openCreate}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#E65F2B] text-white text-sm font-semibold hover:bg-[#d5541e] transition-colors"
                        >
                            <Plus className="w-4 h-4"/> Добавить элемент
                        </button>
                    </div>

                    {/* Tab filter for product sections */}
                    {tabs.length > 0 && section.entity !== 'projects' && (
                        <div className="flex flex-wrap gap-2 mb-5">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeTab === 'all' ? 'bg-[#2F3E46] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                            >
                                Все
                            </button>
                            {tabs.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setActiveTab(t)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeTab === t ? 'bg-[#2F3E46] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {TAB_LABELS[t] ?? t}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Items list */}
                    {items.length === 0 ? (
                        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
                            <p className="text-gray-500">В этом разделе пока нет элементов.</p>
                            <button onClick={openCreate} className="mt-3 text-sm font-semibold text-[#E65F2B] hover:underline">
                                + Добавить элемент
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                            {items.map((item) => {
                                const thumb = entityThumb(item);
                                return (
                                    <div key={item.id} className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3">
                                        <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                            {thumb ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={thumb} alt="" className="w-full h-full object-cover"/>
                                            ) : (
                                                <ImageOff className="w-5 h-5 text-gray-300"/>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[#2F3E46] truncate">{entityTitle(item)}</p>
                                            <p className="text-xs text-gray-500 truncate">{entitySubtitle(item)}</p>
                                        </div>
                                        {isProject(item) && (
                                            <span className={`hidden md:inline-flex text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                                                item.showOnServicePage ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {item.showOnServicePage ? 'На странице услуги' : 'Только портфолио'}
                                            </span>
                                        )}
                                        <span className={`hidden sm:inline-flex text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                                            item.priceOnRequest ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-[#E65F2B]'
                                        }`}>
                                            {formatPrice(item)}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => { setEditing(item); setCreating(false); }}
                                                className="p-2 text-gray-400 hover:text-[#2F3E46] hover:bg-gray-100 rounded-lg transition-colors"
                                                aria-label="Редактировать"
                                            >
                                                <Pencil className="w-4 h-4"/>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                aria-label="Удалить"
                                            >
                                                <Trash2 className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* Editor modal */}
            {(creating || editing) && (
                <ItemEditor
                    key={editing?.id ?? `new-${section.key}`}
                    config={editorConfig}
                    initial={editing}
                    onSave={handleSave}
                    onClose={() => { setEditing(null); setCreating(false); }}
                />
            )}


            {toast && (
                <div className={`fixed bottom-4 right-4 z-[120] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
                    toast.kind === 'success' ? 'bg-emerald-600' : 'bg-red-600'
                }`}>
                    {toast.kind === 'success' ? <CheckCircle2 className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
                    {toast.text}
                    <button onClick={() => setToast(null)} className="ml-1 opacity-70 hover:opacity-100" aria-label="Закрыть">
                        <X className="w-4 h-4"/>
                    </button>
                </div>
            )}

            {error && hydrated && (
                <div className="fixed bottom-4 left-4 z-[120] bg-red-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs">
                    Бэкенд недоступен: {error}
                </div>
            )}

            {!hydrated && (
                <div className="fixed bottom-4 right-4 bg-[#2F3E46] text-white text-xs px-3 py-2 rounded-lg shadow-lg">
                    Загрузка данных…
                </div>
            )}
        </div>
    );
}
