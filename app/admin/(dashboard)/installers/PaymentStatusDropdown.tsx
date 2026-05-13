'use client';

import { useTransition, useState } from 'react';
import { updatePaymentStatus } from './actions';

export function PaymentStatusDropdown({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value;
    setStatus(nextStatus);
    
    startTransition(async () => {
      try {
        await updatePaymentStatus(id, nextStatus);
      } catch (error) {
        setStatus(currentStatus);
        console.error(error);
      }
    });
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className={`px-2 py-1 rounded-md text-sm border focus:outline-none focus:ring-1 focus:ring-brand-red ${
        isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${
        status === 'material_partner' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
        status === 'details_provided' ? 'bg-blue-50 border-blue-200 text-blue-700' :
        'bg-[#fff5f5] border-[#ffcccc] text-[#e20613]'
      }`}
    >
      <option value="pending">Pending</option>
      <option value="details_provided">Details Provided</option>
      <option value="material_partner">Material Partner</option>
    </select>
  );
}
