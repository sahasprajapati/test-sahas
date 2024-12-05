/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import { Service } from "../services/service";
import MultiSelectComponent from "../MultiSelectComponent/MultiSelectComponent";
import { useForm, Controller } from 'react-hook-form';
import {  CreateColumnProps,  DeckConfig, LanguageOption } from "../type/kanbanTypes";
import { queryBuilder } from "../utils";
import _ from "lodash";
import { getTimeZone, isFeedDuplicated } from "../Task/TaskCardFunction";
import moment from "moment";


const UpdateColumn = ({
    userData,
    page,
    activePage,
    tasks,
    decksLength,
    column,
    languagesOptions,
    createDeck
}: CreateColumnProps) => {
    const [query, setQuery]: [any, any] = React.useState({ keyword: '' })
    const [keyword, setKeyword]: [any, any] = React.useState(undefined)
    const [sources, setSources]: [any, any] = React.useState(undefined)
    const [loading, setLoading] = React.useState(true);

    const fetchOptionsFromAPISOURCES = (query?: any) => {
        return Service.getSources(query ?? { keyword: '' })
            .then((response: any) => {
                const sourceOptions = Array.isArray(response.data) ? response.data : [];
                return sourceOptions;
            })
            .catch((error) => {
                console.error("Error fetching sources:", error);
                return [];
            });
    };

    const getSelectedSources = (): Promise<[]> => {
        return Service.getSourcesByIds({ source_ids: column.deckSourceIds }).then((sources: any) => {
            return sources.data.map((source: any) => {
                source.selected = true
                return source;
            })
        })
            .catch((error) => {
                console.error("Error fetching sources:", error);
                return;
            });
    }

    const getSelectedKeywords = (): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            try {
                const selectedKeywords = column.keywords.map((source: any) => {
                    if (typeof source === 'string') {
                        return {
                            selected: true,
                            id: source,
                            name: source
                        };
                    }
                    source.selected = true;
                    source.id = source;
                    source.name = source;
                    return source;
                });
                resolve(selectedKeywords);
            } catch (error) {
                reject(error);
            }
        });
    };

    const getSelectedLanguages = (): Promise<LanguageOption[]> => {
        return new Promise((resolve) => {
            let languages: LanguageOption[] = [];
            column.languages.forEach((lang: string) => {
                const result: LanguageOption | undefined = languagesOptions.find((allLang: LanguageOption) => allLang.value === lang);
                if (result) {
                    languages.push(result);
                }
            });
            resolve(languages);
        });
    };

    const handleScroll = async (event: any, startLoad: any, stopLoad: any): Promise<any> => {
        const container = event.currentTarget;
        if (container.scrollTop + container.offsetHeight > container.scrollHeight - 150) {
            setQuery({
                keyword: '', offset: (query.offset ?? 1) + 1, limit: 100
            })
            const temp = {
                keyword: '', offset: (query.offset ?? 1) + 1, limit: 100
            }
            startLoad()
            const selectOptions = await fetchOptionsFromAPISOURCES(temp)
            stopLoad()

            return selectOptions
        }
        return []
    };

    const fetchOptionsFromAPIKEYWORD = () => {
        return Service.getAllKeywordGroups()
            .then((response: any) => {
                let keywordGroups = _.groupBy(response.data, 'group_name')
                setKeyword(response.data)
                const sourceOptions = Array.isArray(response.data) ? response.data : [];
                return sourceOptions;
            })
            .catch((error) => {
                console.error("Error fetching sources:", error);
                return [];
            });
    };

    const { control, handleSubmit, setValue, getValues } = useForm<DeckConfig>({
        defaultValues: {
            deckName: column.deckName,
            keywords: [],
            sources: undefined,
            languages: undefined,
            autotranslate: column.autotranslate,
        }
    });

    React.useEffect(() => {
        const fatch = async () => {
            const sourcesResponse = await getSelectedSources()
            setValue('sources', sourcesResponse)
            const keywordResponse = await getSelectedKeywords()
            setValue('keywords', keywordResponse)
            const languageResponse = await getSelectedLanguages()
            setValue('languages', languageResponse)
            setLoading(false)

        }

        fatch()
    }, [])

    const addDeck = (data: any): void => {
        let options: any = {
            pageId: page?.page_id,
            userId: userData.userId,
            deckName: data.deckName,
            sources: data.sources,
            //pageId: activePage,
            languages: data.languages,
            deckIndex: column.index,
            autotranslate: data.autotranslate
        };
        options.languages = options.languages.map((i: any) => {
            return i.value
        })
        options.source_ids = options.sources.map((i: any) => {
            return i.id.toString()
        })

        //  options.sources = sources.flatMap((i: any) => i.items);
        options.sources = options.sources.map((i: any) => {
            return i.source_name
        });
        options.keywords = keyword.map((i: any) => { return i.name })

        options.deckId = column.deckId
        options.excludedKeywords = []
        options.isActive = true

        Service.updateDeckFilter(options)
            .then((response: any) => {
                response.data.deckName = response?.data?.deck_name
                const filterOptions = {
                    urgency: response?.data?.deckName === "BreakingNews" || response?.data?.deckName === 'أخبار عاجلة' ? [1, 2] : [],
                    languages: response?.data?.languages,
                    keywords: response?.data?.keywords,
                };
                queryBuilder(filterOptions, response?.data?.deckSources, response?.data?.deckName === "BreakingNews" || response?.data?.deckName === 'أخبار عاجلة')
                    .then((query: any) => {
                        Service.getFeeds({
                            query,
                            sort: [{ "contentCreated.keyword": { order: "desc" } }],
                            size: 15,
                            from: 0
                        }).then((responseFeed: any) => {

                            const tasks_ = responseFeed.data.reduce((acc: any, feed: any) => {
                                const feedSource = feed._source;
                                const timeZone = getTimeZone(feedSource.contentCreated);
                                const localDate = moment(new Date()).utcOffset(-timeZone);

                                if (moment(feedSource.contentCreated).isBefore(localDate) && !isFeedDuplicated(acc, feedSource)) {
                                    acc.push(feed);
                                }
                                return acc;
                            }, [])
                            tasks = tasks_
                        })


                    }).catch((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const onSubmit = handleSubmit((data) => {
        addDeck(data);
    });

    const getAllOptions = (options: any) => {
        setSources(options)
    };

    return (
        <div>
            {
                loading ?
                    (< div className="">
                        <div className="loading"></div>
                        <div className="no-more">No more content available</div>
                    </div>)
                    :
                    (
                        <form className="flex flex-col divide-zinc-400 divide-y-2" onSubmit={onSubmit}>
                            <Controller
                                name="deckName"
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value, ref, name } }) => (
                                    <div className="mb-6">
                                        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">DECK NAME</label>
                                        <input
                                            name={name}
                                            ref={ref}
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            type="text" id="default-input" placeholder="Enter Deck Name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>

                                )}
                            />

                            <div>
                                <Controller
                                    name="sources"
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, onBlur, value, ref, name } }) => (
                                        <MultiSelectComponent
                                            title={'SOURCES'}
                                            name={name}
                                            Options={fetchOptionsFromAPISOURCES}
                                            handleScroll={handleScroll}
                                            getAllOptions={getAllOptions}
                                            SelectedValues={value as [] ?? []}
                                            isMultiOptional={{
                                                name: 'collection',
                                                itemsName: 'items'
                                            }}
                                            onChange={(selectedItems) => onChange(selectedItems.map((item: any) => item))}
                                            optionLabelProperty={'source_name'}
                                            optionValueProperty={'source_name'}
                                            getIdProperty={'id'} />
                                    )}
                                />

                            </div>
                            <div>
                                <Controller
                                    name="keywords"
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, onBlur, value, ref, name } }) => (
                                        <MultiSelectComponent title={'KEYWORD'}
                                            SelectedValues={value as []}
                                            name={name}
                                            Options={fetchOptionsFromAPIKEYWORD}
                                            onChange={(selectedItems) => onChange(selectedItems.map((item: any) => item))}
                                            optionLabelProperty={'name'}
                                            optionValueProperty={'id'}
                                            getIdProperty={'id'}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="languages"
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, onBlur, value, ref, name } }) => (
                                        <MultiSelectComponent title={'LANGUAGE'}
                                            SelectedValues={value as []}
                                            name={name}
                                            Options={languagesOptions}
                                            onChange={(selectedItems) => onChange(selectedItems.map((item: any) => item))}
                                            optionLabelProperty={'name'}
                                            optionValueProperty={'value'}
                                            getIdProperty={'value'}
                                        />
                                    )}
                                />

                            </div>
                            <div>
                                <Controller
                                    name="autotranslate"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value, ref, name } }) => (
                                        <label className='relative flex cursor-pointer select-none items-center justify-between p-2'>
                                            <input
                                                type='checkbox'
                                                className='sr-only peer'
                                                name={name}
                                                ref={ref}
                                                checked={value}
                                                onChange={onChange}
                                                onBlur={onBlur} // This is optional, typically not needed for checkboxes
                                            />
                                            <span className='mr-[18px] text-sm font-medium text-black'>
                                                AUTO TRANSLATE TO ENGLISH
                                            </span>
                                            <div className="justify-items-end relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                                        </label>
                                    )}
                                />
                            </div>
                            <div>
                                <button type="submit" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Apply
                                </button>
                            </div>


                        </form>)
            }
        </div>

    )
}

export default UpdateColumn;