import { useState, type FormEvent } from 'react';
import { submitSuggestion } from '../api/suggestions';
import type { SuggestionCategory } from '../types/suggestion';
import PublicHeader from '../components/PublicHeader';

const categoryOptions: { value: SuggestionCategory; label: string }[] = [
  { value: 'housing', label: 'Housing Concern' },
  { value: 'sanitation', label: 'Sanitation / Waste' },
  { value: 'fire_hazard', label: 'Fire Hazard' },
  { value: 'health_concern', label: 'Health Concern' },
  { value: 'general', label: 'General Feedback' },
];

const inputClass =
  'block w-full mt-2 px-3.5 py-2.5 border border-line rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15';
const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-primary mb-4';

export default function SuggestionForm() {
  const [category, setCategory] = useState<SuggestionCategory>('general');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      await submitSuggestion({ category, message, submitter_name: name, submitter_phone: phone });
      setStatus('success');
      setMessage(''); setName(''); setPhone('');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please check your details and try again.');
    }
  };

  return (
    <>
      <PublicHeader />
      <div className="min-h-[calc(100vh-64px)] bg-bg flex items-center justify-center p-6">
        {status === 'success' ? (
          <div className="bg-surface border border-line rounded-lg shadow-card p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-ink mb-2">Thank you!</h2>
            <p className="text-sm text-ink-soft mb-6">Your report has been sent to the barangay. A BHW may follow up with you.</p>
            <button
              onClick={() => setStatus('idle')}
              className="border border-primary text-primary px-5 py-2 rounded-md text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Submit another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-lg shadow-card p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold text-ink mb-1">Report a Concern</h2>
            <p className="text-sm text-ink-soft mb-6 leading-relaxed">
              Report housing, sanitation, fire hazards, or health concerns directly to Brgy Lawa-an.
            </p>

            <label className={labelClass}>
              Category
              <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as SuggestionCategory)}>
                {categoryOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </label>

            <label className={labelClass}>
              Your Full Name
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required placeholder="Juan Dela Cruz" />
            </label>

            <label className={labelClass}>
              Mobile Number
              <input type="tel" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="09XXXXXXXXX" pattern="09\d{9}" title="Format: 09XXXXXXXXX" />
            </label>

            <label className={labelClass}>
              Details
              <textarea className={inputClass} value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} placeholder="Describe the concern..." />
            </label>

            {status === 'error' && <p className="text-urgent text-sm mb-4">{errorMsg}</p>}

            <button
              type="submit" disabled={status === 'submitting'}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-md text-sm transition-colors disabled:opacity-60 mt-2"
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}