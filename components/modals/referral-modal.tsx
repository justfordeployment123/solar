"use client";

import { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const [yourName, setYourName] = useState("");
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yourName, friendName, friendEmail }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Senden der Empfehlung");
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setYourName("");
        setFriendName("");
        setFriendEmail("");
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md border border-[#e5e5e5] relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <span className="absolute top-0 left-0 right-0 h-[3px] bg-[#d2d700]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#1a1a1a] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-2">
              Freund empfehlen
            </h2>
            <p className="text-sm text-[#5a5859] leading-relaxed">
              Teilen Sie diesen Rechner mit jemandem, der auch von einer
              Batteriespeicherlösung profitieren könnte.
            </p>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-[#ecfccb] text-[#84cc16] rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1a1a1a]">Empfehlung gesendet!</h3>
                <p className="text-sm text-[#5a5859] mt-2">
                  Vielen Dank für Ihre Weiterempfehlung.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#5a5859]">
                  Ihr Name
                </label>
                <input
                  type="text"
                  required
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  className="w-full bg-white border border-[#e5e5e5] py-3 px-4 outline-none focus:border-[#d2d700] text-[#1a1a1a] font-semibold text-[0.95rem] transition-colors placeholder:text-[#a1a1a1] placeholder:font-medium"
                  placeholder="Max Mustermann"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#5a5859]">
                  Name des Freundes
                </label>
                <input
                  type="text"
                  required
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  className="w-full bg-white border border-[#e5e5e5] py-3 px-4 outline-none focus:border-[#d2d700] text-[#1a1a1a] font-semibold text-[0.95rem] transition-colors placeholder:text-[#a1a1a1] placeholder:font-medium"
                  placeholder="Anna Schmidt"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#5a5859]">
                  E-Mail des Freundes
                </label>
                <input
                  type="email"
                  required
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  className="w-full bg-white border border-[#e5e5e5] py-3 px-4 outline-none focus:border-[#d2d700] text-[#1a1a1a] font-semibold text-[0.95rem] transition-colors placeholder:text-[#a1a1a1] placeholder:font-medium"
                  placeholder="anna@beispiel.de"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 border border-red-100 rounded">
                  {error}
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1a1a1a] text-white hover:bg-[#d2d700] hover:text-black"
                >
                  {isSubmitting ? (
                    "Wird gesendet..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Empfehlung senden
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
