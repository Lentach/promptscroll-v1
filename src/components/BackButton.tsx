import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Fallback path used when the history stack has no previous entry –
   * e.g. user refreshed the page or opened it directly.
   * Defaults to "/" (home).
   */
  fallbackPath?: string;
  /** Optional label text shown next to the icon */
  label?: string;
}

/**
 * Re-usable back navigation button that attempts to go one step back in the
 * browser history.  When there is no previous entry (history length < 2), it
 * performs a hard navigation to the provided `fallbackPath` (defaults to "/").
 *
 * The component forwards any additional props to the underlying `<button>` so
 * caller can control classes, sizing, etc.
 */
export const BackButton: React.FC<BackButtonProps> = ({
  fallbackPath = '/',
  label = 'Back',
  className = '',
  ...rest
}) => {
  const navigate = useNavigate();

  const handleClick = React.useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath, { replace: true });
    }
  }, [fallbackPath, navigate]);

  return (
    <button
      type="button"
      aria-label="Go back"
      {...rest}
      onClick={handleClick}
      className={`inline-flex items-center space-x-1 text-purple-400 hover:text-purple-200 transition-colors ${className}`.trim()}
    >
      <ArrowLeft size={18} />
      <span className="hidden sm:inline-block">{label}</span>
    </button>
  );
}; 