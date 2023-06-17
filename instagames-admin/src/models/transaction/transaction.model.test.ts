import { faker } from '@faker-js/faker';

import { NewCreatedTransaction } from './transaction.interfaces';
import Transaction from './transaction.model';

describe('Transaction model', () => {
  describe('Transaction validation', () => {
    let newTransaction: NewCreatedTransaction;
    beforeEach(() => {
      newTransaction = {
        user: faker.name.findName(),
      };
    });

    test('should correctly validate a valid user', async () => {
      await expect(
        new Transaction(newTransaction).validate()
      ).resolves.toBeUndefined();
    });
  });

  describe('Transaction toJSON()', () => {
    test('should not return user password when toJSON is called', () => {
      const newTransaction = {
        user: faker.name.findName(),
      };
      expect(new Transaction(newTransaction).toJSON()).not.toHaveProperty(
        'password'
      );
    });
  });
});
