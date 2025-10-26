// tests/api-response.test.ts
import { ApiResponse } from '../src/utils/api-response.utils';

describe('ApiResponse Utility', () => {

  it('should create a success response', () => {
    const actual = ApiResponse.success('Operation successful', { id: 1, name: 'Test' });
    const expected = {
      status: 'success',
      message: 'Operation successful',
      data: { id: 1, name: 'Test' },
      statusCode: 200
    };
    expect(actual).toEqual(expected);
  });

  it('should create an error response', () => {
    const actual = ApiResponse.error('Internal server error');
    const expected = {
      status: 'error',
      message: 'Internal server error',
      statusCode: 500
    };
    expect(actual).toEqual(expected);
  });

  it('should create a validation error response', () => {
    const errors = { email: 'Invalid email format' };
    const actual = ApiResponse.validationError('Validation failed', errors);
    const expected = {
      status: 'fail',
      message: 'Validation failed',
      errors,
      statusCode: 400
    };
    expect(actual).toEqual(expected);
  });

  it('should create an unauthorized response', () => {
    const actual = ApiResponse.unauthorized();
    const expected = {
      status: 'fail',
      message: 'Unauthorized',
      statusCode: 401
    };
    expect(actual).toEqual(expected);
  });

  it('should create a notFound response', () => {
    const actual = ApiResponse.notFound();
    const expected = {
      status: 'fail',
      message: 'Not Found',
      statusCode: 404
    };
    expect(actual).toEqual(expected);
  });

});
