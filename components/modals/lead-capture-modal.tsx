"use client";

import { useState } from "react";
import { useCalculatorStore } from "@/store/calculatorStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2 } from "lucide-react";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const { leadDraft, setLeadDraft, ...state } = useCalculatorStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    if (formData.get("website")) {
      setLoading(false);
      return; 
    }

    try {
      const payload = {
        firstName: leadDraft.firstName,
        lastName: leadDraft.lastName,
        email: leadDraft.email,
        phone: leadDraft.phone,
        calculationSnapshot: {
          technical: state.technical,
          financial: state.financial,
          derivedResults: state.derivedResults,
        }
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit request.");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#363636]/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="relative w-full max-w-lg glass bg-white/90 shadow-2xl p-8 border border-white/50" style={{ animation: 'fade-in 150ms ease-out' }}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="modal-title" className="text-2xl font-black tracking-tight text-[#363636] mb-2 uppercase">Request Personalized Offer</h2>
        <p className="text-sm font-medium text-slate-500 mb-8">Enter your details to receive a full economic projection and a customized offer from a certified partner.</p>
        
        {success ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Request Sent</h3>
            <p className="text-slate-600 mb-8">We will be in touch shortly with your personalized details.</p>
            <Button onClick={onClose} fullWidth className="bg-[#363636] py-3 uppercase tracking-widest text-sm font-bold text-white hover:bg-black transition-colors">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                id="firstName"
                type="text"
                required
                value={leadDraft.firstName}
                onChange={(e: any) => setLeadDraft({ firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                id="lastName"
                type="text"
                required
                value={leadDraft.lastName}
                onChange={(e: any) => setLeadDraft({ lastName: e.target.value })}
              />
            </div>
            
            <Input
              label="Email Address"
              id="email"
              type="email"
              required
              value={leadDraft.email}
              onChange={(e: any) => setLeadDraft({ email: e.target.value })}
            />
            
            <Input
              label="Phone Number"
              id="phone"
              type="tel"
              value={leadDraft.phone || ''}
              onChange={(e: any) => setLeadDraft({ phone: e.target.value })}
            />
            
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            
            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 py-3 text-slate-600 border-slate-300 hover:bg-slate-50 uppercase tracking-widest text-sm font-bold">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-[#e12029] hover:bg-[#c1151c] text-white py-3 uppercase tracking-widest text-sm font-bold border-none">
                {loading ? "Sending..." : "Request Offer"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
