/*
POST /api/v2/:model 
GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items
GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID
PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID
DELETE /api/v2/:model/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found
*/

'use strict';

process.env.SECRET = "testingAuth";
const supertest = require('supertest');
const server = require('../src/server').server;
const { db } = require('../src/models/index');
const mockRequest = supertest(server);
let users = {
    admin: { username: 'admin', password: 'password', role: 'admin' },
    editor: { username: 'editor', password: 'password', role: 'editor' },
    writer: { username: 'writer', password: 'password', role: 'writer' },
    user: { username: 'user', password: 'password', role: 'user' },
};

beforeAll(async () => {
    await db.sync();
});
afterAll(async () => {
    await db.drop();
});

describe('V2 Route Testing', () => {
    Object.keys(users).forEach(userType => {
        describe(`${userType} users`, () => {
            it('can create new records', async () => {
                const signRes = await mockRequest.post('/signup').send(users[userType]);
                const token = signRes.body.token;
                const response = await mockRequest.post("/v2/movies").send({
                        name: 'test movie 1',
                        year: 2021,
                        rating: 8,
                    }).set("Authorization", `Bearer ${token}`);
                if (userType === 'user') {
                    expect(response.status).not.toBe(201);
                } else {
                    expect(response.status).toBe(201);
                }
            });

            it('can update with put', async () => {
                const signRes = await mockRequest.post('/signin').auth(users[userType].username, users[userType].password);
                const token = signRes.body.token;
                const response = await mockRequest.put('/v2/movies/1').send({
                    name: 'test movie 2',
                    year: 2021,
                    rating: 9
                }).set('Authorization', `Bearer ${token}`);
                if (users[userType].role === 'user' || users[userType].role === 'writer') {
                    expect(response.status).not.toBe(201);
                } else {
                    expect(response.status).toBe(201);
                }
            });

            it('can update with patch', async () => {
                const signRes = await mockRequest.post('/signin').auth(users[userType].username, users[userType].password);
                const token = signRes.body.token;
                const response = await mockRequest.patch('/v2/movies/1').send({
                    name: 'test movie 3'
                }).set('Authorization', `Bearer ${token}`);
                if (users[userType].role === 'user' || users[userType].role === 'writer') {
                    expect(response.status).not.toBe(201);
                } else {
                    expect(response.status).toBe(201);
                }
            });
            // get all
            it('can get all records', async () => {
                const signRes = await mockRequest.post('/signin').auth(users[userType].username, users[userType].password);
                const token = signRes.body.token;
                await mockRequest.put('/v2/movies/1').send({
                    name: 'another test movie',
                    year: 2021,
                    rating: 9
                }).set('Authorization', `Bearer admin`);
                const response = await mockRequest.get('/v2/movies').set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
            });
            it('can get a single record by id', async () => {
                const signRes = await mockRequest.post('/signin').auth(users[userType].username, users[userType].password);
                const token = signRes.body.token;
                const response = await mockRequest.get('/v2/movies/1').set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
            });
            if('can delete a record -- admin only', async () => {
                const signRes = await mockRequest.post('/signin').auth(users[userType].username, users[userType].password);
                const token = signRes.body.token;
                const response = await mockRequest.put('/v2/movies/2').set('Authorization', `Bearer ${token}`);
                if (users[userType].role === 'admin') {
                    expect(response.status).toBe(204);
                } else {
                    expect(response.status).not.toBe(204);
                }
            });
        });
    });
});
