// Utilitaires pour gérer le panier dans le localStorage

export function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const index = cart.findIndex(item => item.product._id === product._id);
  if (index > -1) {
    cart[index].quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  saveCart(cart);
}

export function removeFromCart(productId) {
  const cart = getCart().filter(item => item.product._id !== productId);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function updateQuantity(productId, quantity) {
  const cart = getCart();
  const index = cart.findIndex(item => item.product._id === productId);
  if (index > -1) {
    if (quantity > 0) {
      cart[index].quantity = quantity;
    } else {
      cart.splice(index, 1);
    }
    saveCart(cart);
  }
}
