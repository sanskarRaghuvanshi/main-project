import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { API.get('/admin/users').then(r => setUsers(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  const toggleBlock = async (id, current) => { try { const r = await API.put(`/admin/users/${id}`, { isBlocked: !current }); setUsers(prev => prev.map(u => u._id === id ? r.data.data : u)); toast.success(current ? 'Unblocked' : 'Blocked'); } catch { toast.error('Failed'); } };
  const toggleAdmin = async (id, current) => { try { const r = await API.put(`/admin/users/${id}`, { role: current === 'admin' ? 'user' : 'admin' }); setUsers(prev => prev.map(u => u._id === id ? r.data.data : u)); toast.success(`Role updated`); } catch { toast.error('Failed'); } };

  return (
    <div>
      <h1 className="text-h1 mb-6">Users</h1>
      {loading ? <div className="animate-pulse space-y-3">{Array.from({length:5}).map((_,i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div> : <div className="bg-surface-2 rounded-2xl overflow-hidden shadow-card"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left p-4 font-medium">User</th><th className="text-left p-4 font-medium hidden md:table-cell">Email</th><th className="text-left p-4 font-medium">Role</th><th className="text-left p-4 font-medium">Status</th><th className="text-left p-4 font-medium">Actions</th></tr></thead><tbody>{users.map(u => <tr key={u._id} className="border-t border-border hover:bg-gray-50"><td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center"><span className="text-primary font-bold text-xs">{u.name?.[0]}</span></div><span className="font-medium">{u.name}</span></div></td><td className="p-4 text-text-muted hidden md:table-cell">{u.email}</td><td className="p-4"><span className={`badge text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td><td className="p-4"><span className={`badge text-xs ${u.isBlocked ? 'badge-error' : 'badge-success'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td><td className="p-4"><div className="flex gap-2"><button onClick={() => toggleBlock(u._id, u.isBlocked)} className={`text-xs hover:underline ${u.isBlocked ? 'text-success' : 'text-error'}`}>{u.isBlocked ? 'Unblock' : 'Block'}</button><button onClick={() => toggleAdmin(u._id, u.role)} className="text-xs text-purple-500 hover:underline">{u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}</button></div></td></tr>)}</tbody></table></div></div>}
    </div>
  );
};

export default AdminUsers;
