/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-labels */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { Ref, RefObject, useState } from 'react';
import { chunk, isNumber } from "lodash";
import { CarbonTriangleSolid } from "../../assets/icons/CarbonTriangleSolid";
import ImageItemDetail from "./assetListItem/ImageItemDetails";
import { AssetRows } from "./AssetRows";
interface AssetColumnsProps {
    assets: any[];
    allElement: any;
    columns: number;
    allFilters: {
        data: any[];
        type: string;
    }[];
    rootRef: RefObject<HTMLDivElement>;
    setEditMediaDialog: (data: any) => void;
    loadMoreItems: (query: any) => void;
    loading: boolean;
}



const AssetColumns: React.FC<AssetColumnsProps> = React.memo(({ rootRef, allElement, assets, loading, columns, allFilters, setEditMediaDialog, loadMoreItems }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [selectItemPosition, setSelectItemPosition] = useState<{ left: string; top: string } | undefined>(undefined);
    const [showDetail, setShowDetail]: any = React.useState(undefined)
    const [chunkImageAsset, setChunkImageAsset]: any = React.useState(undefined)
    const [hasMore, setHasMore] = useState(true);
    const [query]: any = useState({
        dateGt: undefined,
        dateLt: undefined,
        filters: {
            orientation: [],
            origins: [],
            assetTypes: [],
            sources: [],
        }
    });

    React.useEffect(() => {
        const activeImageAsset: any[] = [];

        const emptyFilter = allFilters.reduce((acc: any, last: any) => {
            return acc + last.data.length;
        }, 0);

        if (emptyFilter > 0) {
            for (const item of assets) {
                /*let passesFilter = true;
                for (const filters of allFilters) {
                    const filterFunction = filterFunctions[filters.type];
                    if (filters.data.length > 0 && filterFunction) {
                        passesFilter = filterFunction(item, filters.data);
                        if (!passesFilter) break;
                    }
                }*/
                /*if (passesFilter) {
                    activeImageAsset.push(item);
                }*/
            }
        }/* else {
            activeImageAsset.push(...assets);
        }*/
        activeImageAsset.push(...assets);

        setChunkImageAsset(chunk(activeImageAsset, columns));
    }, [columns, assets]);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const lastItem = entries[0];
                if (lastItem.isIntersecting && hasMore) {
                    const currentScroll = rootRef?.current?.scrollTop || 0;
                    if (!loading) {
                        loadMoreItems({ scrollId: allElement.scrollId });
                        rootRef.current?.scrollTo(0, currentScroll - 100);
                        setHasMore(false);
                    }
                }
            },
            { threshold: 0.5 }
        );

        const container = containerRef.current;
        if (container) {
            const lastItem = container.lastElementChild;
            if (lastItem) {
                observer.observe(lastItem);
            }
        }

        const handleScroll = () => {
            const root = rootRef.current;
            if (!root) return;

            const windowHeight = root.clientHeight;
            const documentHeight = root.scrollHeight;
            const scrollTop = root.scrollTop;
            if (windowHeight + scrollTop + 175 >= documentHeight) {
                // Ensure that loadMoreItems is only called once per scroll to bottom
                setHasMore(!hasMore); // Prevent multiple calls
            }
        };

        const root = rootRef.current;
        if (root) {
            root.addEventListener('scroll', handleScroll);
        }

        return () => {
            const container = containerRef.current;
            if (container) {
                const lastItem = container.lastElementChild;
                if (lastItem) {
                    observer.unobserve(lastItem);
                }
            }

            const root = rootRef.current;
            if (root) {
                root.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasMore, loadMoreItems, containerRef, rootRef]);

    return (
        <div>
            <div ref={containerRef}>
                {chunkImageAsset?.map((item: any, index: number) => {
                    const triangleLeft = 80;
                    const triangleTop = 147;
                    const closeViewDetails = () => {
                        setShowDetail(undefined);
                        setSelectItemPosition(undefined);
                    }
                    const handleViewDetails = (rowIndex: number, data: any, element: HTMLDivElement) => {
                        const containerRect = containerRef.current?.getBoundingClientRect();
                        const elementRect = element.getBoundingClientRect();
                        if (containerRect && elementRect) {
                            const left = elementRect.left - containerRect.left + (elementRect.width) + (triangleLeft);
                            const top = elementRect.bottom - containerRect.top + triangleTop;

                            setSelectItemPosition({
                                left: `${left}px`,
                                top: `${top}px`,
                            });
                        }
                        setShowDetail({
                            columnsIndex: index,
                            rowIndex,
                            ...data
                        });
                    };

                    return (
                        <div key={index} className="flex flex-col">
                            <div className="flex gap-x-4">
                                <AssetRows
                                    key={index}
                                    columnsIndex={index}
                                    imageAsset={item}
                                    showDetail={showDetail}
                                    onViewDetails={(rowIndex, data, element) => handleViewDetails(rowIndex, data, element)}
                                    closeViewDetails={closeViewDetails}
                                    onEditMedia={setEditMediaDialog}
                                />
                            </div>
                            {isNumber(showDetail?.columnsIndex) && showDetail?.file?.thumbnails?.large === item[showDetail.rowIndex]?.file?.thumbnails?.large && (
                                <div className="w-full h-full mt-1.5 mb-5">
                                    {selectItemPosition && (
                                        <CarbonTriangleSolid
                                            width={150}
                                            className="absolute"
                                            style={{ left: selectItemPosition.left, top: selectItemPosition.top }}
                                        />
                                    )}
                                    <div className="mt-0 mb-5 h-[850px] bg-white ">
                                        <ImageItemDetail detailData={showDetail} />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div>

            </div>
        </div>
    );
});

export default AssetColumns;




/*
{
copyright: "true",
dateGt: "2024-05-26T12:12:00.000Z",
dateLt: "2024-05-28T20:59:59.000Z",
filters: {
orientation: [
"Horizontal",
],
origins: [
"TRT Bulgarian CMS",
],
assetTypes: [
"image",
],
sources: [
"TRT World",
],
},
}
*/
