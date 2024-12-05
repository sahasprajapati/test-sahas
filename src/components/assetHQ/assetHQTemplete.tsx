/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import Dialog from "./Dialog/Dialog";
import { ImageEditor } from "./ImageEditor";
import AssetColumns from "./AssetColumns";
import { BiSortDown } from "../../assets/icons/BiSortDown";
import { IconoirCloudUpload } from "../../assets/icons/IconoirCloudUpload";
import { HealthiconsUiUserProfileOutline } from "../../assets/icons/HealthiconsUiUserProfileOutline";
import { TRT_Icons } from "../../assets/icons/TRT";
import { AssetHQTempleteContainer } from "./assetHQTempleteContainer";
import { BiSortUpAlt } from "../../assets/icons/BiSortUpAlt";
import { FilterBar } from "./FilterBar";
import { LoadingOverlay } from "./loaderComponent/LoadingOverlay";
import Loader from "./loaderComponent/Loader";

export const t = (text: string) => {
    return text
}

export const AssetHQTemplete = ({ uploadAssetHQ, closeModal }: any) => {
    return (
        <AssetHQTempleteContainer
            uploadAssetHQ={uploadAssetHQ}
            closeModal={closeModal}
        >
            {({
                rootRef,
                editMediaDialog,
                handleGetEditingMediaData,
                handleCloseEditMediaDialog,
                height,
                containerRef,
                resetFiltersAndStates,
                enableCustomField,
                dateRangeFilter,
                dateRangeOptions,
                handleDateRangeSubmit,
                assetTypeFilter,
                assetTypeOptions,
                handleAssetTypeSubmit,
                orientationFilter,
                orientationOptions,
                handleOrientationSubmit,
                sourcesOptions,
                sourcesFilter,
                handleSourcesSubmit,
                originsOptions,
                originsFilter,
                handleOriginsSubmit,
                resolutionsOptions,
                resolutionsFilter,
                handleResolutionsSubmit,
                LanguageOptions,
                LanguageFilter,
                handleLanguageSubmit,
                uploadFormFilter,
                uploadFormOptions,
                handleUploadFormSubmit,
                assetLength,
                renderFilters,
                UploadImage,
                handleSortImages,
                sortOldestToNewest,
                assets,
                columns,
                setEditMediaDialog,
                allFilters,
                allElement,
                loadMoreItems,
                loading,
                newFilterItems,
                rootLoading,
                newQuery,
            }: any) => (
                rootLoading &&
                <div ref={rootRef} className="flex w-[90%] h-full max-w-[1512px] bg-neutral-200/90 gap-x-4 overflow-y-auto delete-document__template">
                    {editMediaDialog &&
                        <Dialog position={{
                            content: "center",
                            items: "center"
                        }}
                            width={'full'}
                            height={'full'}
                            template={

                                <ImageEditor
                                    item={editMediaDialog}
                                    handleGetEditingMediaData={handleGetEditingMediaData}
                                    handleCloseEditMediaDialog={handleCloseEditMediaDialog} />
                            }
                            onClose={handleCloseEditMediaDialog}
                        />
                    }
                    {/*
                        <div className="min-w-16 max-w-16 h-full bg-[#4C89D0]" style={{ minHeight: height }}>
                            <div className="flex items-center w-full">
                                <TRT_Icons className="m-4 w-full" />
                            </div>
                        </div>
                       */}
                    <div className="flex flex-col w-full h-full pl-6">
                        <div className={`flex flex-row justify-between items-center h-16 p-2 gap-y-3 b dark:bg-slate-700 dark:text-white h-34 w-full mb-11
                        font-[Barlow_Semi_Condensed] text-[20px] font-bold leading-[24px]`}>
                            <div>
                                ASSET HQ
                            </div>
                            <div className="flex gap-x-2 flex-wrap justify-between items-center
                            font-[Barlow_Semi_Condensed] text-[14px] font-bold leading-[24px]">
                                <div>
                                    MORAD REYAN
                                </div>
                                <div className="cursor-pointer">
                                    <HealthiconsUiUserProfileOutline width={40} height={40} />
                                </div>
                            </div>
                        </div>

                        <div ref={containerRef} className="flex flex-row h-full w-full">
                            <div className={`flex flex-col shrink w-full max-w-[275px]  h-full`}>
                                <FilterBar
                                    resetFiltersAndStates={resetFiltersAndStates}
                                    enableCustomField={enableCustomField}
                                    dateRangeFilter={dateRangeFilter}
                                    dateRangeOptions={dateRangeOptions}
                                    handleDateRangeSubmit={handleDateRangeSubmit}
                                    assetTypeFilter={assetTypeFilter}
                                    assetTypeOptions={assetTypeOptions}
                                    handleAssetTypeSubmit={handleAssetTypeSubmit}
                                    orientationFilter={orientationFilter}
                                    orientationOptions={orientationOptions}
                                    handleOrientationSubmit={handleOrientationSubmit}
                                    sourcesOptions={sourcesOptions}
                                    sourcesFilter={sourcesFilter}
                                    handleSourcesSubmit={handleSourcesSubmit}
                                    originsOptions={originsOptions}
                                    originsFilter={originsFilter}
                                    handleOriginsSubmit={handleOriginsSubmit}
                                    resolutionsOptions={resolutionsOptions}
                                    resolutionsFilter={resolutionsFilter}
                                    handleResolutionsSubmit={handleResolutionsSubmit}
                                    LanguageOptions={LanguageOptions}
                                    LanguageFilter={LanguageFilter}
                                    handleLanguageSubmit={handleLanguageSubmit}
                                    uploadFormFilter={uploadFormFilter}
                                    uploadFormOptions={uploadFormOptions}
                                    handleUploadFormSubmit={handleUploadFormSubmit}
                                    newFilterItems={newFilterItems}
                                    allFilters={allFilters}
                                    newQuery={newQuery}
                                />
                            </div>

                            <div className={`flex flex-col justify-start pb-4 mb-5 pb-11 pl-16 pr-4 h-full w-full`}>
                                <div className="flex justify-between items-center w-full gap-x-2 pb-6">
                                    <div className="flex items-start min-w-24">
                                        Results: {assetLength}
                                    </div>
                                    <div className="flex flex-wrap gap-x-2 gap-y-2 items-center justify-start grow">
                                        {renderFilters()}
                                    </div>
                                    <div className="flex justify-center items-center h-9">
                                        <label className="flex justify-between items-center min-w-36 p-2 pl-3 bg-white rounded-lg cursor-pointer hover:bg-gray-100">
                                            <input type="file" className="hidden" onChange={UploadImage} />
                                            <div>Upload</div>
                                            <div><IconoirCloudUpload /></div>
                                        </label>
                                    </div>
                                    <div onClick={handleSortImages} className="flex bg-white h-9 rounded-lg h-full max-h-11 flex justify-center items-center cursor-pointer hover:bg-gray-100">
                                        <label className="flex justify-between items-center pt-2 pb-2 p-1 bg-white rounded-lg cursor-pointer hover:bg-gray-100">
                                            {sortOldestToNewest ? <BiSortDown className="w-9 h-7 p-1" /> : <BiSortUpAlt className="w-9 h-7 p-1" />}
                                        </label>
                                    </div>
                                </div>
                                <Loader loaded={rootLoading} onlySpinner={false} >
                                    <div className="h-full w-full">
                                        <AssetColumns
                                            allFilters={allFilters}
                                            allElement={allElement}
                                            assets={assets}
                                            rootRef={rootRef}
                                            columns={columns}
                                            setEditMediaDialog={setEditMediaDialog}
                                            loadMoreItems={loadMoreItems}
                                            loading={loading}
                                        />
                                        <div className="flex w-full h-16 justify-center items-center">
                                            <Loader loaded={!loading} onlySpinner={false} />
                                        </div>

                                    </div>
                                </Loader>
                            </div>
                        </div>
                    </div>
                </div>)
            }
        </AssetHQTempleteContainer>
    )
}