/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/config/Configuration.ts

import { Service } from "../services/service";


export const getDefaultPageDecks = (rows: any[]) => {
    const page_ = rows.filter((x) => {
        return x['page_name'] === 'Default'
    })
    return decks(page_)
}

export const getPageDecks = (rows: any[], pageId: any) => {
    const page_ = rows.filter((x: { [x: string]: any; }) => {
        return x['page_id'] === pageId
    })
    return decks(page_)
}


export const page = (rows: any[], filterKey: any, filterValue: any) => {
    const page_ = rows.filter((x: { [x: string]: any; }) => {
        return x[filterKey] === filterValue
    })
    return decks(page_)
}

export const decks = (rows: any[]) => {
    const deckArray: any = []
        , decks: any[] = []

    return new Promise((resolve) => {
        rows.sort(function (a: any,b:any) { return a.index - b.index })

        rows.forEach((u: any) => {
            decks[u.deck_name] = setSource(u)
        })

        //convert object array to array
        // eslint-disable-next-line no-var
        for (var key in decks)
            deckArray.push(decks[key])

        resolve(deckArray)
    })

}

export const setSource = (deck: any) => {

    const deck_ = {
        'deckId': deck.deck_id,
        deckName: deck.deck_name,
        index: deck.index,
        keywords: deck.keywords ? deck.keywords : [],
        excludedKeywords: deck.excluded_keywords ? deck.excluded_keywords : [],
        deckSources: deck.sources,
        deckSourceIds: deck.source_ids,
        languages: deck.languages,
        autotranslate: deck.autotranslate,
        "filter": false,
        "filtered": false,
        "filterResult": null,
        "page": 0,
        "offScroll": false,
        "refreshed": false,
        "firstItem": null,
    }

    return deck_
}

export const getPages = (userId: any) => {
    return new Promise((resolve, reject) => {
        Service.getPages({ userId }).then((rows: any) => {
            resolve(rows.data)
        }).catch((e: any) => {
            reject(e)
        })
    })
}




