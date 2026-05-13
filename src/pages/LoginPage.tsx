import { ChangeEvent, useState } from 'react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import { authApi } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@/store/authStore';
import { DecodedToken, LoginCredentials, RegisterCredentials } from '@/types';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


type Tab = 'login' | 'register';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function LoginPage() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [loginForm, setLoginForm] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);

  const redirectBasedOnRole = (token: string) => {
  const decoded = jwtDecode<DecodedToken>(token);
  switch (decoded.role) {
    case 'user':
      navigate('/dashboard');
      break;        // ← was missing
    case 'admin':
      navigate('/admin');
      break;        // ← was missing
    default:
      navigate('/');
  }
}
  const loginMutation = useMutation<{ user: any; token: string }, Error, LoginCredentials>({
    mutationFn: (data) => authApi.login(data),
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      redirectBasedOnRole(token);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const registerMutation = useMutation<{ user: any; token: string } | null, Error, RegisterCredentials>({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (result) => {
      if (result?.user && result?.token) {
        setAuth(result.user, result.token);
      } else {
        setActiveTab('login');
      }
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (activeTab === 'login') {
      setLoginForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setRegisterForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    loginMutation.mutate(loginForm);
  };

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    registerMutation.mutate({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
    });
  };
  return (
    <div className="min-h-screen flex font-sans bg-gray-50 overflow-hidden">
      {/* Left Panel  */}
      <div className="hidden lg:flex w-6/12 bg-brand relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-white/5" />

        <Logo />

        <div className="space-y-6">
          <h1 className="text-5xl leading-tight font-serif">
            Clinical intelligence,
            <br />
            <span className="italic opacity-90">always verified.</span>
          </h1>
          <p className="text-lg opacity-80 max-w-md">
            Ask complex pharmaceutical and medical questions. Every answer
            traces back to your institution's verified knowledge base.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="w-2 h-2 rounded-full bg-white/70" />
            <p className="text-sm">
              Answers sourced exclusively from verified documents
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="w-2 h-2 rounded-full bg-white/70" />
            <p className="text-sm">
              Full audit trail — every response cites its source
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - login registerForm */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[400px]">
          <div className="inline-flex items-center gap-2 bg-brand-light text-brand-dark text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
            VERIFIED MEDICAL PLATFORM
          </div>

          {/* switch Tabs */}
          <div className="bg-brand-light p-1.5 rounded-2xl flex mb-10">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "login"
                  ? "bg-white text-brand shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "register"
                  ? "bg-white text-brand shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* {error && <p className="text-sm text-red-600 mb-6">{error}</p>} */}
          {loginMutation.isError && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-sm"
              style={{ background: "#FCEBEB", color: "#A32D2D" }}
            >
              {loginMutation.error.message}
            </div>
          )}

          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-1">
                  Welcome back
                </h2>
                <p className="text-gray-500 mb-8">
                  Sign in to your MediQ workspace
                </p>
              </div>

              <InputField
                label="Institutional email"
                type="email"
                name="email"
                value={loginForm.email}
                placeholder="you@hospital.edu"
                onChange={handleInputChange}
              />
              <InputField
                label="Password"
                type="password"
                name="password"
                value={loginForm.password}
                placeholder="••••••••••"
                onChange={handleInputChange}
              />

              <div className="text-right">
                <a href="#" className="text-sm text-brand hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button
                variant="primary"
                type="submit"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in…" : "Sign in to MediQ"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest text-gray-400 bg-gray-50 px-4">
                  or continue with
                </div>
              </div>

              <Button variant="sso" type="button">
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                Sign in with Google
              </Button>
            </form>
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-1">
                  Create account
                </h2>
                <p className="text-gray-500 mb-8">
                  Join your institution's MediQ workspace
                </p>
              </div>

              <InputField
                label="Full name"
                type="text"
                name="name"
                value={registerForm.name}
                placeholder="Jane Smith"
                onChange={handleInputChange}
              />
              <InputField
                label="Institutional email"
                type="email"
                name="email"
                value={registerForm.email}
                placeholder="you@hospital.edu"
                onChange={handleInputChange}
              />
              <InputField
                label="Password"
                type="password"
                name="password"
                value={registerForm.password}
                placeholder="Min. 8 characters"
                onChange={handleInputChange}
              />
              <InputField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={registerForm.confirmPassword}
                placeholder="Re-enter your password"
                onChange={handleInputChange}
              />

              <Button
                variant="primary"
                type="submit"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending
                  ? "Creating account…"
                  : "Create my account"}
              </Button>
            </form>
          )}

          <p className="text-center text-xs text-gray-500 mt-10 leading-relaxed">
            By continuing you agree to MediQ's{" "}
            <a href="#" className="text-brand hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-brand hover:underline">
              Privacy Policy
            </a>
            .<br />
            This platform is not a substitute for clinical judgement.
          </p>
        </div>
      </div>
    </div>
  );
}