import React from "react";
import { CiAddPlus } from "../../../assets/icons/CiAddPlus";

import withReactContent from 'sweetalert2-react-content'
import { MingcuteSearchFill } from "../../../assets/icons/MingcuteSearchFill";
import './index.css'
import { Service } from "../services/service";
import { TreeView } from "./TreeView";
import Swal from 'sweetalert2'
import { LineMdHome } from "@/assets/icons/LineMdHome";
import Link from "next/link";

const MySwal = withReactContent(Swal)

const KanbanLeftBar = (props: any) => {
    const togglePageHandler = (page: any, index: any) => {
        props.openPage(index)
    }
    React.useEffect(() => {
        if (props?.pages.length > 0)
            props.openPage(1)
    }, [props?.pages])

    const canNotRemovePage = [
        'Default',
        'عربى'
    ]

    type ConvertNameTo = {
        Default: string;
        [key: string]: string;
    };

    const convertNameTo: ConvertNameTo = {
        Default: "News Agencies",
    };

    const [isHovered, setIsHovered] = React.useState(undefined);

    const handleMouseEnter = (e: any) => setIsHovered(e);


    // Function to remove a page
    const removePageHandler = (page: any) => {
        removePage(page).then(() => {
            props.openPage(1)
        });
    };

    // Remove page with confirmation dialog
    const removePage = (page: any): Promise<void> => {
        return new Promise((resolve, reject) => {
            const swalWithBootstrapButtons = MySwal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: "Delete Page!",
                text: "Are you sure you want to permanently delete this page? You won’t be able to bring it back, but you can always create a new one.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true
            }).then((result: any) => {
                if (result.isConfirmed) {
                    const index = props?.pages.findIndex((p: any) => p.page_id === page.page_id);
                    const body = {
                        pageId: page.page_id,
                        userId: props.userData.userId,
                    };
                    Service.removePage(body).then(() => {
                        // setPagesState(newPages);
                        props?.pages.splice(index, 1)
                        //  auth.pages = newPages;  // Update auth object as needed

                        swalWithBootstrapButtons.fire({
                            title: "Deleted!",
                            text: "Your Page has been deleted.",
                            icon: "success"
                        });
                        resolve();
                    });
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === MySwal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                        title: "Cancelled",
                        text: "Your imaginary file is safe :)",
                        icon: "error"
                    });
                    reject();

                }
            });
        });
    };

    return (
        <>
            <nav className="bg-slate-800 background text-font-bar border-gray-200 dark:bg-gray-900 max-h-screen max-w-92 sticky fixed top-0 left-0 right-0 z-30	">
                <div className="flex flex-col items-center justify-start h-screen w-full sticky fixed top-0 left-0 right-0 0-30">
                    <div className="items-start gap-y-2 justify-start w-full h-full flex flex-col" id="navbar-search">
                        <div className="flex flex-col items-center justify-center w-full mt-4 mb-2 h-14">
                            <a id="logo" className="flex items-center text-2xl font-semibold text-gray-900" />
                        </div>

                        <Link href={`/admin`} className="flex gap-x-2 hover:bg-gray-200 items-center justify-center w-full h-14 bg-clip-border bg-gray-50  cursor-pointer">
                            <div>
                                <LineMdHome width={'30px'} height={'30px'}></LineMdHome>
                            </div>
                            <div>
                                Home
                            </div>
                        </Link>

                        <div className="flex flex-col gap-y-1 items-center justify-center w-full h-22">
                            <div className="h-12 w-20">
                                <MingcuteSearchFill className="w-16 h-12 cursor-pointer" onClick={(e) => { props.activeComponent('activeSearchTemplete', props.activeSearchTemplete) }} />
                            </div>
                            Search
                        </div>

                        <ul className="flex p-4 pt-2 font-medium rounded-lg flex-col w-full">
                            <div className="w-92">
                                <TreeView
                                    activePage={props.activePage}
                                    pages={props?.pages}
                                    activePageState={props?.activePageState}
                                    handleMouseEnter={handleMouseEnter}
                                    togglePageHandler={togglePageHandler}
                                    isHovered={isHovered}
                                    canNotRemovePage={canNotRemovePage}
                                    removePageHandler={removePageHandler}
                                    convertNameTo={convertNameTo}

                                />
                            </div>
                        </ul>
                        <div onClick={(e) => {
                            props.activeComponent('activeCreatePageTemplete', props.activeCreatePageTemplete)
                        }} className="flex hover:bg-gray-200 items-center justify-center w-full h-14 bg-clip-border bg-gray-50  cursor-pointer">
                            <CiAddPlus width={'30px'} height={'30px'}></CiAddPlus>
                        </div>

                    </div>

                </div>
            </nav>
        </>
    )
}

export default KanbanLeftBar;