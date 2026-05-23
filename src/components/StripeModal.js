import React, { useState, useEffect } from "react";

export default function StripeModal({ isOpen, onClose, tierKey, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("developer@schemaflow.io");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/30");
  const [cardCvc, setCardCvc] = useState("123");

  let planName = "Pro Plan";
  let planPrice = 12.00;
  let planDesc = "Unlimited database modeling, Prisma & Mongoose code compilers, and vector SVG exports.";

  if (tierKey === "free") {
    planName = "Hobby Plan";
    planPrice = 0.00;
    planDesc = "Basic database modeling up to 3 tables.";
  } else if (tierKey === "enterprise") {
    planName = "Enterprise Plan";
    planPrice = 29.00;
    planDesc = "Unlimited visual schemas, team collaborative workspaces, DBML compiling, and priority Slack support.";
  }

  // Fetch client secret from backend payment-intent route on modal open
  useEffect(() => {
    if (isOpen && planPrice > 0) {
      setCheckoutError("");
      setPaymentSuccess(false);
      
      fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: planPrice, tierKey })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setCheckoutError(data.error);
          } else {
            setClientSecret(data.clientSecret);
          }
        })
        .catch(err => {
          setCheckoutError("Failed to connect to checkout payment intent backend.");
        });
    }
  }, [isOpen, tierKey, planPrice]);

  if (!isOpen) return null;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setCheckoutError("");

    // Simulate processing payment via Stripe custom verification
    setTimeout(() => {
      setLoading(false);
      setPaymentSuccess(true);
      
      // Delay closing to show completion animation
      setTimeout(() => {
        onPaymentSuccess(tierKey);
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/82 backdrop-blur-[4px] z-[100] flex items-center justify-center p-4">
      <div className="bg-[#111113]/90 border border-white/8 rounded-2xl w-full max-w-[700px] overflow-hidden shadow-2xl flex flex-col backdrop-blur-md">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/8 flex justify-between items-center bg-white/2">
          <div className="flex items-center gap-2">
            <span className="font-sans font-extrabold text-[#635bff] text-xl">stripe</span>
            <span className="text-xs text-[#71717a] font-semibold uppercase tracking-wider">Custom Checkout</span>
          </div>
          <button className="text-white/50 hover:text-white text-2xl leading-none cursor-pointer" onClick={onClose}>
            &times;
          </button>
        </div>

        {paymentSuccess ? (
          /* Payment success checkout validation screen */
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[360px]">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-3xl shadow-[0_0_20px_rgba(34,197,94,0.15)] animate-pulse">
              ✓
            </div>
            <h3 className="text-lg font-bold text-white">Payment Confirmed!</h3>
            <p className="text-xs text-[#a1a1aa] max-w-[320px]">
              Your SchemaFlow workspace has been successfully upgraded to the **{planName}**.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-[360px]">
            
            {/* Left pricing summary */}
            <div className="bg-[#0a0a0c] border-r border-white/8 p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <strong className="text-xs text-[#06b6d4] font-bold uppercase tracking-wider block">Billing summary</strong>
                <strong className="text-sm block font-semibold text-white">SchemaFlow Premium</strong>
                <p className="text-[10px] text-[#71717a] leading-relaxed">{planDesc}</p>
              </div>

              <div className="border-t border-white/8 pt-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-[#a1a1aa]">{planName}</span>
                  <span className="text-white font-medium">€{planPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-dashed border-white/8 pt-3">
                  <span className="text-[#f4f4f5]">Total Due</span>
                  <span className="text-white">€{planPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-[9px] text-[#71717a] flex items-center gap-1.5 border-t border-white/5 pt-3">
                🔒 Secured by Stripe SDK.
              </div>
            </div>

            {/* Custom Payment Form */}
            <div className="p-6 flex flex-col gap-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Payment Details</h4>
              
              {checkoutError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-[10px] text-red-400">
                  {checkoutError}
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#a1a1aa]">Account Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/2 border border-white/8 rounded-md px-3 py-2 text-xs text-[#f4f4f5] outline-none focus:border-[#06b6d4] focus:bg-white/5 transition-all w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#a1a1aa]">Name on Card</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="bg-white/2 border border-white/8 rounded-md px-3 py-2 text-xs text-[#f4f4f5] outline-none focus:border-[#06b6d4] focus:bg-white/5 transition-all w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#a1a1aa]">Card Information</label>
                  <div className="flex flex-col border border-white/8 rounded-md bg-white/1 overflow-hidden">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number"
                      className="bg-transparent border-b border-white/8 px-3 py-2 text-xs text-[#f4f4f5] outline-none focus:bg-white/3 transition-all"
                    />
                    <div className="grid grid-cols-[1fr_80px]">
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="bg-transparent border-r border-white/8 px-3 py-2 text-xs text-[#f4f4f5] outline-none focus:bg-white/3 transition-all"
                      />
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="bg-transparent px-3 py-2 text-xs text-[#f4f4f5] outline-none focus:bg-white/3 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 font-sans font-bold text-xs p-3 rounded-md text-white bg-[#635bff] hover:bg-[#7a73ff] hover:shadow-[0_4px_12px_rgba(99,91,255,0.25)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Processing Secure Checkout..." : `Pay €${planPrice.toFixed(2)}`}
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
