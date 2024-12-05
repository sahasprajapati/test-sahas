import React from 'react'
import { CiAddPlus } from '../../assets/icons/CiAddPlus';

export const CreatePageTemplete = ({ pageName, activeCreatePageTemplete, handlePageNameChange, onClickCreatePage }: any) => {
  if (!activeCreatePageTemplete) return;
  return (
    <div className="flex w-full items-center p-4 pl-2 pr-2 justify-start">
      <div className="flex w-full items-center p-4 pl-2 pr-2 justify-start">
        <div className="flex min-w-[800px] items-center justify-start">
          <div className="w-full">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"></label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <CiAddPlus className={'w-6 h-6 text-gray-500 dark:text-gray-400'}></CiAddPlus>
              </div>
              <input value={pageName} onChange={handlePageNameChange} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Choose the page name..." required />
              <button onClick={onClickCreatePage} type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}