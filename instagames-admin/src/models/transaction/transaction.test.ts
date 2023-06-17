import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import moment from 'moment';
import mongoose from 'mongoose';
import request from 'supertest';

import * as tokenService from '@/models/token/token.service';
import tokenTypes from '@/models/token/token.types';
import setupTestDB from '@/utils/jest/setupTestDB';

import { NewCreatedTransaction } from './transaction.interfaces';
import Transaction from './transaction.model';
import app from '../../app';
import config from '../../config/config';

setupTestDB();

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);
const accessTokenExpires = moment().add(
  config.jwt.accessExpirationMinutes,
  'minutes'
);

const transactionOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'transaction',
  isEmailVerified: false,
};

const transactionTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'transaction',
  isEmailVerified: false,
};

const admin = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
};

const transactionOneAccessToken = tokenService.generateToken(
  transactionOne._id,
  accessTokenExpires,
  tokenTypes.ACCESS
);
const adminAccessToken = tokenService.generateToken(
  admin._id,
  accessTokenExpires,
  tokenTypes.ACCESS
);

const insertTransactions = async (transactions: Record<string, any>[]) => {
  await Transaction.insertMany(
    transactions.map((transaction) => ({
      ...transaction,
      password: hashedPassword,
    }))
  );
};

describe('Transaction routes', () => {
  describe('POST /v1/transactions', () => {
    let newTransaction: NewCreatedTransaction;

    beforeEach(() => {
      newTransaction = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.phoneNumber(),
        password: 'password1',
        role: 'transaction',
      };
    });

    test('should return 201 and successfully create new transaction if data is ok', async () => {
      await insertTransactions([admin]);

      const res = await request(app)
        .post('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTransaction)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: expect.anything(),
        name: newTransaction.name,
        email: newTransaction.email,
        role: newTransaction.role,
        isEmailVerified: false,
      });

      const dbTransaction = await Transaction.findById(res.body.id);
      expect(dbTransaction).toBeDefined();
      if (!dbTransaction) return;

      expect(dbTransaction.password).not.toBe(newTransaction.password);
      expect(dbTransaction).toMatchObject({
        name: newTransaction.name,
        email: newTransaction.email,
        role: newTransaction.role,
        isEmailVerified: false,
      });
    });

    test('should be able to create an admin as well', async () => {
      await insertTransactions([admin]);
      newTransaction.role = 'admin';

      const res = await request(app)
        .post('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTransaction)
        .expect(httpStatus.CREATED);

      expect(res.body.role).toBe('admin');

      const dbTransaction = await Transaction.findById(res.body.id);
      expect(dbTransaction).toBeDefined();
      if (!dbTransaction) return;
      expect(dbTransaction.role).toBe('admin');
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app)
        .post('/v1/transactions')
        .send(newTransaction)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in transaction is not admin', async () => {
      await insertTransactions([transactionOne]);

      await request(app)
        .post('/v1/transactions')
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send(newTransaction)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if email is invalid', async () => {
      await insertTransactions([admin]);
      newTransaction.email = 'invalidEmail';

      await request(app)
        .post('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTransaction)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if email is already used', async () => {
      await insertTransactions([admin, transactionOne]);
      newTransaction.email = transactionOne.email;

      await request(app)
        .post('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTransaction)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password length is less than 8 characters', async () => {
      await insertTransactions([admin]);
      newTransaction.password = 'passwo1';

      await request(app)
        .post('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTransaction)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password does not contain both letters and numbers', async () => {
      await insertTransactions([admin]);
      newTransaction.password = 'password';

      await request(app)
        .post('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTransaction)
        .expect(httpStatus.BAD_REQUEST);

      newTransaction.password = '1111111';

      await request(app)
        .post('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTransaction)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if role is neither transaction nor admin', async () => {
      await insertTransactions([admin]);
      (newTransaction as any).role = 'invalid';

      await request(app)
        .post('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTransaction)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/transactions', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertTransactions([transactionOne, transactionTwo, admin]);

      const res = await request(app)
        .get('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0]).toEqual({
        id: transactionOne._id.toHexString(),
        name: transactionOne.name,
        email: transactionOne.email,
        role: transactionOne.role,
        isEmailVerified: transactionOne.isEmailVerified,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertTransactions([transactionOne, transactionTwo, admin]);

      await request(app)
        .get('/v1/transactions')
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all transactions', async () => {
      await insertTransactions([transactionOne, transactionTwo, admin]);

      await request(app)
        .get('/v1/transactions')
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertTransactions([transactionOne, transactionTwo, admin]);

      const res = await request(app)
        .get('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: transactionOne.name })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(transactionOne._id.toHexString());
    });

    test('should correctly apply filter on role field', async () => {
      await insertTransactions([transactionOne, transactionTwo, admin]);

      const res = await request(app)
        .get('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ role: 'transaction' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(transactionOne._id.toHexString());
      expect(res.body.results[1].id).toBe(transactionTwo._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertTransactions([transactionOne, transactionTwo, admin]);

      const res = await request(app)
        .get('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'role:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(transactionOne._id.toHexString());
      expect(res.body.results[1].id).toBe(transactionTwo._id.toHexString());
      expect(res.body.results[2].id).toBe(admin._id.toHexString());
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertTransactions([transactionOne, transactionTwo, admin]);

      const res = await request(app)
        .get('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'role:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(admin._id.toHexString());
      expect(res.body.results[1].id).toBe(transactionOne._id.toHexString());
      expect(res.body.results[2].id).toBe(transactionTwo._id.toHexString());
    });

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertTransactions([transactionOne, transactionTwo, admin]);

      const res = await request(app)
        .get('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'role:desc,name:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);

      const expectedOrder = [transactionOne, transactionTwo, admin].sort(
        (a, b) => {
          if (a.role! < b.role!) {
            return 1;
          }
          if (a.role! > b.role!) {
            return -1;
          }
          return a.name < b.name ? -1 : 1;
        }
      );

      expectedOrder.forEach((transaction, index) => {
        expect(res.body.results[index].id).toBe(transaction._id.toHexString());
      });
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertTransactions([transactionOne, transactionTwo, admin]);

      const res = await request(app)
        .get('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(transactionOne._id.toHexString());
      expect(res.body.results[1].id).toBe(transactionTwo._id.toHexString());
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertTransactions([transactionOne, transactionTwo, admin]);

      const res = await request(app)
        .get('/v1/transactions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ page: 2, limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 2,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(admin._id.toHexString());
    });
  });

  describe('GET /v1/transactions/:transactionId', () => {
    test('should return 200 and the transaction object if data is ok', async () => {
      await insertTransactions([transactionOne]);

      const res = await request(app)
        .get(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: transactionOne._id.toHexString(),
        email: transactionOne.email,
        name: transactionOne.name,
        role: transactionOne.role,
        isEmailVerified: transactionOne.isEmailVerified,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertTransactions([transactionOne]);

      await request(app)
        .get(`/v1/transactions/${transactionOne._id}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if transaction is trying to get another transaction', async () => {
      await insertTransactions([transactionOne, transactionTwo]);

      await request(app)
        .get(`/v1/transactions/${transactionTwo._id}`)
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 200 and the transaction object if admin is trying to get another transaction', async () => {
      await insertTransactions([transactionOne, admin]);

      await request(app)
        .get(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('should return 400 error if transactionId is not a valid mongo id', async () => {
      await insertTransactions([admin]);

      await request(app)
        .get('/v1/transactions/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if transaction is not found', async () => {
      await insertTransactions([admin]);

      await request(app)
        .get(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/transactions/:transactionId', () => {
    test('should return 204 if data is ok', async () => {
      await insertTransactions([transactionOne]);

      await request(app)
        .delete(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbTransaction = await Transaction.findById(transactionOne._id);
      expect(dbTransaction).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertTransactions([transactionOne]);

      await request(app)
        .delete(`/v1/transactions/${transactionOne._id}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if transaction is trying to delete another transaction', async () => {
      await insertTransactions([transactionOne, transactionTwo]);

      await request(app)
        .delete(`/v1/transactions/${transactionTwo._id}`)
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 204 if admin is trying to delete another transaction', async () => {
      await insertTransactions([transactionOne, admin]);

      await request(app)
        .delete(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if transactionId is not a valid mongo id', async () => {
      await insertTransactions([admin]);

      await request(app)
        .delete('/v1/transactions/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if transaction already is not found', async () => {
      await insertTransactions([admin]);

      await request(app)
        .delete(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/transactions/:transactionId', () => {
    test('should return 200 and successfully update transaction if data is ok', async () => {
      await insertTransactions([transactionOne]);
      const updateBody = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'newPassword1',
      };

      const res = await request(app)
        .patch(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: transactionOne._id.toHexString(),
        name: updateBody.name,
        email: updateBody.email,
        role: 'transaction',
        isEmailVerified: false,
      });

      const dbTransaction = await Transaction.findById(transactionOne._id);
      expect(dbTransaction).toBeDefined();
      if (!dbTransaction) return;
      expect(dbTransaction.password).not.toBe(updateBody.password);
      expect(dbTransaction).toMatchObject({
        name: updateBody.name,
        email: updateBody.email,
        role: 'transaction',
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertTransactions([transactionOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/transactions/${transactionOne._id}`)
        .send(updateBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if transaction is updating another transaction', async () => {
      await insertTransactions([transactionOne, transactionTwo]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/transactions/${transactionTwo._id}`)
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 200 and successfully update transaction if admin is updating another transaction', async () => {
      await insertTransactions([transactionOne, admin]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 404 if admin is updating another transaction that is not found', async () => {
      await insertTransactions([admin]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if transactionId is not a valid mongo id', async () => {
      await insertTransactions([admin]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/transactions/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if email is invalid', async () => {
      await insertTransactions([transactionOne]);
      const updateBody = { email: 'invalidEmail' };

      await request(app)
        .patch(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if email is already taken', async () => {
      await insertTransactions([transactionOne, transactionTwo]);
      const updateBody = { email: transactionTwo.email };

      await request(app)
        .patch(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should not return 400 if email is my email', async () => {
      await insertTransactions([transactionOne]);
      const updateBody = { email: transactionOne.email };

      await request(app)
        .patch(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 400 if password length is less than 8 characters', async () => {
      await insertTransactions([transactionOne]);
      const updateBody = { password: 'passwo1' };

      await request(app)
        .patch(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if password does not contain both letters and numbers', async () => {
      await insertTransactions([transactionOne]);
      const updateBody = { password: 'password' };

      await request(app)
        .patch(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);

      updateBody.password = '11111111';

      await request(app)
        .patch(`/v1/transactions/${transactionOne._id}`)
        .set('Authorization', `Bearer ${transactionOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
