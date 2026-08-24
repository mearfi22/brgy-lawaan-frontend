import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-accent/15 border-b border-accent text-primary-dark text-xs font-medium px-4 py-2 flex items-center justify-center gap-2">
      <WifiOff size={14} />
      You're offline — showing saved data. Will update automatically once reconnected.
    </div>
  );
}