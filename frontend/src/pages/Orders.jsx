import { useEffect, useState } from 'react';
import api from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setLoading(false);
    api.get('/orders/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (!orders.length) return <div className="container mx-auto py-8">Aucune commande trouvée.</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Mes commandes</h1>
      <ul>
        {orders.map(order => (
          <li key={order._id} className="border-b py-4">
            <div className="font-semibold">Commande #{order._id}</div>
            <div>Status : {order.status}</div>
            <div>Total : {order.totalPrice} €</div>
            <div>Adresse : {order.deliveryAddress}</div>
            <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
