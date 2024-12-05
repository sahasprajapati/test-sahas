/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, ReactNode, RefObject, SetStateAction } from 'react'
import { t } from './assetHQTemplete'
import { Data } from './mocData'
import { CloseIcon } from '../../assets/icons/CloseIcon'
import axios from 'axios'

interface Tag {
  name: string
  label: string
  value?: any
  Date?: Date[]
}

interface FilterOption {
  name: string
  label: string
  Date?: Date[]
}

interface Filter {
  data: FilterOption[]
  type: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Assets {
  // Define the properties of ImageAsset
  // Example: id: string;
}

interface ChildProps {
  editMediaDialog: Assets | undefined
  handleGetEditingMediaData: (data: Assets) => void
  handleCloseEditMediaDialog: () => void
  height: number
  containerRef: RefObject<HTMLDivElement | null>
  resetFiltersAndStates: () => void
  enableCustomField: boolean
  dateRangeFilter: FilterOption[]
  dateRangeOptions: FilterOption[]
  handleDateRangeSubmit: (value: FilterOption, customFieldValue: any) => void // Adjust customFieldValue type as needed
  assetTypeFilter: FilterOption[]
  assetTypeOptions: FilterOption[]
  handleAssetTypeSubmit: (value: FilterOption) => void
  orientationFilter: FilterOption[]
  orientationOptions: FilterOption[]
  handleOrientationSubmit: (value: FilterOption) => void
  sourcesOptions: FilterOption[]
  sourcesFilter: FilterOption[]
  handleSourcesSubmit: (value: FilterOption) => void
  originsOptions: FilterOption[]
  originsFilter: FilterOption[]
  handleOriginsSubmit: (value: FilterOption) => void
  resolutionsOptions: FilterOption[]
  resolutionsFilter: FilterOption[]
  handleResolutionsSubmit: (value: FilterOption) => void
  LanguageOptions: FilterOption[]
  LanguageFilter: FilterOption[]
  handleLanguageSubmit: (value: FilterOption) => void
  uploadFormFilter: FilterOption[]
  uploadFormOptions: FilterOption[]
  handleUploadFormSubmit: (value: FilterOption) => void
  assetLength: number
  renderFilters: () => ReactNode[][]
  UploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void // Adjust the event type as needed
  handleSortImages: () => void
  sortOldestToNewest: boolean
  assets: Assets[]
  columns: number
  setEditMediaDialog: Dispatch<SetStateAction<Assets | undefined>> // Adjust the state type as needed
  allFilters: Filter[]
  rootRef: RefObject<any> // Adjust the type as needed
  loadMoreItems: (query: any) => void
  newFilterItems: (query: any) => void
  loading: boolean
  allElement: any
  rootLoading: boolean
  newQuery: boolean
}

interface Facets {
  [key: string]: {
    otherCount: number
    buckets: {
      value: string
      count: number
    }[]
  }
}
interface Props {
  uploadAssetHQ: (data: any) => void // Adjust the data type as needed
  closeModal: () => void
  children: (props: ChildProps) => ReactNode
}

export const AssetHQTempleteContainer = ({ uploadAssetHQ, closeModal, children }: Props) => {
  const myData = Data
  const rootRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState(350)
  const [assets, setAssets]: any = React.useState([])
  const [assetLength, setAssetLength]: any = React.useState(0)
  const [editMediaDialog, setEditMediaDialog]: any = React.useState(undefined)
  const [editMediaData, setEditMediaData]: any = React.useState(undefined)
  const [columns, setColumns] = React.useState(0)
  const [enableCustomField, setEnableCustomField] = React.useState(false)
  const dateRangeOptions = [
    {
      name: 'last24Hours',
      label: t('last 24 Hours'),
    },
    {
      name: 'last48Hours',
      label: t('last 48 Hours'),
    },
    {
      name: 'lastWeek',
      label: t('lastWeek'),
    },
    {
      name: 'lastMonth',
      label: t('last Month'),
    },
    {
      name: 'customDates',
      label: t('custom Dates'),
    },
  ]
  const uploadFormOptions = [
    {
      name: 'Agency',
      label: t('Agency'),
    },
    {
      name: 'Editor',
      label: t('Editor'),
    },
  ]
  const [orientationOptions, setOrientationOptions] = React.useState([])
  const [assetTypeOptions, setAssetTypeOptions] = React.useState([])
  const [sourcesOptions, setSourcesOptions] = React.useState([])
  const [originsOptions, setOriginsOptions] = React.useState([])
  const [resolutionsOptions, setResolutionsOptions] = React.useState([])
  const [LanguageOptions, setLanguageOptions] = React.useState([])
  const [dateRangeFilter, setDateRangeFilter] = React.useState<Tag[]>([])
  const [assetTypeFilter, setAssetTypeFilter] = React.useState<Tag[]>([])
  const [orientationFilter, setOrientationFilter] = React.useState<Tag[]>([])
  const [sourcesFilter, setSourcesFilter] = React.useState<Tag[]>([])
  const [originsFilter, setOriginsFilter] = React.useState<Tag[]>([])
  const [resolutionsFilter, setResolutionsFilter] = React.useState<Tag[]>([])
  const [LanguageFilter, setLanguageFilter] = React.useState<Tag[]>([])
  const [uploadFormFilter, setuploadFormFilter] = React.useState<Tag[]>([])
  const [sortOldestToNewest, setSortOldestToNewest] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [rootLoading, setRootLoading] = React.useState(false)
  const [newQuery, setNewQuery] = React.useState(true)
  const [allElement, setAllElement] = React.useState(undefined)

  const allFilters = [
    { data: [...dateRangeFilter], type: 'dateRangeFilter' },
    { data: [...assetTypeFilter], type: 'filters.assetTypes' },
    { data: [...orientationFilter], type: 'filters.orientation' },
    { data: [...sourcesFilter], type: 'filters.sources' },
    { data: [...originsFilter], type: 'filters.origins' },
    { data: [...resolutionsFilter], type: 'resolutionsFilter' },
    { data: [...LanguageFilter], type: 'LanguageFilter' },
    { data: [...uploadFormFilter], type: 'uploadFormFilter' },
  ]
  const newFilterItems = (query: any) => {
    axios
      .get('http://localhost:3030/api/asset', { params: query })
      .then((response) => {
        setRootLoading(false)
        setNewQuery(false)
        const assets: any = response.data.assets
        setAllElement(response.data)
        setAssetLength(assets.length)
        const result_ = sortImagesByProperty(assets, 'captureDate', true)

        setAssets(result_)
        setRootLoading(true)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  React.useEffect(() => {
    const handleResize = () => {
      const params = {
        limit: 1,
        /*filters: {
                    assetTypes: ['image']
                }*/
      }
      axios
        .get('http://localhost:3030/api/asset', { params })
        .then((response) => {
          setRootLoading(false)
          const result: any = response.data.facets
          const facets: any = response.data.facets
          const assets: any = response.data.assets

          setOrientationOptions(facets.orientation.buckets)
          setAssetTypeOptions(facets.assetTypes.buckets)
          setSourcesOptions(facets.sources.buckets)
          setOriginsOptions(facets.origins.buckets)
          setResolutionsOptions(facets.resolutions.buckets)
          setLanguageOptions(facets.language.buckets)

          //setAssetLength(assets.length)
          const columns = getNumberOfColumns(window.innerWidth)
          const result_ = sortImagesByProperty(assets, 'captureDate', true)

          /*if (containerRef.current) {
                      setHeight((containerRef?.current?.scrollHeight + 150 ?? 350))
                  }*/
          setColumns(columns)
          // setAssets(result_);
          setRootLoading(true)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        closeModal()
      }
    }

    handleResize()
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', handleResize)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  React.useEffect(() => {
    //@ts-ignore
    if (containerRef.current) setHeight(containerRef?.current?.scrollHeight + 150 ?? 350)
  }, [containerRef?.current?.scrollHeight])

  const renderFilters = React.useCallback(() => {
    return allFilters.map(({ data, type }) => {
      return data.map((tag, index: number) => {
        let label = tag.label
        if (tag.name === 'customDates' && tag.Date)
          label = `from \t ${tag.Date[0]?.toLocaleDateString() ?? ''} \t to \t ${
            tag.Date[1]?.toLocaleDateString() ?? ''
          }`
        return (
          <div
            key={`${tag.label}-${index}`}
            className="font-sans text-sm font-semibold text-slate-900 bg-blue-100/50 border-2 rounded-xl shadow-sm  border-blue-400"
          >
            <div className="flex group p-1 pl-1 w-full justify-between">
              <div className="flex pl-1 pr-1 text-cyan-900">{label}</div>
              <div
                onClick={() => handleRemoveFilter(index, type)}
                className="flex items-center w-4 rounded-md invisible cursor-pointer group-hover:visible "
              >
                <CloseIcon />
              </div>
            </div>
          </div>
        )
      })
    })
  }, [allFilters])

  const handleRemoveFilter = (index: number, type: string) => {
    setNewQuery(true)
    switch (type) {
      case 'dateRangeFilter':
        if (enableCustomField) setEnableCustomField(false)
        const updatedDateRangeFilter = [...dateRangeFilter]
        updatedDateRangeFilter.splice(index, 1)
        setDateRangeFilter(updatedDateRangeFilter)
        break
      case 'filters.orientation':
        const updatedOrientationFilter = [...orientationFilter]
        updatedOrientationFilter.splice(index, 1)
        setOrientationFilter(updatedOrientationFilter)
        break
      case 'filters.assetTypes':
        const updatedAssetTypeFilter = [...assetTypeFilter]
        updatedAssetTypeFilter.splice(index, 1)
        setAssetTypeFilter(updatedAssetTypeFilter)
        break
      case 'filters.sources':
        const updatedSourcesFilter = [...sourcesFilter]
        updatedSourcesFilter.splice(index, 1)
        setSourcesFilter(updatedSourcesFilter)
        break
      case 'filters.origins':
        const updatedOriginsFilter = [...originsFilter]
        updatedOriginsFilter.splice(index, 1)
        setOriginsFilter(updatedOriginsFilter)
        break
      case 'resolutionsFilter':
        const updatedResolutionsFilter = [...resolutionsFilter]
        updatedResolutionsFilter.splice(index, 1)
        setResolutionsFilter(updatedResolutionsFilter)
        break
      case 'languageFilter':
        const updatedLanguageFilter = [...LanguageFilter]
        updatedLanguageFilter.splice(index, 1)
        setLanguageFilter(updatedLanguageFilter)
        break
      case 'uploadFormFilter':
        const updatedUploadFormFilter = [...uploadFormFilter]
        updatedUploadFormFilter.splice(index, 1)
        setuploadFormFilter(updatedUploadFormFilter)
        break
      default:
        break
    }
  }

  const handleDateRangeSubmit = (value: any, customFieldValue: any) => {
    setNewQuery(true)

    setEnableCustomField(false)
    const now = new Date()

    switch (value?.name) {
      case 'last24Hours':
        value.Date = [new Date(now.getTime() - 24 * 60 * 60 * 1000), now]
        break
      case 'last48Hours':
        value.Date = [new Date(now.getTime() - 48 * 60 * 60 * 1000), now]
        break
      case 'lastWeek':
        const lastWeekStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
        value.Date = [lastWeekStartDate, now]
        break
      case 'lastMonth':
        const lastMonthStartDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        value.Date = [lastMonthStartDate, now]
        break
        break

      case 'customDates':
        setEnableCustomField(true)
        value.Date = customFieldValue
        break

      default:
        break
    }
    if (value) setDateRangeFilter([value])
    else setDateRangeFilter([])
  }

  const handleAssetTypeSubmit = (value: any) => {
    setNewQuery(true)
    setAssetTypeFilter(value)
  }
  const handleOrientationSubmit = (value: any) => {
    setNewQuery(true)
    setOrientationFilter(value)
  }

  const handleSourcesSubmit = (value: any) => {
    setNewQuery(true)
    setSourcesFilter(value)
  }

  const handleOriginsSubmit = (value: any) => {
    setNewQuery(true)
    setOriginsFilter(value)
  }

  const handleResolutionsSubmit = (value: any) => {
    setNewQuery(true)
    setResolutionsFilter(value)
  }

  const handleLanguageSubmit = (value: any) => {
    setNewQuery(true)
    setLanguageFilter(value)
  }

  const handleUploadFormSubmit = (value: any) => {
    if (value) {
      setNewQuery(true)
      setuploadFormFilter([value])
    } else setuploadFormFilter([])
  }

  const handleGetEditingMediaData = (data: any) => {
    uploadAssetHQ(data)
    setEditMediaData(data)
    setEditMediaDialog(undefined)
  }

  const handleCloseEditMediaDialog = () => {
    setEditMediaDialog(undefined)
    resetFiltersAndStates()
  }

  const resetFiltersAndStates = () => {
    setNewQuery(true)
    setDateRangeFilter([])
    setOrientationFilter([])
    setAssetTypeFilter([])
    setSourcesFilter([])
    setOriginsFilter([])
    setResolutionsFilter([])
    setLanguageFilter([])
    setuploadFormFilter([])
  }

  const handleSortImages = () => {
    let sortedImageAsset = [] // Initialize an array to hold the sorted image assets
    if (!sortOldestToNewest) sortedImageAsset = sortImagesByProperty(assets, 'captureDate', true)
    else sortedImageAsset = sortImagesByProperty(assets, 'captureDate', false)
    setSortOldestToNewest(!sortOldestToNewest)
    setAssets(sortedImageAsset)
  }

  const fetchNewImages = (query: any): Promise<any> => {
    return axios
      .get('http://localhost:3030/api/asset/scroll', { params: query })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.error('Error fetching new images:', error)
        throw error
      })
  }

  const loadMoreItems = React.useCallback((query: any) => {
    setLoading(true)
    fetchNewImages(query)
      .then((response) => {
        setTimeout(() => {
          if (response.assets.length > 0) {
            setAssets((prevImages: any) => [...prevImages, ...response.data])
          }
          setLoading(false)
        }, 500)
      })
      .catch((error) => {
        console.error('Error fetching new images:', error)
        throw error
      })
  }, [])

  return children({
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
    loadMoreItems,
    newFilterItems,
    loading,
    rootLoading,
    newQuery,
    allElement,
    rootRef,
  })
}

const getNumberOfColumns = (width: any) => {
  if (width <= 847) return 1
  if (width > 847 && width <= 1176) return 2
  if (width > 1176 && width <= 1411) return 3
  if (width > 1411 && width <= 1512) return 4
  if (width > 1512) return 4
  return 3
}

const sortImagesByProperty = (imagesArray: any[], property: string, newestFirst: boolean) => {
  const sortedArray = [...imagesArray]

  sortedArray.sort((a, b) => {
    const dateA = new Date(a[property])
    const dateB = new Date(b[property])

    if (newestFirst) {
      return dateB.getTime() - dateA.getTime()
    } else {
      return dateA.getTime() - dateB.getTime()
    }
  })

  return sortedArray
}

const UploadImage = (e: any) => {
  e.preventDefault()
  let files
  if (e.dataTransfer) {
    files = e.dataTransfer.files
  } else if (e.target) {
    files = e.target.files
  }
  const reader = new FileReader()
  reader.onload = () => {}
  reader.readAsDataURL(files[0])
}
