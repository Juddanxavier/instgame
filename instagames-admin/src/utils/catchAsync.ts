import { NextFunction, Request, Response } from 'express';

import { errorHandler } from './errors/error';

const catchAsync =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch((err) => {
      return errorHandler(err, req, res, next);
    });
  };

export default catchAsync;
