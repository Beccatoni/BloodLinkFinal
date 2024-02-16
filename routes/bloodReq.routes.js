const express = require('express');
const bldreqRoutes = express.Router();
const { createRequest, getRequests, updateRequest, deleteRequest } = require('../controllers/bloodReq.controllers');

// Endpoint for hospitals to submit blood requests
bldreqRoutes.post('/requests', createRequest);

// Endpoint for admins to view all blood requests
bldreqRoutes.get('/requests', getRequests);

// Endpoint for admins to update a specific request
bldreqRoutes.put('/requests/:requestId', updateRequest);

// Endpoint for admins to delete a specific request
bldreqRoutes.delete('/requests/:requestId', deleteRequest);

module.exports = bldreqRoutes;
