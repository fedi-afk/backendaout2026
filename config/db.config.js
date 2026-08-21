const mongoose = require('mongoose'); // Importation de mongoose pour se connecter à MongoDB

module.exports.connectToMongoDB = async () => {
  try {
    // Connexion à MongoDB avec l'URI stockée dans le fichier .env
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log('MongoDB is connected'); // Message affiché si la connexion réussit
    }).catch((error) => {
      console.error(`Erreur de connexion à MongoDB: ${error.message}`); // Message affiché si la connexion échoue
    });
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB: ${error.message}`); // Sécurité supplémentaire si une erreur inattendue survient
  }
};