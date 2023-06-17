import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import moment from 'moment';
import mongoose from 'mongoose';
import request from 'supertest';

import app from '@/app';
import config from '@/config/config';
import setupTestDB from '@/jest/setupTestDB';
import * as tokenService from '@/token/token.service';
import tokenTypes from '@/token/token.types';

import Storage from '../models/storage';
import { NewCreatedStorage } from '../models/storage/storage.interfaces';

setupTestDB();

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);
const accessTokenExpires = moment().add(
  config.jwt.accessExpirationMinutes,
  'minutes'
);

const storageOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'storage',
  isEmailVerified: false,
};

const storageTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'storage',
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

const storageOneAccessToken = tokenService.generateToken(
  storageOne._id,
  accessTokenExpires,
  tokenTypes.ACCESS
);
const adminAccessToken = tokenService.generateToken(
  admin._id,
  accessTokenExpires,
  tokenTypes.ACCESS
);

const insertStorages = async (storages: Record<string, any>[]) => {
  await Storage.insertMany(
    storages.map((storage) => ({ ...storage, password: hashedPassword }))
  );
};

describe('Storage routes', () => {
  describe('POST /v1/storages', () => {
    let newStorage: NewCreatedStorage;

    beforeEach(() => {
      newStorage = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.phoneNumber(),
        password: 'password1',
        role: 'storage',
      };
    });

    test('should return 201 and successfully create new storage if data is ok', async () => {
      await insertStorages([admin]);

      const res = await request(app)
        .post('/v1/storages')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newStorage)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: expect.anything(),
        name: newStorage.name,
        email: newStorage.email,
        role: newStorage.role,
        isEmailVerified: false,
      });

      const dbStorage = await Storage.findById(res.body.id);
      expect(dbStorage).toBeDefined();
      if (!dbStorage) return;

      expect(dbStorage.password).not.toBe(newStorage.password);
      expect(dbStorage).toMatchObject({
        name: newStorage.name,
        email: newStorage.email,
        role: newStorage.role,
        isEmailVerified: false,
      });
    });

    test('should be able to create an admin as well', async () => {
      await insertStorages([admin]);
      newStorage.role = 'admin';

      const res = await request(app)
        .post('/v1/storages')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newStorage)
        .expect(httpStatus.CREATED);

      expect(res.body.role).toBe('admin');

      const dbStorage = await Storage.findById(res.body.id);
      expect(dbStorage).toBeDefined();
      if (!dbStorage) return;
      expect(dbStorage.role).toBe('admin');
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app)
        .post('/v1/storages')
        .send(newStorage)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in storage is not admin', async () => {
      await insertStorages([storageOne]);

      await request(app)
        .post('/v1/storages')
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send(newStorage)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if email is invalid', async () => {
      await insertStorages([admin]);
      newStorage.email = 'invalidEmail';

      await request(app)
        .post('/v1/storages')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newStorage)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if email is already used', async () => {
      await insertStorages([admin, storageOne]);
      newStorage.email = storageOne.email;

      await request(app)
        .post('/v1/storages')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newStorage)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password length is less than 8 characters', async () => {
      await insertStorages([admin]);
      newStorage.password = 'passwo1';

      await request(app)
        .post('/v1/storages')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newStorage)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password does not contain both letters and numbers', async () => {
      await insertStorages([admin]);
      newStorage.password = 'password';

      await request(app)
        .post('/v1/storages')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newStorage)
        .expect(httpStatus.BAD_REQUEST);

      newStorage.password = '1111111';

      await request(app)
        .post('/v1/storages')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newStorage)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if role is neither storage nor admin', async () => {
      await insertStorages([admin]);
      (newStorage as any).role = 'invalid';

      await request(app)
        .post('/v1/storages')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newStorage)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/storages', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertStorages([storageOne, storageTwo, admin]);

      const res = await request(app)
        .get('/v1/storages')
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
        id: storageOne._id.toHexString(),
        name: storageOne.name,
        email: storageOne.email,
        role: storageOne.role,
        isEmailVerified: storageOne.isEmailVerified,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertStorages([storageOne, storageTwo, admin]);

      await request(app)
        .get('/v1/storages')
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all storages', async () => {
      await insertStorages([storageOne, storageTwo, admin]);

      await request(app)
        .get('/v1/storages')
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertStorages([storageOne, storageTwo, admin]);

      const res = await request(app)
        .get('/v1/storages')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: storageOne.name })
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
      expect(res.body.results[0].id).toBe(storageOne._id.toHexString());
    });

    test('should correctly apply filter on role field', async () => {
      await insertStorages([storageOne, storageTwo, admin]);

      const res = await request(app)
        .get('/v1/storages')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ role: 'storage' })
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
      expect(res.body.results[0].id).toBe(storageOne._id.toHexString());
      expect(res.body.results[1].id).toBe(storageTwo._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertStorages([storageOne, storageTwo, admin]);

      const res = await request(app)
        .get('/v1/storages')
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
      expect(res.body.results[0].id).toBe(storageOne._id.toHexString());
      expect(res.body.results[1].id).toBe(storageTwo._id.toHexString());
      expect(res.body.results[2].id).toBe(admin._id.toHexString());
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertStorages([storageOne, storageTwo, admin]);

      const res = await request(app)
        .get('/v1/storages')
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
      expect(res.body.results[1].id).toBe(storageOne._id.toHexString());
      expect(res.body.results[2].id).toBe(storageTwo._id.toHexString());
    });

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertStorages([storageOne, storageTwo, admin]);

      const res = await request(app)
        .get('/v1/storages')
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

      const expectedOrder = [storageOne, storageTwo, admin].sort((a, b) => {
        if (a.role! < b.role!) {
          return 1;
        }
        if (a.role! > b.role!) {
          return -1;
        }
        return a.name < b.name ? -1 : 1;
      });

      expectedOrder.forEach((storage, index) => {
        expect(res.body.results[index].id).toBe(storage._id.toHexString());
      });
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertStorages([storageOne, storageTwo, admin]);

      const res = await request(app)
        .get('/v1/storages')
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
      expect(res.body.results[0].id).toBe(storageOne._id.toHexString());
      expect(res.body.results[1].id).toBe(storageTwo._id.toHexString());
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertStorages([storageOne, storageTwo, admin]);

      const res = await request(app)
        .get('/v1/storages')
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

  describe('GET /v1/storages/:storageId', () => {
    test('should return 200 and the storage object if data is ok', async () => {
      await insertStorages([storageOne]);

      const res = await request(app)
        .get(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: storageOne._id.toHexString(),
        email: storageOne.email,
        name: storageOne.name,
        role: storageOne.role,
        isEmailVerified: storageOne.isEmailVerified,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertStorages([storageOne]);

      await request(app)
        .get(`/v1/storages/${storageOne._id}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if storage is trying to get another storage', async () => {
      await insertStorages([storageOne, storageTwo]);

      await request(app)
        .get(`/v1/storages/${storageTwo._id}`)
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 200 and the storage object if admin is trying to get another storage', async () => {
      await insertStorages([storageOne, admin]);

      await request(app)
        .get(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('should return 400 error if storageId is not a valid mongo id', async () => {
      await insertStorages([admin]);

      await request(app)
        .get('/v1/storages/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if storage is not found', async () => {
      await insertStorages([admin]);

      await request(app)
        .get(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/storages/:storageId', () => {
    test('should return 204 if data is ok', async () => {
      await insertStorages([storageOne]);

      await request(app)
        .delete(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbStorage = await Storage.findById(storageOne._id);
      expect(dbStorage).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertStorages([storageOne]);

      await request(app)
        .delete(`/v1/storages/${storageOne._id}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if storage is trying to delete another storage', async () => {
      await insertStorages([storageOne, storageTwo]);

      await request(app)
        .delete(`/v1/storages/${storageTwo._id}`)
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 204 if admin is trying to delete another storage', async () => {
      await insertStorages([storageOne, admin]);

      await request(app)
        .delete(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if storageId is not a valid mongo id', async () => {
      await insertStorages([admin]);

      await request(app)
        .delete('/v1/storages/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if storage already is not found', async () => {
      await insertStorages([admin]);

      await request(app)
        .delete(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/storages/:storageId', () => {
    test('should return 200 and successfully update storage if data is ok', async () => {
      await insertStorages([storageOne]);
      const updateBody = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'newPassword1',
      };

      const res = await request(app)
        .patch(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: storageOne._id.toHexString(),
        name: updateBody.name,
        email: updateBody.email,
        role: 'storage',
        isEmailVerified: false,
      });

      const dbStorage = await Storage.findById(storageOne._id);
      expect(dbStorage).toBeDefined();
      if (!dbStorage) return;
      expect(dbStorage.password).not.toBe(updateBody.password);
      expect(dbStorage).toMatchObject({
        name: updateBody.name,
        email: updateBody.email,
        role: 'storage',
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertStorages([storageOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/storages/${storageOne._id}`)
        .send(updateBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if storage is updating another storage', async () => {
      await insertStorages([storageOne, storageTwo]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/storages/${storageTwo._id}`)
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 200 and successfully update storage if admin is updating another storage', async () => {
      await insertStorages([storageOne, admin]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 404 if admin is updating another storage that is not found', async () => {
      await insertStorages([admin]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if storageId is not a valid mongo id', async () => {
      await insertStorages([admin]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/storages/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if email is invalid', async () => {
      await insertStorages([storageOne]);
      const updateBody = { email: 'invalidEmail' };

      await request(app)
        .patch(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if email is already taken', async () => {
      await insertStorages([storageOne, storageTwo]);
      const updateBody = { email: storageTwo.email };

      await request(app)
        .patch(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should not return 400 if email is my email', async () => {
      await insertStorages([storageOne]);
      const updateBody = { email: storageOne.email };

      await request(app)
        .patch(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 400 if password length is less than 8 characters', async () => {
      await insertStorages([storageOne]);
      const updateBody = { password: 'passwo1' };

      await request(app)
        .patch(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if password does not contain both letters and numbers', async () => {
      await insertStorages([storageOne]);
      const updateBody = { password: 'password' };

      await request(app)
        .patch(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);

      updateBody.password = '11111111';

      await request(app)
        .patch(`/v1/storages/${storageOne._id}`)
        .set('Authorization', `Bearer ${storageOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
