import React from 'react'
import './MultiSelectComponent.css'
import { CloseIcon } from '../../../assets/icons/CloseIcon'
import { ChevronUpIcon } from '../../../assets/icons/ChevronUpIcon'
import { ChevronDownIcon } from '../../../assets/icons/ChevronDownIcon'
import { isFeedDuplicated } from '../Task/TaskCardFunction'
import { OkIcon } from '../../../assets/icons/OkIcon'

interface LanguageOption {
  value: string
  name: string
}

interface Props {
  Options: ((query?: any) => Promise<[]>) | unknown[]
  SelectedValues: (() => Promise<LanguageOption | any>) | (LanguageOption | unknown)[]
  optionLabelProperty: string
  optionValueProperty: string
  getIdProperty: string
  title: string
  name: string
  handleScroll?: (
    e: React.UIEvent<HTMLDivElement>,
    startLoading: () => void,
    stopLoading: () => void,
  ) => Promise<void>
  getAllOptions?: (options: any) => void
  isMultiOptional?: {
    name: string
    itemsName: string
  }
  onChange?: (selected: unknown[]) => void // Function to handle changes
}

const MultiSelectComponent: React.FC<Props> = (props) => {
  const [options, setOptions]: [any, any] = React.useState<unknown[]>([])
  const [selected, setSelected] = React.useState<unknown[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null) // Reference to the dropdown container
  const heightRef = React.useRef<HTMLDivElement>(null) // Reference to the dropdown container
  const [loading, setLoading] = React.useState(false)
  const [loadingLoad, setLoadingLoad] = React.useState(false)
  const [filteredOptions, setFilteredOptions] = React.useState<any[]>([])
  const [searchInput, setSearchInput] = React.useState<string | undefined>(undefined)

  const startLoadingLoad = () => {
    setLoadingLoad(true)
  }

  const stopLoadingLoad = () => {
    setLoadingLoad(true)
  }

  React.useEffect(() => {
    if (typeof props.Options === 'function') {
      setLoading(true)
      props
        .Options()
        .then((selectOptions) => {
          setOptions(selectOptions)
          if (typeof props.getAllOptions === 'function') props.getAllOptions(selectOptions)

          setLoading(false)
        })
        .catch((error: unknown) => {
          console.error('Failed to load options:', error)
          setLoading(false)
        })
    } else {
      setOptions(props.Options)
      if (typeof props.getAllOptions === 'function') props.getAllOptions(options)
    }

    if (typeof props.SelectedValues === 'function') {
      setLoading(true)
      props
        .SelectedValues()
        .then((selectValues) => {
          setSelected(selectValues)
          setLoading(false)
        })
        .catch((error: unknown) => {
          console.error('Failed to load selected values:', error)
          setLoading(false)
        })
    } else if (Array.isArray(props.SelectedValues)) {
      setSelected(props.SelectedValues)
    }
    setLoading(false)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const setNewOptions = (e: []) => {
    const options_ = options
    let isChange = false
    e.forEach((newFeed: any) => {
      newFeed.items.forEach((newItem: any) => {
        let isDuplicate = false
        // Iterate over existing options to check for duplicates
        for (const option of options_) {
          if (option.items.some((item: any) => item.id === newItem.id)) {
            isDuplicate = true
            break // Break if a duplicate is found
          }
        }
        // If the item is not a duplicate, find the corresponding feed and add the item
        if (!isDuplicate) {
          const foundFeed = options_.find((option: any) => option.collection === newFeed.collection)
          if (foundFeed) {
            foundFeed.items.push(newItem) // Add to existing feed
          } else {
            // If no corresponding feed is found, create a new feed
            const newOption = {
              collection: newFeed.collection,
              items: [newItem],
            }
            options_.push(newOption)
          }
          isChange = true
        }
      })
    })
    if (isChange) {
      setLoadingLoad(true)
      setOptions(options_)
      setTimeout(() => {
        if (typeof props.getAllOptions === 'function') {
          props.getAllOptions(options_)
        }
        setLoadingLoad(false)
      }, 500)
    }
  }

  const toggleDropdown = () => setIsOpen(!isOpen)

  const toggleOption = (item: any) => {
    item.selected = !item.selected
    let updatedSelected: any[]

    const selectedIndex: any = selected.find(
      (element: any) => item[props.getIdProperty] === element[props.getIdProperty],
    )
    if (selectedIndex) {
      updatedSelected = selected.filter(
        (i: any) => selectedIndex[props.getIdProperty] !== i[props.getIdProperty],
      )
    } else {
      updatedSelected = [...selected, item]
    }
    setSearchInput('')
    setFilteredOptions(options)
    setSelected(updatedSelected)
    if (props.onChange) {
      props.onChange(updatedSelected)
    }
  }

  const selectedValues = () => {
    return selected?.map((item: any) => item[props.optionLabelProperty]) ?? ''
  }

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleDropdown()
  }

  const handleInputClick = (e: React.MouseEvent) => {
    setIsOpen(true)
    e.stopPropagation()
  }

  const filterOptionsBySearch = (searchTerm: string) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    if (searchTerm === '') {
      setFilteredOptions(options) // Reset if search is cleared
    } else {
      let updatedOptions = []
      let itemsFound = true
      if (props.isMultiOptional) {
        updatedOptions = options.map((collection: any) => ({
          ...collection,
          items: collection.items.filter((item: any) =>
            item.source_name.toLowerCase().includes(lowerCaseSearchTerm),
          ),
        }))
        itemsFound = updatedOptions.some((collection: any) => collection.items.length > 0)
      } else {
        updatedOptions = options.filter((item: any) =>
          item.name.toLowerCase().includes(lowerCaseSearchTerm),
        )
        itemsFound = updatedOptions.length > 0
        setFilteredOptions(updatedOptions)
        return
      }
      // Check if any items exist in the updated options
      if (!itemsFound) {
        // No items found, so fetch more options or send a bug report
        setLoadingLoad(true)
        if (typeof props.Options === 'function')
          props
            .Options({ keyword: searchTerm })
            .then((response) => {
              if (response.length > 0) {
                setFilteredOptions(response)
                //setLoadingLoad(false)
              }
              setFilteredOptions([
                { collection: 'Source Collection', items: [] },
                { collection: 'Single Source', items: [] },
              ])
            })
            .catch((e) => {
              console.log()
            })
      } else setFilteredOptions(updatedOptions) // Update the options displayed
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchInput(value) // Update the search input state
    setLoadingLoad(true)
    if (value) {
      filterOptionsBySearch(value)
    } else {
      setFilteredOptions(options) // Reset to original options if search is cleared
    }
    setTimeout(() => {
      setLoadingLoad(false)
    }, 1000)
  }

  const renderMultiOptions = () => {
    const displayOptions = searchInput ? filteredOptions : options
    return displayOptions.map((option: any) => {
      const getItems = option[(props.isMultiOptional as any).itemsName]
      return (
        <div className="relative">
          <div className="sticky top-0 px-4 py-3 z-10 flex items-center font-semibold text-sm text-slate-900 bg-slate-50/90 dark:text-slate-200 dark:bg-slate-700/90 backdrop-blur-sm ring-1 ring-slate-900/10 dark:ring-black/10">
            {option[(props.isMultiOptional as any).name]}
          </div>
          <div className="divide-y dark:divide-slate-200/5">
            {loadingLoad && getItems.length < 1 ? (
              <div className="loading"></div>
            ) : (
              getItems.map((item: any, index: number) => {
                item.selected = Boolean(
                  selected.find(
                    (e: any) => e[props.optionLabelProperty] == item[props.optionLabelProperty],
                  ),
                )
                const isSelected = item.selected && <OkIcon />
                return (
                  <div
                    key={item[props.getIdProperty]}
                    className="cursor-pointer w-full hover:bg-gray-100"
                    onClick={(e) => {
                      toggleOption(item)
                    }}
                  >
                    <div className="flex w-full items-center p-2 pl-2  relative">
                      {loadingLoad && getItems.length == index + 1 ? (
                        <div className="loading"></div>
                      ) : (
                        <div className="flex w-full justify-between	items-center gap-4 p-4">
                          <strong className="text-slate-900 text-sm font-medium dark:text-slate-200">
                            {item[props.optionLabelProperty]}
                          </strong>
                          {isSelected}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )
    })
  }

  const renderOptions = () => {
    const displayOptions = searchInput ? filteredOptions : options
    return displayOptions.map((option: any) => {
      option.selected = Boolean(
        selected.find(
          (e: any) => e[props.optionLabelProperty] == option[props.optionLabelProperty],
        ),
      )
      return (
        <div
          key={option[props.getIdProperty]}
          className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-gray-100"
          onClick={() => {
            toggleOption(option)
          }}
        >
          <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative">
            <div className="mx-2 leading-6">{option[props.optionLabelProperty]}</div>
            {option.selected && <OkIcon />}
          </div>
        </div>
      )
    })
  }

  return (
    <div ref={dropdownRef} className="w-full min-h-14 flex flex-col items-center mx-auto">
      <input name={props.name} type="hidden" value={selectedValues()?.join(',')} />
      <div className="inline-block relative w-full">
        <div className="">{props?.title}</div>
        <div className="flex flex-col items-center relative">
          <div className="w-full">
            <div
              ref={heightRef}
              className="my-2 p-2 divide-x-2 flex border border-gray-200 bg-white rounded"
              onClick={handleDropdownToggle}
            >
              <div className="flex flex-auto flex-wrap gap-x-1 cursor-pointer">
                {loading ? (
                  <div className="loading"></div>
                ) : (
                  selected.map((element: any, index) => (
                    <div
                      key={element[props.getIdProperty]}
                      className="flex justify-center items-center m-1 font-medium py-1 px-1 bg-white rounded bg-gray-100 border"
                    >
                      <div className="text-xs cursor-default font-normal leading-none max-w-full flex-initial">
                        {element[props.optionLabelProperty]}
                      </div>
                      <div
                        className="flex flex-auto flex-row-reverse"
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleOption(element)
                        }}
                      >
                        <CloseIcon />
                      </div>
                    </div>
                  ))
                )}
                <div className="flex justify-center items-center font-medium  bg-white rounded bg-gray-100 ">
                  <input
                    value={searchInput}
                    onChange={handleSearchChange}
                    onClick={handleInputClick}
                    placeholder="Select an option"
                    className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center w-8 pl-1">
                {isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
              </div>
            </div>
          </div>
          {isOpen && (
            <div
              //@ts-ignore

              style={{ top: `${(heightRef?.current?.clientHeight as number) + 23 ?? 65}px` }}
              className={`absolute shadow  bg-white z-40 w-full left-0 rounded max-h-select`}
              onClick={() => setIsOpen(false)}
            >
              {props.isMultiOptional?.name ? (
                <div
                  onScroll={(e) => {
                    if (props.handleScroll && !loadingLoad)
                      props
                        .handleScroll(e, startLoadingLoad, stopLoadingLoad)
                        .then((selectOptions: any) => {
                          setNewOptions(selectOptions)
                        })
                        .catch((error: unknown) => {
                          console.error('Failed to load options:', error)
                        })
                  }}
                  className="relative max-w-md mx-auto bg-white dark:bg-slate-800 shadow-lg max-h-80 overflow-auto ring-1 ring-slate-900/5 -my-px"
                >
                  {renderMultiOptions()}
                </div>
              ) : (
                <div className="flex flex-col w-full overflow-y-auto min-h-2 max-h-64">
                  {renderOptions()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MultiSelectComponent
