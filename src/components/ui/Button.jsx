import { Loader2 } from "lucide-react";

const variants = {
    primary:
        "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",

    secondary:
        "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-400",

    ai:
        "bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-500",

    danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",

    ghost:
        "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};

const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    type = "button",
    className = "",
    ...props
}) {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            disabled={isDisabled}
            className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        font-medium
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            {...props}
        >
            {loading && <Loader2 size={17} className="animate-spin" />}

            {children}
        </button>
    );
}