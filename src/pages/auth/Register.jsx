import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      general: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success(response.message || "Account created successfully");

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071614] text-[#E8F3EF]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT BRANDING */}
        <section
          className="
          relative hidden overflow-hidden
          border-r border-[#21483E]
          bg-[#275C4D]
          lg:flex
        "
        >
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

            {/* Content */}
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
                Build Better
                <span className="block text-[#A9DDCC]">
                  Customer Relationships.
                </span>
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
                Bring your leads, follow-ups and AI-powered insights together in
                one intelligent workspace.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Manage your entire lead pipeline",
                  "Track follow-ups and activities",
                  "Use AI to make smarter sales decisions",
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

        {/* RIGHT FORM */}
        <section
          className="
          flex min-h-screen
          items-center justify-center
          px-4 py-8
          sm:px-6
          lg:px-10
        "
        >
          <div className="w-full max-w-md">
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
            <div className="mb-7">
              <p
                className="
                mb-2
                text-sm font-medium
                text-[#3F8E78]
              "
              >
                Get started
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
                Create your account
              </h2>

              <p
                className="
                mt-2
                text-sm
                leading-6
                text-[#6F9186]
              "
              >
                Start managing your leads with LeadPilot AI.
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  className="
                  mb-2 block
                  text-sm font-medium
                  text-[#C5DAD3]
                "
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-[#6F9186]
                    "
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`
                      w-full rounded-xl border
                      bg-[#275C4D]/20
                      py-3 pl-11 pr-4
                      text-sm text-[#E8F3EF]
                      outline-none
                      placeholder:text-[#506F65]
                      transition
                      ${
                        errors.name
                          ? "border-red-500/60"
                          : "border-[#21483E] focus:border-[#3F8E78]"
                      }
                    `}
                  />
                </div>

                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  className="
                  mb-2 block
                  text-sm font-medium
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
                      w-full rounded-xl border
                      bg-[#275C4D]/20
                      py-3 pl-11 pr-4
                      text-sm text-[#E8F3EF]
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
                  <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  className="
                  mb-2 block
                  text-sm font-medium
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
                    placeholder="Create a password"
                    className={`
                      w-full rounded-xl border
                      bg-[#275C4D]/20
                      py-3 pl-11 pr-11
                      text-sm text-[#E8F3EF]
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
                      hover:text-[#A9DDCC]
                    "
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="
                  mb-2 block
                  text-sm font-medium
                  text-[#C5DAD3]
                "
                >
                  Confirm password
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
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`
                      w-full rounded-xl border
                      bg-[#275C4D]/20
                      py-3 pl-11 pr-11
                      text-sm text-[#E8F3EF]
                      outline-none
                      placeholder:text-[#506F65]
                      transition
                      ${
                        errors.confirmPassword
                          ? "border-red-500/60"
                          : "border-[#21483E] focus:border-[#3F8E78]"
                      }
                    `}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="
                      absolute right-3.5 top-1/2
                      -translate-y-1/2
                      text-[#6F9186]
                      hover:text-[#A9DDCC]
                    "
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  group mt-2
                  flex w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#3F8E78]
                  px-4 py-3
                  text-sm font-semibold
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
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

            {/* Login */}
            <p
              className="
              mt-7
              text-center
              text-sm
              text-[#6F9186]
            "
            >
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="
                  font-medium
                  text-[#A9DDCC]
                  hover:text-white
                "
              >
                Sign In
              </Link>
            </p>

            <p
              className="
              mt-8
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
