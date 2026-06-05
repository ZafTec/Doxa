import {Page} from "./shared.types";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 0;

export function queryParameters<T>(page: Page, whereFilter: T) :{
    take: number;
    skip: number;
    where: T;
} {
    return {
        take: page.pageSize,
        skip: page.pageSize * page.pageNum,
        where:whereFilter
    }
}

export function getPage(pageNumber?: number, pageSize?: number): Page {
    return {
        pageNum: pageNumber ?? DEFAULT_PAGE_NUMBER,
        pageSize: pageSize ?? DEFAULT_PAGE_SIZE
    }
}

export interface PaginatedData<T> {
    data: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
}

export function getPaginatedData<T>(data: T[], pageSize: number, pageNumber: number, totalCount){
    return {
        data,
        pageSize,
        pageNumber,
        totalCount
    }
}