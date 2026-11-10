"use client";

import { usePageTransition } from "../lib/usePageTransition";

interface TransitionLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function TransitionLink({
  href,
  className,
  children,
  onClick,
  onMouseEnter,
}: TransitionLinkProps) {
  const { navigate } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.(e);
    navigate(href);
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </a>
  );
}
