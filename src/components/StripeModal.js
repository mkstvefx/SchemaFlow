import React, { useState } from "react";

export default function StripeModal({ isOpen, onClose, tierKey, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  let name = "Pro Plan";
  let price = "12.00";
  let desc = "Standard database model visualizer & generator";

  if (tierKey === "free") {
    name = "Hobby Plan";
    price = "0.00";
    desc = "Basic table model designer";
  } else if (tierKey === "enterprise") {
    name = "Enterprise Plan";
    price = "29.00";
    desc = "Full code exporters, SVG downloads, team boards";
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onPaymentSuccess(tierKey);
      onClose();
      alert("Payment Completed! Your SchemaFlow subscription plan has been successfully updated.");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-[4px] z-[100] flex items-center justify-center p-4">
      <div className="bg-[#111113] border border-white/8 rounded-xl w-full max-w-[680px] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-sans font-extrabold text-[#635bff] text-xl">stripe</span>
            <span className="text-xs text-[#71717a]">Secure Checkout</span>
          </div>
          <button className="text-white/50 hover:text-white text-2xl leading-none cursor-pointer" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-[350px]">
          {/* Summary Column */}
          <div className="bg-[#0a0a0c] border-r border-white/8 p-6 flex flex-col justify-between">
            <div className="space-y-1">
              <strong className="text-sm block font-semibold text-white">SchemaFlow Designer</strong>
              <p className="text-xs text-[#71717a] leading-tight">{desc}</p>
            </div>
            
            <div className="border-t border-white/8 pt-4 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[#a1a1aa]">{name}</span>
                <span className="text-white font-medium">€{price}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-dashed border-white/8 pt-3">
                <span className="text-[#f4f4f5]">Total Due</span>
                <span className="text-white">€{price}</span>
              </div>
            </div>
            
            <div className="text-[10px] text-[#71717a] flex items-center gap-1">
              🛡️ Sandbox secure payment.
            </div>
          </div>

          {/* Form Column */}
          <div className="p-6 flex flex-col gap-4">
            <h4 className="text-sm font-bold text-white">Card Information</h4>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#a1a1aa]">Account Email</label>
                <input
                  type="email"
                  required
                  className="bg-white/2 border border-white/8 rounded-md px-3 py-2 text-sm text-[#f4f4f5] outline-none focus:border-[#06b6d4] focus:bg-white/5 focus:ring-3 focus:ring-[#06b6d4]/12 transition-all w-full"
                  defaultValue="developer@schemaflow.io"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#a1a1aa]">Credit Card Details</label>
                <div className="flex flex-col border border-white/8 rounded-md bg-white/1 overflow-hidden">
                  <input
                    type="text"
                    placeholder="Card Number"
                    required
                    className="bg-transparent border-b border-white/8 px-3 py-2 text-sm text-[#f4f4f5] outline-none focus:bg-white/3 transition-all"
                    defaultValue="4242 4242 4242 4242"
                  />
                  <div className="grid grid-cols-[1fr_80px]">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      required
                      className="bg-transparent border-r border-white/8 px-3 py-2 text-sm text-[#f4f4f5] outline-none focus:bg-white/3 transition-all"
                      defaultValue="10/30"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      required
                      className="bg-transparent px-3 py-2 text-sm text-[#f4f4f5] outline-none focus:bg-white/3 transition-all"
                      defaultValue="193"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#a1a1aa]">Billing Organization</label>
                <input
                  type="text"
                  required
                  className="bg-white/2 border border-white/8 rounded-md px-3 py-2 text-sm text-[#f4f4f5] outline-none focus:border-[#06b6d4] focus:bg-white/5 focus:ring-3 focus:ring-[#06b6d4]/12 transition-all w-full"
                  defaultValue="SaaS Inc."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#a1a1aa]">Country</label>
                <select className="bg-white/2 border border-white/8 rounded-md px-3 py-2 text-sm text-[#f4f4f5] outline-none focus:border-[#06b6d4] focus:bg-white/5 focus:ring-3 focus:ring-[#06b6d4]/12 transition-all w-full">
                  <option className="bg-[#111113]">Germany</option>
                  <option className="bg-[#111113]">United States</option>
                  <option className="bg-[#111113]">Austria</option>
                  <option className="bg-[#111113]">Switzerland</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 font-sans font-bold text-xs p-3 rounded-md text-white bg-[#635bff] hover:bg-[#7a73ff] shadow-[0_4px_12px_rgba(99,91,255,0.25)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Securing Checkout Verification..." : `Pay €${price}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
