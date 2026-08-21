// Importation Bibliothèques
var express = require('express'); // Importation du framework Express pour créer l'application web
var cors = require('cors'); // Importation du module cors pour autoriser les requêtes cross-origin (frontend Next.js)
var cookieParser = require('cookie-parser'); // Importation du module cookie-parser pour parser les cookies dans les requêtes HTTP
var logger = require('morgan'); // Importation du module morgan pour logger les requêtes HTTP dans la console

const http = require('http'); // Importation du module HTTP pour créer un serveur HTTP

require('dotenv').config(); // Importation du module dotenv pour charger les variables d'environnement depuis le fichier .env

const { connectToMongoDB } = require('./config/db.config'); // Importation de la fonction connectToMongoDB depuis le fichier config/db.config.js // Importation de la fonction connectToMongoDB depuis le fichier config/mogo.connection.js
// Importation des routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.routes');
// Création de l'application
var app = express();

app.use(logger('dev')); // Middleware pour le logging des requêtes HTTP(200, 404, 500, etc.)
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Middleware pour autoriser le frontend a appeler l'API avec les cookies
app.use(express.json()); // Middleware pour parser le corps des requêtes en JSON {"key": "value", etc.}
app.use(express.urlencoded({ extended: false })); // Middleware pour parser le corps des requêtes en URL-encoded (key=value&key2=value2, etc.)
app.use(cookieParser()); // Middleware pour parser les cookies

// Définition des routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({ message: 'Route introuvable' });
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});

const server = http.createServer(app); // Création du serveur HTTP avec l'application Express

server.listen(process.env.PORT, () => { 
  connectToMongoDB(); // Démarrage du serveur sur le port 5000
  console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});