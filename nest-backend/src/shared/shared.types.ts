export interface PaginatedData<T> {
    data: T[];
    metadata: {
        offset: number;
        take: number;
        totalCount: number;
    }
}

export interface Page {
    pageNum: number;
    pageSize: number;
}