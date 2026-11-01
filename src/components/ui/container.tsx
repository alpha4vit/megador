import {ReactNode} from 'react';

interface ContainerProps {
    children: ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    background?: 'white' | 'muted' | 'gray';
}

export const Container = ({children, className = '', size = 'lg', background = 'white'}: ContainerProps) => {
    const sizes = {
        sm: 'max-w-4xl',
        md: 'max-w-5xl',
        lg: 'max-w-6xl',
        xl: 'max-w-7xl',
    };

    const backgrounds = {
        white: 'bg-white',
        muted: 'bg-[#F8F9FA]',
        gray: 'bg-zinc-50 border-y border-gray-100/50',
    };

    return (
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className} ${backgrounds[background]}`}>
            {children}
        </div>
    );
};
