import React, { useState } from "react";
import { supabase, isSupabaseConfigured } from "../utils/supabase";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState("signin"); // signin, signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!isSupabaseConfigured) {
      // Mock Sandbox Login Fallback
      setTimeout(() => {
        setLoading(false);
        const mockUser = {
          email,
          id: "mock-user-id-" + Date.now(),
          plan_tier: "free"
        };
        alert("🔒 Running in Local Sandbox Mode. Logged in successfully!");
        onAuthSuccess(mockUser);
        onClose();
      }, 1000);
      return;
    }

    try {
      if (tab === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        
        // Fetch or create user profile
        onAuthSuccess(data.user);
        alert("Welcome back! Logged in successfully.");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;

        alert("Registration email verification link sent! Check your inbox.");
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message || "An unexpected auth error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/82 backdrop-blur-[4px] z-[100] flex items-center justify-center p-4">
      <div className="bg-[#111113]/90 border border-white/8 rounded-xl w-full max-w-[400px] overflow-hidden shadow-2xl flex flex-col backdrop-blur-md">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/8 flex justify-between items-center bg-white/2">
          <strong className="text-sm font-bold text-white uppercase tracking-wider">
            {tab === "signin" ? "Sign In" : "Create Account"}
          </strong>
          <button className="text-white/50 hover:text-white text-xl cursor-pointer" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {!isSupabaseConfigured && (
            <div className="bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-lg p-3 text-[10px] text-[#a78bfa] leading-relaxed mb-4">
              ⚠️ **Offline Sandbox Mode**: Supabase environment keys are missing. You can enter any mock email/password to preview the auth and database saving flow.
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-[10px] text-red-400 mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#a1a1aa]">Email Address</label>
              <input
                type="email"
                required
                placeholder="developer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/2 border border-white/8 rounded-md px-3 py-2 text-sm text-[#f4f4f5] outline-none focus:border-[#06b6d4] focus:bg-white/5 transition-all w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#a1a1aa]">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/2 border border-white/8 rounded-md px-3 py-2 text-sm text-[#f4f4f5] outline-none focus:border-[#06b6d4] focus:bg-white/5 transition-all w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white rounded-md text-xs font-semibold cursor-pointer hover:shadow-[0_4px_12px_rgba(6,182,212,0.25)] transition-all disabled:opacity-50"
            >
              {loading ? "Authenticating..." : tab === "signin" ? "Log In" : "Sign Up"}
            </button>
          </form>

          {/* Toggle Tab */}
          <div className="mt-5 text-center text-xs border-t border-white/5 pt-4 text-[#71717a]">
            {tab === "signin" ? (
              <span>
                New to SchemaFlow?{" "}
                <button onClick={() => setTab("signup")} className="text-[#06b6d4] font-semibold hover:underline bg-transparent border-none cursor-pointer">
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button onClick={() => setTab("signin")} className="text-[#06b6d4] font-semibold hover:underline bg-transparent border-none cursor-pointer">
                  Log in
                </button>
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
