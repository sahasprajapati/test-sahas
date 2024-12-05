/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { arrayMove } from "@dnd-kit/sortable";
import { Service } from "./services/service";
import { PageState } from "./type/kanbanTypes";
import Swal from 'sweetalert2'
import withReactContent from "sweetalert2-react-content";
export const MySwal = withReactContent(Swal)

export const createPage = async ({ pageName, userData, pages }: any) => {
    const body = {
        userId: userData.currentUser,
        pageName: pageName,
        index: pages.length + 1,
        pageIndex: pages.length + 1
    };
    const response: any = await Service.createPage(body)
    const newPage = {
        user_id: response.data.user_id,
        page_id: response.data.page_id,
        page_name: response.data.page_name,
        index: response.data.index,
        pageIndex: response.data.index
    };
    const newPageState = {
        columns: [],
        page_index: 0,
        page: newPage,
        columnsLength: 0
    };

    return {
        data: response.data,
        newPageState: newPageState,
        index: newPage.index,
        activeCreatePageTemplete: false,
    };
}

export const updateColumnPositions = (currentPage: PageState, activeId: any, overId: any) => {
    const activeIndex = currentPage.columns.findIndex(column => column.Deck.deckId === activeId);
    const overIndex = currentPage.columns.findIndex(column => column.Deck.deckId === overId);
    const newColumns = arrayMove(currentPage.columns, activeIndex, overIndex);
    const deckIds: any = newColumns.map(column => column.Deck.deckId);
    Service.updateDecksIndexes(deckIds)
        .then((result: any) => {
            if (Array.isArray(result.data)) {
                result.data.forEach((item: any) => {
                    const deckUpdate = item.rows[0];
                    const foundDeck = newColumns.find(column => column.Deck.deckId === deckUpdate.deck_id);
                    if (foundDeck) {
                        foundDeck.Deck.index = deckUpdate.index;
                    }
                });
            }
        })
        .catch(err => {
            console.error('Failed to update deck indexes:', err);
        });
    return { newColumns }
}

export const connectTwitterRequest = () => {
    MySwal.fire({
        title: 'Connect to Twitter',
        text: 'You can now track Twitter on NewsHQ. Just click connect to Twitter below to start using our newest features. \n\n Artık NewsHQ üzerinden Twitter\'ı da takip edebilirsiniz. Başlamak için hesabı bağlamanız yeterli.',
        //icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Connect to Twitter',
        cancelButtonText: 'Cancel',
        buttonsStyling: false,
        customClass: {
            popup: 'swal-modal',
            title: 'swal-title',
            htmlContainer: 'flex m-0 !text-left text-justify text-start',
            confirmButton: `bg-blue-600 px-2 pb-2 pt-2.5 text-xs font-medium
         uppercase leading-normal text-white hover:bg-blue-700 rounded-md`,
            cancelButton: `bg-red-600 px-2 pb-2 pt-2.5 text-xs font-medium
        uppercase leading-normal text-white hover:bg-red-700 rounded-md`,
            actions: 'flex flex-row gap-x-4', // Class for the footer which contains buttons
        },
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            //window.location = baseConfig.twitterAuthUrl;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            localStorage.setItem("dontConnectTwitter", 'true');
        }
    });
}
