/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';
import { useForm, Controller } from 'react-hook-form'; // Importing react-hook-form


export const SearchButton = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();


    const onSubmit = (data: any) => {
        return
    };

    return (
        <div className="flex w-full items-center p-2 justify-start">
            <div className="flex w-full items-center justify-start">
                <div className="w-full">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="relative">

                            <Controller
                                name="searchText"
                                control={control}
                                defaultValue={''}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="default-search"
                                        className="block w-full p-3 font-[Eudoxus_Sans] text-[12px] font-normal leading-[15.12px] border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500  border-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                                        placeholder="Search"
                                    />
                                )}
                            />
                            <div className="absolute inset-y-0 end-0 flex items-center ps-3 ">
                                <button type="submit" className="cursor-pointer absolute h-full end-0 bottom-0 hover:bg-[#4C89D0]/50 focus:ring-1 focus:outline-none focus:ring-blue-300 rounded-lg px-4 py-2">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </button>

                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};