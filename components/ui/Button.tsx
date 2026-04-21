interface ButtonProps {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
    className?: string;
}

export default function Button({
    label,
    href,
    onClick,
    variant = "primary",
    className = "",
}: ButtonProps) {
    const base = "inline-block px-6 py-2 rounded font-medium transition-colors";
    const styles =
        variant === "primary"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border border-blue-600 text-blue-600 hover:bg-blue-50";

    if (href) {
        return (
            <a href={href} className={`${base} ${styles} ${className}`}>
                {label}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={`${base} ${styles} ${className}`}>
            {label}
        </button>
    );
}
