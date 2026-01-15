import SettingsToggleButton from "./SettingsToggle";

interface HeaderProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

export default function Header({ showSettings, setShowSettings }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 z-50">
      {/* Logo/text */}
      <div className="flex flex-col justify-center">
        <h1
          className="text-4xl tracking-tighter font-light leading-none"
          style={{ fontFamily: "Stack Sans Notch, sans-serif" }}
        >
          <span className="font-extrabold">EMT</span> Near Me
        </h1>
        <h2
          className="tracking-widest text-base text-gray-700 dark:text-gray-200"
          style={{ fontFamily: "Chulapa, sans-serif" }}
        >
          Madrid bus arrivals
        </h2>
      </div>

      {/* Settings toggle */}
      <div className="flex items-center justify-center">
        <div className="rounded-full p-2 bg-[#ecf1f7]/70 dark:bg-[#020024]/70 hover:bg-gray-400/80 dark:hover:bg-gray-400/80 transition-colors duration-200">
          <SettingsToggleButton open={showSettings} setOpen={setShowSettings} />
        </div>
      </div>
    </header>
  );
}
