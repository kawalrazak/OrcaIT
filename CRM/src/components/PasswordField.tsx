import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  placeholder?: string;
  autoComplete?: string;
  labelledBy?: string;
}

export default function PasswordField({
  id,
  value,
  onChange,
  visible,
  onVisibleChange,
  placeholder,
  autoComplete = 'new-password',
  labelledBy,
}: PasswordFieldProps) {
  return (
    <div className="relative min-w-[16rem] flex-1">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-labelledby={labelledBy}
        className="input-field pr-10"
      />
      <button
        type="button"
        onClick={() => onVisibleChange(!visible)}
        className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-brand-600 hover:bg-brand-50 hover:text-brand-700"
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
