const User = require('../model/users.model'); // Importation du modèle User

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Récupération des données envoyées dans le body

    // Vérification que les champs obligatoires sont bien présents
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Champs manquants (name, email, password)' });
    }

    // Vérification qu'aucun utilisateur n'existe déjà avec cet email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    // Création de l'utilisateur (le mot de passe est hashé automatiquement par le pre-save hook)
    const user = await User.create({ name, email, password });

    // On ne renvoie jamais le mot de passe dans la réponse
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer la liste de tous les utilisateurs
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(); // password exclu automatiquement grâce à select:false dans le schéma
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer un utilisateur précis via son id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour un utilisateur existant
exports.updateUser = async (req, res) => {
  try {
    // On limite volontairement les champs modifiables ici (pas de password ni de role)
    // pour éviter qu'un utilisateur s'auto-promeuve admin en envoyant { role: 'admin' } dans le body
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true } // new:true renvoie le document mis à jour, runValidators réapplique les contraintes du schéma
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};