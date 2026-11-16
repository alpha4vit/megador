'use client';

import {useRef, type ReactNode} from 'react';
import {ImagePlus, Star, Trash2, X} from 'lucide-react';
import type {Spec} from '@/data/types';

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
export function ImageManager({images, onChange}: {images: string[]; onChange: (images: string[]) => void}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const urlRef = useRef<HTMLInputElement>(null);

    const addFiles = (files: FileList | null) => {
        if (!files) return;
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') onChange([...images, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const addUrl = () => {
        const url = urlRef.current?.value.trim();
        if (url) {
            onChange([...images, url]);
            if (urlRef.current) urlRef.current.value = '';
        }
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
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {images.map((src, i) => (
                        <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
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
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-[#2F3E46] border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                    <ImagePlus className="w-4 h-4"/> Загрузить файл
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
            <p className="text-[11px] text-gray-400">Первое фото используется как обложка. Локальные файлы сохраняются как Base64 — для продакшена лучше использовать URL.</p>
        </div>
    );
}
