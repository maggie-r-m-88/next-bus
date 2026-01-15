import { useState } from "react";

export function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      {/* Top slider */}
      <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="2" fill="currentColor" />

      {/* Middle slider */}
      <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="15" cy="12" r="2" fill="currentColor" />

      {/* Bottom slider */}
      <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11" cy="17" r="2" fill="currentColor" />
    </svg>
  );
}

export function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

interface SettingsToggleButtonProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SettingsToggleButton({ open, setOpen }: SettingsToggleButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      aria-label={open ? "Close settings" : "Open settings"}
      className={`
        w-6 h-6 flex items-center justify-center
        transition-transform duration-150 cursor-pointer
        ${pressed ? "scale-90 rotate-3" : "scale-100 rotate-0"}
      `}
    >
      {open ? <XIcon /> : <SlidersIcon />}
    </button>
  );
}
