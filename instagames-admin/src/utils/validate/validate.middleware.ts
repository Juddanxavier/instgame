import httpStatus from 'http-status';
import Joi from 'joi';

import ApiError from '@/utils/errors/ApiError';

const validate =
  (schema: Record<string, any>) =>
  (data): Promise<any> => {
    // const validSchema = pick(schema, ['params', 'query', 'body']);
    // const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(schema)
      .prefs({ errors: { label: 'key' } })
      .validate(data);

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');

      throw new ApiError(httpStatus.BAD_REQUEST, errorMessage);
    }

    return value;
  };

export default validate;
