'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';
import {Check, ChevronDown, ImagePlus, Star, Trash2, X} from 'lucide-react';
import type {Spec} from '@/data/types';
import {apiImportImage, apiUploadImage} from '@/data/apiClient';

export function Field({label, children, hint}: {label: string; children: ReactNode; hint?: string}) {
    return (
        <label className="block">
            <span className="block text-xs font-semibold text-gray-600 mb-1">{label}</span>
            {children}
            {hint && <span className="block text-[11px] text-gray-400 mt-1">{hint}</span>}
        </label>
    );
}

const inputCls =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#2F3E46] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E65F2B]/40 focus:border-[#E65F2B]';

export function TextInput(props: React.ComponentProps<'input'>) {
    return <input {...props} className={`${inputCls} ${props.className ?? ''}`}/>;
}

export function TextArea(props: React.ComponentProps<'textarea'>) {
    return <textarea rows={3} {...props} className={`${inputCls} resize-y ${props.className ?? ''}`}/>;
}

export function Select({children, ...props}: React.ComponentProps<'select'>) {
    return <select {...props} className={inputCls}>{children}</select>;
}

/** Badge background classes used across the catalog — must stay literal for Tailwind JIT. */
export const BADGE_STYLE_OPTIONS: {value: string; label: string}[] = [
    {value: 'bg-slate-900', label: 'Тёмно-синий'},
    {value: 'bg-zinc-700', label: 'Графитовый'},
    {value: 'bg-black', label: 'Чёрный'},
    {value: 'bg-[#E65F2B]', label: 'Оранжевый акцент'},
    {value: 'bg-red-700', label: 'Красный'},
    {value: 'bg-emerald-700', label: 'Зелёный'},
    {value: 'bg-blue-800', label: 'Синий'},
];

/** Live preview pill matching how badges render on public catalog cards. */
export function BadgePreview({style, text}: {style: string; text: string}) {
    return (
        <span className={`px-2 py-0.5 ${style} text-white text-[10px] font-semibold rounded-full whitespace-nowrap`}>
            {text}
        </span>
    );
}

/**
 * Visual dropdown for the badge background style: shows a live badge preview
 * inside the field and next to every option. Saved value remains the raw
 * Tailwind class string expected by the backend `badge_style` field.
 */
export function BadgeStyleSelect({
    value,
    badgeText,
    onChange,
}: {
    value: string;
    badgeText: string;
    onChange: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const previewText = badgeText.trim() || 'Хит';

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const options = BADGE_STYLE_OPTIONS.some((o) => o.value === value)
        ? BADGE_STYLE_OPTIONS
        : [...BADGE_STYLE_OPTIONS, {value, label: value}];
    const current = options.find((o) => o.value === value);

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`${inputCls} flex items-center justify-between gap-2 text-left cursor-pointer`}
            >
                <span className="flex items-center gap-2 min-w-0">
                    <BadgePreview style={value} text={previewText}/>
                    <span className="truncate text-gray-500">{current?.label ?? value}</span>
                </span>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}/>
            </button>
            {open && (
                <ul
                    role="listbox"
                    className="absolute z-30 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg py-1"
                >
                    {options.map((o) => (
                        <li key={o.value} role="option" aria-selected={o.value === value}>
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(o.value);
                                    setOpen(false);
                                }}
                                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${o.value === value ? 'text-[#E65F2B] font-semibold' : 'text-[#2F3E46]'}`}
                            >
                                <span className="truncate">{o.label}</span>
                                <span className="flex items-center gap-2 flex-shrink-0">
                                    <BadgePreview style={o.value} text={previewText}/>
                                    {o.value === value && <Check className="w-4 h-4"/>}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export function Checkbox({label, ...props}: React.ComponentProps<'input'> & {label: string}) {
    return (
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" {...props} className="w-4 h-4 accent-[#E65F2B]"/>
            {label}
        </label>
    );
}

/** Flexible pricing block: numeric price (BYN) + "Цена по запросу" toggle. */
export function PriceFields({
    price,
    priceOnRequest,
    pricePrefix,
    onChange,
}: {
    price?: number | null;
    priceOnRequest: boolean;
    pricePrefix?: string;
    onChange: (patch: {price?: number | null; priceOnRequest: boolean; pricePrefix?: string}) => void;
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <Field label="Цена, BYN">
                <TextInput
                    type="number"
                    min={0}
                    step="any"
                    disabled={priceOnRequest}
                    value={price ?? ''}
                    onChange={(e) => onChange({price: e.target.value === '' ? null : Number(e.target.value), priceOnRequest, pricePrefix})}
                    placeholder="например, 2500"
                />
            </Field>
            <Field label="Префикс">
                <TextInput
                    disabled={priceOnRequest}
                    value={pricePrefix ?? ''}
                    onChange={(e) => onChange({price, priceOnRequest, pricePrefix: e.target.value || undefined})}
                    placeholder="от"
                />
            </Field>
            <Checkbox
                label="Цена по запросу"
                checked={priceOnRequest}
                onChange={(e) => onChange({priceOnRequest: e.target.checked, price, pricePrefix})}
            />
        </div>
    );
}

/** Key-value editor for dynamic specifications (Характеристики). */
export function SpecEditor({specs, onChange}: {specs: Spec[]; onChange: (specs: Spec[]) => void}) {
    const update = (i: number, patch: Partial<Spec>) =>
        onChange(specs.map((s, idx) => (idx === i ? {...s, ...patch} : s)));
    return (
        <div className="space-y-2">
            {specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-2">
                    <TextInput
                        value={spec.label}
                        onChange={(e) => update(i, {label: e.target.value})}
                        placeholder="Характеристика (напр. Размеры)"
                        className="w-2/5"
                    />
                    <TextInput
                        value={spec.value}
                        onChange={(e) => update(i, {value: e.target.value})}
                        placeholder="Значение (напр. 4000x2000)"
                        className="flex-1"
                    />
                    <button
                        type="button"
                        onClick={() => onChange(specs.filter((_, idx) => idx !== i))}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Удалить характеристику"
                    >
                        <Trash2 className="w-4 h-4"/>
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={() => onChange([...specs, {label: '', value: ''}])}
                className="text-sm font-semibold text-[#E65F2B] hover:underline"
            >
                + Добавить характеристику
            </button>
        </div>
    );
}

/**
 * Photo manager: multiple image URLs + local file uploads (converted to
 * base64 data URLs so they preview immediately without a backend).
 * The first image is the cover.
 */
export function ImageManager({images, onChange, onError}: {images: string[]; onChange: (images: string[]) => void; onError?: (message: string) => void}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const urlRef = useRef<HTMLInputElement>(null);
    const imagesRef = useRef(images);
    imagesRef.current = images;
    const [uploading, setUploading] = useState(0);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);

    const addFiles = async (files: FileList | null) => {
        if (!files) return;
        const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
        if (valid.length === 0) return;
        setUploading((n) => n + valid.length);
        for (const file of valid) {
            try {
                const uploaded = await apiUploadImage(file);
                onChange([...imagesRef.current, uploaded.url]);
            } catch (e) {
                onError?.(e instanceof Error ? e.message : 'Не удалось загрузить изображение');
            } finally {
                setUploading((n) => n - 1);
            }
        }
    };

    const addUrl = async () => {
        const url = urlRef.current?.value.trim();
        if (!url) return;
        urlRef.current && (urlRef.current.value = '');
        // Remote URLs are downloaded, compressed to WebP and self-hosted.
        // Local/public paths (/...) are kept as-is.
        if (/^https?:\/\//i.test(url)) {
            setUploading((n) => n + 1);
            try {
                const imported = await apiImportImage(url);
                onChange([...imagesRef.current, imported.url]);
            } catch {
                onChange([...imagesRef.current, url]);
                onError?.('Не удалось импортировать картинку — добавлена внешняя ссылка');
            } finally {
                setUploading((n) => n - 1);
            }
        } else {
            onChange([...images, url]);
        }
    };

    const reorder = (from: number, to: number) => {
        if (from === to || from < 0 || to < 0) return;
        const next = [...images];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        onChange(next);
    };

    const moveToCover = (index: number) => {
        if (index === 0) return;
        const next = [...images];
        const [item] = next.splice(index, 1);
        next.unshift(item);
        onChange(next);
    };

    return (
        <div className="space-y-3">
            {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2" data-image-guard-exclude>
                    {images.map((src, i) => (
                        <div
                            key={i}
                            draggable
                            onDragStart={(e) => {
                                setDragIndex(i);
                                e.dataTransfer.effectAllowed = 'move';
                                e.dataTransfer.setData('text/plain', String(i));
                            }}
                            onDragEnd={() => {
                                setDragIndex(null);
                                setOverIndex(null);
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                if (overIndex !== i) setOverIndex(i);
                            }}
                            onDragLeave={() => {
                                if (overIndex === i) setOverIndex(null);
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                const from = dragIndex ?? Number(e.dataTransfer.getData('text/plain'));
                                reorder(from, i);
                                setDragIndex(null);
                                setOverIndex(null);
                            }}
                            className={`relative group aspect-square rounded-lg overflow-hidden border bg-gray-50 select-none cursor-grab active:cursor-grabbing ${
                                overIndex === i && dragIndex !== null && dragIndex !== i
                                    ? 'border-[#E65F2B] ring-2 ring-[#E65F2B]/40'
                                    : 'border-gray-200'
                            } ${dragIndex === i ? 'opacity-40' : ''}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt="" className="w-full h-full object-cover"/>
                            {i === 0 && (
                                <span className="absolute top-1 left-1 flex items-center gap-1 bg-[#2F3E46]/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                    <Star className="w-3 h-3 fill-current"/> Обложка
                                </span>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                {i !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => moveToCover(i)}
                                        className="bg-white/90 text-[#2F3E46] text-[10px] font-semibold px-2 py-1 rounded hover:bg-white"
                                        title="Сделать обложкой"
                                    >
                                        Обложка
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                                    className="bg-red-500/90 text-white p-1.5 rounded hover:bg-red-500"
                                    aria-label="Удалить фото"
                                >
                                    <X className="w-3.5 h-3.5"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex flex-1 gap-2">
                    <TextInput ref={urlRef} placeholder="Вставьте URL изображения" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}/>
                    <button type="button" onClick={addUrl} className="px-3 py-2 text-sm font-semibold text-[#2F3E46] border border-gray-200 rounded-lg hover:bg-gray-50 whitespace-nowrap">
                        Добавить
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading > 0}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-[#2F3E46] border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                    <ImagePlus className="w-4 h-4"/> {uploading > 0 ? `Загрузка… (${uploading})` : 'Загрузить файл'}
                </button>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        addFiles(e.target.files);
                        e.target.value = '';
                    }}
                />
            </div>
            <p className="text-[11px] text-gray-400">Первое фото используется как обложка. Загруженные файлы сжимаются в WebP и хранятся на сервере.</p>
        </div>
    );
}
