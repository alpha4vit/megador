'use client';

export function DataLoading({label = 'Загрузка…'}: {label?: string}) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
            <div className="w-10 h-10 border-4 border-[#E65F2B] border-t-transparent rounded-full animate-spin"/>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    );
}
