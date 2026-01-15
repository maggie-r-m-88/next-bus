interface HeaderProps {
  radiusMeters: number;
  setRadiusMeters: (radius: number) => void;
}

export default function Header({ radiusMeters, setRadiusMeters }: HeaderProps) {
  return (
    <div className="flex-shrink-0 px-2 py-3 z-50 touch-none">
      <div className="flex items-center justify-between">
        {/* Logo/text */}
        <div className="inline-block">
          <h1
            className="text-4xl tracking-tighter font-light"
            style={{ fontFamily: "Stack Sans Notch, sans-serif" }}
          >
            <span className="font-extrabold">EMT</span> Near Me
          </h1>
          <h2
            className="tracking-[.08em] text-base text-center"
            style={{ fontFamily: "Chulapa, sans-serif" }}
          >
            Madrid bus arrivals
          </h2>
        </div>

        {/* Radius control */}
     {/*    <div className="flex items-center gap-3">
          <label htmlFor="radius" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Radius:
          </label>
          <select
            id="radius"
            value={radiusMeters}
            onChange={(e) => setRadiusMeters(Number(e.target.value))}
            className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
          >
            <option value={100}>100m</option>
            <option value={150}>150m</option>
            <option value={200}>200m</option>
            <option value={250}>250m</option>
            <option value={300}>300m</option>
            <option value={400}>400m</option>
            <option value={500}>500m</option>
          </select>
        </div> */}
      </div>
    </div>
  );
}
