'use client';

import {useEffect, useRef, useState} from 'react';
import {MapPin} from 'lucide-react';
import type {PortfolioProject} from './portfolio-data';

interface YMapInstance {
    destroy(): void;
    geoObjects: {
        add(object: unknown): void;
        removeAll(): void;
    };
    setBounds(bounds: unknown, options?: Record<string, unknown>): void;
}

interface YGeoObjectCollection {
    add(object: unknown): void;
    getBounds(): unknown;
}

interface YPlacemark {
    balloon: { close(): void };
    events: {
        add(event: string, callback: (event: { preventDefault(): void }) => void): void;
    };
}

interface YMapsApi {
    ready(callback: () => void): void;
    Map: new (
        element: HTMLElement,
        state: Record<string, unknown>,
        options?: Record<string, unknown>,
    ) => YMapInstance;
    GeoObjectCollection: new (
        properties?: Record<string, unknown>,
        options?: Record<string, unknown>,
    ) => YGeoObjectCollection;
    Placemark: new (
        coordinates: [number, number],
        properties: Record<string, unknown>,
        options?: Record<string, unknown>,
    ) => YPlacemark;
}

declare global {
    interface Window {
        ymaps?: YMapsApi;
        __portfolioYmapsPromise?: Promise<YMapsApi>;
    }
}

const YANDEX_MAPS_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY ?? '78a60ce0-c783-4022-8e62-7748de6fc389';

function loadYmaps(apiKey: string): Promise<YMapsApi> {
    if (window.ymaps) return Promise.resolve(window.ymaps);
    if (window.__portfolioYmapsPromise) return window.__portfolioYmapsPromise;

    window.__portfolioYmapsPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
        script.async = true;
        script.onload = () => {
            if (window.ymaps) {
                window.ymaps.ready(() => resolve(window.ymaps as YMapsApi));
            } else {
                reject(new Error('Yandex Maps failed to initialize'));
            }
        };
        script.onerror = () => reject(new Error('Failed to load Yandex Maps script'));
        document.head.appendChild(script);
    });

    return window.__portfolioYmapsPromise;
}

type MapStatus = 'loading' | 'ready' | 'error' | 'no-key';

interface PortfolioMapProps {
    projects: PortfolioProject[];
    onSelectProject: (project: PortfolioProject) => void;
}

export function PortfolioMap({projects, onSelectProject}: PortfolioMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<YMapInstance | null>(null);
    const onSelectRef = useRef(onSelectProject);
    const [status, setStatus] = useState<MapStatus>(() =>
        YANDEX_MAPS_API_KEY ? 'loading' : 'no-key',
    );

    useEffect(() => {
        onSelectRef.current = onSelectProject;
    }, [projects, onSelectProject]);

    useEffect(() => {
        if (!YANDEX_MAPS_API_KEY) return;
        let cancelled = false;

        loadYmaps(YANDEX_MAPS_API_KEY)
            .then((ymaps) => {
                if (cancelled || !containerRef.current) return;

                const map = new ymaps.Map(containerRef.current, {
                    center: [53.7, 27.95],
                    zoom: 7,
                    controls: ['zoomControl'],
                }, {
                    suppressMapOpenBlock: true,
                });
                mapRef.current = map;
                setStatus('ready');
            })
            .catch(() => {
                if (!cancelled) setStatus('error');
            });

        return () => {
            cancelled = true;
            if (mapRef.current) {
                mapRef.current.destroy();
                mapRef.current = null;
            }
        };
    }, []);

    // Rebuild placemarks when filtered project list changes
    useEffect(() => {
        const map = mapRef.current;
        const ymaps = window.ymaps;
        if (!map || !ymaps || status !== 'ready') return;

        map.geoObjects.removeAll();
        const collection: YGeoObjectCollection = new ymaps.GeoObjectCollection({}, {
            preset: 'islands#orangeDotIcon',
            iconColor: '#E65F2B',
        });

        projects.forEach((project) => {
            const placemark = new ymaps.Placemark(
                project.coordinates,
                {
                    hintContent: project.title,
                },
                {
                    preset: 'islands#orangeDotIcon',
                    iconColor: '#E65F2B',
                    cursor: 'pointer',
                },
            );

            placemark.events.add('click', (e) => {
                e.preventDefault();
                onSelectRef.current(project);
            });

            collection.add(placemark);
        });

        map.geoObjects.add(collection);

        if (projects.length > 0) {
            map.setBounds(collection.getBounds(), {
                checkZoomRange: true,
                zoomMargin: 60,
            });
        }
    }, [projects, status]);

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-200 bg-[#F8F9FA]">
            <div ref={containerRef} className="absolute inset-0 z-0"/>

            {status !== 'ready' && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#F8F9FA] text-center px-6">
                    {status === 'loading' && (
                        <>
                            <div className="w-10 h-10 border-4 border-[#E65F2B] border-t-transparent rounded-full animate-spin"/>
                            <p className="text-sm text-gray-500">Загружаем карту…</p>
                        </>
                    )}
                    {status === 'no-key' && (
                        <>
                            <MapPin className="w-10 h-10 text-[#E65F2B]"/>
                            <p className="text-sm font-medium text-[#2F3E46]">Карта временно недоступна</p>
                            <p className="text-xs text-gray-500 max-w-sm">
                                Для отображения Яндекс.Карт укажите ключ API в переменной окружения{' '}
                                <code className="bg-gray-200 rounded px-1.5 py-0.5">NEXT_PUBLIC_YANDEX_MAPS_API_KEY</code>.
                            </p>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <MapPin className="w-10 h-10 text-gray-400"/>
                            <p className="text-sm font-medium text-[#2F3E46]">Не удалось загрузить карту</p>
                            <p className="text-xs text-gray-500">Проверьте подключение к интернету и ключ API Яндекс.Карт.</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
