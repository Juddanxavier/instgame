import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import moment from 'moment';
import mongoose from 'mongoose';
import request from 'supertest';

import { NewCreatedRequest } from './request.interfaces';
import Request from './request.model';
import setupTestDB from '../jest/setupTestDB';
import * as tokenService from '../token/token.service';
import tokenTypes from '../token/token.types';
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

const requestOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'request',
  isEmailVerified: false,
};

const requestTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'request',
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

const requestOneAccessToken = tokenService.generateToken(
  requestOne._id,
  accessTokenExpires,
  tokenTypes.ACCESS
);
const adminAccessToken = tokenService.generateToken(
  admin._id,
  accessTokenExpires,
  tokenTypes.ACCESS
);

const insertRequests = async (requests: Record<string, any>[]) => {
  await Request.insertMany(
    requests.map((request) => ({ ...request, password: hashedPassword }))
  );
};

describe('Request routes', () => {
  describe('POST /v1/requests', () => {
    let newRequest: NewCreatedRequest;

    beforeEach(() => {
      newRequest = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.phoneNumber(),
        password: 'password1',
        role: 'request',
      };
    });

    test('should return 201 and successfully create new request if data is ok', async () => {
      await insertRequests([admin]);

      const res = await request(app)
        .post('/v1/requests')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRequest)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: expect.anything(),
        name: newRequest.name,
        email: newRequest.email,
        role: newRequest.role,
        isEmailVerified: false,
      });

      const dbRequest = await Request.findById(res.body.id);
      expect(dbRequest).toBeDefined();
      if (!dbRequest) return;

      expect(dbRequest.password).not.toBe(newRequest.password);
      expect(dbRequest).toMatchObject({
        name: newRequest.name,
        email: newRequest.email,
        role: newRequest.role,
        isEmailVerified: false,
      });
    });

    test('should be able to create an admin as well', async () => {
      await insertRequests([admin]);
      newRequest.role = 'admin';

      const res = await request(app)
        .post('/v1/requests')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRequest)
        .expect(httpStatus.CREATED);

      expect(res.body.role).toBe('admin');

      const dbRequest = await Request.findById(res.body.id);
      expect(dbRequest).toBeDefined();
      if (!dbRequest) return;
      expect(dbRequest.role).toBe('admin');
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app)
        .post('/v1/requests')
        .send(newRequest)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in request is not admin', async () => {
      await insertRequests([requestOne]);

      await request(app)
        .post('/v1/requests')
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send(newRequest)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if email is invalid', async () => {
      await insertRequests([admin]);
      newRequest.email = 'invalidEmail';

      await request(app)
        .post('/v1/requests')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRequest)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if email is already used', async () => {
      await insertRequests([admin, requestOne]);
      newRequest.email = requestOne.email;

      await request(app)
        .post('/v1/requests')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRequest)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password length is less than 8 characters', async () => {
      await insertRequests([admin]);
      newRequest.password = 'passwo1';

      await request(app)
        .post('/v1/requests')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRequest)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password does not contain both letters and numbers', async () => {
      await insertRequests([admin]);
      newRequest.password = 'password';

      await request(app)
        .post('/v1/requests')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRequest)
        .expect(httpStatus.BAD_REQUEST);

      newRequest.password = '1111111';

      await request(app)
        .post('/v1/requests')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRequest)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if role is neither request nor admin', async () => {
      await insertRequests([admin]);
      (newRequest as any).role = 'invalid';

      await request(app)
        .post('/v1/requests')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRequest)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/requests', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertRequests([requestOne, requestTwo, admin]);

      const res = await request(app)
        .get('/v1/requests')
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
        id: requestOne._id.toHexString(),
        name: requestOne.name,
        email: requestOne.email,
        role: requestOne.role,
        isEmailVerified: requestOne.isEmailVerified,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertRequests([requestOne, requestTwo, admin]);

      await request(app)
        .get('/v1/requests')
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all requests', async () => {
      await insertRequests([requestOne, requestTwo, admin]);

      await request(app)
        .get('/v1/requests')
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertRequests([requestOne, requestTwo, admin]);

      const res = await request(app)
        .get('/v1/requests')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: requestOne.name })
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
      expect(res.body.results[0].id).toBe(requestOne._id.toHexString());
    });

    test('should correctly apply filter on role field', async () => {
      await insertRequests([requestOne, requestTwo, admin]);

      const res = await request(app)
        .get('/v1/requests')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ role: 'request' })
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
      expect(res.body.results[0].id).toBe(requestOne._id.toHexString());
      expect(res.body.results[1].id).toBe(requestTwo._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertRequests([requestOne, requestTwo, admin]);

      const res = await request(app)
        .get('/v1/requests')
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
      expect(res.body.results[0].id).toBe(requestOne._id.toHexString());
      expect(res.body.results[1].id).toBe(requestTwo._id.toHexString());
      expect(res.body.results[2].id).toBe(admin._id.toHexString());
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertRequests([requestOne, requestTwo, admin]);

      const res = await request(app)
        .get('/v1/requests')
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
      expect(res.body.results[1].id).toBe(requestOne._id.toHexString());
      expect(res.body.results[2].id).toBe(requestTwo._id.toHexString());
    });

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertRequests([requestOne, requestTwo, admin]);

      const res = await request(app)
        .get('/v1/requests')
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

      const expectedOrder = [requestOne, requestTwo, admin].sort((a, b) => {
        if (a.role! < b.role!) {
          return 1;
        }
        if (a.role! > b.role!) {
          return -1;
        }
        return a.name < b.name ? -1 : 1;
      });

      expectedOrder.forEach((request, index) => {
        expect(res.body.results[index].id).toBe(request._id.toHexString());
      });
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertRequests([requestOne, requestTwo, admin]);

      const res = await request(app)
        .get('/v1/requests')
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
      expect(res.body.results[0].id).toBe(requestOne._id.toHexString());
      expect(res.body.results[1].id).toBe(requestTwo._id.toHexString());
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertRequests([requestOne, requestTwo, admin]);

      const res = await request(app)
        .get('/v1/requests')
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

  describe('GET /v1/requests/:requestId', () => {
    test('should return 200 and the request object if data is ok', async () => {
      await insertRequests([requestOne]);

      const res = await request(app)
        .get(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: requestOne._id.toHexString(),
        email: requestOne.email,
        name: requestOne.name,
        role: requestOne.role,
        isEmailVerified: requestOne.isEmailVerified,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertRequests([requestOne]);

      await request(app)
        .get(`/v1/requests/${requestOne._id}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if request is trying to get another request', async () => {
      await insertRequests([requestOne, requestTwo]);

      await request(app)
        .get(`/v1/requests/${requestTwo._id}`)
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 200 and the request object if admin is trying to get another request', async () => {
      await insertRequests([requestOne, admin]);

      await request(app)
        .get(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('should return 400 error if requestId is not a valid mongo id', async () => {
      await insertRequests([admin]);

      await request(app)
        .get('/v1/requests/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if request is not found', async () => {
      await insertRequests([admin]);

      await request(app)
        .get(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/requests/:requestId', () => {
    test('should return 204 if data is ok', async () => {
      await insertRequests([requestOne]);

      await request(app)
        .delete(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbRequest = await Request.findById(requestOne._id);
      expect(dbRequest).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertRequests([requestOne]);

      await request(app)
        .delete(`/v1/requests/${requestOne._id}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if request is trying to delete another request', async () => {
      await insertRequests([requestOne, requestTwo]);

      await request(app)
        .delete(`/v1/requests/${requestTwo._id}`)
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 204 if admin is trying to delete another request', async () => {
      await insertRequests([requestOne, admin]);

      await request(app)
        .delete(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if requestId is not a valid mongo id', async () => {
      await insertRequests([admin]);

      await request(app)
        .delete('/v1/requests/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if request already is not found', async () => {
      await insertRequests([admin]);

      await request(app)
        .delete(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/requests/:requestId', () => {
    test('should return 200 and successfully update request if data is ok', async () => {
      await insertRequests([requestOne]);
      const updateBody = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'newPassword1',
      };

      const res = await request(app)
        .patch(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: requestOne._id.toHexString(),
        name: updateBody.name,
        email: updateBody.email,
        role: 'request',
        isEmailVerified: false,
      });

      const dbRequest = await Request.findById(requestOne._id);
      expect(dbRequest).toBeDefined();
      if (!dbRequest) return;
      expect(dbRequest.password).not.toBe(updateBody.password);
      expect(dbRequest).toMatchObject({
        name: updateBody.name,
        email: updateBody.email,
        role: 'request',
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertRequests([requestOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/requests/${requestOne._id}`)
        .send(updateBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if request is updating another request', async () => {
      await insertRequests([requestOne, requestTwo]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/requests/${requestTwo._id}`)
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 200 and successfully update request if admin is updating another request', async () => {
      await insertRequests([requestOne, admin]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 404 if admin is updating another request that is not found', async () => {
      await insertRequests([admin]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if requestId is not a valid mongo id', async () => {
      await insertRequests([admin]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/requests/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if email is invalid', async () => {
      await insertRequests([requestOne]);
      const updateBody = { email: 'invalidEmail' };

      await request(app)
        .patch(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if email is already taken', async () => {
      await insertRequests([requestOne, requestTwo]);
      const updateBody = { email: requestTwo.email };

      await request(app)
        .patch(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should not return 400 if email is my email', async () => {
      await insertRequests([requestOne]);
      const updateBody = { email: requestOne.email };

      await request(app)
        .patch(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 400 if password length is less than 8 characters', async () => {
      await insertRequests([requestOne]);
      const updateBody = { password: 'passwo1' };

      await request(app)
        .patch(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if password does not contain both letters and numbers', async () => {
      await insertRequests([requestOne]);
      const updateBody = { password: 'password' };

      await request(app)
        .patch(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);

      updateBody.password = '11111111';

      await request(app)
        .patch(`/v1/requests/${requestOne._id}`)
        .set('Authorization', `Bearer ${requestOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
