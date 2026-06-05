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


