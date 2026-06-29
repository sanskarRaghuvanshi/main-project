import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { ProgressBar } from '../components/ui/index';
import { skinTypes as stList, concerns as cList, goals as gList, budgets } from '../constants/index';

const Quiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ skinType: '', concerns: [], goals: [], budget: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { title: "What's your skin type?", sub: 'This helps us find the perfect match', comp: <div className="grid grid-cols-2 gap-3">{stList.map(st => <button key={st} onClick={() => setAnswers({...answers, skinType: answers.skinType === st ? '' : st})} className={`p-4 rounded-xl border-2 text-center transition ${answers.skinType === st ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-muted hover:border-primary-light'}`}><span className="block text-lg mb-1">{['😊','💧','🌿','✨','🌸'][stList.indexOf(st)]}</span><span className="font-medium capitalize">{st}</span></button>)}</div> },
    { title: 'What are your main concerns?', sub: 'Select all that apply', comp: <div className="grid grid-cols-2 gap-3">{cList.map(c => <button key={c} onClick={() => setAnswers({...answers, concerns: answers.concerns.includes(c.toLowerCase()) ? answers.concerns.filter(x => x !== c.toLowerCase()) : [...answers.concerns, c.toLowerCase()]})} className={`p-3 rounded-xl border-2 text-center text-sm transition ${answers.concerns.includes(c.toLowerCase()) ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-muted hover:border-primary-light'}`}>{c}</button>)}</div> },
    { title: "What's your goal?", sub: 'What do you want to achieve?', comp: <div className="grid grid-cols-2 gap-3">{gList.map(g => <button key={g} onClick={() => setAnswers({...answers, goals: answers.goals.includes(g.toLowerCase()) ? [] : [g.toLowerCase()]})} className={`p-4 rounded-xl border-2 text-center transition ${answers.goals.includes(g.toLowerCase()) ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-muted hover:border-primary-light'}`}>{g}</button>)}</div> },
    { title: "What's your budget?", sub: "We'll find the best options", comp: <div className="space-y-3">{budgets.map(b => <button key={b.value} onClick={() => setAnswers({...answers, budget: answers.budget === b.value ? '' : b.value})} className={`w-full p-4 rounded-xl border-2 text-left transition ${answers.budget === b.value ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-muted hover:border-primary-light'}`}><span className="font-medium block">{b.label}</span><span className="text-xs text-text-muted">{b.desc}</span></button>)}</div> },
  ];

  const canNext = () => { if (step === 0) return answers.skinType; if (step === 1) return answers.concerns.length > 0; if (step === 2) return answers.goals.length > 0; return answers.budget; };

  const submit = async () => {
    setLoading(true);
    try {
      const r = await API.post('/quiz/recommend', answers);
      navigate('/quiz/results', { state: { recommendations: r.data.data, answers } });
    } catch { navigate('/quiz/results', { state: { recommendations: [], answers } }); toast.error('AI unavailable, showing fallback'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-surface to-primary/5 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8"><h1 className="text-h1">Skin Quiz</h1><p className="text-text-muted mt-2">Step {step + 1} of {steps.length}</p><div className="mt-4"><ProgressBar step={step} total={steps.length} /></div></div>
        <div className="bg-surface-2 rounded-3xl shadow-card p-8"><h2 className="text-h2">{steps[step].title}</h2><p className="text-text-muted text-sm mb-6">{steps[step].sub}</p>{steps[step].comp}
          <div className="flex gap-3 mt-8">{step > 0 && <button onClick={() => setStep(step - 1)} className="btn-secondary flex-1">Back</button>}
            {step < steps.length - 1 ? <button onClick={() => setStep(step + 1)} disabled={!canNext()} className="btn-primary flex-1">Next</button>
            : <button onClick={submit} disabled={!canNext() || loading} className="btn-primary flex-1">{loading ? 'Finding matches...' : 'Get Recommendations'}</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
