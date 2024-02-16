const express = require('express');
const bldreqRoutes = express.Router();
const { createRequest, getRequests, updateRequest, deleteRequest } = require('../controllers/bloodReq.controllers');

// Endpoint for hospitals to submit blood requests
bldreqRoutes.post('/createRequest', createRequest);

// Endpoint for admins to view all blood requests
bldreqRoutes.get('/getRequests', getRequests);

// Endpoint for admins to update a specific request
bldreqRoutes.put('/updateRequests/:requestId', updateRequest);

// Endpoint for admins to delete a specific request
bldreqRoutes.delete('/deleteRequests/:requestId', deleteRequest);

module.exports = bldreqRoutes;
