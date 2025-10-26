/**
 * apiResponseUtils.ts
 * 
 * Generic API Response Utility Class for Node.js/Express with HTTP status codes
 */

type ResponseData<T = any> = {
  status: 'success' | 'error' | 'fail';
  message: string;
  data?: T;
  errors?: any;
  statusCode: number;
};

export class ApiResponse<T = any> {
  private message: string;
  private data?: T;
  private errors?: any;
  private statusCode: number;

  constructor(message: string, statusCode: number, data?: T, errors?: any) {
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.statusCode = statusCode;
  }

  private getResponse(): object {
    const res: any = {
      message: this.message,
      statusCode: this.statusCode,
    };
    if (this.data !== undefined) res.data = this.data;
    if (this.errors !== undefined) res.errors = this.errors;
    return res;
  }

  // Success response
  static success<T>(message: string, data?: T, statusCode: number = 200): ResponseData<T> {
    const response = new ApiResponse<T>(message, statusCode, data);
    return { status: 'success', ...response.getResponse() } as ResponseData<T>;
  }

  // Generic error response
  static error<T>(message: string, data?: T, statusCode: number = 500): ResponseData<T> {
    const response = new ApiResponse<T>(message, statusCode, data);
    return { status: 'error', ...response.getResponse() } as ResponseData<T>;
  }

  // Validation / bad request response
  static validationError<T>(message: string, errors: any, statusCode: number = 400, data?: T): ResponseData<T> {
    const response = new ApiResponse<T>(message, statusCode, data, errors);
    return { status: 'fail', ...response.getResponse() } as ResponseData<T>;
  }

  // Unauthorized response
  static unauthorized(message: string = 'Unauthorized', statusCode: number = 401): ResponseData<null> {
    const response = new ApiResponse<null>(message, statusCode);
    return { status: 'fail', ...response.getResponse() } as ResponseData<null>;
  }

  // Not found response
  static notFound(message: string = 'Not Found', statusCode: number = 404): ResponseData<null> {
    const response = new ApiResponse<null>(message, statusCode);
    return { status: 'fail', ...response.getResponse() } as ResponseData<null>;
  }
}
