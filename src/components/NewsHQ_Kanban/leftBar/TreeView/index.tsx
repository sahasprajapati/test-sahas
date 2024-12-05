import React from 'react';
import AnimateHeight from 'react-animate-height';
import TrashIcon from '../../../../assets/icons/TrashIcon';
import { ChevronDownIcon } from '../../../../assets/icons/ChevronDownIcon';
import { ChevronUpIcon } from '../../../../assets/icons/ChevronUpIcon';

export const TreeView = ({
    pages,
    handleMouseEnter,
    togglePageHandler,
    isHovered,
    canNotRemovePage,
    removePageHandler,
    convertNameTo,
    activePage,
    activePageState
}: any) => {
    const [treeview, setTreeview] = React.useState<boolean>(false);
    const toggleTreeview1 = () => {
        setTreeview(!treeview);
    };

    return (
        <div className="font-semibold">
            <li className="py-[5px]">
                <button type="button" className='flex flex-row items-center gap-x-2' onClick={() => toggleTreeview1()}>
                    <div className='w-4 h-4'>
                        {treeview ?
                            <ChevronDownIcon /> : (
                                <ChevronUpIcon />
                            )}

                    </div>
                    <div className='w-6 h-6'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M22 3H5a2 2 0 0 0-2 2v4h2V5h17v14H5v-4H3v4a2 2 0 0 0 2 2h17a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M7 15v-2H0v-2h7V9l4 3zm13-2h-7v-2h7zm0-4h-7V7h7zm-3 8h-4v-2h4z"></path></svg>
                    </div>
                    <div>
                        PAGES
                    </div>
                </button>
                <AnimateHeight duration={300} height={treeview ? 'auto' : 0}>
                    <ul className="ltr:pl-14 rtl:pr-14 ms-5">
                        {pages?.map((item: any, index: number) => {
                            if (item.page_name === 'Default')
                                'News Agencies'
                            const isActive = activePage == (index + 1) ? 'text-blue-500' : ''
                            return (
                                <li key={item.page_id} className="flex flex-row items-center" onMouseLeave={(e) => {
                                    handleMouseEnter(null)
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 100 100"><path fill="white" d="M94.284 65.553L75.825 52.411a1.255 1.255 0 0 0-1.312-.093c-.424.218-.684.694-.685 1.173l.009 6.221H57.231c-.706 0-1.391.497-1.391 1.204v11.442c0 .707.685 1.194 1.391 1.194h16.774v6.27c0 .478.184.917.609 1.136c.425.219.853.182 1.242-.096l18.432-13.228c.335-.239.477-.626.477-1.038v-.002c0-.415-.144-.801-.481-1.041"></path><path fill="white" d="M64.06 78.553h-6.49a1.73 1.73 0 0 0-1.73 1.73h-.007v3.01H15.191V36.16h17.723a1.73 1.73 0 0 0 1.73-1.73V16.707h21.188v36.356h.011a1.728 1.728 0 0 0 1.726 1.691h6.49c.943 0 1.705-.754 1.726-1.691h.004V12.501h-.005V8.48a1.73 1.73 0 0 0-1.73-1.73h-32.87L5.235 32.7v58.819c0 .956.774 1.73 1.73 1.73h57.089a1.73 1.73 0 0 0 1.73-1.73v-2.448h.005v-8.79a1.729 1.729 0 0 0-1.729-1.728"></path></svg>

                                    <div
                                        key={item.page_id}
                                        onMouseEnter={(e) => {
                                            handleMouseEnter(item.page_id)
                                        }}
                                    >

                                        <a onClick={() => {
                                            togglePageHandler(item, item.index)
                                        }}
                                            className={`${isActive} block py-1 px-3 cursor-pointer rounded hover:bg-gray-100 hover:bg-transparent hover:text-blue-700`}>
                                            {convertNameTo[item.page_name] ?? item.page_name}
                                        </a>
                                    </div>
                                    {(isHovered == item.page_id && !canNotRemovePage.includes(item.page_name)) &&
                                        <div
                                            onClick={(e) => { removePageHandler(item) }}
                                            className="cursor-pointer stroke-gray-500
                                                hover:stroke-white
                                                hover:bg-sky-500
                                                rounded
                                                px-1
                                                py-2 ">
                                            <TrashIcon />
                                        </div>}
                                </li>
                            )
                        })}
                    </ul>
                </AnimateHeight>
            </li>
        </div>
    )
}