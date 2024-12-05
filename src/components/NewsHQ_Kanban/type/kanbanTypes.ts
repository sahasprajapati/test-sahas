export interface LanguageOption {
    value: string;
    name: string;
}
export interface Page {
    index?: number,
    user_id?: string;
    page_id: string;
    pageIndex: string;
    page_filter?: boolean;
    page_name: string;
}
export interface ServiceResponse<T> {
    data: T;
    status: string;
}

export interface LoginRequest {
    userName: string;
    userMail?: string;
    password: string;
    domain?: string;
}

export interface CheckUserRequest {
    cmsId?: string;
    pageIndex?: number;
    cmsUser?: boolean;
    userId?: string;
    userName?: string;
    userMail?: string;
}

export interface KeywordGroup {
    id?: string;
    name?: string;
    group_name?: string;
    keywords?: string[];
    excluded_keywords?: string[];
}

export interface Deck {
    filter: boolean;
    filtered: boolean;
    filterResult: any; // Update this type if filterResult can have other types
    page: number;
    offScroll: boolean;
    refreshed: boolean;
    firstItem: null; // Update this type if firstItem can have other types
    deckSources: string[];
    deckSourceIds: string[];
    deckName: string;
    keywords: [];
    excludedKeywords: string[];
    languages: string[];
    autotranslate: boolean;
    deckId: string;
    index: number;
}

export interface TaskSource {
    id: string;
    title: string;
    content: string;
    language: string;
    urgency?: number;
    location?: string;
    source?: string;
    favs?: Array<{ name: string, _id: string }>;
    url?: string;
    owner?: string;
    contentCreated: string;
    contentModified?: string;
    imageUrl?: string;
    tags?: string[];
    video_list?: string; // Update type if this is supposed to be an array
    external_link_list?: string; // Update type if this is supposed to be an array
    title_en: string;
    description_en?: string;
    keywords_en?: string;
    content_en: string;
    news_type?: string;
    content_html?: string;
    content_en_html?: string;
    verified?: string;
    follower_count?: string;
}

export interface Task {
    _index?: string;
    _type?: string;
    _id: string;
    _score?: null; // Update type if _score can have other types
    _source: TaskSource;
    sort?: string[]; // Update type if sort can have other types or values
}


export interface Columns {
    Deck: Deck;
    //tasks: Task[];
    //searchTasks: Task[];
    //searchIsActive: boolean;
    //query: any;
}
export interface PageState {
    columns: Columns[];
    page_index: number;
    page: Page;
    columnsLength: any;
}








export interface loginRow {
    user_id: string;
    user_name: string;
    cms_id: string;
    password: string;
    twitter_id: string | null;
    page_id: string;
    page_name: string;
    page_filter: string | null;
    page_index: number;
    deck_id: string;
    deck_name: string;
    sources: string[];
    source_ids: string[];
    keywords: string[] | null;
    excluded_keywords: string[] | null;
    languages: string[];
    is_active: boolean;
    index: number;
    autotranslate: boolean;
}

export interface loginField {
    name: string;
    tableID: number;
    columnID: number;
    dataTypeID: number;
    dataTypeSize: number;
    dataTypeModifier: number;
    format: string;
}

export interface loginResult {
    command: string;
    rowCount: number;
    oid: null;
    rows: loginRow[];
    fields: loginField[];
}
export interface UserData {
    currentUser: string;
    userId: string;
    userName: string;
    twitterId: boolean;
    cms_id: string;
    pass: string;
}

export interface CreateColumnProps {
    userData: UserData;
    page: Page | undefined;
    activePage: number;
    decksLength: number;
    column: Deck;
    tasks?: Task[];
    languagesOptions: LanguageOption[];
    createDeck: (data: Deck, tasks: Task[], query: any) => void;
}

export interface DeckConfig {
    deckName: string;
    keywords?: string[];
    sources?: string[];
    languages?: LanguageOption[];
    autotranslate?: boolean;
}