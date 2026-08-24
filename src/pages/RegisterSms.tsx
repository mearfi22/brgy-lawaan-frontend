import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { registerResident } from '../api/residents';
import PublicHeader from '../components/PublicHeader';
import MobileTabBar from '../components/MobileTabBar';

const inputClass =
  'block w-full mt-2 px-3.5 py-2.5 border border-line rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15';
const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-primary mb-4';

function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits;
}

export default function RegisterSms() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [purokZone, setPurokZone] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const phoneValid = /^09\d{9}$/.test(phoneNumber);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      await registerResident({ full_name: fullName, phone_number: phoneNumber, purok_zone: purokZone || undefined });
      setStatus('success');
      setFullName(''); setPhoneNumber(''); setPurokZone('');
    } catch (err: any) {
      setStatus('error');
      const apiError = err?.response?.data?.errors;
      setErrorMsg(apiError?.phone_number?.[0] ?? 'Something went wrong. Please check your details and try again.');
    }
  };

  return (
    <>
      <PublicHeader />
      <div className="min-h-[calc(100vh-64px)] bg-bg flex items-center justify-center p-6 pb-24 md:pb-6">
        {status === 'success' ? (
          <div className="bg-surface border border-line rounded-lg shadow-card p-8 max-w-sm w-full text-center">
            <CheckCircle2 size={40} className="mx-auto text-primary mb-3" />
            <h2 className="text-xl font-bold text-ink mb-2">You're registered!</h2>
            <p className="text-sm text-ink-soft mb-6">You'll now receive SMS updates for urgent health announcements in Brgy Lawa-an.</p>
            <button
              onClick={() => setStatus('idle')}
              className="border border-primary text-primary px-5 py-2 rounded-md text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Register another number
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-lg shadow-card p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold text-ink mb-1">Register for SMS Updates</h2>
            <p className="text-sm text-ink-soft mb-6 leading-relaxed">
              Get free flu vaccine, medicine, and health mission alerts by text — no internet needed.
            </p>

            <label className={labelClass}>
              Full Name
              <input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Juan Dela Cruz" />
            </label>

            <label className={labelClass}>
              Mobile Number
              <input
                type="tel"
                inputMode="numeric"
                className={inputClass}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneInput(e.target.value))}
                required
                placeholder="09XXXXXXXXX"
              />
              {phoneNumber.length > 0 && !phoneValid && (
                <span className="block mt-1.5 text-[11px] normal-case font-normal text-ink-soft">
                  Format: 09 followed by 9 digits (11 digits total)
                </span>
              )}
            </label>

            <label className={labelClass}>
              Purok / Zone <span className="normal-case font-normal text-ink-soft/60">(optional)</span>
              <input className={inputClass} value={purokZone} onChange={(e) => setPurokZone(e.target.value)} placeholder="e.g. Purok 3" />
            </label>

            {status === 'error' && <p className="text-urgent text-sm mb-4">{errorMsg}</p>}

            <button
              type="submit"
              disabled={status === 'submitting' || !phoneValid}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-md text-sm transition-colors disabled:opacity-60 mt-2"
            >
              {status === 'submitting' ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
      </div>
      <MobileTabBar />
    </>
  );
}