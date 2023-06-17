import { faker } from '@faker-js/faker';

import { NewCreatedStorage } from './storage.interfaces';
import Storage from './storage.model';

describe('Storage model', () => {
  describe('Storage validation', () => {
    let newStorage: NewCreatedStorage;
    beforeEach(() => {
      newStorage = {
        user: faker.name.findName(),
      };
    });

    test('should correctly validate a valid user', async () => {
      await expect(new Storage(newStorage).validate()).resolves.toBeUndefined();
    });
  });

  describe('Storage toJSON()', () => {
    test('should not return user password when toJSON is called', () => {
      const newStorage = {
        user: faker.name.findName(),
      };
      expect(new Storage(newStorage).toJSON()).not.toHaveProperty('password');
    });
  });
});
