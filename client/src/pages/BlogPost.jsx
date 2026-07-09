import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { API.get(`/blog/${slug}`).then(r => setBlog(r.data.data)).catch(() => {}).finally(() => setLoading(false)); }, [slug]);

  if (loading) return <div className="container-custom px-4 py-8"><div className="skeleton h-64 rounded-2xl mb-6" /><div className="skeleton h-8 w-3/4 mb-4" /><div className="skeleton h-4 w-full mb-2" /><div className="skeleton h-4 w-2/3" /></div>;
  if (!blog) return <div className="text-center py-20 text-text-muted">Not found</div>;

  return (
    <div className="container-custom px-4 md:px-8 py-8 max-w-4xl mx-auto">
      <Link to="/blog" className="text-sm text-text-muted hover:text-primary transition">&larr; Back to Blog</Link>
      <div className="mt-6">
        <div className="aspect-video bg-primary-light/10 rounded-3xl overflow-hidden">
          <img src={blog.coverImage || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800'} alt={blog.title} className="w-full h-full object-cover" />
        </div>
        <div className="mt-8">
          {blog.tags?.map(t => <span key={t} className="badge-primary mr-2">{t}</span>)}
          <h1 className="text-h1 mt-4">{blog.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-text-muted">
            <span>By {blog.author?.name || 'Opal Team'}</span>
            <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-8 text-text-muted leading-relaxed whitespace-pre-line">{blog.content}</div>
      </div>

      {blog.relatedProducts?.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {blog.relatedProducts.map(p => (
              <Link key={p._id} to={`/product/${p._id}`} className="card p-3">
                <div className="aspect-square bg-primary-light/10 rounded-xl overflow-hidden">
                  <img src={p.images?.[0] || 'https://via.placeholder.com/200'} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-text-muted mt-2">{p.brand}</p>
                <p className="font-medium text-sm line-clamp-1">{p.name}</p>
                <p className="font-bold text-sm mt-1">{p.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
