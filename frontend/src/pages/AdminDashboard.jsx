import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { API_URL } from '../config/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState('all');
  const [filterOrderDate, setFilterOrderDate] = useState('all');
  const [filterProductCategory, setFilterProductCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    orderId: null,
    newStatus: null,
    currentStatus: null
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    paidOrders: 0,
    totalProducts: 0
  });
  const [productDialog, setProductDialog] = useState({
    isOpen: false,
    mode: null, // 'edit' ou 'delete'
    product: null
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: ''
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [addProductDialog, setAddProductDialog] = useState({
    isOpen: false
  });
  const [addFormData, setAddFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    category: ''
  });
  const [addImagePreview, setAddImagePreview] = useState(null);
  const [addImageFile, setAddImageFile] = useState(null);

  // Vérifier l'authentification admin au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      navigate('/');
      return;
    }

    setUser(parsedUser);
    fetchData(token);
  }, [navigate]);

  const fetchData = async (token) => {
    setLoading(true);
    try {
      // Récupérer les commandes
      const ordersRes = await fetch(`${API_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!ordersRes.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }

      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      // Calculer les stats
      const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);
      const pendingOrders = ordersData.filter(o => o.status === 'pending').length;
      const paidOrders = ordersData.filter(o => o.status === 'paid').length;

      // Récupérer les produits
      const productsRes = await fetch(`${API_URL}/api/products`);
      let productsData = [];
      if (productsRes.ok) {
        productsData = await productsRes.json();
        setProducts(productsData);
      }

      setStats({
        totalOrders: ordersData.length,
        totalRevenue,
        pendingOrders,
        paidOrders,
        totalProducts: productsData.length
      });

      // Récupérer les catégories
      const categoriesRes = await fetch(`${API_URL}/api/categories`);
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }

      setError('');
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const order = orders.find(o => o._id === orderId);
    setConfirmDialog({
      isOpen: true,
      orderId: orderId,
      newStatus: newStatus,
      currentStatus: order?.status
    });
  };

  const confirmStatusChange = async () => {
    const { orderId, newStatus } = confirmDialog;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(o => o._id === orderId ? updatedOrder : o));
        setConfirmDialog({ isOpen: false, orderId: null, newStatus: null, currentStatus: null });
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setConfirmDialog({ isOpen: false, orderId: null, newStatus: null, currentStatus: null });
    }
  };

  const cancelStatusChange = () => {
    setConfirmDialog({ isOpen: false, orderId: null, newStatus: null, currentStatus: null });
  };

  const openProductDialog = (mode, product) => {
    if (mode === 'edit') {
      setEditFormData({
        name: product.name,
        price: product.price,
        description: product.description || '',
        stock: product.stock || ''
      });
      setEditImageFile(null);
      setEditImagePreview(product.image || null);
    }
    setProductDialog({
      isOpen: true,
      mode: mode,
      product: product
    });
  };

  const closeProductDialog = () => {
    setProductDialog({
      isOpen: false,
      mode: null,
      product: null
    });
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddProductDialog = () => {
    setAddProductDialog({ isOpen: true });
    setAddFormData({
      name: '',
      price: '',
      description: '',
      stock: '',
      category: ''
    });
    setAddImageFile(null);
    setAddImagePreview(null);
  };

  const closeAddProductDialog = () => {
    setAddProductDialog({ isOpen: false });
    setAddFormData({
      name: '',
      price: '',
      description: '',
      stock: '',
      category: ''
    });
    setAddImageFile(null);
    setAddImagePreview(null);
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    const token = localStorage.getItem('token');
    
    // Validation
    if (!addFormData.name || !addFormData.price || !addFormData.category) {
      alert('Veuillez remplir tous les champs obligatoires (nom, prix, catégorie)');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: addFormData.name,
          price: parseFloat(addFormData.price),
          description: addFormData.description,
          stock: addFormData.stock ? parseInt(addFormData.stock) : 0,
          category: addFormData.category,
          image: addImagePreview || null
        })
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        closeAddProductDialog();
        alert('Produit ajouté avec succès!');
      } else {
        alert('Erreur lors de l\'ajout du produit');
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      alert('Erreur lors de l\'ajout du produit');
    }
  };

  const handleDeleteProduct = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/products/${productDialog.product._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(products.filter(p => p._id !== productDialog.product._id));
        closeProductDialog();
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  const handleUpdateProduct = async () => {
    const token = localStorage.getItem('token');
    try {
      let imageUrl = productDialog.product.image;

      // Si une nouvelle image a été sélectionnée, la convertir en base64
      if (editImageFile) {
        // Utiliser le preview qui est déjà en base64
        imageUrl = editImagePreview;
      }

      const response = await fetch(`${API_URL}/api/products/${productDialog.product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editFormData.name,
          price: parseFloat(editFormData.price),
          description: editFormData.description,
          stock: editFormData.stock ? parseInt(editFormData.stock) : 0,
          image: imageUrl
        })
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
        closeProductDialog();
        alert('Produit mis à jour avec succès!');
      } else {
        alert('Erreur lors de la mise à jour du produit');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      alert('Erreur lors de la mise à jour du produit');
    }
  };

  const getFilteredOrders = () => {
    let filtered = [...orders];

    // Filtre par statut
    if (filterOrderStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterOrderStatus);
    }

    // Filtre par date
    if (filterOrderDate !== 'all') {
      const now = new Date();
      const orderDate = new Date();

      if (filterOrderDate === '7days') {
        orderDate.setDate(now.getDate() - 7);
      } else if (filterOrderDate === '30days') {
        orderDate.setDate(now.getDate() - 30);
      } else if (filterOrderDate === '90days') {
        orderDate.setDate(now.getDate() - 90);
      } else if (filterOrderDate === 'year') {
        orderDate.setFullYear(now.getFullYear() - 1);
      }

      filtered = filtered.filter(order => new Date(order.createdAt) >= orderDate);
    }

    return filtered;
  };

  const getFilteredProducts = () => {
    if (filterProductCategory === 'all') {
      return products;
    }
    return products.filter(product => {
      // Gérer les deux cas : product.category peut être un ObjectId ou un objet ou un string
      const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
      return categoryName === filterProductCategory;
    });
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Chargement du dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Confirmer le changement de statut</h3>
            <p style={styles.modalText}>
              Êtes-vous sûr de vouloir modifier le statut de cette commande ?
            </p>
            <div style={styles.modalActions}>
              <button onClick={cancelStatusChange} style={styles.cancelBtn}>
                Annuler
              </button>
              <button onClick={confirmStatusChange} style={styles.confirmBtn}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Dialog */}
      {productDialog.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.modal, maxWidth: productDialog.mode === 'edit' ? '600px' : '400px', maxHeight: '90vh', overflowY: 'auto'}}>
            {productDialog.mode === 'edit' ? (
              <>
                <h3 style={styles.modalTitle}>Modifier le produit</h3>
                <div style={styles.productDetailsForm}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Nom du produit</label>
                    <input 
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      style={styles.formInput}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Prix</label>
                    <input 
                      type="number"
                      step="0.01"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                      style={styles.formInput}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Description</label>
                    <textarea 
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                      style={{...styles.formInput, minHeight: '80px', fontFamily: 'inherit', resize: 'vertical'}}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Stock</label>
                    <input 
                      type="number"
                      value={editFormData.stock}
                      onChange={(e) => setEditFormData({...editFormData, stock: e.target.value})}
                      style={styles.formInput}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Image</label>
                    {editImagePreview && (
                      <img 
                        src={editImagePreview} 
                        alt={editFormData.name} 
                        style={styles.productImagePreview}
                      />
                    )}
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={styles.fileInput}
                    />
                  </div>
                </div>
                <div style={styles.modalActions}>
                  <button onClick={closeProductDialog} style={styles.cancelBtn}>
                    Annuler
                  </button>
                  <button onClick={handleUpdateProduct} style={styles.confirmBtn}>
                    <i className="fas fa-save"></i> Enregistrer
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 style={styles.modalTitle}>Supprimer le produit</h3>
                <p style={styles.modalText}>
                  Êtes-vous sûr de vouloir supprimer <strong>{productDialog.product?.name}</strong> ? Cette action est irréversible.
                </p>
                <div style={styles.modalActions}>
                  <button onClick={closeProductDialog} style={styles.cancelBtn}>
                    Annuler
                  </button>
                  <button onClick={handleDeleteProduct} style={styles.deleteModalBtn}>
                    Supprimer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add Product Dialog */}
      {addProductDialog.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.modal, maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h3 style={styles.modalTitle}>Ajouter un nouveau produit</h3>
            <div style={styles.productDetailsForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Nom du produit *</label>
                <input 
                  type="text"
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({...addFormData, name: e.target.value})}
                  style={styles.formInput}
                  placeholder="Entrez le nom du produit"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Prix *</label>
                <input 
                  type="number"
                  step="0.01"
                  value={addFormData.price}
                  onChange={(e) => setAddFormData({...addFormData, price: e.target.value})}
                  style={styles.formInput}
                  placeholder="0.00"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Catégorie *</label>
                <select 
                  value={addFormData.category}
                  onChange={(e) => setAddFormData({...addFormData, category: e.target.value})}
                  style={styles.formInput}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description</label>
                <textarea 
                  value={addFormData.description}
                  onChange={(e) => setAddFormData({...addFormData, description: e.target.value})}
                  style={{...styles.formInput, minHeight: '80px', fontFamily: 'inherit', resize: 'vertical'}}
                  placeholder="Description du produit"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Stock</label>
                <input 
                  type="number"
                  value={addFormData.stock}
                  onChange={(e) => setAddFormData({...addFormData, stock: e.target.value})}
                  style={styles.formInput}
                  placeholder="0"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Image</label>
                {addImagePreview && (
                  <img 
                    src={addImagePreview} 
                    alt={addFormData.name} 
                    style={styles.productImagePreview}
                  />
                )}
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleAddImageChange}
                  style={styles.fileInput}
                />
              </div>
            </div>
            <div style={styles.modalActions}>
              <button onClick={closeAddProductDialog} style={styles.cancelBtn}>
                Annuler
              </button>
              <button onClick={handleAddProduct} style={styles.confirmBtn}>
                <i className="fas fa-plus"></i> Créer le produit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={styles.headerBanner}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}><i className="fas fa-cog"></i> Dashboard Admin</h1>
            <p style={styles.subtitle}>Bienvenue, {user?.firstName} {user?.lastName}</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <i className="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}><i className="fas fa-shopping-bag"></i></div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Commandes totales</p>
            <p style={styles.statValue}>{stats.totalOrders}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}><i className="fas fa-euro-sign"></i></div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Chiffre d'affaires</p>
            <p style={styles.statValue}>{stats.totalRevenue.toFixed(2)} €</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}><i className="fas fa-hourglass-half"></i></div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>En attente</p>
            <p style={styles.statValue}>{stats.pendingOrders}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}><i className="fas fa-check-circle"></i></div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Payées</p>
            <p style={styles.statValue}>{stats.paidOrders}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}><i className="fas fa-box"></i></div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Produits en stock</p>
            <p style={styles.statValue}>{stats.totalProducts}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            ...styles.tabBtn,
            borderBottom: activeTab === 'orders' ? '3px solid #059669' : '3px solid transparent',
            color: activeTab === 'orders' ? '#059669' : '#6b7280'
          }}
        >
          <i className="fas fa-list"></i> Commandes ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            ...styles.tabBtn,
            borderBottom: activeTab === 'products' ? '3px solid #059669' : '3px solid transparent',
            color: activeTab === 'products' ? '#059669' : '#6b7280'
          }}
        >
          <i className="fas fa-box"></i> Produits ({products.length})
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {error && (
          <div style={styles.errorBox}>
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div style={styles.ordersContainer}>
            <h2 style={styles.sectionTitle}>Gestion des Commandes</h2>

            {/* Filtres */}
            <div style={styles.filterSection}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Statut</label>
                <select 
                  value={filterOrderStatus}
                  onChange={(e) => setFilterOrderStatus(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="paid">Payée</option>
                  <option value="preparing">Préparation</option>
                  <option value="delivering">Livraison</option>
                  <option value="delivered">Livrée</option>
                </select>
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Période</label>
                <select 
                  value={filterOrderDate}
                  onChange={(e) => setFilterOrderDate(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">Toutes les dates</option>
                  <option value="7days">7 derniers jours</option>
                  <option value="30days">30 derniers jours</option>
                  <option value="90days">90 derniers jours</option>
                  <option value="year">Dernière année</option>
                </select>
              </div>
            </div>

            {getFilteredOrders().length === 0 ? (
              <p style={styles.emptyText}>Aucune commande correspondant aux filtres</p>
            ) : (
              <div style={styles.ordersGrid}>
                {getFilteredOrders().map(order => (
                  <div key={order._id} style={styles.orderCard}>
                    <div style={styles.orderCardHeader}>
                      <div>
                        <p style={styles.orderNumber}>#{order._id.substring(0, 12).toUpperCase()}</p>
                        <p style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                      <div style={styles.customerInfo}>
                        <p style={styles.customerName}>{order.customer.firstName} {order.customer.lastName}</p>
                      </div>
                    </div>
                    <div style={styles.orderCardBody}>
                      <div style={styles.orderRow}>
                        <div style={styles.orderCol}>
                          <p style={styles.colLabel}>Montant</p>
                          <p style={styles.colValue}>{order.total.toFixed(2)} €</p>
                        </div>
                        <div style={styles.orderCol}>
                          <p style={styles.colLabel}>Statut</p>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            style={styles.statusSelect}
                          >
                            <option value="pending">En attente</option>
                            <option value="paid">Payée</option>
                            <option value="preparing">Préparation</option>
                            <option value="delivering">Livraison</option>
                            <option value="delivered">Livrée</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div style={styles.productsContainer}>
            <div style={styles.productsHeader}>
              <h2 style={styles.sectionTitle}>Gestion des Produits</h2>
              <button onClick={openAddProductDialog} style={styles.addBtn}>
                <i className="fas fa-plus"></i> Ajouter un produit
              </button>
            </div>

            {/* Filtre */}
            <div style={styles.filterSection}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Catégorie</label>
                <select 
                  value={filterProductCategory}
                  onChange={(e) => setFilterProductCategory(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {getFilteredProducts().length === 0 ? (
              <p style={styles.emptyText}>Aucun produit correspondant aux filtres</p>
            ) : (
              <div style={styles.productsGrid}>
                {getFilteredProducts().map(product => (
                  <div key={product._id} style={styles.productCard}>
                    <div style={styles.productImage}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} style={styles.image} />
                      ) : (
                        <div style={styles.noImage}><i className="fas fa-image"></i></div>
                      )}
                    </div>
                    <div style={styles.productInfo}>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <p style={styles.productPrice}>{product.price.toFixed(2)} €</p>
                      <div style={styles.productActions}>
                        <button 
                          onClick={() => openProductDialog('edit', product)}
                          style={styles.editBtn}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => openProductDialog('delete', product)}
                          style={styles.deleteBtn}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    padding: '60px 140px'
  },
  headerBanner: {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '40px',
    color: '#ffffff',
    boxShadow: '0 10px 30px rgba(5, 150, 105, 0.2)'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
    color: '#ffffff'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#d1fae5',
    margin: 0
  },
  logoutBtn: {
    padding: '12px 24px',
    background: '#fbbf24',
    color: '#1f2937',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease'
  },
  statIcon: {
    fontSize: '2rem',
    color: '#059669'
  },
  statContent: {
    flex: 1
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: '0 0 2px 0',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 40px'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #059669',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  tabsContainer: {
    display: 'flex',
    gap: '0',
    marginBottom: '24px',
    background: '#ffffff',
    borderRadius: '12px 12px 0 0',
    border: '1px solid #e5e7eb',
    borderBottom: 'none'
  },
  tabBtn: {
    padding: '16px 24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.2s ease'
  },
  content: {
    background: '#ffffff',
    borderRadius: '0 0 12px 12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
    minHeight: '400px'
  },
  errorBox: {
    background: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px',
    color: '#dc2626'
  },
  filterSection: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  filterLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#374151'
  },
  filterSelect: {
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.9rem',
    background: '#ffffff',
    cursor: 'pointer',
    fontFamily: 'inherit',
    minWidth: '200px'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '20px',
    margin: '0 0 20px 0'
  },
  ordersContainer: {
    maxWidth: '1200px'
  },
  ordersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  orderCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s ease',
    background: '#ffffff'
  },
  orderCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  orderNumber: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 4px 0'
  },
  orderDate: {
    fontSize: '0.85rem',
    color: '#6b7280',
    margin: 0
  },
  customerInfo: {
    textAlign: 'right'
  },
  customerName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  orderCardBody: {
    padding: '16px'
  },
  orderRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  orderCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  colLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    margin: 0
  },
  colValue: {
    fontSize: '0.95rem',
    color: '#1f2937',
    margin: 0,
    fontWeight: '600'
  },
  ordersTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  orderCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  cellLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    margin: 0
  },
  cellValue: {
    fontSize: '0.95rem',
    color: '#1f2937',
    margin: 0,
    fontWeight: '600'
  },
  statusSelect: {
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '40px 20px'
  },
  productsContainer: {},
  productsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  addBtn: {
    padding: '12px 24px',
    background: '#ffffff',
    color: '#059669',
    border: '2px solid #059669',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px'
  },
  productCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.2s ease'
  },
  productImage: {
    height: '150px',
    background: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  noImage: {
    fontSize: '3rem'
  },
  productInfo: {
    padding: '12px'
  },
  productName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  productPrice: {
    fontSize: '1.1rem',
    color: '#059669',
    fontWeight: '700',
    margin: '0 0 12px 0'
  },
  productActions: {
    display: 'flex',
    gap: '8px'
  },
  editBtn: {
    flex: 1,
    padding: '8px 12px',
    background: '#e0e7ff',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  deleteBtn: {
    flex: 1,
    padding: '8px 12px',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  moreText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: '16px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '400px',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 12px 0'
  },
  modalText: {
    fontSize: '0.95rem',
    color: '#6b7280',
    margin: '0 0 24px 0',
    lineHeight: '1.5'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  },
  cancelBtn: {
    padding: '10px 24px',
    background: '#f3f4f6',
    color: '#6b7280',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  confirmBtn: {
    padding: '10px 24px',
    background: '#059669',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  deleteModalBtn: {
    padding: '10px 24px',
    background: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  productDetailsForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  formLabel: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase'
  },
  formValue: {
    fontSize: '0.95rem',
    color: '#1f2937',
    margin: 0,
    padding: '10px 12px',
    background: '#f9fafb',
    borderRadius: '6px',
    border: '1px solid #e5e7eb'
  },
  formInput: {
    fontSize: '0.95rem',
    color: '#1f2937',
    padding: '10px 12px',
    background: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    fontFamily: 'inherit'
  },
  productImagePreview: {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginBottom: '12px'
  },
  fileInput: {
    padding: '8px',
    border: '2px dashed #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }
};

