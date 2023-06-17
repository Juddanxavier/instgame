import { faker } from '@faker-js/faker';

import { NewCreatedRequest } from './request.interfaces';
import Request from './request.model';

describe('Request model', () => {
  describe('Request validation', () => {
    let newRequest: NewCreatedRequest;
    beforeEach(() => {
      newRequest = {
        // name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        // phone: faker.phone.phoneNumber(),
        password: 'password1',
        role: 'request',
      };
    });

    test('should correctly validate a valid request', async () => {
      await expect(new Request(newRequest).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if email is invalid', async () => {
      newRequest.email = 'invalidEmail';
      await expect(new Request(newRequest).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password length is less than 8 characters', async () => {
      newRequest.password = 'passwo1';
      await expect(new Request(newRequest).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password does not contain numbers', async () => {
      newRequest.password = 'password';
      await expect(new Request(newRequest).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password does not contain letters', async () => {
      newRequest.password = '11111111';
      await expect(new Request(newRequest).validate()).rejects.toThrow();
    });

    test('should throw a validation error if role is unknown', async () => {
      newRequest.role = 'invalid';
      await expect(new Request(newRequest).validate()).rejects.toThrow();
    });
  });

  describe('Request toJSON()', () => {
    test('should not return request password when toJSON is called', () => {
      const newRequest = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'request',
      };
      expect(new Request(newRequest).toJSON()).not.toHaveProperty('password');
    });
  });
});
