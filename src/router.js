const express = require('express');
const routes = express.Router();

const CollaboratorsController = require('./controllers/CollaboratorController.js');
const AuthController = require('./controllers/AuthController.js');
const authMiddleware = require('./middlewares/auth.js');

/* Collaborators routes */
routes.get('/collaborators', authMiddleware, CollaboratorsController.read); // Get all the collaborators
routes.get('/collaborators/:id', authMiddleware, CollaboratorsController.read); // Get a specific collaborator
routes.post('/collaborators', authMiddleware, CollaboratorsController.create); // Create a new collaborator
routes.put('/collaborators/:id', authMiddleware, CollaboratorsController.update); // Update a collaborator
routes.delete('/collaborators/:id', authMiddleware, CollaboratorsController.delete); // Delete a collaborator
routes.post('/collaborators/points', authMiddleware, CollaboratorsController.registerPoint); // Add points to a collaborator

/* Auth routes */
routes.post('/auth', AuthController.authenticate); // Authenticate a collaborator
routes.get('/me', authMiddleware, AuthController.me); // Authenticate a collaborator

module.exports = routes;