/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

interface RadioInputProps {
    title: string;
    width: string;
    height: string;
    options: { value?: boolean; label: string, name: string, count: number }[];
    onSubmit: (value: any) => void;
    enableSearch: boolean;
    selectedOption: any;

}

export const CheckboxInputComponent: React.FC<RadioInputProps> = ({
    title,
    options,
    onSubmit,
    selectedOption,
    width,
    height,
    enableSearch,
}: RadioInputProps) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control
    } = useForm();

    const [displayOptions, setDisplayOptions] = React.useState<any[]>(options);
    const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

    const Search = (text: any) => {
        const result: any = options.filter((option: any) =>
            option.label.toLowerCase().includes(text.toLowerCase())
        );
        setDisplayOptions(result)
    }


    const handleOptionChange = (option: any) => {
        const updatedSelectedValues = [...selectedValues];
        const index = updatedSelectedValues.indexOf(option);
        if (index === -1) {
            updatedSelectedValues.push(option);
        } else {
            updatedSelectedValues.splice(index, 1);
        }
        setSelectedValues(updatedSelectedValues);
        onSubmit(updatedSelectedValues);
    };

    const select = (option: { name: string }) => {
        const result = selectedOption.filter((e: any) => e?.name == option.name)
        return result.length > 0
    }

    return (
        <div className={`flex flex-col p-2 ${width} ${height}`}>
            <div className="flex font-[Eudoxus_Sans] text-[16px] font-bold leading-[20.16px]">{title}</div>
            {enableSearch && <div className="w-full pt-2">
                <div className="relative h-9">
                    <input
                        type="text"
                        id="default-search"
                        onChange={(event) => {
                            if (event.target.value != '')
                                Search(event.target.value)
                            else
                                setDisplayOptions(options)
                        }}
                        className="block h-full w-full p-3 font-[Eudoxus_Sans] text-[12px] font-normal leading-[15.12px] border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500  border-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                        placeholder="Search"
                    />
                    <div className="absolute inset-y-0 end-0 flex items-center">
                        <button type="submit" className="cursor-pointer flex items-center absolute h-full end-0 bottom-0 hover:bg-[#4C89D0]/50 focus:ring-1 focus:outline-none focus:ring-blue-300 rounded-lg px-4 py-2">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>}
            <div className="flex flex-col gap-y-1 overflow-y-auto pt-2">
                {displayOptions.length > 0 ? displayOptions.map((option: any) => (
                    <div key={option.label} className="flex items-center me-4 p-0.5">

                        <Controller
                            name={option.label}
                            control={control}
                            render={({ field }) => (
                                <input
                                    id={`checkbox-${option.label}`}
                                    type="checkbox"
                                    style={{
                                        color: 'accent-black'
                                    }}
                                    className="w-4 h-4 bg-gray-100 border-gray-300 accent-black rounded cursor-pointer focus:outline-none outline-none"
                                    checked={select(option)}
                                    onChange={() => {
                                        handleOptionChange(option);
                                        field.onChange(option.value);
                                    }}
                                />
                            )}
                        />
                        <label htmlFor={`checkbox-${option.label}`} className="ms-2 cursor-pointer font-[Eudoxus_Sans] text-[12px] font-normal leading-[15.12px]">

                            {`${option.label} ${option.count ? `(${option.count})` : ''}`}
                        </label>
                    </div>
                )) :
                    <div className="w-full h-8 font-[Eudoxus_Sans] font-normal leading-[15.12px]">
                        no more options
                    </div>
                }
            </div>
        </div>
    );
};
