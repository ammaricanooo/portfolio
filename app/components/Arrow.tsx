interface ArrowProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  direction?: "right" | "up-right";
  color?: string;
}

export default function Arrow({
  className = "",
  size = "md",
  direction = "right",
  color = "",
}: ArrowProps) {
  const dirClass = direction === "up-right" ? "arrow-up-right" : "";
  const sizeClass =
    size === "xs"
      ? "arrow-xs"
      : size === "sm"
      ? "arrow-sm"
      : size === "lg"
      ? "arrow-lg"
      : "arrow-md";

  return (
    <div className={`arrow-container ${sizeClass} ${dirClass} ${color} ${className}`}>
      <div className="arrow-line" />
      <div className="arrow-point" />
    </div>
  );
}

