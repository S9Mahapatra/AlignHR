import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware factory that validates request data against a Zod schema.
 * Supports simple body-only validation or multi-target validation.
 */
interface ValidateOptions {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export const validate = (schema: ZodSchema | ValidateOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if ('parse' in schema) {
        // Simple body-only validation
        req.body = (schema as ZodSchema).parse(req.body);
      } else {
        // Multi-target validation
        const options = schema as ValidateOptions;
        if (options.body) {
          req.body = options.body.parse(req.body);
        }
        if (options.params) {
          req.params = options.params.parse(req.params);
        }
        if (options.query) {
          req.query = options.query.parse(req.query) as any;
        }
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
        return;
      }
      next(error);
    }
  };
};
