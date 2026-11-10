interface ArrowProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  direction?: "right" | "left" | "up" | "down";
  color?: string;
}

export default function Arrow({
  className = "",
  size = "md",
  direction = "right",
  color = "",
}: ArrowProps) {
  const dirClass =
    direction === "up"
      ? "arrow-up"
      : direction === "down"
      ? "arrow-down"
      : direction === "left"
      ? "arrow-left"
      : "";

  const sizeClass =
    size === "xs"
      ? "arrow-xs"
      : size === "sm"
      ? "arrow-sm"
      : size === "lg"
      ? "arrow-lg"
      : "arrow-md";

  return (
    <div className={`arrow-container ${sizeClass} ${dirClass} ${color} ${className}`.trim()}>
      <div className="arrow-line" />
      <div className="arrow-point" />
    </div>
  );
}

