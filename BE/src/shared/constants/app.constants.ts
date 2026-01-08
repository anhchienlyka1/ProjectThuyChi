/**
 * Application Constants
 */
export const APP_CONSTANTS = {
    // API Version
    API_VERSION: 'v1',
    API_PREFIX: 'api',

    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,

    // Validation
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 100,
    MIN_PASSWORD_LENGTH: 8,
} as const;

/**
 * HTTP Status Messages
 */
export const HTTP_MESSAGES = {
    SUCCESS: 'Success',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    NOT_FOUND: 'Resource not found',
    BAD_REQUEST: 'Bad request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    INTERNAL_ERROR: 'Internal server error',
} as const;

/**
 * Error Codes
 */
export const ERROR_CODES = {
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
    INVALID_EMAIL: 'INVALID_EMAIL',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
} as const;
