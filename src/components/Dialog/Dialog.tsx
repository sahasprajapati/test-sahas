import React, { CSSProperties } from "react";

type width = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | number
type height = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | number
type position = {
    content: 'end' | 'center' | 'start'
    items: 'end' | 'center' | 'start'
}
type Props = {
    position: position,
    style?: CSSProperties,
    width: width,
    height: height,
    templete: any,
    onClose: () => void;
};

const dimensionClassMap = {
    xs: { width: 'w-1/4', height: 'h-1/4' },
    sm: { width: 'w-1/3', height: 'h-1/3' },
    md: { width: 'w-1/2', height: 'h-1/2' },
    lg: { width: 'w-2/3', height: 'h-2/3' },
    xl: { width: 'w-3/4', height: 'h-3/4' },
    full: { width: 'w-full', height: 'h-full' }
};

const Dialog = ({ position, width, height, templete, onClose, style }: Props) => {
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const [positionContent, setPositionContent] = React.useState('justify-end');

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const resolveDimensionClass = (dimension: 'width' | 'height', value: height | width) => {
        if (value in dimensionClassMap) {
            return dimensionClassMap[value as keyof typeof dimensionClassMap][dimension];
        }
        if (typeof value === 'number') {
            return `${dimension === 'width' ? 'w' : 'h'}-[${value}px]`;
        }
        return dimension === 'width' ? 'w-1/2' : 'h-screen'; // Default classes
    };
    React.useEffect(() => {
        if (position.content) {
            setPositionContent('justify-' + (position.content ?? 'end'))

        }
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "visible";
        }
    }, [])
    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">

            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 w-screen">
                <div className={`flex h-screen ${positionContent} items-${position.items}  text-center`}
                >

                    <div ref={dropdownRef}
                        style={style}
                        className={`flex ${resolveDimensionClass('height', height)} overflow-y-auto ${resolveDimensionClass('width', width)} text-center justify-center justify-items-center 
                    transform rounded-lg bg-white`}>
                        {templete}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dialog;
