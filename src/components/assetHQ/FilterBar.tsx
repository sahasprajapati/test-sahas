/* eslint-disable */
import React from 'react';
import { CheckboxInputComponent } from "./CheckboxInputComponent"
import { RadioInputComponent } from "./RadioInputComponent"
import { SearchButton } from "./searchButton"




interface Filters {
    dateGt?: Date;
    dateLt?: Date;
    filters?: {
        [key: string]: string[];
    };
}
interface FilterFunction {
    (filters: any[]): any;
}

type FilterFunctions = {
    [key: string]: FilterFunction;
};

interface FilterBarProps {
    resetFiltersAndStates: () => void;
    enableCustomField: boolean;
    dateRangeFilter: any;
    dateRangeOptions: any[];
    handleDateRangeSubmit: (value: any) => void;
    assetTypeFilter: any;
    assetTypeOptions: any[];
    handleAssetTypeSubmit: (value: any) => void;
    orientationFilter: any;
    orientationOptions: any[];
    handleOrientationSubmit: (value: any) => void;
    sourcesOptions: any[];
    sourcesFilter: any;
    handleSourcesSubmit: (value: any) => void;
    originsOptions: any[];
    originsFilter: any;
    handleOriginsSubmit: (value: any) => void;
    resolutionsOptions: any[];
    resolutionsFilter: any;
    handleResolutionsSubmit: (value: any) => void;
    LanguageOptions: any[];
    LanguageFilter: any;
    handleLanguageSubmit: (value: any) => void;
    uploadFormFilter: any;
    uploadFormOptions: any[];
    handleUploadFormSubmit: (value: any) => void;
    newFilterItems: (query: any) => void;
    allFilters: any;
    newQuery: any;
}

export const FilterBar: React.FC<FilterBarProps> = ({
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
    newFilterItems,
    allFilters,
    newQuery,
}) => {

    const applyDateRangeFilter = (filters: any[]) => {
        return [filters[0].Date[0], filters[0].Date[1]]


        /* return filters.some((filter) => {
             const startDate = filter.Date[0];
             const endDate = filter.Date[1];
             if (item.captureDate) {
                 const captureDate = new Date(item.captureDate);
                 query.dateGt = startDate
                 query.dateLt = endDate
                 return captureDate >= startDate && captureDate <= endDate;
             }
             return true;
         });*/
    };

    const applyAssetTypeFilter = (filters: any[]) => {
        return filters.map((element) => { return element.name })
        // return filters.some((filter) => item.type.toLowerCase() === filter.name.toLowerCase());
    };

    const applyOrientationFilter = (filters: any[]) => {
        return filters.map((element) => { return element.name })
        // return filters.some((filter) => item.file.orientation.toLowerCase() === filter.name.toLowerCase());
    };

    const applySourcesFilter = (filters: any[]) => {
        return filters.map((element) => { return element.name })

        // return filters.some((filter) => item.source.value.toLowerCase() === filter.name.toLowerCase());
    };

    const applyOriginsFilter = (filters: any[]) => {
        return filters.map((element) => { return element.name })
    };

    const filterFunctions: FilterFunctions = {
        dateRangeFilter: applyDateRangeFilter,
        'filters.assetTypes': applyAssetTypeFilter,
        'filters.orientation': applyOrientationFilter,
        'filters.sources': applySourcesFilter,
        'filters.origins': applyOriginsFilter,

        // Add other filter types here with corresponding functions
    };

    React.useEffect(() => {
        const query: Filters = {}
        query.filters = {}
        for (const filters of allFilters) {
            const filterFunction = filterFunctions[filters.type];
            if (filters.data.length > 0 && filterFunction) {
                const result = filterFunction(filters.data);
                if (!result) break;
                else if (filters.type === 'dateRangeFilter') {
                    if (result[1]) {
                        query['dateGt'] = result[0]
                        query['dateLt'] = result[1]
                    }
                }
                else {
                    const newType = filters.type.split('.')
                    query.filters[newType[1]] = result
                }
            }
        }
        if (query.filters && Object.keys(query.filters).length === 0) {
            delete query.filters;
        }
        if (newQuery)
            if (Object.keys(query).length > 0)
                newFilterItems(query)
            else
                newFilterItems({ limit: 25 })

    }, [allFilters])

    return (
        <div className="flex flex-col w-full h-full gap-y-2 w-full items-start">
            <div className="w-full">
                <SearchButton />
            </div>
            <div className="flex flex-row justify-between items-center px-2 w-full font-[Eudoxus_Sans] text-[14px] font-bold leading-[24px]">
                <div>Filter By</div>
                <div className="text-sm cursor-pointer" onClick={resetFiltersAndStates}>Clear</div>
            </div>
            <div className="w-full">
                <RadioInputComponent
                    enableCustomField={enableCustomField}
                    title="Date Range"
                    selectedOption={dateRangeFilter}
                    options={dateRangeOptions}
                    onSubmit={handleDateRangeSubmit}
                />
            </div>
            <div className="w-full">
                <CheckboxInputComponent
                    width='w-full'
                    height='max-h-48'
                    title="Asset Types"
                    enableSearch={true}
                    selectedOption={assetTypeFilter}
                    options={assetTypeOptions}
                    onSubmit={handleAssetTypeSubmit}
                />
            </div>
            <div className="w-full">
                <CheckboxInputComponent
                    width='w-full'
                    height='max-h-48'
                    title="Orientation"
                    enableSearch={true}
                    selectedOption={orientationFilter}
                    options={orientationOptions}
                    onSubmit={handleOrientationSubmit}
                />
            </div>
            <div className="w-full">
                <CheckboxInputComponent
                    enableSearch={false}
                    width='w-full'
                    height='max-h-48'
                    title="Sources"
                    options={sourcesOptions}
                    selectedOption={sourcesFilter}
                    onSubmit={handleSourcesSubmit}
                />
            </div>
            <div className="w-full">
                <CheckboxInputComponent
                    enableSearch={false}
                    width='w-full'
                    height='max-h-48'
                    title="Origins"
                    options={originsOptions}
                    selectedOption={originsFilter}
                    onSubmit={handleOriginsSubmit}
                />
            </div>
            <div className="w-full">
                <CheckboxInputComponent
                    enableSearch={true}
                    width='w-full'
                    height='max-h-48'
                    title="Resolutions"
                    options={resolutionsOptions}
                    selectedOption={resolutionsFilter}
                    onSubmit={handleResolutionsSubmit}
                />
            </div>
            <div className="w-full">
                <CheckboxInputComponent
                    enableSearch={true}
                    width='w-full'
                    height='max-h-48'
                    title="Language"
                    options={LanguageOptions}
                    selectedOption={LanguageFilter}
                    onSubmit={handleLanguageSubmit}
                />
            </div>
            <div className="w-full">
                <RadioInputComponent
                    enableCustomField={false}
                    selectedOption={uploadFormFilter}
                    title="Upload From"
                    options={uploadFormOptions}
                    onSubmit={handleUploadFormSubmit}
                />
            </div>
        </div>
    );
};
