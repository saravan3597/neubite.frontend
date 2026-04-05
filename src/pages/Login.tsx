import React, { useState } from 'react';
import { useAuthStore } from '../shared/stores/useAuthStore';
import { useNavigate, Navigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const { login, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorText('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-50">
      {/* Left Form Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-[0_0_480px] lg:px-20 xl:px-24 bg-white border-r border-slate-200 z-10 shadow-2xl relative">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              N
            </div>
            <span className="text-2xl font-bold tracking-tight text-surface-900">
              Neubite
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-surface-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to your account to manage your meals.
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errorText && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                  {errorText}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 text-surface-900 placeholder-slate-400"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 text-surface-900 placeholder-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-surface-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-surface-900 transition-all duration-200"
              >
                Sign in to account
              </button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">
                    New to Neubite?{' '}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all duration-200"
                >
                  Create an account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Image/Gradient Section */}
      <div className="hidden lg:block relative flex-1 bg-surface-900 overflow-hidden">
        {/* Abstract decorative elements simulating SaaS background patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-surface-900 to-black opacity-90"></div>
        
        {/* Glowing Orb 1 */}
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse"></div>
        {/* Glowing Orb 2 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30"></div>
        {/* Glowing Orb 3 */}
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"></div>

        <div className="relative h-full flex flex-col justify-center px-16 xl:px-24">
          <blockquote className="max-w-2xl">
            <p className="text-3xl font-medium text-white leading-tight mb-6">
              "Neubite completely changed how I manage my groceries. I am saving money on meals and reducing my food waste to near zero."
            </p>
            <footer className="text-lg text-brand-100 font-medium">
              — Sarah Jenkins
              <div className="text-sm text-slate-400 font-normal mt-1">Product Designer</div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};
