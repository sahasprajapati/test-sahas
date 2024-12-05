/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
    template: any,
    onClose: () => void;
};

const dimensionClassMap = {
    xs: { width: 'w-1/4', height: 'h-1/4' },
    sm: { width: 'w-1/3', height: 'h-1/3' },
    md: { width: 'w-1/2', height: 'h-1/2' },
    lg: { width: 'w-2/3', height: 'h-2/3' },
    xl: { width: 'w-3/4', height: 'h-3/4' },
    full: { width: 'w-full p-8 pl-32 pr-32', height: 'h-full' }
};

const Dialog = ({ position, width, height, template, onClose, style }: Props) => {
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
        return dimension === 'width' ? 'w-1/2' : 'h-full'; // Default classes
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
        <div className={`relative z-50 delete-document`} aria-labelledby="modal-title" role="dialog" aria-modal="true">

            <div className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity delete-document`}></div>
            <div className={`fixed inset-0 delete-document z-50 ${resolveDimensionClass('width', width)}  ${resolveDimensionClass('height', height)}`}>

                <div className={`flex h-full w-full text-center delete-document`}>

                    <div ref={dropdownRef}
                        style={style}
                        className={`flex w-full h-full overflow-y-auto text-center transform rounded-lg bg-white delete-document__template`}>
                        {template}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dialog;
