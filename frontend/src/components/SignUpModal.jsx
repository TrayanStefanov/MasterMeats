import { useState } from "react";
import { createPortal } from "react-dom";
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoEye, IoEyeOff, IoClose } from "react-icons/io5";
import { LuLoader } from "react-icons/lu";
import { useUserStore } from "../stores/useUserStore";

const SignUpModal = ({ isOpen, onClose, openLoginModal }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signup, loading, error } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-primary/90 rounded-2xl p-8 w-[90%] max-w-md text-primary-content shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-accent/70 hover:text-accent transition"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-4xl font-bold text-accent text-center mb-2">
          Create an Account
        </h2>
        <p className="text-center text-primary-content/80 mb-8 text-sm">
          Join us today — it’s quick and easy
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <div className="relative">
              <IoPersonOutline className="absolute left-3 top-2.5 w-5 h-5 text-accent/70" />
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full pl-10 pr-3 py-2 rounded-md bg-primary-content/10 text-primary-content 
                           border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <IoMailOutline className="absolute left-3 top-2.5 w-5 h-5 text-accent/70" />
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2 rounded-md bg-primary-content/10 text-primary-content 
                           border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-3 top-2.5 w-5 h-5 text-accent/70" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 rounded-md bg-primary-content/10 text-primary-content 
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-3 top-2.5 w-5 h-5 text-accent/70" />
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 rounded-md bg-primary-content/10 text-primary-content 
                           border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
              />
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
                Creating Account...
              </>
            ) : (
              <>
                <IoPersonOutline className="w-5 h-5" />
                Sign Up
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-primary-content/80">
            Already have an account?{" "}
            <button
              type="button"
              onClick={openLoginModal}
              className="text-accent hover:text-accent/80 transition-colors font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SignUpModal;
