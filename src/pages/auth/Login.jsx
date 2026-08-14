import toast from "react-hot-toast";
import { loginUser } from "../../services/authService";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(response.message || "Login successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071614] text-[#E8F3EF]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* =========================================
            LEFT - BRANDING
        ========================================== */}

        <section
          className="
          relative hidden overflow-hidden
          border-r border-[#21483E]
          bg-[#275C4D]
          lg:flex
        "
        >
          {/* Decorative glow */}
          <div
            className="
            absolute -left-32 -top-32
            h-96 w-96
            rounded-full
            bg-[#3F8E78]/30
            blur-3xl
          "
          />

          <div
            className="
            absolute -bottom-40 -right-32
            h-[450px] w-[450px]
            rounded-full
            bg-[#A9DDCC]/10
            blur-3xl
          "
          />

          <div
            className="
            relative z-10
            flex w-full
            flex-col
            justify-between
            p-10 xl:p-14
          "
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="
                flex h-11 w-11
                items-center justify-center
                rounded-xl
                bg-[#A9DDCC]
                text-[#071614]
              "
              >
                <Sparkles size={21} />
              </div>

              <div>
                <h1
                  className="
                  text-lg font-semibold
                  tracking-tight
                  text-[#E8F3EF]
                "
                >
                  LeadPilot
                </h1>

                <p
                  className="
                  text-[11px]
                  font-medium
                  text-[#A9DDCC]
                "
                >
                  AI CRM
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-xl">
              <div
                className="
                mb-6 inline-flex
                items-center gap-2
                rounded-full
                border border-[#3F8E78]
                bg-[#071614]/20
                px-3 py-1.5
                text-xs
                text-[#A9DDCC]
              "
              >
                <Sparkles size={13} />
                AI-powered lead management
              </div>

              <h2
                className="
                text-4xl
                font-semibold
                leading-[1.12]
                tracking-tight
                text-[#E8F3EF]
                xl:text-5xl
              "
              >
                Turn Leads Into
                <span className="block text-[#A9DDCC]">Customers.</span>
              </h2>

              <p
                className="
                mt-6
                max-w-lg
                text-base
                leading-7
                text-[#A8C2B9]
              "
              >
                Manage your leads, understand customer intent and take smarter
                actions with AI-powered insights.
              </p>

              {/* Feature points */}
              <div className="mt-8 space-y-4">
                {[
                  "AI-powered lead analysis",
                  "Smart follow-up management",
                  "Generate personalized replies",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#A9DDCC]" />

                    <span
                      className="
                      text-sm
                      text-[#C5DAD3]
                    "
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom */}
            <p
              className="
              text-xs
              text-[#6F9186]
            "
            >
              Intelligent CRM for modern sales teams.
            </p>
          </div>
        </section>

        {/* =========================================
            RIGHT - LOGIN
        ========================================== */}

        <section
          className="
          flex min-h-screen
          items-center justify-center
          px-4 py-8
          sm:px-6
          lg:px-10
        "
        >
          <div
            className="
            w-full max-w-md
          "
          >
            {/* Mobile Logo */}
            <div
              className="
              mb-10
              flex items-center
              justify-center
              gap-3
              lg:hidden
            "
            >
              <div
                className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-[#A9DDCC]
                text-[#071614]
              "
              >
                <Sparkles size={19} />
              </div>

              <div>
                <h1
                  className="
                  text-base font-semibold
                  text-[#E8F3EF]
                "
                >
                  LeadPilot
                </h1>

                <p
                  className="
                  text-[10px]
                  text-[#A9DDCC]
                "
                >
                  AI CRM
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p
                className="
                mb-2
                text-sm font-medium
                text-[#3F8E78]
              "
              >
                Welcome back
              </p>

              <h2
                className="
                text-2xl
                font-semibold
                tracking-tight
                text-[#E8F3EF]
                sm:text-3xl
              "
              >
                Sign in to your account
              </h2>

              <p
                className="
                mt-2
                text-sm
                leading-6
                text-[#6F9186]
              "
              >
                Access your leads and continue where you left off.
              </p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div
                className="
                mb-5
                rounded-xl
                border border-red-500/30
                bg-red-500/10
                px-4 py-3
                text-sm
                text-red-300
              "
              >
                {errors.general}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#C5DAD3]
                "
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-[#6F9186]
                    "
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`
                      w-full
                      rounded-xl
                      border
                      bg-[#275C4D]/20
                      py-3
                      pl-11
                      pr-4
                      text-sm
                      text-[#E8F3EF]
                      outline-none
                      placeholder:text-[#506F65]
                      transition
                      ${
                        errors.email
                          ? "border-red-500/60"
                          : "border-[#21483E] focus:border-[#3F8E78]"
                      }
                    `}
                  />
                </div>

                {errors.email && (
                  <p
                    className="
                    mt-1.5
                    text-xs
                    text-red-400
                  "
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#C5DAD3]
                "
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-[#6F9186]
                    "
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`
                      w-full
                      rounded-xl
                      border
                      bg-[#275C4D]/20
                      py-3
                      pl-11
                      pr-11
                      text-sm
                      text-[#E8F3EF]
                      outline-none
                      placeholder:text-[#506F65]
                      transition
                      ${
                        errors.password
                          ? "border-red-500/60"
                          : "border-[#21483E] focus:border-[#3F8E78]"
                      }
                    `}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute right-3.5 top-1/2
                      -translate-y-1/2
                      text-[#6F9186]
                      transition
                      hover:text-[#A9DDCC]
                    "
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p
                    className="
                    mt-1.5
                    text-xs
                    text-red-400
                  "
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember */}
              <div
                className="
                flex items-center
                justify-between
                gap-4
              "
              >
                <label
                  className="
                  flex cursor-pointer
                  items-center gap-2.5
                "
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="
                      h-4 w-4
                      rounded
                      border-[#21483E]
                      bg-[#275C4D]
                      accent-[#3F8E78]
                    "
                  />

                  <span
                    className="
                    text-xs
                    text-[#A8C2B9]
                  "
                  >
                    Remember me
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#3F8E78]
                  px-4 py-3
                  text-sm
                  font-semibold
                  text-[#071614]
                  transition
                  hover:bg-[#A9DDCC]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <span
                      className="
                      h-4 w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-[#071614]/30
                      border-t-[#071614]"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={17}
                      className="
                        transition
                        group-hover:translate-x-0.5
                      "
                    />
                  </>
                )}
              </button>
            </form>

            {/* Register */}
            <p
              className="
              mt-8
              text-center
              text-sm
              text-[#6F9186]
            "
            >
              Don't have an account?
              <Link
                to={"/register"}
                className="
                  font-medium
                  text-[#A9DDCC]
                  hover:text-white
                "
              >
                Create account
              </Link>
            </p>

            {/* Footer */}
            <p
              className="
              mt-10
              text-center
              text-[11px]
              text-[#506F65]
            "
            >
              © 2026 LeadPilot AI
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
