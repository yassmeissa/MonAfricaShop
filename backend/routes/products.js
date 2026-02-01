const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { auth, admin } = require('../middlewares/auth');

router.get('/', getProducts);
router.get('/:id', async (req, res) => {
  try {
    const product = await require('../models/Product').findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Requête invalide' });
  }
});
router.post('/', auth, admin, createProduct);
router.put('/:id', auth, admin, updateProduct);
router.delete('/:id', auth, admin, deleteProduct);

module.exports = router;
