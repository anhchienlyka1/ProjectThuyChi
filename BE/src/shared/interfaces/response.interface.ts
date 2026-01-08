/**
 * Common Response Interface
 */
export interface IResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
}

/**
 * Pagination Interface
 */
export interface IPagination {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

/**
 * Paginated Response Interface
 */
export interface IPaginatedResponse<T> extends IResponse<T[]> {
    pagination: IPagination;
}
