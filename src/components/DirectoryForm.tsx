import { useState, type FormEvent } from 'react';
import type { DirectoryEntry, DirectoryType } from '../types/directory';

interface Props {
  initial?: Partial<DirectoryEntry>;
  onSubmit: (data: Partial<DirectoryEntry>) => Promise<void>;
  onCancel: () => void;
}

const typeOptions: { value: DirectoryType; label: string }[] = [
  { value: 'abtc', label: 'Animal Bite Treatment Center' },
  { value: 'health_center', label: 'Health Center' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'barangay_outpost', label: 'Barangay Health Outpost' },
];

const inputClass =
  'block w-full mt-2 px-3 py-2.5 border border-line rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15';
const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-primary mb-4';

export default function DirectoryForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [type, setType] = useState<DirectoryType>(initial?.type ?? 'health_center');
  const [address, setAddress] = useState(initial?.address ?? '');
  const [contactNumber, setContactNumber] = useState(initial?.contact_number ?? '');
  const [operatingHours, setOperatingHours] = useState(initial?.operating_hours ?? '');
  const [servicesOffered, setServicesOffered] = useState(initial?.services_offered ?? '');
  const [requirements, setRequirements] = useState(initial?.requirements ?? '');
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({
        name, type, address,
        contact_number: contactNumber || null,
        operating_hours: operatingHours || null,
        services_offered: servicesOffered || null,
        requirements: requirements || null,
        is_active: isActive,
      });
    } catch {
      setError('Failed to save. Please check the fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-md shadow-card p-6 max-w-2xl mb-8">
      <label className={labelClass}>
        Facility Name
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <label className={labelClass}>
        Type
        <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as DirectoryType)}>
          {typeOptions.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </label>

      <label className={labelClass}>
        Address
        <input className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} required />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className={labelClass}>
          Contact Number <span className="normal-case font-normal text-ink-soft/60">(optional)</span>
          <input className={inputClass} value={contactNumber ?? ''} onChange={(e) => setContactNumber(e.target.value)} />
        </label>
        <label className={labelClass}>
          Operating Hours <span className="normal-case font-normal text-ink-soft/60">(optional)</span>
          <input className={inputClass} value={operatingHours ?? ''} onChange={(e) => setOperatingHours(e.target.value)} placeholder="Mon–Fri, 8AM–5PM" />
        </label>
      </div>

      <label className={labelClass}>
        Services Offered <span className="normal-case font-normal text-ink-soft/60">(optional)</span>
        <textarea className={inputClass} value={servicesOffered ?? ''} onChange={(e) => setServicesOffered(e.target.value)} rows={2} placeholder="Free PEP shots, wound care..." />
      </label>

      <label className={labelClass}>
        Requirements <span className="normal-case font-normal text-ink-soft/60">(optional)</span>
        <textarea className={inputClass} value={requirements ?? ''} onChange={(e) => setRequirements(e.target.value)} rows={2} placeholder="Barangay ID, bite incident report..." />
      </label>

      <label className="flex items-center gap-2 text-sm text-ink mb-4">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4" />
        Active (visible to residents)
      </label>

      {error && <p className="text-urgent text-sm mb-3">{error}</p>}

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={onCancel} className="border border-line text-ink-soft px-5 py-2.5 rounded-md text-sm hover:border-ink-soft transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-md text-sm transition-colors disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
}