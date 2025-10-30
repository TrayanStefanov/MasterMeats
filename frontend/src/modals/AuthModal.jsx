import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  IoLogInOutline,
  IoMailOutline,
  IoPersonOutline,
  IoLockClosedOutline,
  IoEye,
  IoEyeOff,
  IoClose,
} from "react-icons/io5";
import { LuLoader } from "react-icons/lu";
import { useTranslation } from "react-i18next";

import { useUserStore } from "../stores/useUserStore";

const AuthModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation("auth");
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, signup, loading, error, user } = useUserStore();

  useEffect(() => {
    if (!isOpen) {
      setMode("login");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await signup(formData);
        setMode("login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] ${
        isOpen ? "flex" : "hidden"
      } items-center justify-center bg-black/40 backdrop-blur-sm`}
    >
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-primary/90 border-4 border-accent text-primary-content rounded-2xl p-8 w-[90%] max-w-md shadow-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-secondary/70 hover:text-accent transition"
          >
            <IoClose size={24} />
          </button>

          <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-accent text-center mb-2">
            {mode === "login"
              ? t("loginMode.title")
              : t("signupMode.title")}
          </h2>
          <p className="text-center text-primary-content/80 mb-8 text-base lg:text-lg 2xl:text-xl">
            {mode === "login"
              ? t("loginMode.subtitle")
              : t("signupMode.subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs lg:text-sm 2xl:text-base font-medium mb-1"
                >
                  {t("form.name")}
                </label>
                <div className="relative">
                  <IoPersonOutline className="absolute left-3 top-2.5 w-5 h-5 text-accent/70" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="w-full pl-10 pr-3 py-2 rounded-md bg-secondary text-primary placeholder:text-primary/50
                    border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs lg:text-sm 2xl:text-base font-medium mb-1"
              >
                {t("form.email")}
              </label>
              <div className="relative">
                <IoMailOutline className="absolute left-3 top-2.5 w-5 h-5 text-accent/70" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2 rounded-md bg-secondary text-primary placeholder:text-primary/50
                  border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs lg:text-sm 2xl:text-base font-medium mb-1"
              >
                {t("form.password")}
              </label>
              <div className="relative">
                <IoLockClosedOutline className="absolute left-3 top-2.5 w-5 h-5 text-accent/70" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 rounded-md bg-secondary text-primary placeholder:text-primary/50
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

            {mode === "signup" && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs lg:text-sm 2xl:text-base font-medium mb-1"
                >
                  {t("form.confirmPassword")}
                </label>
                <div className="relative">
                  <IoLockClosedOutline className="absolute left-3 top-2.5 w-5 h-5 text-accent/70" />
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2 rounded-md bg-secondary text-primary placeholder:text-primary/50
                    border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-400 text-base lg:text-lg 2xl:text-xl text-center mt-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center text-base lg:text-lg 2xl:text-xl gap-2 py-2 rounded-md bg-accent 
            text-secondary/70 font-semibold hover:bg-accent/80 focus:ring-2 focus:ring-accent/50 
            transition-all shadow-md shadow-accent/20 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LuLoader className="w-5 h-5 animate-spin" />
                  {mode === "login"
                    ? t("loginMode.loading")
                    : t("signupMode.loading")}
                </>
              ) : (
                <>
                  {mode === "login" ? (
                    <IoLogInOutline className="w-5 h-5" />
                  ) : (
                    <IoPersonOutline className="w-5 h-5" />
                  )}
                  {mode === "login"
                    ? t("loginMode.btn")
                    : t("signupMode.btn")}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs lg:text-sm 2xl:text-base">
            <p className="text-primary-content/80">
              {mode === "login"
                ? t("loginMode.belowtext")
                : t("signupMode.belowtext")}
              <button
                type="button"
                onClick={switchMode}
                className="text-accent hover:text-accent/80 transition-colors font-medium"
              >
                {mode === "login"
                  ? t("loginMode.btnCTA")
                  : t("signupMode.btnCTA")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
