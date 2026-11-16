'use client';

import {useEffect, useState} from 'react';
import {X} from 'lucide-react';
import type {CatalogProduct, PortfolioProject, ProductSection, ProjectSection, Spec} from '@/data/types';
import {PROJECT_SECTION_LABELS} from '@/components/features/portfolio/portfolio-data';
import {Field, ImageManager, PriceFields, Select, SpecEditor, TextArea, TextInput, Checkbox} from './fields';

export type EditorKind = 'product' | 'project' | 'mixed';

export interface EditorConfig {
    kind: EditorKind;
    /** Product or project section this editor manages. */
    section?: ProductSection | ProjectSection;
    /** Available tab values for product sections. */
    tabs?: {value: string; label: string}[];
}

interface ItemEditorProps {
    config: EditorConfig;
    /** Existing entity to edit, or null to create. */
    initial: CatalogProduct | PortfolioProject | null;
    onSave: (entity: CatalogProduct | PortfolioProject) => void;
    onClose: () => void;
}

const BADGE_STYLES = ['bg-slate-900', 'bg-zinc-700', 'bg-zinc-800', 'bg-[#E65F2B]', 'bg-black', 'bg-emerald-700', 'bg-blue-800'];

const inputShell =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#2F3E46] focus:outline-none focus:ring-2 focus:ring-[#E65F2B]/40 focus:border-[#E65F2B]';

function genId(prefix: string) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function defaultProduct(section: ProductSection, tab: string): CatalogProduct {
    const id = genId('prod');
    return {
        id,
        section,
        tab,
        title: '',
        subtitle: '',
        badgeText: '',
        badgeStyle: 'bg-slate-900',
        specs: [],
        priceOnRequest: false,
        price: null,
        pricePrefix: 'от',
        images: [],
        productActionKey: id,
    };
}

function defaultProject(section: ProjectSection): PortfolioProject {
    return {
        id: genId('pf'),
        section,
        title: null,
        typeLabel: PROJECT_SECTION_LABELS[section],
        location: '',
        description: '',
        series: '',
        color: '',
        automation: '',
        dimensions: '',
        timeline: '',
        specs: [],
        priceOnRequest: false,
        price: null,
        pricePrefix: 'от',
        images: [],
        coordinates: null,
        badges: [],
        showOnServicePage: false,
    };
}

export function ItemEditor({config, initial, onSave, onClose}: ItemEditorProps) {
    const resolvedKind: 'product' | 'project' = initial
        ? ('tab' in initial ? 'product' : 'project')
        : config.kind === 'product' ? 'product' : 'project';
    const [kind, setKind] = useState<'product' | 'project'>(resolvedKind);
    const [draft, setDraft] = useState<CatalogProduct | PortfolioProject>(() => {
        if (initial) return initial;
        if (resolvedKind === 'product') return defaultProduct(config.section as ProductSection, config.tabs?.[0]?.value ?? '');
        return defaultProject((config.section as ProjectSection | undefined) ?? 'sectional');
    });
    const [badgesText, setBadgesText] = useState(initial && 'badges' in initial ? initial.badges.join(', ') : '');
    const [coordLat, setCoordLat] = useState(initial && 'coordinates' in initial && initial.coordinates ? String(initial.coordinates[0]) : '');
    const [coordLng, setCoordLng] = useState(initial && 'coordinates' in initial && initial.coordinates ? String(initial.coordinates[1]) : '');

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const switchKind = (next: 'product' | 'project') => {
        setKind(next);
        if (next === 'product') {
            setDraft(defaultProduct(config.section as ProductSection, config.tabs?.[0]?.value ?? ''));
        } else {
            setDraft(defaultProject((config.section as ProjectSection | undefined) ?? 'sectional'));
        }
        setBadgesText('');
        setCoordLat('');
        setCoordLng('');
    };

    const patch = (p: Record<string, unknown>) => setDraft((d) => ({...d, ...p}));
    const isProject = kind === 'project';
    const isValid = isProject
        ? ((draft as PortfolioProject).location.trim().length > 0 || (draft.title ?? '').trim().length > 0)
        : (draft.title ?? '').trim().length > 0;

    const handleSave = () => {
        if (!isValid) return;
        const entity = {...draft};
        if ('specs' in entity) {
            entity.specs = (entity.specs as Spec[]).filter((x) => x.label.trim() || x.value.trim());
        }
        if (isProject && 'badges' in entity) {
            (entity as PortfolioProject).badges = badgesText.split(',').map((b) => b.trim()).filter(Boolean);
            const lat = coordLat.trim();
            const lng = coordLng.trim();
            (entity as PortfolioProject).coordinates =
                lat !== '' && lng !== '' ? [Number(lat), Number(lng)] : null;
        }
        onSave(entity);
    };

    const priceable = draft as {price?: number | null; priceOnRequest: boolean; pricePrefix?: string};
    const specs = 'specs' in draft ? (draft.specs as Spec[]) : [];
    const images = draft.images ?? [];

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
            <div className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl">
                <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-[#2F3E46]">
                        {initial ? 'Редактировать элемент' : 'Добавить элемент'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700" aria-label="Закрыть">
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {config.kind === 'mixed' && (
                        <Field label="Тип элемента">
                            <Select value={kind} onChange={(e) => switchKind(e.target.value as 'product' | 'project')}>
                                <option value="project">Проект / пример работы</option>
                                <option value="product">Товар / серия</option>
                            </Select>
                        </Field>
                    )}

                    {/* Common: title (optional for projects — pages compose a fallback) */}
                    <Field label={isProject ? 'Название (необязательно)' : 'Название'} hint={isProject ? 'Оставьте пустым, чтобы автоматически подставилось название услуги' : undefined}>
                        <TextInput value={draft.title ?? ''} onChange={(e) => patch({title: e.target.value || null})} placeholder={isProject ? 'Свой заголовок проекта' : 'Название элемента'} autoFocus/>
                    </Field>

                    {kind === 'product' && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field label="Подзаголовок">
                                    <TextInput value={(draft as CatalogProduct).subtitle} onChange={(e) => patch({subtitle: e.target.value})} placeholder="Краткое описание"/>
                                </Field>
                                <Field label="Бейдж">
                                    <TextInput value={(draft as CatalogProduct).badgeText} onChange={(e) => patch({badgeText: e.target.value})} placeholder="Популярный"/>
                                </Field>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {config.tabs && config.tabs.length > 1 && (
                                    <Field label="Вкладка / группа">
                                        <Select
                                            value={(draft as CatalogProduct).tab}
                                            onChange={(e) => patch({tab: e.target.value})}
                                        >
                                            {config.tabs.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </Select>
                                    </Field>
                                )}
                                <Field label="Стиль бейджа">
                                    <Select
                                        value={(draft as CatalogProduct).badgeStyle}
                                        onChange={(e) => patch({badgeStyle: e.target.value})}
                                    >
                                        {BADGE_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </Select>
                                </Field>
                                <Field label="Кнопка (текст)">
                                    <TextInput value={(draft as CatalogProduct).buttonText ?? ''} onChange={(e) => patch({buttonText: e.target.value || undefined})} placeholder="В корзину"/>
                                </Field>
                            </div>
                            <Field label="Описание">
                                <TextArea value={(draft as CatalogProduct).description ?? ''} onChange={(e) => patch({description: e.target.value || undefined})} placeholder="Подробное описание для карточки товара"/>
                            </Field>
                        </>
                    )}

                    {isProject && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field label="Раздел / тип">
                                    <Select
                                        value={(draft as PortfolioProject).section}
                                        onChange={(e) => {
                                            const section = e.target.value as ProjectSection;
                                            patch({section, typeLabel: PROJECT_SECTION_LABELS[section]});
                                        }}
                                    >
                                        {(Object.keys(PROJECT_SECTION_LABELS) as ProjectSection[]).map((s) => (
                                            <option key={s} value={s}>{PROJECT_SECTION_LABELS[s]}</option>
                                        ))}
                                    </Select>
                                </Field>
                                <Field label="Подпись типа">
                                    <TextInput value={(draft as PortfolioProject).typeLabel} onChange={(e) => patch({typeLabel: e.target.value})} placeholder="Распашные ворота"/>
                                </Field>
                                <Field label="Местоположение">
                                    <TextInput value={(draft as PortfolioProject).location} onChange={(e) => patch({location: e.target.value})} placeholder="г. Заславль"/>
                                </Field>
                                <Field label="Серия / тип конструкции">
                                    <TextInput value={(draft as PortfolioProject).series} onChange={(e) => patch({series: e.target.value})} placeholder="Сэндвич-панель"/>
                                </Field>
                                <Field label="Цвет">
                                    <TextInput value={(draft as PortfolioProject).color} onChange={(e) => patch({color: e.target.value})} placeholder="Антрацит"/>
                                </Field>
                                <Field label="Автоматика">
                                    <TextInput value={(draft as PortfolioProject).automation} onChange={(e) => patch({automation: e.target.value})} placeholder="Alutech"/>
                                </Field>
                                <Field label="Размеры">
                                    <TextInput value={(draft as PortfolioProject).dimensions} onChange={(e) => patch({dimensions: e.target.value})} placeholder="4000 x 2000 мм"/>
                                </Field>
                                <Field label="Срок монтажа">
                                    <TextInput value={(draft as PortfolioProject).timeline} onChange={(e) => patch({timeline: e.target.value})} placeholder="1 день"/>
                                </Field>
                            </div>
                            <Field label="Описание">
                                <TextArea value={(draft as PortfolioProject).description} onChange={(e) => patch({description: e.target.value})} placeholder="Описание выполненных работ"/>
                            </Field>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Широта (latitude)">
                                    <TextInput
                                        type="number"
                                        step="any"
                                        value={coordLat}
                                        onChange={(e) => setCoordLat(e.target.value)}
                                        placeholder="53.9"
                                    />
                                </Field>
                                <Field label="Долгота (longitude)">
                                    <TextInput
                                        type="number"
                                        step="any"
                                        value={coordLng}
                                        onChange={(e) => setCoordLng(e.target.value)}
                                        placeholder="27.56"
                                    />
                                </Field>
                            </div>
                            <Field label="Бейджи (через запятую)">
                                <TextInput value={badgesText} onChange={(e) => setBadgesText(e.target.value)} placeholder="Гарантия на работы, Калитка"/>
                            </Field>
                            <Checkbox
                                label="Показывать в примерах работ на странице услуги"
                                checked={(draft as PortfolioProject).showOnServicePage}
                                onChange={(e) => patch({showOnServicePage: e.target.checked})}
                            />
                        </>
                    )}

                    {/* Pricing */}
                    <div>
                        <h3 className="text-sm font-bold text-[#2F3E46] mb-2">Цена</h3>
                        <PriceFields
                            price={priceable.price}
                            priceOnRequest={priceable.priceOnRequest}
                            pricePrefix={priceable.pricePrefix}
                            onChange={(p) => patch(p)}
                        />
                    </div>

                    {/* Specs — products & projects */}
                    {(kind === 'product' || isProject) && (
                        <div>
                            <h3 className="text-sm font-bold text-[#2F3E46] mb-2">Характеристики</h3>
                            <SpecEditor specs={specs} onChange={(s) => patch({specs: s})}/>
                        </div>
                    )}

                    {/* Photos */}
                    <div>
                        <h3 className="text-sm font-bold text-[#2F3E46] mb-2">Фотографии</h3>
                        <ImageManager images={images} onChange={(imgs) => patch({images: imgs})}/>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-100 px-5 py-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className={`${inputShell} w-auto px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50`}
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isValid}
                        className="px-5 py-2 rounded-lg bg-[#E65F2B] text-white text-sm font-semibold hover:bg-[#d5541e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        {initial ? 'Сохранить' : 'Добавить'}
                    </button>
                </div>
            </div>
        </div>
    );
}
