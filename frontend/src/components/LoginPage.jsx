import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div
        className="bg-primary/70 backdrop-blur-md border border-accent/30 shadow-lg shadow-accent/10 
                   rounded-2xl px-8 py-10 w-[90%] max-w-md text-primary-content">
        <h2 className="text-4xl font-bold text-accent text-center mb-2" >
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
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 rounded-md bg-primary-content/10 text-primary-content 
                           border border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-accent/70 hover:text-accent transition"
              >
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2 rounded-md bg-accent 
                       text-primary font-semibold hover:bg-accent/80 focus:ring-2 focus:ring-accent/50 
                       transition-all shadow-md shadow-accent/20 disabled:opacity-50">
                Login
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-primary-content/80">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-accent hover:text-accent/80 transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
