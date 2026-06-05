export interface PaginatedData<T> {
    data: T[];
    metadata: {
        pageNumber: number;
        pageSize: number;
        totalCount: number;
    }
}

export interface Page {
    pageNum: number;
    pageSize: number;
}