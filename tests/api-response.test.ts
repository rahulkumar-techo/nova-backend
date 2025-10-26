// tests/response-handler.test.ts
import ResponseHandler from '../src/utils/api-response.utils';
import { Response } from 'express';

describe('ResponseHandler Utility', () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should send a success response', () => {
    ResponseHandler.success(res as Response, { id: 1, name: 'Test' }, 'Operation successful');

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Operation successful',
      data: { id: 1, name: 'Test' },
      statusCode: 200,
    });
  });

  it('should send a created response', () => {
    ResponseHandler.created(res as Response, { id: 2 }, 'Resource created');

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Resource created',
      data: { id: 2 },
      statusCode: 201,
    });
  });

  it('should send an error response', () => {
    ResponseHandler.error(res as Response, 'Internal error', 'Something went wrong', 500);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong',
      error: 'Internal error',
      statusCode: 500,
    });
  });

  it('should send a bad request response', () => {
    ResponseHandler.badRequest(res as Response, 'Invalid input', { email: 'Invalid email' });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid input',
      error: { email: 'Invalid email' },
      statusCode: 400,
    });
  });

  it('should send an unauthorized response', () => {
    ResponseHandler.unauthorized(res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Unauthorized',
      error: null,
      statusCode: 401,
    });
  });

  it('should send a not found response', () => {
    ResponseHandler.notFound(res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Not found',
      error: null,
      statusCode: 404,
    });
  });
});
