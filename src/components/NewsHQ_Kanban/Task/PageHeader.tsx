import React, { MouseEventHandler } from "react";
import { PageState } from "../type/kanbanTypes";

interface Props {
  activePageState:PageState;
logout:MouseEventHandler<HTMLDivElement>;
}

export const PageHeader = React.memo(({activePageState,logout}:Props) => {
    if (!activePageState) return null;

    return (
      <div className="flex flex-row p-4 pl-2 pr-2 justify-between w-full">
        <div className="flex items-center p-4 justify-start pl-0 pr-0">
          <div className="w-full">
            <div className="font-sans text-2xl font-semibold text-slate-900 px-4 py-2 
            bg-white border border-slate-300 rounded-md
            shadow-sm outline outline-2 outline-offset-2 outline-indigo-500">
              {activePageState.page.page_name === 'Default' ? 'News Agencies' : activePageState.page.page_name}
            </div>
          </div>
        </div>
        <div className="flex items-center p-4 pl-0 pr-0 justify-start">
          <div className="w-full">
            <div onClick={logout} className="cursor-pointer font-sans text-2xl font-semibold text-slate-900 px-4 py-2 
            bg-white border border-slate-300 rounded-md
            shadow-sm outline outline-2 outline-offset-2 outline-indigo-500">
              LOGOUT
            </div>
          </div>
        </div>
      </div>
    );
  });