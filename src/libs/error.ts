// src/libs/error.ts
// 共通エラー定義ライブラリ

export class NotFoundError extends Error {
    statusCode: number;
  
    constructor(message: string = 'Not Found') {
      super(message);
      this.name = 'NotFoundError';
      this.statusCode = 404;
      Object.setPrototypeOf(this, NotFoundError.prototype);
    }
  }
  
  export class ValidationError extends Error {
    statusCode: number;
  
    constructor(message: string = 'Bad Request') {
      super(message);
      this.name = 'ValidationError';
      this.statusCode = 400;
      Object.setPrototypeOf(this, ValidationError.prototype);
    }
  }
  
  export class UnauthorizedError extends Error {
    statusCode: number;
  
    constructor(message: string = 'Unauthorized') {
      super(message);
      this.name = 'UnauthorizedError';
      this.statusCode = 401;
      Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
  }
  
  export class InternalServerError extends Error {
    statusCode: number;
  
    constructor(message: string = 'Internal Server Error') {
      super(message);
      this.name = 'InternalServerError';
      this.statusCode = 500;
      Object.setPrototypeOf(this, InternalServerError.prototype);
    }
  }
  