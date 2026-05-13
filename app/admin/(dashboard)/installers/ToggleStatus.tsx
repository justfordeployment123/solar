'use client';

import { useTransition, useState } from 'react';
import { toggleInstallerStatus } from './actions';

export function ToggleStatus({ id, initialStatus }: { id: string, initialStatus: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(initialStatus);

  const handleToggle = () => {
    const nextStatus = !status;
    // Optimistic UI update
    setStatus(nextStatus);
    
    startTransition(async () => {
      try {
        await toggleInstallerStatus(id, nextStatus);
      } catch (error) {
        // Revert on failure
        setStatus(status);
        console.error(error);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 ${
        status ? 'bg-brand-red' : 'bg-brand-lighter-gray'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      role="switch"
      aria-checked={status}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-brand-white transition-transform ${
          status ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
