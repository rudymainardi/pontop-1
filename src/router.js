const express = require('express');
const routes = express.Router();

const CollaboratorsController = require('./controllers/CollaboratorController.js');
const AuthController = require('./controllers/AuthController.js');
const authMiddleware = require('./middlewares/auth.js');

/* Collaborators routes */
routes.get('/collaborators', CollaboratorsController.read); // Get all the collaborators
routes.get('/collaborators/:id', CollaboratorsController.read); // Get a specific collaborator
routes.post('/collaborators', CollaboratorsController.create); // Create a new collaborator
routes.put('/collaborators/:id', CollaboratorsController.update); // Update a collaborator
routes.delete('/collaborators/:id', CollaboratorsController.delete); // Delete a collaborator

/* Auth routes */
routes.post('/auth', AuthController.authenticate); // Authenticate a collaborator
routes.post('/me', authMiddleware, AuthController.me); // Authenticate a collaborator

module.exports = routes;