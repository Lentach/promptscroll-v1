import React, { useState } from 'react';

interface AvatarProps {
  /** URL of the avatar image. When omitted or the image fails to load, we fall back to initials. */
  src?: string | null;
  /** User display name – used for alt text, tooltip, and extracting initials. */
  name: string;
  /** Pixel size of the avatar – applied to width & height (default 48). */
  size?: number;
  /** Additional Tailwind classes (e.g., margin utilities) */
  className?: string;
}

/**
 * Generic Avatar component.
 * – Renders a circular image when `src` resolves successfully.
 * – Gracefully degrades to a coloured circle with user initials when src is empty or fails.
 * – Comes with subtle border, shadow & hover-scale for depth on dark UIs.
 */
export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 48, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  // Extract up to two initials from the provided name.
  const initials = name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join('');

  const dimension = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
  } as const;

  const commonClasses = `rounded-full border border-white/15 shadow-md overflow-hidden ` +
    `transition-transform duration-300 hover:scale-105 ${className}`;

  // Show fallback if there is no src or the image fails to load.
  if (!src || hasError) {
    return (
      <div
        className={commonClasses + ' flex items-center justify-center'}
        style={{ ...dimension, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        title={name}
      >
        <span className="text-white font-semibold select-none" style={{ fontSize: size * 0.35 }}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      title={name}
      loading="lazy"
      onError={() => setHasError(true)}
      className={commonClasses + ' object-cover'}
      style={dimension}
    />
  );
}; 