import React, { useCallback } from 'react';
import { getAIModelMeta } from '../constants/aiModels';

interface RedirectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** AI model identifier, e.g. "gemini", "chatgpt" */
  model: string;
  /** Text that will be copied to clipboard before redirect */
  promptContent: string;
  /** Optional callback executed after the prompt is copied and the window is opened */
  onUseComplete?: () => void;
}

/**
 * RedirectButton handles the full workflow of:
 * 1. Copying prompt content to the clipboard
 * 2. Opening the target AI model playground in a **new** tab
 *
 * It forwards any additional props to the underlying `<button>` element, so
 * parent components control styling, sizing, etc.
 */
export const RedirectButton: React.FC<RedirectButtonProps> = ({
  model,
  promptContent,
  onUseComplete,
  children,
  ...buttonProps
}) => {
  const meta = getAIModelMeta(model);

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(promptContent);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy prompt to clipboard', err);
      /* Even if the copy fails we still proceed with opening the playground */
    }

    // Open the playground in a new, non-blocking tab
    window.open(meta.url, '_blank', 'noopener,noreferrer');

    onUseComplete?.();
  }, [meta.url, onUseComplete, promptContent]);

  return (
    <button
      type="button"
      {...buttonProps}
      onClick={handleClick}
      title={`Open ${meta.name} and copy prompt to clipboard`}
    >
      {children ?? `Try in ${meta.name}`}
    </button>
  );
};
