var express = require('express');
var router = express.Router();
const usersController = require('../controller/users.controller'); // Importation du controller users

/* GET users listing. */
router.get('/hello', function(req, res, next) {
  res.json('hello from users');
});

// Routes CRUD pour la gestion des utilisateurs
router.post('/', usersController.createUser); // Créer un utilisateur
router.get('/', usersController.getUsers); // Récupérer tous les utilisateurs
router.get('/:id', usersController.getUserById); // Récupérer un utilisateur par id
router.put('/:id', usersController.updateUser); // Mettre à jour un utilisateur
router.delete('/:id', usersController.deleteUser); // Supprimer un utilisateur

module.exports = router;