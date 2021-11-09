'use strict';

const express = require('express');
const v2Routes = express.Router();

const { users } = require('../models/index');
const bearerAuth = require('../middleware/bearer.js');
const permissions = require('../middleware/acl.js');
const dataModules = require('../models');

v2Routes.param('model', (req, res, next) => {
    const modelName = req.params.model;
    if (dataModules[modelName]) {
        req.model = dataModules[modelName];
        next();
    } else {
        next('Invalid Model');
    }
});

v2Routes.get('/:model', bearerAuth, handleGetAll);
v2Routes.get('/:model/:id', bearerAuth, handleGetOne);
v2Routes.post('/:model', bearerAuth, permissions('create'), handleCreate);
v2Routes.put('/:model/:id', bearerAuth, permissions('update'), handleUpdate);
v2Routes.patch('/:model/:id', bearerAuth, permissions('update'), handleUpdate);
v2Routes.delete('/:model/:id', bearerAuth, permissions('delete'), handleDelete);

async function handleGetAll(req, res) {
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
    const id = req.params.id;
    let theRecord = await req.model.get(id)
    res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj)
    res.status(201).json(updatedRecord);
}

async function handleDelete(req, res) {
    let id = req.params.id;
    let deletedRecord = await req.model.delete(id);
    res.status(204).json(deletedRecord);
}

// // requires authentication only, no specific roles:
// v2Routes.get('/v2', bearerAuth, async (req, res, next) => {
//     res.status(200).send('You can see the content of this page :)');
// });

// // requires both a bearer token and the create capability:
// v2Routes.post('/v2', bearerAuth, permissions('create'), async (req, res, next) => {
//     res.status(201).send('You can create new records');
// });

// v2Routes.put('/v2', bearerAuth, permissions('update'), async(req, res, next)=>{
//     res.status(201).send('You can update records');
// });

// v2Routes.patch('/v2', bearerAuth, permissions('update'), async(req, res, next)=>{
//     res.status(201).send('You can update records');
// });

// v2Routes.delete('/v2', bearerAuth, permissions('delete'), async(req, res, next)=>{
//     res.status(204).send('You can delete records');
// });

module.exports = v2Routes;

// hasnaa: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imhhc25hYSIsImlhdCI6MTYzNjQ2NTk2NH0.-FuqtOyvr0FGROjRLErB1j4-rdL0X6OsnJLducGS9Q0
// sarah: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhcmFoIiwiaWF0IjoxNjM2NDY1OTkyfQ.D1n_H7IfApwI0atYDTlWSymNY0a322dLxMjqRm3ZBZI
// samar: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhbWFyIiwiaWF0IjoxNjM2NDY2MDYzfQ.caNl7ujcB5FTTvxOyaXcMsbt3aRKWAKsCU2oxnGNICs
// aseel: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFzZWVsIiwiaWF0IjoxNjM2NDY2MDc5fQ.vGe58o7yCdwRMJhgfrSkTc7hMX2xTNQLCVxTUz4a8CE
