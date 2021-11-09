'use strict';

const express = require('express');
const v2Routes = express.Router();

const { users } = require('../models/index');
const bearerAuth = require('../middleware/bearer.js')
const permissions = require('../middleware/acl.js')

// requires authentication only, no specific roles:
v2Routes.get('/v2', bearerAuth, async (req, res, next) => {
    res.status(200).send('You can see the content of this page :)');
});

// requires both a bearer token and the create capability:
v2Routes.post('/v2', bearerAuth, permissions('create'), async (req, res, next) => {
    res.status(200).send('You can create new records');
});

v2Routes.put('/v2', bearerAuth, permissions('update'), async(req, res, next)=>{
    res.status(200).send('You can update records');
});

v2Routes.patch('/v2', bearerAuth, permissions('update'), async(req, res, next)=>{
    res.status(200).send('You can update records');
});

v2Routes.delete('/v2', bearerAuth, permissions('delete'), async(req, res, next)=>{
    res.status(200).send('You can delete records');
});

module.exports = v2Routes;