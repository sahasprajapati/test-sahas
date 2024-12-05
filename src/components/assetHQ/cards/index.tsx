/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useCallback, useState } from "react";
import { HumbleiconsDownload } from "../../../assets/icons/HumbleiconsDownload";
import { MaterialSymbolsCrop } from "../../../assets/icons/MaterialSymbolsCrop";
import { MaterialSymbolsInfo } from "../../../assets/icons/MaterialSymbolsInfo";
import { CarbonCloseFilled } from "../../../assets/icons/CarbonCloseFilled";
import { OouiDownload } from "../../../assets/icons/OouiDownload";
import { format } from 'date-fns';
import moment from "moment";

interface AssetItemProps {
    item: any;
    onViewDetails: (rowIndex: number, item: any, element: HTMLDivElement) => void;
    onEditMedia: (item: any) => void;
    closeViewDetails: () => void;
    rowIndex: number;
    columnsIndex: number;
    showDetail: any;

}


export const AssetItem: React.FC<AssetItemProps> = React.memo(({ item, onViewDetails, closeViewDetails, onEditMedia, rowIndex, columnsIndex, showDetail }) => {
    const isDetailVisible = showDetail?.rowIndex === rowIndex && showDetail?.columnsIndex === columnsIndex;
    const itemRef = React.useRef<HTMLDivElement>(null);

    const handleViewDetails = useCallback(() => {
        closeViewDetails();
        setTimeout(() => {
            if (itemRef.current && !isDetailVisible) {

                onViewDetails(rowIndex, item, itemRef.current);
            }
        }, 0);
    }, [onViewDetails, rowIndex, item]);

    const handleEditMedia = useCallback(() => {
        onEditMedia(item);
    }, [onEditMedia, item]);

    const handleDownloadImage = useCallback(() => {
        fetch(item?.file?.thumbnails?.medium)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'image.jpg';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error downloading image:', error));
    }, [item]);

    return (
        <div ref={itemRef} key={`${columnsIndex}-${rowIndex}`} className="flex max-w-full h-[190px] mb-4">
            <div className="flex flex-col h-full w-[255.85px] duration-500 hover:scale-105 hover:shadow-xl">
                <div className="flex items-center h-[143px] justify-center group backdrop-opacity-100">
                    <img
                        data-oritentation={item?.file?.orientation}
                        src={item?.file.thumbnails?.medium}
                        alt="image"
                        className="relative w-full h-[143px] object-cover"
                    />
                    <div className="absolute hidden items-center bg-gradient-to-t from-black w-full h-full group-hover:flex transform duration-500 top-0">
                        <div className="flex justify-center w-full justify-evenly">
                            <div className="flex flex-col hover:scale-105 group/detail cursor-pointer items-center justify-center" onClick={handleViewDetails}>
                                {!isDetailVisible ? <MaterialSymbolsInfo className="w-7 h-7 group-hover/detail:fill-white" /> : <CarbonCloseFilled className="w-8 h-8 group-hover/crop:fill-white" />}
                                <p className="text-slate-300 font-[Eudoxus_Sans] text-[12px] font-medium group-hover/detail:text-white">
                                    View Details
                                </p>
                            </div>
                            <div className="flex flex-col hover:scale-105 group/crop cursor-pointer items-center justify-center" onClick={handleEditMedia}>
                                <MaterialSymbolsCrop className="w-7 h-7 group-hover/crop:fill-white" />
                                <p className="text-slate-300 font-[Eudoxus_Sans] text-[12px] font-medium group-hover/crop:text-white">
                                    Crop & Use
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-start p-1 pb-2 w-full h-full font-[Eudoxus_Sans] text-[12px] font-medium leading-[15.12px]">
                    <div>
                        <div className="flex pb-1 mb-1 max-w-[175px] max-h-8 text-ellipsis overflow-hidden">{item.title}</div>
                        <div className="flex items-start w-full gap-x-4 font-[Eudoxus_Sans] text-[10px] font-normal leading-[12.6px]">
                            <div>{format(new Date(item.captureDate), 'dd.MM.yyyy')}</div>
                            <div>{item.source.value}</div>
                        </div>
                    </div>
                    <div className="cursor-pointer flex items-center h-full group/download hover:fill-blue-500" onClick={handleDownloadImage}>
                        <OouiDownload className="w-6 h-6 group-hover/download:fill-blue-500" />
                    </div>
                </div>
            </div>
        </div>
    );
});

const getTimeZone = (date: string) => {
    return (new Date(date.replace(/-/g, '/').split('.')[0]).getTimezoneOffset() / 60) * -1;
};

const getDateByZone = (date: string) => {
    try {
        const timeZone = getTimeZone(date);
        const localDate = moment(new Date()).add(-timeZone, 'hours');
        const date_ = moment(date).isBefore(localDate) ? moment(date) : localDate;
        return timeZone > 0
            ? moment(date_).add(timeZone, 'hours').fromNow()
            : moment(date_).subtract(Math.abs(timeZone), 'hours').fromNow();
    } catch (err) {
        console.error(err);
        return '';
    }
};