import React from 'react';
import './index.scss'
import { processModal } from './Task/TaskCardFunction';
import { TaskSource } from './type/kanbanTypes';

interface TaskOptions {
    isAutotranslate: boolean;
}

interface ModalProps {
    task: TaskSource;
    styleClass: string;
    column: any;
    cmsTrue: boolean;
    cmsUrl: string;
    isRtl: boolean;
    taskOptions?: TaskOptions;
    onClose: () => void;
}

const ModalHeader: React.FC<ModalProps> = ({ task, cmsTrue, isRtl, column, cmsUrl, taskOptions, onClose, styleClass }) => {
    const [toggleViewOriginal, setToggleViewOriginal] = React.useState(false);
    const [contentClass, setContentClass] = React.useState('text-left');


    const isRtlLanguage = ['ar', 'az', 'dv', 'he', 'ku', 'fa', 'ur'].includes(task?.language ?? 'en');

    const articleLink = `${cmsUrl}#!/article/new/nhq/${task?.id}`;

    React.useEffect(() => {
        if (isRtl) {
            setContentClass('text-right')
        }
    }, [isRtl])
    return (
        <div className="flex flex-col gap-y-2 w-full" dir={isRtl ? 'rtl' : 'ltr'}>
            {/*false && (task?.urgency === 1 || task?.urgency === 2) ? (
                <a className="export-article" target="_blank" href={articleLink}>Create a Breaking News Story</a>
            ) : (
                <a className="export-article" target="_blank" href={articleLink}>Export to CMS</a>
            )*/}
            <div className='flex justify-end flex-col sticky top-0 w-full'>
                <div className={`flex w-full self-center justify-center items-center content-center h-32 bg-clip-border ${styleClass} bg-gray-200 box-content box-border`}
                >
                    <p className='p-4'>

                        {task.title}
                    </p>
                </div>
                <div className=' flex h-8 flex-row items-center bg-clip-border w-full bg-gray-100 box-content box-border'>
                    <ul className='p-4 gap-x-2 flex flex-row'>
                        <li className="flex items-center gap-x-2"><div className="rounded-full bg-gray-800 w-2 h-2 "></div>{task.source} <div className="rounded-full bg-gray-800 w-2 h-2 "></div></li>
                        <li className="flex items-center gap-x-2">Modified: {task.contentModified} <div className="rounded-full bg-gray-800 w-2 h-2 "></div></li>
                        <li className="flex items-center gap-x-2">Created: {task.contentCreated} <div className="rounded-full bg-gray-800 w-2 h-2 "></div></li>
                        <li className="flex items-center gap-x-2">Urgency: {task.urgency} </li>
                    </ul >
                </div>

            </div>
            <div className='flex flex-row p-4'>
                <div className={`flex flex-wrap flex-1 ${contentClass}`}
                    dangerouslySetInnerHTML={{
                        __html: processModal(task, {
                            searchKeywords: column.keywords
                        }, false) || ""
                    }} />


            </div>
            { /*<div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button onClick={onClose} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                <button type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button>
            </div>*/}
        </div >
    );
};

export default ModalHeader;
