/**
 * Custom Business Exception
 * Dùng cho các lỗi nghiệp vụ
 */
export class BusinessException extends Error {
    constructor(
        message: string,
        public readonly code: string,
    ) {
        super(message);
        this.name = 'BusinessException';
    }
}

/**
 * Not Found Exception
 */
export class NotFoundException extends BusinessException {
    constructor(entity: string, id: string) {
        super(`${entity} with id ${id} not found`, 'NOT_FOUND');
        this.name = 'NotFoundException';
    }
}

/**
 * Already Exists Exception
 */
export class AlreadyExistsException extends BusinessException {
    constructor(entity: string, field: string, value: string) {
        super(
            `${entity} with ${field} '${value}' already exists`,
            'ALREADY_EXISTS',
        );
        this.name = 'AlreadyExistsException';
    }
}

/**
 * Validation Exception
 */
export class ValidationException extends BusinessException {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR');
        this.name = 'ValidationException';
    }
}
