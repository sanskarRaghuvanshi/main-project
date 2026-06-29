import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { API.get('/blog/tags').then(r => setTags(r.data.data || [])).catch(() => {}); }, []);
  useEffect(() => {
    setLoading(true);
    API.get('/blog', { params: { tag: tag || undefined, search: search || undefined } })
      .then(r => setBlogs(r.data.data?.blogs || [])).catch(() => {}).finally(() => setLoading(false));
  }, [tag, search]);

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="section-title">Beauty Blog</h1>
        <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="input !py-2 !w-64 text-sm" />
      </div>
      {tags.length > 0 && <div className="flex flex-wrap gap-2 mb-8"><button onClick={() => setTag('')} className={`badge cursor-pointer transition ${!tag ? 'badge-primary' : 'bg-surface-2 text-text-muted hover:text-primary'}`}>All</button>{tags.map(t => <button key={t} onClick={() => setTag(t)} className={`badge cursor-pointer transition ${tag === t ? 'badge-primary' : 'bg-surface-2 text-text-muted hover:text-primary'}`}>{t}</button>)}</div>}
      {loading ? <div className="grid md:grid-cols-3 gap-6">{Array.from({length:6}).map((_,i) => <div key={i} className="animate-pulse"><div className="skeleton h-48 rounded-xl mb-4" /><div className="skeleton h-4 w-3/4 rounded mb-2" /><div className="skeleton h-3 w-1/2 rounded" /></div>)}</div> : !blogs.length ? <div className="text-center py-12 text-text-muted">No posts found</div> : <div className="grid md:grid-cols-3 gap-6">{blogs.map(b => <Link key={b._id} to={`/blog/${b.slug}`} className="card group"><div className="aspect-video bg-primary-light/10 overflow-hidden"><img src={b.coverImage || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div><div className="p-5">{b.tags?.slice(0,2).map(t => <span key={t} className="badge-primary text-xs mr-2">{t}</span>)}<h3 className="font-display font-semibold text-lg mt-2 line-clamp-2 group-hover:text-primary transition">{b.title}</h3><p className="text-text-muted text-sm mt-2 line-clamp-2">{b.excerpt || b.content?.slice(0,100)}</p><p className="text-xs text-text-muted mt-3">{new Date(b.publishedAt).toLocaleDateString()}</p></div></Link>)}</div>}
    </div>
  );
};

export default Blog;
