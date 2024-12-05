/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios, { AxiosResponse, Method } from 'axios';
import serviceConfig from "./service.config.json"

export interface requestParams {
    url: string;
    body?: any;
    resolve: (value: AxiosResponse<unknown> | unknown) => void;
    reject: (reason?: unknown) => void;
    type: 'get' | 'delete' | 'post' | 'put' | 'patch';
}

export interface feedRequest {
    feedId: string;
}
export interface saveRequest {
    user: any;
    feedId: any;
}

export interface feedsRequest {
    query: any;
    sort: any;
    size: number;
    from: number;
}

export interface loginRequest {
    userName: string;
    password: string;
}

export interface loginLDAPRequest {
    username: string;
    usermail: string;
    password: string;
    domain: string;
}

export interface checkUserRequest {
    cmsId: string;
    pageIndex: number;
    cmsUser?: string;
    userId: string;
    userName: string;
    userMail?: string;
}

export interface associateTwitterRequest {
    twitterUserId: string;
    userId: string;
}

export interface tokenRequest {
    token: string;
}

export interface sourcesRequest {
    keyword?: string;
    offset?: number;
    limit?: number;
}

export interface sourcesByIdsRequest {
    source_ids: string[];
}

export interface pageRequest {
    userId: string;
}

export interface createPageRequest {
    userId: string;
    pageName: string;
    pageIndex: number;
}

export interface updatePageRequest extends createPageRequest {
    id: string;

}

export interface removePageRequest {
    userId: string;
    pageId: string;
}

export interface deckRequest {
    deckId?: string;
}
export interface deckOperationRequest {
    deckId: string;
}

export interface updateDecksIndexesRequest {
    // Assuming structure; adjust according to actual use
    indexes: Array<{ deckId: string; newIndex: number }>;
}

export interface updateDeckFilterRequest {
    deckName: string;
    deckId: string;
    index: number;
    keywords: string[];
    excludedKeywords: string[];
    sources: string[];
    source_ids: number[];
    languages: string[];
    isActive: boolean;
    autotranslate: boolean;
}

export interface createRssRequest {
    feedUrl: string;
    frequency: number;
}

export interface createSitemapRequest {
    feedUrl: string;
    frequency: number;
}

export interface searchKeywordGroupRequest {
    searchTerm: string;
}

export interface saveKeywordGroupRequest {
    id?: string; // Assuming ID is optional for creation
    name: string;
    group_name: string;
    keywords: string[];
    excluded_keywords: string[];
}

export interface deleteKeywordGroupRequest {
    id: string;
}

export interface JQueryPingRequest {
    url: string;
}

const apiUrl = `${serviceConfig.host}${serviceConfig.port ? `:${serviceConfig.port}` : ''}`;

const websocketUrl: string = serviceConfig.websocket;

export const Service = {

    axiosCall: ({ url, body, resolve, reject, type }: requestParams) => {
        const headers = {};

        const request = axios[type](url, body, headers);

        request.then((response: unknown) => {
            resolve(response)
        }).catch((e: unknown) => {
            reject(e)
        })
    },

    getLanguages: function () {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/languages`;
            const body = {};

            this.axiosCall({ url, body, resolve, reject, type: 'get' });
        })
    },

    getFeed: async function (req: feedRequest) {

        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/feed/${req.feedId}`;
            const body = {};
            this.axiosCall({ url, body, resolve, reject, type: 'get' });
        })
    },

    getFeeds: function (req: feedsRequest) {
        //console.log('getFeeds', req)

        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/feeds`;
            const body = {
                query: req.query,
                sort: req.sort,
                size: req.size,
                from: req.from
            }
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    saveFav: function (req: saveRequest) {
        return new Promise((resolve, reject) => {
            const url = `${websocketUrl}/feed/saveFav`;
            const body = {
                user: req.user,
                feedId: req.feedId
            };
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    login: function (req: loginRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/login`;
            const body = {
                userName: req.userName,
                password: req.password
            }

            setTimeout(() => { reject('timeout'); }, 10000);

            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    loginLDAP: function (req: loginLDAPRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/ldap/login`;
            const body = {
                username: req.username,
                usermail: req.usermail,
                password: req.password,
                domain: req.domain
            };

            setTimeout(() => { reject('timeout'); }, 10000);

            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    checkUser: function (req: checkUserRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/check`
                , body = {
                    cmsId: req.cmsId,
                    pageIndex: req.pageIndex,
                    cmsUser: req.cmsUser,
                    userId: req.userId,
                    userName: req.userName,
                    userMail: req.userMail
                }
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    associateTwitterWithUser: function (req: associateTwitterRequest) {
        return new Promise((resolve, reject) => {
            // console.log(this)
            const url = `${apiUrl}/twitteruser/associate`
                , body = {
                    twitterUserId: req.twitterUserId,
                    userId: req.userId
                }
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    connectWithToken: function (req: tokenRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/token`
                , body = {
                    token: req.token
                }
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    getSources: function (req: sourcesRequest) {
        //console.log('getSources', req)

        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/sources/get`
                , body = {
                    keywords: req?.keyword,
                    offset: req?.offset,
                    limit: req?.limit
                }
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    getSourcesByIds: function (req: sourcesByIdsRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/sources/getByIds`
                , body = {
                    source_ids: req.source_ids
                }
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    getPages: function (req: pageRequest) {
        //console.log('getPages', req)
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/${req.userId}/pages`
                , body = {}
            this.axiosCall({ url, body, resolve, reject, type: 'get' });
        })
    },

    createPage: function (req: createPageRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/page/create`
                , body = {
                    userId: req.userId,
                    pageName: req.pageName,
                    pageIndex: req.pageIndex
                }
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    updatePage: function (req: updatePageRequest) {
        return new Promise((resolve, reject) => {
            const url = `${serviceConfig.host}:${serviceConfig.port}/user/page/update`
                , body = req
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    removePage: function (req: removePageRequest) {
        const userId = req.userId
        const pageId = req.pageId
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/page/${userId}/${pageId}/delete`
                , body = {}
            this.axiosCall({ url, body, resolve, reject, type: 'delete' });
        })
    },

    createDeck: function (req: deckRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/deck/create`
                , body = req
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    removeDeck: function (req: deckOperationRequest) {
        const { deckId } = req;
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/deck/${deckId}/delete`
                , body = {}
            this.axiosCall({ url, body, resolve, reject, type: 'delete' });
        })
    },

    updateDecksIndexes: function (req: updateDecksIndexesRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/decks/updateIndex`
                , body = req
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },
    updateDeckFilter: function (req: updateDeckFilterRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/deck/update`
                , body = req
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },
    createRss: function (req: createRssRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/rss/create`
                , body = {
                    rssUrl: req.feedUrl,
                    frequency: req.frequency
                };
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    createSitemap: function (req: createSitemapRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/sitemap/create`
                , body = {
                    sitemapUrl: req.feedUrl,
                    frequency: req.frequency
                };
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    getAllKeywordGroups: function () {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/keywordgroup/getAll`,
                body = {}
            this.axiosCall({ url, body, resolve, reject, type: 'get' });
        })
    },

    searchKeywordGroup: function (req: searchKeywordGroupRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/keywordgroup/search`,
                body = {
                    searchTerm: req.searchTerm
                }
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    saveKeywordGroup: function (req: saveKeywordGroupRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/keywordgroup/save`,
                body = {
                    id: req.id,
                    name: req.name,
                    group_name: req.group_name,
                    keywords: req.keywords,
                    excluded_keywords: req.excluded_keywords
                }
            this.axiosCall({ url, body, resolve, reject, type: 'post' });
        })
    },

    deleteKeywordGroup: function (req: deleteKeywordGroupRequest) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/user/keywordgroup/delete/${req.id}`
            this.axiosCall({ url, resolve, reject, type: 'delete' });
        })
    },

    jqueryPing: function ({ url }: JQueryPingRequest) {
        return new Promise((resolve, reject) => {
            this.axiosCall({
                url,
                resolve,
                reject,
                type: 'get'
            });
        });
    }
}