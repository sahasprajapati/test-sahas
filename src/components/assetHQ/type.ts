export interface Source {
    id: null | any;
    value: string;
    key: string;
}

export interface File {
    orientation: string;
    size: number;
    width: number;
    format: string;
    storage: {
        bucket: string;
        source: string;
        key: string;
        url: string;
    };
    thumbnails: {
        preview: any[];
        small: string;
        large: string;
        medium: string;
    };
    resolution: any;
    downloadCount: number;
    height: number;
}

export interface Audit {
    created: {
        date: string;
        user: {
            name: string;
            id: null | any;
            email: string;
        };
    };
    modified: {
        date: string;
    };
}

export interface Asset {
    id?: number;
    type: string;
    title: string;
    source: Source;
    event: null | any;
    captureDate: string;
    file: File;
    audit: Audit;
    description: string;
}

export interface Bucket {
    value: string;
    count: number;
}

export interface Facets {
    assetTypes: {
        otherCount: number;
        buckets: Bucket[];
    };
    orientation: {
        otherCount: number;
        buckets: Bucket[];
    };
    sources: {
        otherCount: number;
        buckets: Bucket[];
    };
    origins: {
        otherCount: number;
        buckets: Bucket[];
    };
    resolutions: {
        otherCount: number;
        buckets: Bucket[];
    };
    language: {
        otherCount: number;
        buckets: Bucket[];
    };
}

export interface Data {
    scrollId: string;
    count: number;
    assets: Asset[];
    facets: Facets;
}

export interface Lookup {
    key: string;
    value: string;
    metadata: any[];
}

export interface Origins {
    lookups: Lookup[];
    count: number;
}
