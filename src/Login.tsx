import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthenticate } from "./utils/base.hooks";
import { FiLock, FiUser, FiShield, FiAlertCircle, FiArrowRight } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthenticate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    try {
      const data = await login(username, password);
      const { username: user, token } = data;

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", user);
      localStorage.setItem("token", token);

      if (user.toLowerCase() === "admin") {
        navigate("/");
      } else {
        navigate("/tourist");
      }
    } catch {
      // error is already set by the hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-950 via-ocean-900 to-ocean-800 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-sand-200/80 relative overflow-hidden">
        {/* Top Decorative Emblem Banner */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-mint-400 to-ocean-600 text-ocean-900 font-serif font-bold text-3xl shadow-md mx-auto">
            M
          </div>
          <div>
            <div className="flex items-center justify-center space-x-2">
              <span className="font-serif font-bold text-3xl text-ink-900 tracking-tight">
                m-lah
              </span>
              <span className="badge-tag bg-mint-50 text-mint-700 border border-mint-200 text-[10px]">
                Secure
              </span>
            </div>
            <p className="text-xs font-semibold text-ocean-700 uppercase tracking-wider mt-1">
              Labour & Human Affairs Portal
            </p>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sand-100 text-ink-600 text-xs">
            <FiShield className="text-mint-600" size={13} />
            <span>Authorized Personnel Access Only</span>
          </div>
        </div>

        {/* Error Callout */}
        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-coral-50 border border-coral-200 text-coral-700 text-xs font-semibold flex items-start space-x-2.5"
          >
            <FiAlertCircle className="flex-shrink-0 mt-0.5 text-coral-600" size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-bold text-ink-800 uppercase tracking-wider mb-2"
            >
              Account Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-400">
                <FiUser size={18} />
              </div>
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                placeholder="e.g. admin or user"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 bg-sand-50/50 text-ink-900 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ocean-600 focus-visible:bg-white transition-all placeholder:text-ink-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-ink-800 uppercase tracking-wider mb-2"
            >
              Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-400">
                <FiLock size={18} />
              </div>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 bg-sand-50/50 text-ink-900 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ocean-600 focus-visible:bg-white transition-all placeholder:text-ink-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-mint-500 hover:bg-mint-400 text-ocean-900 font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 focus-visible:ring-2 focus-visible:ring-ocean-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? "Authenticating Session..." : "Sign In to Portal"}</span>
            {!isLoading && <FiArrowRight size={16} />}
          </button>
        </form>

        {/* Credentials Guidance Helper */}
        <div className="mt-8 pt-6 border-t border-sand-100 text-center">
          <p className="text-xs text-ink-400 mb-2">System Authentication Roles</p>
          <div className="flex justify-center gap-3 text-[11px]">
            <span className="px-2.5 py-1 rounded-lg bg-sand-100 text-ink-600 font-mono">
              admin
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-sand-100 text-ink-600 font-mono">
              user
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

