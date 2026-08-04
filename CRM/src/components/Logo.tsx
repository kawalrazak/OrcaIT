interface LogoProps {
  /** full = login | header = top bar | icon = sidebar collapsed | sidebar = sidebar expanded */
  variant?: 'full' | 'header' | 'icon' | 'sidebar';
  className?: string;
}

const LOGO = '/orca-it-logo.png';

export default function Logo({ variant = 'full', className = '' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <img
        src={LOGO}
        alt="ORCA IT"
        className={`h-8 w-auto shrink-0 rounded-md object-contain ${className}`}
      />
    );
  }

  if (variant === 'header') {
    return (
      <img
        src={LOGO}
        alt="ORCA IT — IT Help for Seniors"
        className={`h-10 w-auto object-contain ${className}`}
      />
    );
  }

  if (variant === 'sidebar') {
    return (
      <img
        src={LOGO}
        alt="ORCA IT"
        className={`h-9 w-auto min-w-0 max-w-full object-contain ${className}`}
      />
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img
        src={LOGO}
        alt="ORCA IT — IT Help for Seniors. Patient & friendly tech support."
        className="mx-auto h-auto w-full max-w-[300px] object-contain"
      />
      <p className="mt-4 text-center text-xs font-semibold tracking-wide text-orca-royal-light">
        Patient &amp; Friendly Tech Support
      </p>
    </div>
  );
}
