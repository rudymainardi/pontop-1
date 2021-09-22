const express = require('express');
const routes = express.Router();

const CollaboratorsController = require('./controllers/CollaboratorController.js');
const CompaniesController = require('./controllers/CompaniesController');
const AuthController = require('./controllers/AuthController.js');
const authMiddleware = require('./middlewares/auth.js');

/* Collaborators routes */
routes.get('/', (req, res) => {
 return res.send('!'); 
});
routes.get('/collaborators', authMiddleware, CollaboratorsController.read);
routes.get('/collaborators/:id', authMiddleware, CollaboratorsController.read);
routes.post('/collaborators', authMiddleware, CollaboratorsController.create);
routes.put('/collaborators/:id', authMiddleware, CollaboratorsController.update);
routes.delete('/collaborators/:id', authMiddleware, CollaboratorsController.delete);
routes.post('/collaborators/points', authMiddleware, CollaboratorsController.registerPoint);
routes.put('/collaborators/points/:id', authMiddleware, CollaboratorsController.editPoint);
routes.delete('/collaborators/points/:id', authMiddleware, CollaboratorsController.deletePoint);

routes.get('/companies', authMiddleware, CompaniesController.read);
routes.get('/companies/:id', authMiddleware, CompaniesController.read);
routes.post('/companies', authMiddleware, CompaniesController.create);
routes.put('/companies/:id', authMiddleware, CompaniesController.update);
routes.delete('/companies/:id', authMiddleware, CompaniesController.delete);
routes.post('/companies/points', authMiddleware, CompaniesController.registerPoint);

/* Auth routes */
routes.post('/auth', AuthController.authenticate);
routes.get('/me', authMiddleware, AuthController.me);
routes.post('/change-pass', authMiddleware, AuthController.changePassword);
routes.post('/forgot-password', AuthController.forgotPassword);
routes.post('/reset-password', AuthController.resetPassword);

module.exports = routes;