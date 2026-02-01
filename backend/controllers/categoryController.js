const Category = require('../models/Category');

// Récupérer toutes les catégories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des catégories', error: error.message });
  }
};

// Récupérer une catégorie par ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie introuvable' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: 'Requête invalide', error: error.message });
  }
};

// Créer une catégorie
exports.createCategory = async (req, res) => {
  try {
    const { name, description, emoji, image, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Le nom de la catégorie est requis' });
    }

    // Vérifier si la catégorie existe déjà
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Cette catégorie existe déjà' });
    }

    const newCategory = new Category({
      name,
      description: description || '',
      emoji: emoji || '🛍️',
      image: image || '',
      color: color || '#059669'
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la catégorie', error: error.message });
  }
};

// Mettre à jour une catégorie
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, emoji, image, color } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie introuvable' });
    }

    // Vérifier si le nouveau nom existe déjà
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Une catégorie avec ce nom existe déjà' });
      }
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (emoji) category.emoji = emoji;
    if (image !== undefined) category.image = image;
    if (color) category.color = color;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie', error: error.message });
  }
};

// Supprimer une catégorie
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie introuvable' });
    }

    // Vérifier s'il y a des produits dans cette catégorie
    const Product = require('../models/Product');
    const productsInCategory = await Product.countDocuments({ category: category.name });

    if (productsInCategory > 0) {
      return res.status(400).json({ 
        message: `Impossible de supprimer cette catégorie. Elle contient ${productsInCategory} produit(s).` 
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie', error: error.message });
  }
};
