import { useRef, type FocusEvent, type MouseEvent } from 'react';

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
}

function openDatePicker(input: HTMLInputElement | null) {
  if (!input) return;
  try {
    if (typeof input.showPicker === 'function') {
      input.showPicker();
    } else {
      input.focus();
    }
  } catch {
    input.focus();
  }
}

export default function DateInput({
  className = 'input-field',
  onClick,
  onFocus,
  ...props
}: DateInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  function handleClick(e: MouseEvent<HTMLInputElement>) {
    openDatePicker(ref.current);
    onClick?.(e);
  }

  function handleFocus(e: FocusEvent<HTMLInputElement>) {
    openDatePicker(ref.current);
    onFocus?.(e);
  }

  return (
    <input
      ref={ref}
      type="date"
      className={`date-input ${className}`}
      onClick={handleClick}
      onFocus={handleFocus}
      {...props}
    />
  );
}
