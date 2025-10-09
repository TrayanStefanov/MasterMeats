import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  IoLogInOutline,
  IoMailOutline,
  IoLockClosedOutline,
  IoEye,
  IoEyeOff,
  IoClose,
  IoArrowRedoOutline,
} from "react-icons/io5";
import { LuLoader } from "react-icons/lu";

import { useUserStore } from "../stores/useUserStore";

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, error } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-primary/90 rounded-2xl p-8 w-[90%] max-w-md text-primary-content shadow-lg">
        <button
          onClick={onClose}
          aria-label="Close login modal"
          className="absolute top-4 right-4 text-primary-content/70 hover:text-accent transition"
        >
          <IoClose className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-bold text-accent text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-primary-content/80 mb-8 text-sm">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <IoMailOutline className="absolute left-3 top-2.5 w-5 h-5 text-accent/70" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="w-full pl-10 pr-3 py-2 rounded-md bg-primary-content/10 text-primary-content 
              border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-3 top-2.5 w-5 h-5 text-accent/70" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full pl-10 px-3 py-2 rounded-md bg-primary-content/10 text-primary-content 
              border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-accent/70 hover:text-accent transition"
              >
                {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mt-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2 rounded-md bg-accent 
                       text-primary font-semibold hover:bg-accent/80 focus:ring-2 focus:ring-accent/50 
                       transition-all shadow-md shadow-accent/20 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <LuLoader className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <IoLogInOutline className="w-5 h-5" />
                Login
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-primary-content/80">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-accent hover:text-accent/80 transition-colors font-medium"
            >
              Sign up <IoArrowRedoOutline className="inline w-4 h-4 ml-1" />
            </Link>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
