import { useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';

const QuizResults = () => {
  const { state } = useLocation();
  const recs = state?.recommendations || [];
  const ans = state?.answers;

  return (
    <div className="container-custom px-4 md:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-h1">Your Personalized Picks</h1>
        {ans && <p className="text-text-muted mt-2">Based on your {ans.skinType} skin, concerns & goals</p>}
      </div>
      {!recs.length ? (
        <div className="text-center py-12"><p className="text-text-muted">Couldn't generate recommendations.</p><Link to="/quiz" className="btn-primary mt-4 inline-block">Retry Quiz</Link></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">{recs.map((r, i) => <ProductCard key={r.product?._id || i} product={r.product} matchScore={r.matchScore} reason={r.reason} />)}</div>
      )}
      <div className="text-center mt-8"><Link to="/quiz" className="btn-secondary">Retake Quiz</Link><Link to="/catalog" className="btn-primary ml-4">Browse All</Link></div>
    </div>
  );
};

export default QuizResults;
