import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const save = async (e) => { e.preventDefault(); setSaving(true); try { await updateProfile({ name }); toast.success('Updated!'); } catch { toast.error('Failed'); } finally { setSaving(false); } };

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <h1 className="section-title mb-8">My Profile</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-surface-2 rounded-2xl p-6 shadow-card">
            <h2 className="font-semibold text-lg mb-4">Personal Information</h2>
            <form onSubmit={save} className="space-y-4">
              <div><label className="text-sm text-text-muted block mb-1">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="input" required /></div>
              <div><label className="text-sm text-text-muted block mb-1">Email</label><input type="email" value={user?.email || ''} className="input bg-gray-50" disabled /></div>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? '...' : 'Save Changes'}</button>
            </form>
          </div>
          {user?.skinProfile?.skinType && <div className="bg-surface-2 rounded-2xl p-6 shadow-card mt-6"><h2 className="font-semibold mb-4">Skin Profile</h2><div className="text-sm space-y-1"><p><span className="text-text-muted">Type:</span> <span className="font-medium capitalize">{user.skinProfile.skinType}</span></p>{user.skinProfile.concerns?.length > 0 && <p><span className="text-text-muted">Concerns:</span> {user.skinProfile.concerns.join(', ')}</p>}</div><Link to="/quiz" className="text-primary text-sm font-medium mt-3 inline-block hover:underline">Update Skin Profile</Link></div>}
        </div>
        <div><div className="bg-surface-2 rounded-2xl p-6 shadow-card"><h2 className="font-semibold mb-4">Quick Links</h2><div className="space-y-3">{['orders', 'wishlist', 'reviews'].map(s => <Link key={s} to={`/profile/${s}`} className="block text-sm text-text-muted hover:text-primary py-2 border-b border-border transition capitalize">{s}</Link>)}</div></div></div>
      </div>
    </div>
  );
};

export default Profile;
