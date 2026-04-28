import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStats, getUsers, deleteUser, getMedicines, addMedicine, updateMedicine, deleteMedicine, getOrders, deleteOrder } from '../services/adminService';
import StatsCard from '../components/admin/StatsCard';
import MedicineModal from '../components/admin/MedicineModal';
import { Users, Pill, ShoppingBag, Plus, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalUsers: 0, totalMedicines: 0, totalOrders: 0 });
  const [medicines, setMedicines] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await getStats();
        setStats(res.stats);
      } else if (activeTab === 'users') {
        const res = await getUsers();
        setUsers(res.users);
      } else if (activeTab === 'medicines') {
        const res = await getMedicines(1, 100); // simplify pagination for MVP
        setMedicines(res.medicines);
      } else if (activeTab === 'orders') {
        const res = await getOrders();
        setOrders(res.orders);
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        toast.success('User deleted');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await deleteMedicine(id);
        toast.success('Medicine deleted');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete medicine');
      }
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(id);
        toast.success('Order deleted');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete order');
      }
    }
  };

  const handleSaveMedicine = async (medicineData) => {
    if (selectedMedicine) {
      await updateMedicine(selectedMedicine._id, medicineData);
    } else {
      await addMedicine(medicineData);
    }
    fetchData();
  };

  const openAddModal = () => {
    setSelectedMedicine(null);
    setIsMedicineModalOpen(true);
  };

  const openEditModal = (med) => {
    setSelectedMedicine(med);
    setIsMedicineModalOpen(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Admin Panel</h2>
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <ShoppingBag size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('medicines')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'medicines' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Pill size={20} /> Medicines
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Users size={20} /> Users
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <ShoppingBag size={20} /> Orders
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {loading ? (
           <div className="flex justify-center mt-20"><div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div></div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} colorClass="bg-blue-500" />
                  <StatsCard title="Medicines" value={stats.totalMedicines} icon={Pill} colorClass="bg-green-500" />
                  <StatsCard title="Orders" value={stats.totalOrders} icon={ShoppingBag} colorClass="bg-purple-500" />
                </div>
              </div>
            )}

            {activeTab === 'medicines' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Medicines</h2>
                  <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <Plus size={20} /> Add Medicine
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Category</th>
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Price</th>
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map((med) => (
                        <tr key={med._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="p-4 text-gray-800 dark:text-gray-200">{med.name}</td>
                          <td className="p-4 text-gray-800 dark:text-gray-200">{med.category}</td>
                          <td className="p-4 text-gray-800 dark:text-gray-200">₹{med.price}</td>
                          <td className="p-4 flex gap-3">
                            <button onClick={() => openEditModal(med)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                            <button onClick={() => handleDeleteMedicine(med._id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))}
                      {medicines.length === 0 && (
                        <tr><td colSpan="4" className="text-center p-4 text-gray-500">No medicines found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <MedicineModal 
                  isOpen={isMedicineModalOpen} 
                  onClose={() => setIsMedicineModalOpen(false)} 
                  onSave={handleSaveMedicine} 
                  medicine={selectedMedicine}
                />
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Manage Users</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="p-4 text-gray-800 dark:text-gray-200">{u.name}</td>
                          <td className="p-4 text-gray-800 dark:text-gray-200">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700" title="Delete User">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr><td colSpan="4" className="text-center p-4 text-gray-500">No users found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Manage Orders</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Customer</th>
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Contact</th>
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Items</th>
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Total Price</th>
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="p-4 text-gray-800 dark:text-gray-200">
                            <div>{o.name}</div>
                            <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="p-4 text-gray-800 dark:text-gray-200">
                            <div>{o.phone}</div>
                            <div className="text-sm text-gray-500">{o.address}</div>
                          </td>
                          <td className="p-4 text-gray-800 dark:text-gray-200 text-sm">
                            <ul className="list-disc pl-4">
                              {o.items.map(item => (
                                <li key={item._id}>{item.name} (x{item.quantity})</li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-4 text-gray-800 dark:text-gray-200 font-semibold">₹{o.totalPrice}</td>
                          <td className="p-4">
                            <button onClick={() => handleDeleteOrder(o._id)} className="text-red-500 hover:text-red-700" title="Delete Order">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan="5" className="text-center p-4 text-gray-500">No orders found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
