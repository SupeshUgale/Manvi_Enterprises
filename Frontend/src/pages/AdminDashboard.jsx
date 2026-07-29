import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SecureLoader from '../Components/SecureLoader';
import {
  LayoutDashboard, Package, ShoppingBag, Users, LogOut,
  TrendingUp, IndianRupee, AlertCircle, CheckCircle2,
  Truck, XCircle, ChevronDown, RefreshCw, Loader2, Eye,
  Edit3, Trash2, Plus, Search, Filter, ArrowUpRight, X
} from 'lucide-react';

const STATUS_COLORS = {
  Placed: 'bg-amber-100 text-amber-700 border-amber-200',
  Processing: 'bg-blue-100 text-blue-700 border-blue-200',
  Shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'users', label: 'Customers', icon: Users },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, usersRes] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/orders'),
        api.get('/products'),
        api.get('/admin/users'),
      ]);
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data?.stats || statsRes.value.data);
      }
      if (ordersRes.status === 'fulfilled') {
        setOrders(ordersRes.value.data?.orders || ordersRes.value.data?.data || []);
      }
      if (productsRes.status === 'fulfilled') {
        setProducts(productsRes.value.data?.products || productsRes.value.data?.data || []);
      }
      if (usersRes.status === 'fulfilled') {
        setCustomers(usersRes.value.data?.users || usersRes.value.data?.data || []);
      }
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev =>
        prev.map(o => (o._id === orderId || o.orderId === orderId)
          ? { ...o, orderStatus: newStatus }
          : o
        )
      );
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product from catalog?')) return;
    setDeletingProduct(productId);
    try {
      await api.delete(`/products/${productId}`);
      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (err) {
      console.error('Delete product failed:', err);
    } finally {
      setDeletingProduct(null);
    }
  };

  const filteredOrders = orders.filter(o =>
    (o.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(c =>
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <SecureLoader message="Loading Admin Analytics & Database..." />;
  }

  // ─── Overview Tab ─────────────────────────────────────────────────────────
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', sub: 'All time' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', sub: `${stats?.pendingOrders || 0} pending` },
          { label: 'Products', value: stats?.totalProducts || products.length, icon: Package, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200', sub: 'In catalog' },
          { label: 'Customers', value: stats?.totalUsers || customers.length, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', sub: 'Registered' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`bg-white border ${stat.bg} rounded-2xl p-5 space-y-3`}>
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">{stat.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">Recent Orders</h3>
          <button onClick={() => setActiveTab('orders')} className="text-xs text-emerald-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer">
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(orders.slice(0, 5)).map(order => (
                <tr key={order._id || order.orderId} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-emerald-700">{order.orderId}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{order.customer?.name || '—'}</p>
                    <p className="text-gray-400 text-[10px]">{order.customer?.email || ''}</p>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${STATUS_COLORS[order.orderStatus] || STATUS_COLORS.Placed}`}>
                      {order.orderStatus || 'Placed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-xs">No orders found</div>
          )}
        </div>
      </div>
    </div>
  );

  // ─── Orders Tab ──────────────────────────────────────────────────────────
  const renderOrders = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">All Orders</h2>
          <p className="text-xs text-gray-500 mt-0.5">{orders.length} total orders</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search orders..."
            className="pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-emerald-700 whitespace-nowrap">{order.orderId}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{order.customer?.name || '—'}</p>
                    <p className="text-gray-400 text-[10px]">{order.customer?.phone || ''}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.products?.length || 0}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-600 truncate max-w-[120px]">{order.paymentMethod || 'COD'}</p>
                    <p className={`text-[10px] font-bold mt-0.5 ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {order.paymentStatus || 'Pending'}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus || 'Placed'}
                      onChange={e => handleUpdateOrderStatus(order._id || order.orderId, e.target.value)}
                      disabled={updatingOrder === order._id}
                      className={`text-[10px] font-bold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${STATUS_COLORS[order.orderStatus] || STATUS_COLORS.Placed}`}
                    >
                      {['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {updatingOrder === order._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    ) : (
                      <button className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer">
                        Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-xs">No orders match your search</div>
          )}
        </div>
      </div>
    </div>
  );

  // ─── Products Tab ─────────────────────────────────────────────────────────
  const renderProducts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Product Catalog</h2>
          <p className="text-xs text-gray-500 mt-0.5">{products.length} products in database</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-emerald-300 transition group">
            <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
              <img
                src={product.image?.startsWith('/uploads')
                  ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.image}`
                  : product.image}
                alt={product.name}
                className="h-28 object-contain p-3"
                onError={e => { e.target.src = 'https://placehold.co/200x200?text=No+Image'; }}
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 line-clamp-2">{product.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{product.brand} · {product.category}</p>
                </div>
                {product.badge && (
                  <span className="shrink-0 text-[9px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-sm font-black text-gray-900">₹{(product.price || 0).toLocaleString('en-IN')}</span>
                  {product.actualPrice > product.price && (
                    <span className="text-[10px] text-gray-400 line-through ml-1">₹{product.actualPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
                <span className={`text-[10px] font-bold ${product.stock > 5 ? 'text-emerald-600' : 'text-red-500'}`}>
                  Stock: {product.stock}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  disabled={deletingProduct === product._id}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                >
                  {deletingProduct === product._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-3 py-12 text-center text-gray-400 text-xs">No products match your search</div>
        )}
      </div>
    </div>
  );

  // ─── Users Tab ─────────────────────────────────────────────────────────────
  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Customers</h2>
          <p className="text-xs text-gray-500 mt-0.5">{customers.length} registered users</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search customers..."
            className="pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Email', 'Phone', 'Role', 'Joined'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map(customer => (
                <tr key={customer._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                        {(customer.name || 'U')[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900">{customer.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                  <td className="px-4 py-3 text-gray-600">{customer.phone || customer.mobile || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${customer.role === 'admin' ? 'bg-violet-100 text-violet-700 border-violet-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {customer.role || 'user'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-xs">No customers match your search</div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
          <p className="text-sm font-medium text-gray-500">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900">Manvi Enterprises</p>
              <p className="text-[10px] text-gray-500">Admin Control Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAll}
              className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-900">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'users' && renderUsers()}
      </div>
    </div>
  );
}