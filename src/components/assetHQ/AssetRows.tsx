/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { AssetItem } from "./cards";

interface AssetRowsProps {
    columnsIndex: number;
    onViewDetails: (rowIndex: number, item: any, element: HTMLDivElement) => void;
    closeViewDetails: () => void;
    onEditMedia: (item: any) => void;
    imageAsset: any[];
    showDetail: any;
}

export const AssetRows: React.FC<AssetRowsProps> = React.memo(({ columnsIndex,showDetail, closeViewDetails,onViewDetails, onEditMedia, imageAsset }) => {
    return (
        <>
            {imageAsset.map((item, index) => (
                <AssetItem
                    key={`${columnsIndex}-${index}`}
                    columnsIndex={columnsIndex}
                    rowIndex={index}
                    item={item}
                    showDetail={showDetail}
                    onViewDetails={onViewDetails}
                    closeViewDetails={closeViewDetails}
                    onEditMedia={onEditMedia}
                />
            ))}
        </>
    );
});

