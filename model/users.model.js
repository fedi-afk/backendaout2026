const mongoose = require('mongoose'); // Importation de mongoose pour définir le schéma et le modèle
const bcrypt = require('bcrypt'); // Importation de bcrypt pour hasher le mot de passe avant sauvegarde

// Définition du schéma User avec les champs attendus et leurs contraintes
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // le nom est obligatoire
      trim: true, // supprime les espaces inutiles au début/fin
    },
    email: {
      type: String,
      required: true,
      unique: true, // deux utilisateurs ne peuvent pas avoir le même email
      lowercase: true, // normalise l'email en minuscules avant stockage
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // le mot de passe n'est jamais renvoyé par défaut dans un find()
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // seules ces deux valeurs sont autorisées
      default: 'user',
    },
  },
  { timestamps: true } // ajoute automatiquement createdAt et updatedAt
);

// Middleware exécuté juste avant chaque sauvegarde (create / save)
userSchema.pre('save', async function (next) {
  // Si le mot de passe n'a pas été modifié (ex: on met juste à jour le nom), on ne le re-hash pas
  if (!this.isModified('password')) return next();

  // Hash du mot de passe avec un coût de 12 (bon compromis sécurité/performance)
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode d'instance pour comparer un mot de passe en clair avec le hash stocké
userSchema.methods.comparePassword = async function (motDePasseSaisi) {
  return bcrypt.compare(motDePasseSaisi, this.password);
};

// Export du modèle "User", relié à la collection "users" dans MongoDB
module.exports = mongoose.model('User', userSchema);